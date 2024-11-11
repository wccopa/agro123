import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, getDocs, getFirestore, query, where } from '@angular/fire/firestore';
import { async, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }



  async borrarProducto(id: string){
    return await deleteDoc(doc(getFirestore(), "cart", id));
  }

  getCart(iduser: string): Observable<any> {
    const ref = collection(getFirestore(), "cart");
    let q = query(ref, where("iduser", "==", iduser ));

    return new Observable(observer => {
      getDocs(q).then(querySnapshot => {
        const docs = querySnapshot.docs.map(doc => {
          return {
            ...doc.data(),
            iddoc: doc.id
          };
        });
        observer.next(docs);
        observer.complete();
      }).catch(error => {
        console.error('Error al obtener el carrito:', error);
        observer.error(error);
      });
    });
  }

}
