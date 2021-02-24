import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { MyGainsLandingComponent } from './my-gains-landing/my-gains-landing.component';
import { GainsRoutingModule } from './gains-routing.module';
import { MainTableComponent } from './main-table/main-table.component';
import { NavGainsComponent } from './nav-gains/nav-gains.component';
import { AccountsPageComponent } from './accounts-page/accounts-page.component';
import { RemoveDialogComponent } from './remove-dialog/remove-dialog.component';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { DialogComponent } from './dialog/dialog.component';
import { AccountsTableComponent } from './accounts-table/accounts-table.component';
import { PositionDialogComponent } from './position-dialog/position-dialog.component';
import { InteractiveComponent } from './interactive/interactive.component';
import { MenuDialogContainerComponent } from './menu-dialog-container/menu-dialog-container.component';
import { PieChartVisualComponent } from './pie-chart-visual/pie-chart-visual.component';
import { BarChartVisualComponent } from './bar-chart-visual/bar-chart-visual.component';



@NgModule({
  declarations: [
    MyGainsLandingComponent,
    MainTableComponent,
    NavGainsComponent,
    AccountsPageComponent,
    RemoveDialogComponent,
    AddDialogComponent,
    DialogComponent,
    AccountsTableComponent,
    PositionDialogComponent,
    InteractiveComponent,
    MenuDialogContainerComponent,
    PieChartVisualComponent,
    BarChartVisualComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    GainsRoutingModule
  ],
  exports: [MyGainsLandingComponent]
})
export class GainsModule { }
