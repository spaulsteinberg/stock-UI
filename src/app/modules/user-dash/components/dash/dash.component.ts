import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { IQuote } from '../../shared/models/IQuote';
import { ListServiceService } from '../../shared/services/list-service.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {

  constructor(private router: Router,
              private _dash: DashboardService,
              public _stocks: ListServiceService){ }
  // hydrate the service only init once
  ngOnInit(){
    if (this._stocks.getQuotes() === undefined) this.getUserList();
  }

  watchList = [];
  isError:boolean = false;
  errorOnList:string;
  quotes:IQuote[] = [];
  quotesHydratedFlag:boolean = false;
  finishedLoadingFlag:boolean = false;
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
          let q = new IQuote(min.companyName, min.symbol, min.iexRealtimePrice, min.change, min.changePercent, min.latestPrice);
          this.quotes.push(q);
        });
        this._stocks.updateQuoteList(this.quotes);
        console.log(this._stocks.getQuotes());
      },
      error => {
        this.isError = true;
        this.errorOnList = "Error fetching stock quotes.";
      },
      () => {
        console.log("Batch complete");
        this.quotesHydratedFlag = true;
      }
    );
  }

  /*reRoute(){
    console.log(this.route.snapshot['_routerState'].url);
    this.router.navigate(['configstocks'], {relativeTo: this.route});
  }*/
}
