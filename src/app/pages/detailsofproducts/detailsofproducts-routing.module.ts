import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsofproductsPage } from './detailsofproducts.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsofproductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsofproductsPageRoutingModule {}
