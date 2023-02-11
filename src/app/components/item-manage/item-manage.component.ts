import { Component } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-item-manage',
  templateUrl: './item-manage.component.html',
  styleUrls: ['./item-manage.component.css']
})
export class ItemManageComponent {

  public items: any = [];

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.retrieveItems();

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
