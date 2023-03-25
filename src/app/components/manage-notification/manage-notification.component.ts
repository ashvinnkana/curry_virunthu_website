import { Component } from '@angular/core';
import { map } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';
import { DeviceTokenService } from 'src/app/services/device-token.service';
import { FcmNotificationService } from 'src/app/services/fcm-notification.service';

@Component({
  selector: 'app-manage-notification',
  templateUrl: './manage-notification.component.html',
  styleUrls: ['./manage-notification.component.css']
})
export class ManageNotificationComponent {

  customers: any = []
  devicesByCus: any = {}

  customerId: any = ""
  title: any = ""
  subtitle: any = ""
  body: any = ""
  sendAll: any = false



  constructor(private cusService: CustomerService, private fcmService: FcmNotificationService, private deviceService: DeviceTokenService) {

    cusService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.customers = data
    });

    this.devicesByCus = {}
    deviceService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(datas => {
      for (let data of datas) {
        this.devicesByCus[data["id"]] = data["token"]
      }
    });
  }

  sendNotification() {

    if (this.title.trim() == "" || this.subtitle.trim() == "" || this.body.trim() == "" || (this.customerId == "" && !this.sendAll)) {
      alert("ALL FIELDS REQUIRED!");
      return
    }

    if (this.sendAll) {
      for (let cus of this.customers) {
        this.fcmService.sendPostRequest({
          "to": this.devicesByCus[cus.id],
          "notification": {
            "body": this.body,
            "title": this.title,
            "subtitle": this.subtitle
          }
        }).subscribe(
          res => {

            console.log(res);
          }
        );
      }
      this.body = ""
      this.title = ""
      this.subtitle = ""
      this.customerId = ""
    }
    else {
      this.fcmService.sendPostRequest({
        "to": this.devicesByCus[this.customerId],
        "notification": {
          "body": this.body,
          "title": this.title,
          "subtitle": this.subtitle
        }
      }).subscribe(
        res => {
          this.body = ""
          this.title = ""
          this.subtitle = ""
          this.customerId = ""
          console.log(res);
        }
      );
    }
  }
}
