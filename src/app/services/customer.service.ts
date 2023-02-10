import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private dbPath = '/customer';

  customerRef: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
    this.customerRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<any> {
    return this.customerRef;
  }

  getByPhoneNum(phoneNum:any) {
    return this.db.collection(this.dbPath, ref => ref.where('mobile','==',phoneNum));
  }
}
