import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarLandingComponent } from './calendar-landing/calendar-landing.component';

const routes: Routes = [
    {
        path: '',
        component: CalendarLandingComponent,
        pathMatch: 'full'
    },
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }