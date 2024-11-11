import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
} from 'firebase/auth';
import { User } from '../models/usr.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
  collectionData,
  query,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { authState, signInWithPopup } from '@angular/fire/auth';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  getStorage,
  uploadString,
  ref,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);
  storage = inject(AngularFireStorage);

  //inicio de sesion y registro
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  async iniciarGoogle() {
    return await signInWithPopup(getAuth(), new GoogleAuthProvider());
  }
  
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  get currentUser(): Observable<any> {
    return authState(getAuth());
  }

  //base de datos

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //guard

  // getAuth() {
  //   return getAuth();
  // }

  //cerrrar sesion
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  //agregar productos firebase

  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  //subir nuestra imagen
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(
      () => {
        return getDownloadURL(ref(getStorage(), path));
      }
    );
  }

  //llamar a los documentos de la coleccion

  getCollectionData(path: string, collectionquery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionquery), { idField: 'id' });
  }

  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }

//editar
  editDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }
//eliminar
  deleteDocument(path: string, data: any) {
    return deleteDoc(doc(getFirestore(), path));
  }

  deleteImage(path: string) {
    return deleteObject(ref(getStorage(), path));
  }
}
