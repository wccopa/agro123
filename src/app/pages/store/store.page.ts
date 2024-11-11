import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/products.model';
import { Store } from 'src/app/models/store.model';
import { CartService } from 'src/app/services/cart.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddproductsComponent } from 'src/app/shared/components/addproducts/addproducts.component';
import { AddstoreComponent } from 'src/app/shared/components/addstore/addstore.component';

@Component({
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
})
export class StorePage implements OnInit {
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);
  cartSvc = inject(CartService);

  store: Store[] = [];
  categorias: string[] = [];
  productsByCategory: { [key: string]: Store[] } = {};
  currentUser: any;

  ngOnInit() {
    this.getProducts();
    this.firebaseSvc.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  //agregar producto al carrito
  async addProductToCart(product: Store) {
    try {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.cartSvc.addDocument('cart', {
        ...product,
        iduser: this.currentUser.uid,
      });
      loading.dismiss();
    } catch (error) {
      console.error('Error al añadir el producto al carrito:', error);
    }
  }

  //obtener productos
  getProducts() {
    let path = `store`;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.store = res;
        // Actualizar categorías después de obtener los productos
        this.categorias = [...new Set(this.store.map((p) => p.categoria))];
        // Agrupar productos por categoría
        this.productsByCategory = this.categorias.reduce((acc, cat) => {
          acc[cat] = this.store.filter((p) => p.categoria === cat);
          return acc;
        }, {} as { [key: string]: Store[] });

        sub.unsubscribe();
      },
    });
  }

  async addProduct(store?: Store) {
    let asd = await this.utilsSvc.presentModal({
      component: AddstoreComponent,
      cssClass: 'modal-add-product',
      componentProps: { store },
    });
    if (asd.success) {
      this.getProducts();
    }
  }
}
