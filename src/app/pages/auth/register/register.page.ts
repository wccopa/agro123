import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/usr.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl('',),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor() {}

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  async submit() {
    if(this.form.valid){

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signUp(this.form.value as User).then(async res => {

        await this.firebaseSvc.updateUser(this.form.value.name)

        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid);

        this.setUserInfo(uid);

      }).catch(error => {
        console.log(error);
      }).finally(() => {
        loading.dismiss();
      });
    }
  }

  async setUserInfo(uid: string) {
    if(this.form.valid){

      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`
      delete this.form.value.password;

      this.firebaseSvc.setDocument(path, this.form.value).then(async res => {

        this.utilsSvc.saveInLocalStorage('user', this.form.value)
        this.utilsSvc.routerLink('/home')
        this.form.reset();

      }).catch(error => {
        console.log(error);
      }).finally(() => {
        loading.dismiss();
      });
    }
  }
}
