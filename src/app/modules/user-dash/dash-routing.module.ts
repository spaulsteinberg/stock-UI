import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { AddRemoveComponent } from './components/add-remove/add-remove.component';
import { MainLandingComponent } from './components/compare-components/main-landing/main-landing.component';
import { DashComponent } from './components/dash/dash.component';
import { TrendingLandingComponent } from './components/trending-components/trending-landing/trending-landing.component';

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
    },
    {
        path: 'trending',
        component: TrendingLandingComponent
    }
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashRoutingModule { }