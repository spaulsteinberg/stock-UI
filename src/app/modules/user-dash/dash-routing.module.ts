import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { AddRemoveComponent } from './components/add-remove/add-remove.component';
import { DashComponent } from './components/dash/dash.component';

const routes: Routes = [
    {
        path: '',
        component: DashComponent,
      /*  children: [
            {
                path: 'configstocks',
                component: AddRemoveComponent
            }
        ]*/
    },
    {
        path: 'configstocks',
        component: AddRemoveComponent
    }
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashRoutingModule { }