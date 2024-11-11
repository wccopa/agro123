import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  LoadingController,
  ModalController,
  ModalOptions,
  ToastController,
  ToastOptions,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingCtrl = inject(LoadingController);
  router = inject(Router);
  modalCtrl = inject(ModalController);

  // toastCtrl = inject(ToastController);

  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  //mensaje de error:
  // async presentToast(opts?: ToastOptions){
  //   const toast = await this.toastCtrl.create(opts);
  //   toast.present();
  // }

  routerLink(url: string) {
    return this.router.navigate([url]);
  }

  //localStorage

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  //modal agregar editar

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();

    return data;
  }

  dismissModal(data: any) {
    return this.modalCtrl.dismiss(data);
  }

  //camara

  async takePicture(promptLabelHeader: string) {
    return Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto',
    });
  }
}
