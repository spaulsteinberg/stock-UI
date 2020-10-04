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



@NgModule({
  declarations: [DashComponent, AddRemoveComponent, DashNavigationComponent, SymbolFilterPipe],
  imports: [
    CommonModule,
    DashRoutingModule,
    MatSelectModule,
    FormsModule,
    DragDropModule,
    MatRadioModule,
    ScrollingModule
  ],
  exports: [
    DashComponent
  ]
})
export class UserDashModule { }
