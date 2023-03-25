import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import * as Hammer from 'hammerjs';
import {HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';

import { KitchenDocketComponent } from './components/kitchen-docket/kitchen-docket.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HeaderComponent } from './components/header/header.component';
import { BillingDocketComponent } from './components/billing-docket/billing-docket.component';
import { ItemManageComponent } from './components/item-manage/item-manage.component';
import { ItemCrudComponent } from './components/item-crud/item-crud.component';
import { TodaysMenuComponent } from './components/todays-menu/todays-menu.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { TableManagementComponent } from './components/table-management/table-management.component';
import { ManageNotificationComponent } from './components/manage-notification/manage-notification.component';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  override overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_HORIZONTAL },
    pinch: { direction: Hammer.DIRECTION_HORIZONTAL },    
  };
}

@NgModule({
  declarations: [
    AppComponent,
    KitchenDocketComponent,
    PageNotFoundComponent,
    HeaderComponent,
    BillingDocketComponent,
    ItemManageComponent,
    ItemCrudComponent,
    TodaysMenuComponent,
    AboutComponent,
    ContactComponent,
    TableManagementComponent,
    ManageNotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HammerModule, 
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
