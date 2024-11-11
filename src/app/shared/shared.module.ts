import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { FooterComponent } from './components/footer/footer.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddproductsComponent } from './components/addproducts/addproducts.component';
import { AddstoreComponent } from './components/addstore/addstore.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LogoComponent,
    FooterComponent,
    AddproductsComponent,
    AddstoreComponent
  ],
  exports: [
    HeaderComponent,
    LogoComponent,
    FooterComponent,
    ReactiveFormsModule,
    AddproductsComponent,
    AddstoreComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class SharedModule { }
