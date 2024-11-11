import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/products.model';
import { User } from 'src/app/models/usr.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-addproducts',
  templateUrl: './addproducts.component.html',
  styleUrls: ['./addproducts.component.scss'],
})
export class AddproductsComponent  implements OnInit {

  @Input() product: Product;

  form = new FormGroup({
    id: new FormControl('',),
    nombre: new FormControl(''),
    categoria: new FormControl(''),
    descripcion: new FormControl(''),
    semillas: new FormControl(null),
    fosforo: new FormControl(null),
    nitrogeno: new FormControl(null),
    potasio: new FormControl(null),
    rendimiento: new FormControl(null),
    image: new FormControl(''),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;


  ngOnInit() {
    if (this.product) this.form.setValue(this.product)
  }

  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Selecciona una imagen'))
      .dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  async submit() {
    if (this.form.valid) {
      if (this.product) this.editProduct();
      else this.createProduct();
    }
  }

  async createProduct() {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      // Generar un ID único para el producto de la tienda
      const productItemId = this.firebaseSvc.firestore.createId();

      // Subir la imagen con un nombre de archivo único
      let dataUrl = this.form.value.image;
      let imagePath = `products/${productItemId}_${Date.now()}.png`;
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

      // Crear el objeto del producto de la tienda con el nuevo ID y la URL de la imagen
      const productItemData = {
        ...this.form.value,
        id: productItemId,
        image: imageUrl,
      };

      // Añadir el documento a Fireproduct
      let path = `products`;
      await this.firebaseSvc.addDocument(path, productItemData);

      this.utilsSvc.dismissModal({ success: true });
    } catch (error) {
      console.error('Error al añadir el producto', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      loading.dismiss();
    }
  }

  async editProduct() {

    let path = `products/${this.product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      // Generar un ID único para el producto de la tienda
      const productItemId = this.firebaseSvc.firestore.createId();

      // Crear el objeto del producto de la tienda con el nuevo ID
      const productItemData = {
        ...this.form.value,
        id: productItemId,
      };

      if (this.form.value.image !== this.product.image) {
        let dataUrl = this.form.value.image;
        let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
        let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
        this.form.controls.image.setValue(imageUrl);

        productItemData.image = imageUrl;
      }


      delete this.form.value.id;

      // Añadir el documento a Fireproduct
      await this.firebaseSvc.editDocument(path, productItemData).then(async (res) => {
          this.utilsSvc.dismissModal({ success: true });
        });
    } catch (error) {
      console.error('Error al editar el producto:', error);
    } finally {
      loading.dismiss();
    }
  }

  
}
