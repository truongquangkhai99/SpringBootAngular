import {Component, OnInit} from '@angular/core';
import {Product} from '../../../model/product';
import {ProductService} from '../../../service/product.service';
import {AccountService} from '../../../service/account.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CartService} from '../../../service/cart.service';
import {OrderService} from '../../../service/order.service';
import {User} from '../../../model/model.user';
import {Order} from '../../../model/order';
import {FormControl, Validators} from '@angular/forms';
import {MyErrorStateMatcher} from '../../../model/MyErrorStateMatcher';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  emailFormControl = new FormControl('', [Validators.email]);
  addressFormControl = new FormControl('', [Validators.required]);
  firstNameFormControl = new FormControl('', [Validators.required]);
  lastNameFormControl = new FormControl('', [Validators.required]);
  phoneNumberFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})[-. )]*(\\d{3})[-. ]*(\\d{4})(?: *x(\\d+))?\\s*$')
  ]);
  notesFormControl = new FormControl('');
  matcher = new MyErrorStateMatcher();

  currentUser: User;
  cartNum;
  productInCart: Product[];
  dataCart;
  subtotal;
  conditionUser;
  dataUsers;
  firstName;
  lastName;
  phoneNumber;
  city;
  email;
  address;
  id;
  orderCode;
  total: number;
  checked: boolean;
  userInSession = new Array();
  userSetSession = new Order();
  codeOrder;
  productBuyNow;

  constructor(private cartService: CartService,
              private toastr: ToastrService,
              private router: Router,
              private accountService: AccountService,
              private productService: ProductService,
              private orderService: OrderService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {

    this.codeOrder = 'HD-' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('orderCode', this.codeOrder);
    if (sessionStorage.getItem('productBuyNow')) {
      this.productBuyNow = sessionStorage.getItem('productBuyNow');
    }
    this.dataCheckOut();
    if (localStorage.getItem('currentUser')) {
      this.getDataUser();
      this.fetchOrderCode();
    }
  }

  dataCheckOut() {
    if (localStorage.getItem('currentUser')) {
      if (sessionStorage.getItem('productBuyNow')) {
        this.productInCart = JSON.parse(sessionStorage.getItem('productBuyNow'));
        for (const product of this.productInCart) {
          this.total = 100 * product['realPrice'] * product['numProInCart'];
        }
      } else {
        this.currentUser = new User(this.currentUser.id, null, null, null, null, null);
        this.cartService.getNumCartAPI(this.currentUser).subscribe(
          dataInCart => {
            this.dataCart = dataInCart['data'];
            this.cartNum = this.dataCart['numCart'];
            this.productInCart = this.dataCart['productDTOList'];
            this.subtotal = this.dataCart['subtotal'];
          }
        );
      }
    } else if (sessionStorage.getItem('productBuyNow')) {
      this.productInCart = JSON.parse(sessionStorage.getItem('productBuyNow'));
      console.log('dfasfasdf', this.productInCart);
      for (var product of this.productInCart) {
        this.total = 100 * product['realPrice'] * product['numProInCart'];
      }
    }
  }

  showSuccess(message: string) {
    this.toastr.success(message, '', {
      timeOut: 500, positionClass: 'toast-top-center'
    });
    this.router.navigate(['/order-info']);
  }

  showError(message: string) {
    this.toastr.error(message, 'Thông báo', {});
  }

  getDataUser() {
    this.conditionUser = new User(this.currentUser.id);
    this.accountService.getDataUser(this.conditionUser).subscribe(
      dataUser => {
        console.log(dataUser);
        this.dataUsers = dataUser['data'];
        this.firstNameFormControl.setValue(this.dataUsers['firstName']);
        this.lastNameFormControl.setValue(this.dataUsers['lastName']);
        this.emailFormControl.setValue(this.dataUsers['email']);
      }
    );
  }

  notificationError(notification: string) {
    this.toastr.error(notification);
  }

  checkOut() {
    if (!this.addressFormControl.invalid && !this.phoneNumberFormControl.invalid &&
      !this.firstNameFormControl.invalid && !this.lastNameFormControl.invalid && !this.emailFormControl.hasError('email')
      && !this.phoneNumberFormControl.hasError('pattern')) {
      if (localStorage.getItem('currentUser')) {
        if (sessionStorage.getItem('productBuyNow')) {
          this.conditionUser = new Order(null, this.notesFormControl.value, this.codeOrder,
            this.lastNameFormControl.value, this.firstNameFormControl.value, this.addressFormControl.value,
            this.phoneNumberFormControl.value, this.emailFormControl.value, null, null, this.currentUser.id);
          console.log('request body', this.conditionUser);
          this.orderService.saveOrder(this.conditionUser).subscribe(
            dataUpdateOrder => {
              if (dataUpdateOrder['code'] == 200) {
                setTimeout(function success() {
                    this.showSuccess('Xác nhận thông tin thành công!');
                  }, 1500
                )
              }
            }, error => this.showError('Lỗi')
          );
        } else {
          this.conditionUser = new Order(null, this.notesFormControl.value, this.codeOrder,
            this.lastNameFormControl.value, this.firstNameFormControl.value, this.addressFormControl.value,
            this.phoneNumberFormControl.value, this.emailFormControl.value, null, null, this.currentUser.id);
          this.orderService.saveOrder(this.conditionUser).subscribe(
            dataUpdateOrder => {
              if (dataUpdateOrder['code'] == 200) {
                setTimeout(function success() {
                    this.showSuccess('Xác nhận thông tin thành công!');
                  }, 1500
                )
              }
              sessionStorage.removeItem('productBuyNow');
            }, error => this.showError('Lỗi')
          );
        }
      } else {
        const email = this.emailFormControl.value ? this.emailFormControl.value : null;
        this.userSetSession.firstName = this.firstNameFormControl.value;
        this.userSetSession.lastName = this.lastNameFormControl.value;
        this.userSetSession.phoneNumber = this.phoneNumberFormControl.value;
        this.userSetSession.address = this.addressFormControl.value;
        this.userSetSession.email = email;
        this.userSetSession.note = this.notesFormControl.value;
        this.userInSession.push(this.userSetSession);
        if (sessionStorage.getItem('userInSession')) {
          sessionStorage.removeItem('userInSession');
        }
        sessionStorage.setItem('userInSession', JSON.stringify(this.userInSession));
        this.conditionUser = new Order(null, this.notesFormControl.value, this.codeOrder,
          this.lastNameFormControl.value, this.firstNameFormControl.value, this.addressFormControl.value,
          this.phoneNumberFormControl.value, this.emailFormControl.value, null, null, null);
        this.orderService.saveOrder(this.conditionUser).subscribe(
          dataUpdateOrder => {
            if (dataUpdateOrder['code'] == 200) {
              setTimeout(function success() {
                  this.showSuccess('Xác nhận thông tin thành công!');
                }, 1500
              );
            }
          }, error => this.showError('Lỗi')
        );
      }
      window.location.replace('/order-info');
    } else if (this.checked === undefined || this.checked === false) {
      this.notificationError('Bạn cần chọn vào ô xác thực thông tin trước khi thanh toán');
    } else {
      this.notificationError('Bạn cần điền đầy đủ và chính xác các thông tin trước khi thanh toán');
    }
  }

  fetchOrderCode() {
    this.cartService.orderCode$.subscribe(
      dataFetch => {
        console.log('dataFetchOrderCode', dataFetch);
        this.orderCode = dataFetch;
      });
  }
}
