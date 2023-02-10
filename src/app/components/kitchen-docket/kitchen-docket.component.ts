import { NONE_TYPE } from '@angular/compiler';
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-kitchen-docket',
  templateUrl: './kitchen-docket.component.html',
  styleUrls: ['./kitchen-docket.component.css']
})

export class KitchenDocketComponent {

  public orders: any = [];

  public swiping = false;

  public currentTime: any;

  public orderTypeColor:any = {
    "Dine-in": "#0B5FA3",
    "Takeaway": "#a30b69"
  }

  public orderStateColor:any = {
    "ORDERED": "white",
    "PREPARING": "#E9BC69",
    "DONE": "#5AD880"
  }

  constructor(private orderService: OrderService, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.retrieveOrders();

    setInterval(() => {
      this.currentTime = Date.now()
    },1000)
  
  }

  retrieveOrders(): void {
    this.orderService.getAll()
    .snapshotChanges().pipe(
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
    this.orders[orderIndex]["state"]="PREPARING"
    switch (this.orders[orderIndex][itemType][itemIndex]["state"]) {
      case 'ORDERED':
        this.orders[orderIndex][itemType][itemIndex]["state"] = "PREPARING";
        break;
      case 'PREPARING':
        this.orders[orderIndex][itemType][itemIndex]["completedCount"]++;
        this.orders[orderIndex]["completedCount"]++;
        this.updateCompletedPercent(orderIndex);
        if (this.orders[orderIndex][itemType][itemIndex]["completedCount"] >= this.orders[orderIndex][itemType][itemIndex]["quantity"]) {
          this.orders[orderIndex][itemType][itemIndex]["state"] = "DONE";
        }
        break;
    }
  }

  updateCompletedPercent(orderIndex:any) {
    this.orders[orderIndex]["completedPercent"] = (this.orders[orderIndex]["completedCount"]/this.orders[orderIndex]["orderQuantity"])*100
  }

  handleResetItem(orderIndex:any, itemIndex: any, itemType: any) {
    this.orders[orderIndex][itemType][itemIndex]["state"] = "ORDERED";
    this.orders[orderIndex]["completedCount"] -= this.orders[orderIndex][itemType][itemIndex]["completedCount"];
    this.updateCompletedPercent(orderIndex);
    this.orders[orderIndex][itemType][itemIndex]["completedCount"] = 0;
  }

  handleCompleteItem(orderIndex:any, itemIndex: any, itemType: any) {
    this.orders[orderIndex]["state"]="PREPARING"
    this.orders[orderIndex][itemType][itemIndex]["state"] = "DONE";
    this.orders[orderIndex]["completedCount"] += this.orders[orderIndex][itemType][itemIndex]["quantity"] - this.orders[orderIndex][itemType][itemIndex]["completedCount"];
    this.orders[orderIndex][itemType][itemIndex]["completedCount"] = this.orders[orderIndex][itemType][itemIndex]["quantity"];
    this.updateCompletedPercent(orderIndex);
  }

  findTimer(orderTime: any) {
    if (orderTime == null || orderTime == NONE_TYPE) {
      return "..."
    }

    var totalSec = (this.currentTime - orderTime.toDate().getTime())/(1000)
    var hours = Math.floor(totalSec / 3600);
    var minutes = Math.floor((totalSec - (hours * 3600)) / 60);
    var seconds = Math.floor(totalSec  - (hours * 3600) - (minutes * 60));

    var timer = ""
    if (hours != 0)
      timer += hours + "h "
    
    if (minutes < 5 && hours == 0)
      return ""
    else
      timer += minutes + "m "

    return timer
  }

  roundPercent(value: any) {
    return Math.round(value)
  }

  getCustomerName(phoneNum:any) {
    
  }
}
