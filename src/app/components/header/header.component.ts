import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  isAdminHeader = false
  navChoice = 1

  constructor(private router: Router) {
    router.events.subscribe((val: any) => {
      if (val.urlAfterRedirects != undefined) {
        if (val.urlAfterRedirects.includes("admin")) {
          this.isAdminHeader = true
        } else {
          this.isAdminHeader = false
          if (val.urlAfterRedirects.includes("menu")) {
            this.navChoice = 1
          } else if (val.urlAfterRedirects.includes("about")) {
            this.navChoice = 2
          } else if (val.urlAfterRedirects.includes("contact")) {
            this.navChoice = 3
          }
        }
      }
    })
  }

  ngOnInit(): void {

  }
}
