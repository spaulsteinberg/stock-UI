import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/angular';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { CalendarContainer, CalendarObject } from '../../../shared/models/CalendarObject';
import { ListServiceService } from '../../../shared/services/list-service.service';
@Component({
  selector: 'app-calendar-landing',
  templateUrl: './calendar-landing.component.html',
  styleUrls: ['./calendar-landing.component.css']
})
export class CalendarLandingComponent implements OnInit {

  constructor(private el: ElementRef,
              private _stocks : ListServiceService,
              private dash: DashboardService, 
              private router : Router) {
    this.el.nativeElement.ownerDocument.body.style.backgroundColor = "lightgray"
    this.el.nativeElement.ownerDocument.body.style.backgroundImage = "none"
  }
  symbolList:string[] = [];
  calendarContainer:CalendarContainer;
  ngOnInit(): void {
    this.dash.getUserList()
    .subscribe(data => {
      this.symbolList = data["stocksTracking"];
    },
    error => {
      console.log(error)
    },
    () => {
      this.getNextDividends();
      this.assign();
    })
  }
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    editable: false,
    eventColor: "green",
    eventClick: (event) => {
      console.log(event)
    },
    fixedWeekCount: false
  };

  getNextDividends(){
    this.calendarContainer = this._stocks.getNextDividendOnBadStocks(this.symbolList);
  }
  isLoaded:boolean = false;
  assign(){
    setTimeout(() => {
      this.calendarOptions.events = this.calendarContainer.calendarObjects
      this.isLoaded = true;
    }, 500)
    console.log(this.calendarContainer)
  }
  renderErrorStocks(){
    return this.calendarContainer.errorObjects.join(', ');
  }
  navBack() {
    this.router.navigate(['/dash'])
  }
}
