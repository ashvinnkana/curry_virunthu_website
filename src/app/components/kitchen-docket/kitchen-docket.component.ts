import { NONE_TYPE } from '@angular/compiler';
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { GlobalVariableService } from 'src/app/services/global-variable.service';

@Component({
  selector: 'app-kitchen-docket',
  templateUrl: './kitchen-docket.component.html',
  styleUrls: ['./kitchen-docket.component.css']
})

export class KitchenDocketComponent {

  public orders: any = [];
  public customerData: any = {};
  public foodSummary: any = {};
  public addonSummary: any = {};
  public drinkSummary: any = {};
  public foodList: any = [];
  public addonList: any = [];
  public drinkList: any = [];

  public swiping = false;

  public currentTime: any;

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

  public updateDocketList: any = []

  constructor(private orderService: OrderService, private customerService: CustomerService, public globalVariableService: GlobalVariableService) { }

  ngOnInit(): void {
    this.retrieveCustomers();
    this.retrieveOrders();

    setInterval(() => {
      this.currentTime = Date.now()
    }, 1000)

  }

  loginAdmin(): void {
    var password = prompt("Enter Administration Password: ")
     if (password == '@shvinn') {
       this.globalVariableService.isAdmin = true
     } else {
       this.globalVariableService.isAdmin = false
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
        this.foodSummary = {}
        this.drinkSummary = {}
        this.addonSummary = {}

        this.foodList = []
        this.addonList = []
        this.drinkList =[]
        for (let order of data) {
          if (order["state"] == "ORDERED" || order["state"] == "PREPARING") {
            this.orders.push(order)
            for (let food of order["foodOrder"]) {
                if (food["state"] == "ORDERED" || food["state"] == "PREPARING") {
                  
                  if (!this.foodSummary[food["label"]]) {
                    this.foodList.push(food["label"])
                    this.foodSummary[food["label"]] = {
                      "Dine-in":0,
                      "Takeaway":0
                    }
                  }
                  this.foodSummary[food["label"]][order['orderType']] += food["quantity"] - food["completedCount"]
                  

                  if (food["addon"]) {
                    
                    if (!this.addonSummary[food["addon"]]) {
                      this.addonList.push(food["addon"])
                      this.addonSummary[food["addon"]] = {
                        "Dine-in":0,
                        "Takeaway":0
                      }
                    }
                    this.addonSummary[food["addon"]][order["orderType"]] += food["quantity"] - food["completedCount"]
                  }
                }
            }

            for (let drink of order["drinkOrder"]) {
                if (drink["state"] == "ORDERED" || drink["state"] == "PREPARING") {
                  
                  if (!this.drinkSummary[drink["label"]]) {
                    this.drinkList.push(drink["label"])
                    this.drinkSummary[drink["label"]] = {
                      "Dine-in":0,
                      "Takeaway":0
                    }
                  }
                  this.drinkSummary[drink["label"]][order["orderType"]] += drink["quantity"] - drink["completedCount"]
                }
            }
          }
        }

        if (Object.keys(this.foodSummary).length == 0) {
          this.foodSummary = null
        }
        if (Object.keys(this.drinkSummary).length == 0) {
          this.drinkSummary = null
        }
        if (Object.keys(this.addonSummary).length == 0) {
          this.addonSummary = null
        }

      });
  }

  summaryWidth = 5
  showSummary() {
    if (this.summaryWidth == 5) {
      this.summaryWidth = 30
    } else {
      this.summaryWidth = 5
    }
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

    this.updateOrder(this.orders[orderIndex]["id"], this.orders[orderIndex]);
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
      this.orders[orderIndex]["total"] -= this.orders[orderIndex][itemType][itemIndex]["totalPrice"];
      this.orders[orderIndex][itemType][itemIndex]["completedCount"] = 0;
      if (this.orders[orderIndex]["orderQuantity"] == 0)
        this.orders[orderIndex]["completedPercent"] = 100
      else
        this.updateCompletedPercent(orderIndex);

    }

    this.updateOrder(this.orders[orderIndex]["id"], this.orders[orderIndex]);
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
      this.orders[orderIndex]["total"] += this.orders[orderIndex][itemType][itemIndex]["totalPrice"];
      this.updateCompletedPercent(orderIndex);
    }

    this.updateOrder(this.orders[orderIndex]["id"], this.orders[orderIndex]);
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

    if (hours == -1)
      return ""

    var timer = ""
    if (hours != 0)
      timer += hours + "hr "

    if (minutes < 1 && hours == 0)
      return ""
    else
      timer += minutes + "min "

    return timer
  }

  roundPercent(value: any) {
    return Math.round(value)
  }

  updateOrder(id: any, data: any) {
    this.orderService.update(id, data).then(() => {

    })
      .catch((error) => {
        console.error("Cannot update order docket: ", error);
      });
  }
}
