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
  selector: 'app-add-remove',
  templateUrl: './add-remove.component.html',
  styleUrls: ['./add-remove.component.css']
})
export class AddRemoveComponent implements OnInit {

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
    // get initial user list from DB
    this._dash.getUserList()
    .subscribe
    (response => {
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
            this.getBatchQuotesFromStoredPreferences();
            this.finishedLoadingFlag = true;
        });
  }

  // get the batch request and map to IQuote structure
  getBatchQuotesFromStoredPreferences(){
    this._stocks.getBatchQuotes(this.watchList)
    .subscribe(
      quotes => {
        console.log(quotes);
        Object.keys(quotes).forEach((key, index) => {
          const min = quotes[key].quote;
          let q = new IQuote(min.companyName, min.symbol, min.iexRealtimePrice, min.change, min.changePercent);
          this.quotes.push(q);
        });
      },
      error => {
        this.isError = true;
        this.errorOnList = "Error fetching stock quotes.";
      },
      () => console.log("Batch complete")
    );
  }

  //render function helper
  renderStockItem(fullName:string, symbol:string):string {
      return `${fullName} (${symbol})`;
  }

/***********************Testing stuff */

  fillerQuotes = ['JPM', 'WDC', 'AAPL', 'WFC', 'UBER', 'LYFT', 'WMT', 'DAL', 'ROKU'];
  actions = ['Add', 'Remove'];
  selectBoxValue;
  selectBoxAction;
  isAddError:boolean = false;

  // on Execute, perform logic to add/delete stock depending on option selected
  executeAction(){
    console.log(this.selectBoxValue);
    if (this.selectBoxAction === 'Add'){
    this._backend.addStockToUserList(this.selectBoxValue)
    .subscribe(
    data => {
    this._stocks.getIndividualQuote(this.selectBoxValue)
    .toPromise()
    .then(quote => {
      console.log("quote is:", quote);
      let q = new IQuote(quote.companyName, quote.symbol, quote.iexRealtimePrice, quote.change, quote.changePercent);
      this.quotes.push(q);
      this.toastSuccessAdd(this.selectBoxValue);
    })
    .catch(error => {
      console.log(error);
      this.toastPartialSuccess(this.selectBoxValue);
    })
    .then(() => {
      console.log("Promise complete.");
    })
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
        console.log("Patch Complete")
    });
    }
    else {
    this._backend.deleteFromUserList(this.selectBoxValue)
    .subscribe(
    data => {
    for (let i = 0; i < this.quotes.length; i++){
      if (this.selectBoxValue === this.quotes[i].symbol){
        this.quotes.splice(i, 1);
        this.toastSuccessDelete(this.selectBoxValue);
        break;
      }
    }
    console.log(this.quotes);
    },
    error => this.toastErrorDelete(this.selectBoxValue),
    () => console.log("Delete complete")
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
  //success for db, failure adding to real-time list. on a refresh it will show up
  toastPartialSuccess(value){
    $(function(){
        toastr.warning(`${value} added to list but failed rendering. Please refresh.`);
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.quotes, event.previousIndex, event.currentIndex);
  }

}
