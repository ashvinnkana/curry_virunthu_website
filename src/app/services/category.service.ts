import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private dbPath = '/category';

  categoryRef: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
    this.categoryRef = db.collection(this.dbPath, ref => ref.orderBy('orderId'));
  }

  getAll(): AngularFirestoreCollection<any> {
    return this.categoryRef; 
  }
}
