import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { MyGainsLandingComponent } from './my-gains-landing/my-gains-landing.component';
import { GainsRoutingModule } from './gains-routing.module';
import { MainTableComponent } from './main-table/main-table.component';
import { NavGainsComponent } from './nav-gains/nav-gains.component';



@NgModule({
  declarations: [MyGainsLandingComponent, MainTableComponent, NavGainsComponent],
  imports: [
    SharedModule,
    CommonModule,
    GainsRoutingModule
  ],
  exports: [MyGainsLandingComponent]
})
export class GainsModule { }
