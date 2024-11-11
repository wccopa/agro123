import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule),
    data: { title: 'Login' }, 
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsPageModule),
    data: { title: 'Productos' }, 
  },
  {
    canActivate: [AuthGuard],
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    data: { title: 'Perfil' },
  },
  {
    canActivate: [AuthGuard],
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    data: { title: 'Inicio' }, 
  },
  {
    path: 'store',
    loadChildren: () => import('./pages/store/store.module').then(m => m.StorePageModule),
    data: { title: 'Tienda' }, 
  },
  {
    canActivate: [AuthGuard],
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then( m => m.CartPageModule),
    data: { title: 'Carrito' },
  },
  {
    path: 'detailsofproducts',
    loadChildren: () => import('./pages/detailsofproducts/detailsofproducts.module').then( m => m.DetailsofproductsPageModule)
  },
  {
    path: 'detailsofstore',
    loadChildren: () => import('./pages/detailsofstore/detailsofstore.module').then( m => m.DetailsofstorePageModule)
  },
  {
    path: 'storeadmin',
    loadChildren: () => import('./pages/storeadmin/storeadmin.module').then( m => m.StoreadminPageModule)
  },
  
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  providers: [AuthGuard],

  exports: [RouterModule]
})
export class AppRoutingModule { }
