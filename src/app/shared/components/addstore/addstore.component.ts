import { Component, inject, Input, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from 'src/app/models/store.model';
import { User } from 'src/app/models/usr.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-addstore',
  templateUrl: './addstore.component.html',
  styleUrls: ['./addstore.component.scss'],
})
export class AddstoreComponent implements OnInit {

  @Input() store: Store;

  form = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', Validators.required),
    categoria: new FormControl('', Validators.required),
    descripcion: new FormControl(''),
    precio: new FormControl(null, Validators.required),
    image: new FormControl(''),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {
    if (this.store) this.form.setValue(this.store)
  }

  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Selecciona una imagen'))
      .dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  async submit() {
    if (this.form.valid) {
      if (this.store) this.editProduct();
      else this.createProduct();
    }
  }

  async createProduct() {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      // Generar un ID único para el producto de la tienda
      const storeItemId = this.firebaseSvc.firestore.createId();

      // Subir la imagen con un nombre de archivo único
      let dataUrl = this.form.value.image;
      let imagePath = `store/${storeItemId}_${Date.now()}.png`;
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

      // Crear el objeto del producto de la tienda con el nuevo ID y la URL de la imagen
      const storeItemData = {
        ...this.form.value,
        id: storeItemId,
        image: imageUrl,
      };

      // Añadir el documento a Firestore
      let path = `store`;
      await this.firebaseSvc.addDocument(path, storeItemData);

      this.utilsSvc.dismissModal({ success: true });
    } catch (error) {
      console.error('Error al añadir el producto a la tienda:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      loading.dismiss();
    }
  }

  async editProduct() {

    let path = `store/${this.store.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    try {
      // Generar un ID único para el producto de la tienda
      const storeItemId = this.firebaseSvc.firestore.createId();

      // Crear el objeto del producto de la tienda con el nuevo ID
      const storeItemData = {
        ...this.form.value,
        id: storeItemId,
      };

      if (this.form.value.image !== this.store.image) {
        let dataUrl = this.form.value.image;
        let imagePath = await this.firebaseSvc.getFilePath(this.store.image);
        let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
        this.form.controls.image.setValue(imageUrl);

        storeItemData.image = imageUrl;
      }


      delete this.form.value.id;

      // Añadir el documento a Firestore
      await this.firebaseSvc.editDocument(path, storeItemData).then(async (res) => {
          this.utilsSvc.dismissModal({ success: true });
        });
    } catch (error) {
      console.error('Error al editar el producto:', error);
    } finally {
      loading.dismiss();
    }
  }
}
