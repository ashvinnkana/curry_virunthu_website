import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { KitchenDocketComponent } from './components/kitchen-docket/kitchen-docket.component';
import { BillingDocketComponent } from './components/billing-docket/billing-docket.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ItemManageComponent } from './components/item-manage/item-manage.component';

const routes: Routes = [
  { path: '',   redirectTo: 'admin/kitchen-docket', pathMatch: 'full' },
  { path: 'admin/kitchen-docket', component: KitchenDocketComponent },
  { path: 'admin/billing-docket', component: BillingDocketComponent },
  { path: 'admin/item-manage', component: ItemManageComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
