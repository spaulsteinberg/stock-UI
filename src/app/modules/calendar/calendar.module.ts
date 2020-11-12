import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarLandingComponent } from './calendar-landing/calendar-landing.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { CalendarRoutingModule } from './calendar-routing.module';



@NgModule({
  declarations: [CalendarLandingComponent],
  imports: [
    SharedModule,
    CommonModule,
    CalendarRoutingModule
  ],
  exports: [CalendarLandingComponent]
})
export class CalendarModule { }
