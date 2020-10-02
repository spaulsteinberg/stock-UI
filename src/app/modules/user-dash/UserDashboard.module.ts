import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashComponent } from './components/dash/dash.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddRemoveComponent } from './components/add-remove/add-remove.component';
import { DashRoutingModule } from './dash-routing.module';
import { DashNavigationComponent } from './components/dash-navigation/dash-navigation.component';


@NgModule({
  declarations: [DashComponent, AddRemoveComponent, DashNavigationComponent],
  imports: [
    CommonModule,
    DashRoutingModule,
    MatSelectModule,
    FormsModule,
    DragDropModule,
  ],
  exports: [
    DashComponent
  ]
})
export class UserDashModule { }
