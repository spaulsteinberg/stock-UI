import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { AddRemoveComponent } from './components/add-remove/add-remove.component';
import { MainLandingComponent } from './components/compare-components/main-landing/main-landing.component';
import { DashComponent } from './components/dash/dash.component';

const routes: Routes = [
    {
        path: '',
        component: DashComponent,
        pathMatch: 'full'
    },
    {
        path: 'dash',
        component: DashComponent,
      /*  children: [
            { path: 'comparelanding', component: MainLandingComponent }
        ]*/
    },
    {
        path: 'configstocks',
        component: AddRemoveComponent
    },
    {
        path: 'comparelanding',
        component: MainLandingComponent
    }
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashRoutingModule { }