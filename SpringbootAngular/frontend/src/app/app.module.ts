import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { LoginComponent } from './account/login/login.component';
import { LogoutComponent } from './account/logout/logout.component';
import { NotFoundComponent } from './account/not-found/not-found.component';
import { ProfileComponent } from './account/profile/profile.component';
import { RegisterComponent } from './account/register/register.component';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material';
import { HeaderComponent } from './home/header/header.component';
import { FooterComponent } from './home/footer/footer.component';
import { ItemsComponent } from './product/items/items.component';
import { QuickViewComponent } from './product/quick-view/quick-view.component';
import { SingleItemComponent } from './product/single-item/single-item.component';
import { ProCateComponent } from './product/pro-cate/pro-cate.component';
import { ShowCartComponent } from './cart/show-cart/show-cart.component';
import { CheckoutComponent } from './cart/checkout/checkout.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { BlogDetailComponent } from './blog/blog-detail/blog-detail.component';
import { AboutComponent } from './static/about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    NotFoundComponent,
    ProfileComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    ItemsComponent,
    QuickViewComponent,
    SingleItemComponent,
    ProCateComponent,
    ShowCartComponent,
    CheckoutComponent,
    BlogListComponent,
    BlogDetailComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [QuickViewComponent]
})
export class AppModule { }
