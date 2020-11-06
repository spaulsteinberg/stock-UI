import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashComponent } from './components/dash/dash.component';
import { AddRemoveComponent } from './components/add-remove/add-remove.component';
import { DashRoutingModule } from './dash-routing.module';
import { DashNavigationComponent } from './components/dash-navigation/dash-navigation.component';
import { SymbolFilterPipe } from './shared/symbol-filter.pipe';
import { TickerComponent } from './components/ticker/ticker.component';
import { ViewChartComponent } from './components/view-chart/view-chart.component';
import { StockPanelComponent } from './components/stock-panel/stock-panel.component';
import { MainLandingComponent } from './components/compare-components/main-landing/main-landing.component';
import { ChartsComponent } from './components/compare-components/charts/charts.component';
import { EarningsDisplayComponent } from './components/compare-components/earnings-display/earnings-display.component';
import { DividendsPanelComponent } from './components/compare-components/dividends-panel/dividends-panel.component';
import { TrendingLandingComponent } from './components/trending-components/trending-landing/trending-landing.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { NewsCardComponent } from './components/trending-components/news-card/news-card.component';




@NgModule({
  declarations: [
    DashComponent, 
    AddRemoveComponent, 
    DashNavigationComponent, 
    SymbolFilterPipe, 
    TickerComponent, 
    ViewChartComponent, 
    StockPanelComponent, 
    MainLandingComponent,
    ChartsComponent, 
    EarningsDisplayComponent,
    DividendsPanelComponent,
    TrendingLandingComponent,
    NewsCardComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    DashRoutingModule
  ],
  exports: [
    DashComponent
  ]
})
export class UserDashModule { }
