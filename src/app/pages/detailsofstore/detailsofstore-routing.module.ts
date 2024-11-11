import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsofstorePage } from './detailsofstore.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsofstorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsofstorePageRoutingModule {}
