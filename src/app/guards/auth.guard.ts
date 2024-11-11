import {
  CanActivate,
} from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private firebaseSvc: FirebaseService
  ) {}
  canActivate() {
    return this.firebaseSvc.currentUser.pipe(
      map((user) => {
        if (user) {
          return true;
        } else {
          this.router.navigate(['/auth']);
          return false;
        }
      })
    );
  }
}
