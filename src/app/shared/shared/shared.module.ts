import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { OwlModule } from 'ngx-owl-carousel';
import { ChartsModule } from 'ng2-charts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);
export const modules = [
  FormsModule,
  MatSelectModule,
  MatRadioModule,
  ScrollingModule,
  OwlModule,
  MatInputModule,
  ChartsModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatProgressBarModule,
  ReactiveFormsModule,
  HttpClientModule,
  MatProgressSpinnerModule,
  FullCalendarModule
];

@NgModule({
  declarations: [],
  imports: modules,
  exports: [...modules]
})
export class SharedModule { }
