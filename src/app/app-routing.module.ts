import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { KitchenDocketComponent } from './components/kitchen-docket/kitchen-docket.component';
import { BillingDocketComponent } from './components/billing-docket/billing-docket.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ItemManageComponent } from './components/item-manage/item-manage.component';
import { TodaysMenuComponent } from './components/todays-menu/todays-menu.component';

const routes: Routes = [
  { path: '',   redirectTo: 'todays-menu', pathMatch: 'full' },
  { path: 'admin/kitchen-docket', component: KitchenDocketComponent },
  { path: 'admin/billing-docket', component: BillingDocketComponent },
  { path: 'admin/item-manage', component: ItemManageComponent },
  { path: 'todays-menu', component: TodaysMenuComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
