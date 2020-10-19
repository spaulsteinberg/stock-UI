import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashComponent } from './components/dash/dash.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddRemoveComponent } from './components/add-remove/add-remove.component';
import { DashRoutingModule } from './dash-routing.module';
import { DashNavigationComponent } from './components/dash-navigation/dash-navigation.component';
import { SymbolFilterPipe } from './shared/symbol-filter.pipe';
import {MatRadioModule} from '@angular/material/radio';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { OwlModule } from 'ngx-owl-carousel';
import { TickerComponent } from './components/ticker/ticker.component';
import {MatInputModule} from '@angular/material/input';
import { ViewChartComponent } from './components/view-chart/view-chart.component';
import { ChartsModule } from 'ng2-charts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import { StockPanelComponent } from './components/stock-panel/stock-panel.component';
import { MainLandingComponent } from './components/compare-components/main-landing/main-landing.component';




@NgModule({
  declarations: [DashComponent, AddRemoveComponent, DashNavigationComponent, SymbolFilterPipe, TickerComponent, ViewChartComponent, StockPanelComponent, MainLandingComponent],
  imports: [
    CommonModule,
    DashRoutingModule,
    MatSelectModule,
    FormsModule,
    DragDropModule,
    MatRadioModule,
    ScrollingModule,
    OwlModule,
    MatInputModule,
    ChartsModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatExpansionModule
  ],
  exports: [
    DashComponent
  ]
})
export class UserDashModule { }
