import { Component, OnInit } from '@angular/core';
import {Product} from '../../../model/product';
import {WriteReviewComponent} from '../write-review/write-review.component';
import {Cart} from '../../../model/cart';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {ProductService} from '../../../service/product.service';

@Component({
  selector: 'app-single-item',
  templateUrl: './single-item.component.html',
  styleUrls: ['./single-item.component.scss']
})
export class SingleItemComponent implements OnInit {

  currentUser;
  productId;
  productName;
  price;
  realPrice;
  dataProduct;
  numLike;
  description;
  cateName;
  discount;
  categoryId;
  sameProList: Product[];
  numSamePro;
  listImg;
  conditionCart;
  cartService;
  notificationMessage;
  writeReview;
  slides: any = [[]];

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private toastr: ToastrService,
              config: NgbCarouselConfig) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    config.interval = 3000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = true;
  }

  ngOnInit() {
    this.getProDetail();
    // tslint:disable-next-line:no-unused-expression
    this.categoryId;
    this.sameProList = this.chunk(this.sameProList, 4);
  }

  getProDetail() {
    this.productId = this.route.snapshot.params['id'];
    console.log(this.productId);
    this.productService.productDetailAPI(this.productId).subscribe(
      data => {
        console.log('data detail', data['data']);
        this.dataProduct = data['data'];
        this.listImg = this.dataProduct['urlImage'];
        this.productName = this.dataProduct['productName'];
        this.price = this.dataProduct['price'];
        this.numLike = this.dataProduct['numLike'];
        this.description = this.dataProduct['description'];
        this.cateName = this.dataProduct['categoryName'];
        this.realPrice = this.dataProduct['realPrice'];
        this.discount = this.dataProduct['discount'];
        this.categoryId = this.dataProduct['categoryId'];
        console.log('cateId', this.categoryId);
        this.getSamePro(this.dataProduct['categoryId']);
      });
  }

  getSamePro(cateId: number) {
    // console.log('cateId', this.categoryId);
    this.productService.sameProAPI(cateId).subscribe(
      dataSame => {
        console.log(dataSame['data']);
        this.sameProList = dataSame['data']['productDTOList'];
        this.numSamePro = dataSame['data']['numLimit'];
        console.log('sameProList', this.sameProList);
        console.log('numSamePro', this.numSamePro);
      }
    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(WriteReviewComponent, {
      width: '250px',
      data: {name: this.productName, animal: this.writeReview}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.writeReview = result;
    });
  }

  addProCart(productId: number) {
    this.conditionCart = new Cart(this.currentUser.id, productId);
    console.log('this.currentUser.id', this.currentUser.id);
    console.log('productIdToAddCart', productId);
    this.cartService.addCartAPI(this.conditionCart).subscribe(
      message => {
        this.notificationMessage = message['data'];
        console.log('this.notificationMessage', this.notificationMessage);
        this.notificationSuccess(this.notificationMessage);
      },
      error => this.notificationError()
    );
  }

  notificationSuccess(notification: string) {
    this.toastr.success(notification, 'Thông báo');
  }

  notificationError() {
    this.toastr.error('Lỗi', 'Thông báo');
  }

  chunk(arr: any, chunkSize: any) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }
}
