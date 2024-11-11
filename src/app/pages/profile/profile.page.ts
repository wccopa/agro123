import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  usuario: any;


  ngOnInit() {
    this.firebaseSvc.currentUser.subscribe((user) => {
      this.usuario = user;
      console.log(this.usuario);
      
    });
  }

  singOut() {
    this.firebaseSvc.signOut();
  }
}
