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
import {HomeComponent} from './home/home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material';
import { HeaderComponent } from './home/header/header.component';
import { FooterComponent } from './home/footer/footer.component';
import { ItemsComponent } from './product/items/items.component';
import { QuickViewComponent } from './product/quick-view/quick-view.component';
import { SingleItemComponent } from './product/single-item/single-item.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
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
