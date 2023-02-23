import { Component } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';

import { map } from 'rxjs/operators';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-item-manage',
  templateUrl: './item-manage.component.html',
  styleUrls: ['./item-manage.component.css']
})
export class ItemManageComponent {

  public items: any = [];
  public categories: any = [];

  public choosen_item_data = {}
  public choosen_crud = "add"

  constructor(private itemService: ItemService, private catService: CategoryService) { }

  ngOnInit(): void {
    this.retrieveItems();
    this.retrieveCategory();
  }

  openAddModal() {
    this.choosen_item_data = {
      "buyCount": "0",
      "category": "",
      "choices": [],
      "description": "",
      "img": "",
      "isAvailable": true,
      "isVeg": false,
      "label": "",
      "price": "0",
      "addon":""
    }
    this.choosen_crud = "add"
    this.isModal = true
  }

  openUpdateModal(data:any) {
    this.choosen_item_data = data
    this.choosen_crud = "update"
    this.isModal = true
  }

  isModal = false;
  closeModal() {
    this.isModal = false
  }

  retrieveItems(): void {
    this.itemService.getAll()
      .snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      ).subscribe(data => {
        this.items = data;
      });
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

  changeAvailability(itemIndex : any) {
    this.items[itemIndex]["isAvailable"] = !this.items[itemIndex]["isAvailable"]
    this.updateItem(this.items[itemIndex]["id"], this.items[itemIndex])
  }

  changeChoiceAvailability(itemIndex : any, choiceIndex: any) {
    this.items[itemIndex]["choices"][choiceIndex]["isAvailable"] = !this.items[itemIndex]["choices"][choiceIndex]["isAvailable"];
    this.updateItem(this.items[itemIndex]["id"], this.items[itemIndex])
  }

  updateItem(id:any, data:any) {
    this.itemService.update(id, data).then(() => {

    })
    .catch((error) => {
      console.error("Cannot update order docket: ", error);
  });
  }
}
