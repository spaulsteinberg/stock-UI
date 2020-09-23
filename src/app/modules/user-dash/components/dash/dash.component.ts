import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { ListServiceService } from '../../shared/services/list-service.service';
import { IQuote } from '../../shared/models/IQuote';
import { BackendService } from '../../shared/services/backend.service';
import * as $ from 'jquery/dist/jquery.min.js';
import * as toastr from 'toastr';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {

  constructor(private _dash: DashboardService, 
              private router: Router, 
              private _stocks: ListServiceService,
              private _backend: BackendService) { }
  watchList = [];
  isError:boolean = false;
  errorOnList:string;
  quotes:IQuote[] = [];
  finishedLoadingFlag:boolean = false;
  ngOnInit(): void {
    this.getUserList();
  }

  getUserList(){
    this._dash.getUserList()
    .subscribe(response => {
      console.log("I am the response");
      if (response === null || response === undefined){
        console.log("Nothing in response to dash");
      }
      else if (response.stocksTracking !== null || response.stocksTracking !== undefined){
        this.watchList = response.stocksTracking;
      }
      else {
        console.log(response);
      }
      this.isError = false;
    },
    error => {
      this.isError = true;
      if (error.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('u');
        this.router.navigate(['/login']);
      }
      this.errorOnList = error.status === 500 ? "Server error. Please login and try again." : "Error fetching stocks.";
    },
    () => {
      console.log("here after update");
      this.getWatchList();
      this.finishedLoadingFlag = true;
    });
  }

  getWatchList(){
    this.quotes = [];
    this.watchList.forEach(element => {
      this._stocks.getUserListQuotes(element)
          .subscribe
          (quote => {
            console.log(quote);
            let q = new IQuote(quote.companyName, quote.symbol, quote.iexRealtimePrice, quote.change, quote.changePercent);
            this.quotes.push(q);
          },
          error => {
            this.isError = true;
            this.errorOnList = "Error fetching stock quotes.";
          },
          () => console.log("Complete."))
    });
  }

  renderStockItem(fullName:string, symbol:string):string {
    return `${fullName} (${symbol})`;
  }

  /***********************Testing stuff */

  fillerQuotes = ['JPM', 'WDC', 'AAPL', 'WFC', 'UBER', 'LYFT', 'WMT', 'DAL', 'ROKU'];
  actions = ['Add', 'Remove'];
  selectBoxValue;
  selectBoxAction;
  isAddError:boolean = false;
  executeAction(){
    console.log(this.selectBoxValue);
    if (this.selectBoxAction === 'Add'){
      this._backend.addStockToUserList(this.selectBoxValue)
      .subscribe(
        data => {
          this.toastSuccessAdd(this.selectBoxValue);
        },
        error => {
          if (error.status === 400){
            this.isAddError = true;
            this.toastErrorAdd(this.selectBoxValue);
          }
          if (error.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('u');
            this.router.navigate(['/login']);
          }
        },
        () => {
          console.log("Patch Complete");
          this.getUserList();
        });
    }
    else {
      this._backend.deleteFromUserList(this.selectBoxValue)
      .subscribe(
        data => this.toastSuccessDelete(this.selectBoxValue),
        error => this.toastErrorDelete(this.selectBoxValue),
        () => this.getUserList()
      )
    }
  }

  toastErrorAdd(value){
    $(function(){
      toastr.error(`${value} already in watch list!`, 'Cannot add stock');
    });
  }
  toastSuccessAdd(value){
    $(function(){
      toastr.success(`${value} added to watch list`, 'Stock added');
    });
  }
  toastErrorDelete(value){
    $(function(){
      toastr.error(`Failed to delete ${value}`, 'Deletion Failure');
    });
  }
  toastSuccessDelete(value){
    $(function(){
      toastr.info(`Deleted ${value}`, 'Item deleted');
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.quotes, event.previousIndex, event.currentIndex);
  }
}
