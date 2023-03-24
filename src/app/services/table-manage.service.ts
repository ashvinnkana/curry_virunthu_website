import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class TableManageService {
  private dbPath = '/tableData';

  tableRef: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
    this.tableRef = db.collection(this.dbPath);
  }

  create(tableNum:any, data:any) {
    return this.tableRef.doc(tableNum).set(data);
  }

  getAll(): AngularFirestoreCollection<any> {
    return this.tableRef; 
  }

  update(id: string, data: any): Promise<void> {
    return this.tableRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.tableRef.doc(id).delete();
  }
}
