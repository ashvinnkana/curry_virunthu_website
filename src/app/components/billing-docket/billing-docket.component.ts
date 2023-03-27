import { NONE_TYPE } from '@angular/compiler';
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { CustomerService } from 'src/app/services/customer.service';
import { GlobalVariableService } from 'src/app/services/global-variable.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-billing-docket',
  templateUrl: './billing-docket.component.html',
  styleUrls: ['./billing-docket.component.css']
})
export class BillingDocketComponent {
  public orders: any = [];

  public swiping = false;

  public currentTime: any;

  public customerData: any = {};

  public orderTypeColor: any = {
    "Dine-in": "#0B5FA3",
    "Takeaway": "#a30b69"
  }

  public orderStateColor: any = {
    "REMOVED": "#cf5b5b",
    "ORDERED": "white",
    "PREPARING": "#E9BC69",
    "DONE": "#5AD880"
  }

  public selectedDockets:any = []

  public updateDocketList: any = []

  constructor(private orderService: OrderService, private customerService: CustomerService, public globalVariableService: GlobalVariableService) { }

  loginAdmin(): void {
    var password = prompt("Enter Administration Password: ")
     if (password == '@shvinn') {
       this.globalVariableService.isAdmin = true
     } else {
       this.globalVariableService.isAdmin = false
     }
  }

  summaryWidth = 30
  showSummary() {
    if (this.summaryWidth == 5) {
      this.summaryWidth = 30
    } else {
      this.summaryWidth = 5
    }
  }

  retrieveCustomers(): void {
    this.customerService.getAll()
      .snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      ).subscribe(data => {
        this.customerData = {}
        for (let cus of data){
          this.customerData[cus["mobile"]] = cus
        } 

      });
  }

  ngOnInit(): void {
    this.retrieveCustomers();
    this.retrieveOrders();

    setInterval(() => {
      this.currentTime = Date.now()
    }, 1000)

    setInterval(() => {
      console.log(this.updateDocketList)
      for (var docket of this.updateDocketList) {
        this.updateOrder(docket["id"], docket["data"])
      }

      this.updateDocketList = []
    }, 600000)

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
        this.orders = []
        for (let order of data) {
          if (order["state"] == "BILLING") {
            this.orders.push(order)
          }

        }
      });
  }

  getOrderColor(type: any): any {
    return this.orderTypeColor[type];
  }

  getItemBackgroundColor(state: any): any {
    return this.orderStateColor[state];
  }

  handleItemClick(orderIndex: any, itemIndex: any, itemType: any) {
    this.orders[orderIndex]["state"] = "PREPARING"
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

    this.updateDocketList.push({
      "id" : this.orders[orderIndex]["id"],
      "data" : this.orders[orderIndex]
    })
  }

  updateCompletedPercent(orderIndex: any) {
    this.orders[orderIndex]["completedPercent"] = (this.orders[orderIndex]["completedCount"] / this.orders[orderIndex]["orderQuantity"]) * 100
  }

  handleResetItem(orderIndex: any, itemIndex: any, itemType: any) {
    this.orders[orderIndex]["state"] = "PREPARING"
    if (this.orders[orderIndex][itemType][itemIndex]["state"] != 'ORDERED' && this.orders[orderIndex][itemType][itemIndex]["state"] != 'REMOVED') {
      this.orders[orderIndex][itemType][itemIndex]["state"] = "ORDERED";
      this.orders[orderIndex]["completedCount"] -= this.orders[orderIndex][itemType][itemIndex]["completedCount"];
      this.updateCompletedPercent(orderIndex);
      this.orders[orderIndex][itemType][itemIndex]["completedCount"] = 0;
    } else if (this.orders[orderIndex][itemType][itemIndex]["state"] == 'ORDERED') {
      this.orders[orderIndex][itemType][itemIndex]["state"] = "REMOVED";
      this.orders[orderIndex]["completedCount"] -= this.orders[orderIndex][itemType][itemIndex]["completedCount"];
      this.orders[orderIndex]["orderQuantity"] -= this.orders[orderIndex][itemType][itemIndex]["quantity"];
      this.orders[orderIndex][itemType][itemIndex]["completedCount"] = 0;
      if (this.orders[orderIndex]["orderQuantity"] == 0)
        this.orders[orderIndex]["completedPercent"] = 100
      else
        this.updateCompletedPercent(orderIndex);

    }

    this.updateDocketList.push({
      "id" : this.orders[orderIndex]["id"],
      "data" : this.orders[orderIndex]
    })
  }

  handleCompleteItem(orderIndex: any, itemIndex: any, itemType: any) {
    this.orders[orderIndex]["state"] = "PREPARING"
    if (this.orders[orderIndex][itemType][itemIndex]["state"] != 'REMOVED' && this.orders[orderIndex][itemType][itemIndex]["state"] != 'DONE') {
      this.orders[orderIndex][itemType][itemIndex]["state"] = "DONE";
      this.orders[orderIndex]["completedCount"] += this.orders[orderIndex][itemType][itemIndex]["quantity"] - this.orders[orderIndex][itemType][itemIndex]["completedCount"];
      this.orders[orderIndex][itemType][itemIndex]["completedCount"] = this.orders[orderIndex][itemType][itemIndex]["quantity"];
      this.updateCompletedPercent(orderIndex);
    } else if (this.orders[orderIndex][itemType][itemIndex]["state"] == 'REMOVED') {
      this.orders[orderIndex][itemType][itemIndex]["state"] = "ORDERED";
      this.orders[orderIndex]["orderQuantity"] += this.orders[orderIndex][itemType][itemIndex]["quantity"];
      this.updateCompletedPercent(orderIndex);
    }

    this.updateDocketList.push({
      "id" : this.orders[orderIndex]["id"],
      "data" : this.orders[orderIndex]
    })
  }

  sendToBiling(orderIndex: any) {
    this.orders[orderIndex]["state"] = 'BILLING'
    this.updateOrder(this.orders[orderIndex]["id"], this.orders[orderIndex]);
  }

  findTimer(orderTime: any) {
    if (orderTime == null || orderTime == NONE_TYPE) {
      return "..."
    }

    var totalSec = (this.currentTime - orderTime.toDate().getTime()) / (1000)
    var hours = Math.floor(totalSec / 3600);
    var minutes = Math.floor((totalSec - (hours * 3600)) / 60);
    var seconds = Math.floor(totalSec - (hours * 3600) - (minutes * 60));

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

  updateOrder(id:any, data:any) {
    this.orderService.update(id, data).then(() => {

    })
    .catch((error) => {
      console.error("Cannot update order docket: ", error);
  });
  }

  confirmPayment(orderIndex: any) {
    if (confirm("PAID ?")) {
      this.orders[orderIndex]["state"] = 'PAID'
      this.updateOrder(this.orders[orderIndex]["id"], this.orders[orderIndex]);
    }
  }


  recieptData:any = {
    dockets: [],
    total:0,
  }
  selectDocket(orderIndex: any) {
    this.recieptData = {
      dockets: [],
      total:0,
    }
    if(!this.selectedDockets.includes(orderIndex)) {
      this.selectedDockets.push(orderIndex)
    } else {
      let index = this.selectedDockets.indexOf(orderIndex);
      let elementsToRemove = 1;
      this.selectedDockets.splice(index, elementsToRemove);
    }

    for (let docketIndex of this.selectedDockets) {
      this.recieptData.total += this.orders[docketIndex]["total"]
      this.recieptData.dockets.push(docketIndex)
    }
  }
}
