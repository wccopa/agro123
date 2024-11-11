import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/products.model';
import { Store } from 'src/app/models/store.model';
import { CartService } from 'src/app/services/cart.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddproductsComponent } from 'src/app/shared/components/addproducts/addproducts.component';
import { AddstoreComponent } from 'src/app/shared/components/addstore/addstore.component';

@Component({
  selector: 'app-storeadmin',
  templateUrl: './storeadmin.page.html',
  styleUrls: ['./storeadmin.page.scss'],
})
export class StoreadminPage implements OnInit {
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


  async deleteProduct(store: Store) {
    let path = `store/${store.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      // Obtener la ruta de la imagen antes de eliminar el producto
      let imagePath = await this.firebaseSvc.getFilePath(store.image);

      // Eliminar la imagen asociada
      await this.firebaseSvc.deleteImage(imagePath);

      // Eliminar el documento del producto en Firestore
      await this.firebaseSvc.deleteDocument(path, store);

    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }loading.dismiss();
  }
}
