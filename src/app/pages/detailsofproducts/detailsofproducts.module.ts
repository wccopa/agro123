import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsofproductsPageRoutingModule } from './detailsofproducts-routing.module';

import { DetailsofproductsPage } from './detailsofproducts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsofproductsPageRoutingModule
  ],
  declarations: [DetailsofproductsPage]
})
export class DetailsofproductsPageModule {}
