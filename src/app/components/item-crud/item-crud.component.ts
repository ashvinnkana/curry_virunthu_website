import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';

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

  constructor( private catService: CategoryService) { }

  ngOnInit(): void {
    this.retrieveCategory();
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
      "label":"",
      "isVeg":false,
      "isAvailable":true
    })
  }
}
