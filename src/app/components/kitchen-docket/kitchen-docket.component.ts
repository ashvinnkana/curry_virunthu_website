import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-kitchen-docket',
  templateUrl: './kitchen-docket.component.html',
  styleUrls: ['./kitchen-docket.component.css']
})

export class KitchenDocketComponent {

  public orders: any = [];

  public orderTypeColor:any = {
    "Dine-in": "#0B5FA3",
    "Takeaway": "#a30b69"
  }

  public orderStateColor:any = {
    "ORDERED": "white",
    "PREPARING": "#E9BC69",
    "DONE": "#5AD880"
  }

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.retrieveOrders();
  }

  retrieveOrders(): void {
    this.orderService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.orders = data;
    });
  }

  getOrderColor(type:any):any {
    return this.orderTypeColor[type];
  }

  getItemBackgroundColor(state:any):any {
    return this.orderStateColor[state];
  }

  handleItemClick(orderIndex:any, itemIndex: any, itemType: any) {
    switch (this.orders[orderIndex][itemType][itemIndex]["state"]) {
      case 'ORDERED':
        this.orders[orderIndex][itemType][itemIndex]["state"] = "PREPARING";
        break;
      case 'PREPARING':
        this.orders[orderIndex][itemType][itemIndex]["completedCount"]++;
        if (this.orders[orderIndex][itemType][itemIndex]["completedCount"] >= this.orders[orderIndex][itemType][itemIndex]["quantity"]) {
          this.orders[orderIndex][itemType][itemIndex]["state"] = "DONE";
        }
        break;
    }
  }

  public timeoutHandler: any;

  handleItemHold(orderIndex:any, itemIndex: any, itemType: any) {
    this.timeoutHandler = setTimeout(() => {
      this.orders[orderIndex][itemType][itemIndex]["state"] = "ORDERED"
      this.timeoutHandler = null;
    }, 1000);
    
  }
}
