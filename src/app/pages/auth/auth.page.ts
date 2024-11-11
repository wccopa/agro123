import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/usr.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor() {}

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc
        .signIn(this.form.value as User)
        .then((res) => {
          this.getUserInfo(res.user.uid);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;

      this.firebaseSvc
        .getDocument(path)
        .then((user: User) => {
          this.utilsSvc.saveInLocalStorage('user', user);
          this.utilsSvc.routerLink('/home');
          this.form.reset();
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  async iniciarconGoogle() {
    console.log('iniciar con google');
    
    const loading = await this.utilsSvc.loading();
    await loading.present();
    await this.firebaseSvc.iniciarGoogle();
    loading.dismiss();
    this.utilsSvc.routerLink('/home');

  }
}
