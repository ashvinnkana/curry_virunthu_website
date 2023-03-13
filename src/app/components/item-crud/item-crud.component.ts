import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { finalize, map } from 'rxjs/operators';

import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { ItemService } from 'src/app/services/item.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-item-crud',
  templateUrl: './item-crud.component.html',
  styleUrls: ['./item-crud.component.css']
})
export class ItemCrudComponent {

  @Input() data: any;
  @Input() crud: any;
  @Output() isComplete = new EventEmitter<string>();


  public categories: any = [];

  constructor(private itemService: ItemService, private catService: CategoryService, 
    private sanitizer: DomSanitizer, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.retrieveCategory();
  }

  public loadedImageFile:any = null;

  imageLoaded(evt: any) {
    this.loadedImageFile = evt.target.files[0]
    this.data.img = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(evt.target.files[0])
    );
  }

  updateData() {
    if (this.loadedImageFile != null) {
      this.pushFileToStorage('update')
    } else {
      this.pushToFirestore()
    }
    this.isComplete.emit()
  }

  addData() {
    if (this.data.label == '') {
      alert("Item label cannot be null");
      return
    }

    if (this.data.category == '') {
      alert("Item category cannot be null");
      return
    }

    if (this.data.price < 0) {
      alert("Item Price cannot be Negative");
      return
    }
      
    if (this.loadedImageFile != null) {
      this.pushFileToStorage('add')
    } else {
      this.addToFirestore()
    }
    this.isComplete.emit()
  }

  addToFirestore() {
    this.itemService.create(this.data).then((result)=>{
      console.log(result);
    })
  }

  pushToFirestore() {
    this.itemService.update(this.data.id, this.data).then((result)=>{
      console.log(result);
    })
  }

  private basePath = '/assets/img/item-uploads';

  pushFileToStorage(type:any) {
    const filePath = `${this.basePath}/${this.loadedImageFile.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, this.loadedImageFile);
  
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          console.log(downloadURL)
          this.data.img = downloadURL;
          if (type == 'add'){
            this.addToFirestore()
          } else {
            this.pushToFirestore()
          }
        });
      })
    ).subscribe();
  }

  retrieveCategory(): void {
    this.catService.getAll()
      .snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      ).subscribe(data => {
        this.categories = data;
      });
  }

  choiceVegSwitch(choiceIndex: any) {
    this.data.choices[choiceIndex].isVeg = !this.data.choices[choiceIndex].isVeg
  }

  choiceAvailableSwitch(choiceIndex: any) {
    this.data.choices[choiceIndex].isAvailable = !this.data.choices[choiceIndex].isAvailable
  }

  deleteChoice(choiceIndex: any) {
    this.data.choices.splice(choiceIndex, 1)
  }

  curryVegSwitch() {
    this.data.isVeg = !this.data.isVeg
  }

  addChoice() {
    this.data.choices.push({
      "label": "",
      "isVeg": false,
      "isAvailable": true
    })
  }
}
