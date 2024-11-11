import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreadminPageRoutingModule } from './storeadmin-routing.module';

import { StoreadminPage } from './storeadmin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreadminPageRoutingModule
  ],
  declarations: [StoreadminPage]
})
export class StoreadminPageModule {}
