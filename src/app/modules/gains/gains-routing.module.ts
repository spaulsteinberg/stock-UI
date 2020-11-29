import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { AccountsPageComponent } from './accounts-page/accounts-page.component';
import { MainTableComponent } from './main-table/main-table.component';
import { MyGainsLandingComponent } from './my-gains-landing/my-gains-landing.component';

const routes: Routes = [
    {
        path: '',
        children: [
          {
            path: '',
            component: MyGainsLandingComponent
          },
          {
            path: 'watchlist/table',
            component: MainTableComponent
          },
          {
            path: 'accounts',
            component: AccountsPageComponent
          }
        ]
    }
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GainsRoutingModule { }