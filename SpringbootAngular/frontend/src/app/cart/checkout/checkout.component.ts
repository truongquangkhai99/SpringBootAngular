import { Component, OnInit } from '@angular/core';
import {CartService} from '../../service/cart.service';
import {User} from '../../../model/model.user';
import {Product} from '../../../model/product';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  currentUser;
  cartNum;
  productInCart: Product[];
  dataCart;
  subtotal;

  constructor(private cartService: CartService,
              private toastr: ToastrService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.dataCheckOut();
  }

  dataCheckOut() {
    //   this.userId = this.route.snapshot.params['userId'];
    this.currentUser = new User(this.currentUser.id, null, null, null);
    console.log('userIdssss', this.currentUser.id);
    this.cartService.getNumCartAPI(this.currentUser).subscribe(
      dataInCart => {
        this.dataCart = dataInCart['data'];
        console.log('proInCartfdasdas', dataInCart);
        this.cartNum = this.dataCart['numCart'];
        this.productInCart = this.dataCart['productDTOList'];
        console.log('proInCart', this.productInCart);
        this.subtotal = this.dataCart['subtotal'];
      }
    );
  }

  showSuccess() {
    this.toastr.success('Đặt hàng thành công, chúng tôi sẽ liên hệ với bạn sớm nhất', 'Thông báo',{
      timeOut: 2000, progressBar: false
    });
  }
}
