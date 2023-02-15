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

  public choosen_item_data = {
    "buyCount": "16",
    "category": "uCEqphrnucw50HI2ZzFc",
    "choices": [
      {
        "isAvailable": true,
        "isVeg": false,
        "label": "Chicken Kalaki",
        "meat": "UnaQzVNZOXH15OP8Trpr"
      },
      {
        "isAvailable": true,
        "isVeg": false,
        "label": "Mutton Kalaki",
        "meat": "uHGEKtGA12T0TNGA4yvn"
      },
      {
        "isAvailable": false,
        "isVeg": false,
        "label": "Beef Kalaki",
        "meat": "fSzjiISmfEQc4Yf76rPJ"
      }
    ],
    "description": "Kalakki is a famous street side food from Coimbatore. Its a soft scrambled egg with a little masala added of the choosen meat.",
    "id": "6RVtOOBi95gkbMk3TnSM",
    "img": "https://firebasestorage.googleapis.com/v0/b/curry-virunthu.appspot.com/o/assets%2Fimg%2Fitem-uploads%2Fkalaki.jpg?alt=media&token=34f886f6-dbda-4a16-8f81-108c0b45f49c",
    "isAvailable": true,
    "label": "Kalaki",
    "price": "12"
  }

  constructor(private itemService: ItemService, private catService: CategoryService) { }

  ngOnInit(): void {
    this.retrieveItems();
    this.retrieveCategory();
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
