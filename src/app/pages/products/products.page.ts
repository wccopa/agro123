import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/products.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddproductsComponent } from 'src/app/shared/components/addproducts/addproducts.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  products: Product[] = [];
  categorias: string[] = [];
  productsByCategory: { [key: string]: Product[] } = {};

  ngOnInit() {
    this.getProducts();
  }

  //obtener productos
  getProducts() {
    let path = `products`;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
        // Actualizar categorías después de obtener los productos
        this.categorias = [...new Set(this.products.map((p) => p.categoria))];
        // Agrupar productos por categoría
        this.productsByCategory = this.categorias.reduce((acc, cat) => {
          acc[cat] = this.products.filter((p) => p.categoria === cat);
          return acc;
        }, {} as { [key: string]: Product[] });

        sub.unsubscribe();
      },
    });
  }

  // agrega y edita producto

  async addProduct(product?: Product) {
    let asd = await this.utilsSvc.presentModal({
      component: AddproductsComponent,
      cssClass: 'modal-add-product',
      componentProps: { product },
    });
    if (asd.success) {
      this.getProducts();
    }
  }

  //eliminar producto

  async deleteProduct(products: Product) {
    let path = `products/${products.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      // Obtener la ruta de la imagen antes de eliminar el producto
      let imagePath = await this.firebaseSvc.getFilePath(products.image);

      // Eliminar la imagen asociada
      await this.firebaseSvc.deleteImage(imagePath);

      // Eliminar el documento del producto en Firestore
      await this.firebaseSvc.deleteDocument(path, products);

    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      
    } loading.dismiss();
  }
}
