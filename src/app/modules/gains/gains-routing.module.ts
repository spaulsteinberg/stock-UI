import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { MyGainsLandingComponent } from './my-gains-landing/my-gains-landing.component';

const routes: Routes = [
    {
        path: '',
        component: MyGainsLandingComponent,
        pathMatch: 'full'
    }
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GainsRoutingModule { }