import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private dbPath = '/item';

  itemRef: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
    this.itemRef = db.collection(this.dbPath, ref => ref.orderBy('label'));
  }

  getAll(): AngularFirestoreCollection<any> {
    return this.itemRef; 
  }

  update(id: string, data: any): Promise<void> {
    return this.itemRef.doc(id).update(data);
  }

  create(data:any) {
    return this.itemRef.add(data);
  }

  delete(id: string): Promise<void> {
    return this.itemRef.doc(id).delete();
  }
}
