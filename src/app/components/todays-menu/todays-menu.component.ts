import { Component } from '@angular/core';
import { map } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-todays-menu',
  templateUrl: './todays-menu.component.html',
  styleUrls: ['./todays-menu.component.css']
})
export class TodaysMenuComponent {

  public items: any = [];
  public categories: any = [];
  public categoryData: any = {};
  public categoryColorData: any = {};

  constructor(private catService: CategoryService, private itemService: ItemService) {
    
  }

  ngOnInit(): void {
    this.retrieveCategory();
    
    
  }

  retrieveItems(): void {
    this.items = []
    for (let category of this.categories) {
      if (category.id == 'zMyEDUtUyDBHPFfERBBD')
        continue;
        this.itemService.getByCategory(category.id)
        .snapshotChanges().pipe(
          map(changes =>
            changes.map(c =>
              ({ id: c.payload.doc.id, ...c.payload.doc.data() })
            )
          )
        ).subscribe(data => {
          for (let item of data) {
            this.items.push(item)
          }
        });
    }
    
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
        this.categoryData = {}
        for(let category of data) {
          this.categoryData[category.id] = category.label
          this.categoryColorData[category.id] = category.color
        }
        this.retrieveItems();
      });
  }
}
