import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private dbPath = '/order';

  orderRef: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
    this.orderRef = db.collection(this.dbPath, ref => ref.orderBy('orderTime'));
  }

  getAll(): AngularFirestoreCollection<any> {
    return this.orderRef; 
  }

  update(id: string, data: any): Promise<void> {
    return this.orderRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.orderRef.doc(id).delete();
  }
}
