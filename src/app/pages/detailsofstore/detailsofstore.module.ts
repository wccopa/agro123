import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsofstorePageRoutingModule } from './detailsofstore-routing.module';

import { DetailsofstorePage } from './detailsofstore.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsofstorePageRoutingModule
  ],
  declarations: [DetailsofstorePage]
})
export class DetailsofstorePageModule {}
