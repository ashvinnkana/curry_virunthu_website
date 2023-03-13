import { Component, HostListener } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'curry_virunthu_website';
  isAdmin = false
  isSuitable = true
  screenHeight:any =window.innerHeight;
  screenWidth:any =window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenHeight > (this.screenWidth - 250)) {
      this.isSuitable= true
    } else {
      this.isSuitable= false
    }
  }

  constructor() {
    if (this.screenHeight > (this.screenWidth - 250)) {
      this.isSuitable= true
    } else {
      this.isSuitable= false  
    }
     var password = prompt("Enter Administration Password: ")
     if (password == '@shvinn') {
       this.isAdmin = true
     } else {
       this.isAdmin = false
     }
  }
}
