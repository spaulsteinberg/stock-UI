import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { MainTableComponent } from './main-table/main-table.component';
import { MyGainsLandingComponent } from './my-gains-landing/my-gains-landing.component';

const routes: Routes = [
    {
        path: '',
        component: MyGainsLandingComponent,
        pathMatch: 'full'
    },
    {
      path: 'gains',
      component: MyGainsLandingComponent
    }
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GainsRoutingModule { }