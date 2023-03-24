import { Component } from '@angular/core';
import { TableManageService } from 'src/app/services/table-manage.service';

@Component({
  selector: 'app-table-management',
  templateUrl: './table-management.component.html',
  styleUrls: ['./table-management.component.css']
})
export class TableManagementComponent {
  data:any = {
    "customer":"",
    "state":"FREE"
  }
  tableNum = ""
  constructor(private tableService: TableManageService) {}

  createTable() {
    this.tableService.create(this.tableNum, this.data).then(() => {
      console.log("Document successfully written!");
      this.tableNum = ""
  });
  }
}
