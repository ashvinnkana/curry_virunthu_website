import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class DeviceTokenService {
  private dbPath = '/DeviceTokens';

  deviceRef: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
    this.deviceRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<any> {
    return this.deviceRef;
  }

  getByPhoneNum(phoneNum:any) {
    return this.db.collection(this.dbPath, ref => ref.where('mobile','==',phoneNum));
  }
}
