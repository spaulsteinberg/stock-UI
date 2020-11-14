import { Component, ElementRef, OnInit } from '@angular/core';
import { noop, Observable, timer } from 'rxjs';
import { concatMap, map, switchMap, tap } from 'rxjs/operators';
import { ILightWeightQuote } from 'src/app/shared/interfaces/ILightWeightQuote';
import { IQuote } from 'src/app/shared/interfaces/IQuote';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { ListServiceService } from 'src/app/shared/services/list-service.service';

@Component({
  selector: 'app-main-table',
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.component.css']
})
export class MainTableComponent implements OnInit {

  constructor(private dash : DashboardService, private _stocks : ListServiceService, private el : ElementRef) 
  {
    this.el.nativeElement.ownerDocument.body.style.backgroundColor = "black"
    this.el.nativeElement.ownerDocument.body.style.backgroundImage = "none"
  }

  symbolList:string[] = [];
  stockList:ILightWeightQuote[] = [];
  quoteList:IQuote[] = [];
  isError:boolean = false;
  onInitLoadingProgressBarDisplay:boolean = true;
  tickingSub$;
  ngOnInit(): void {
    this.getSymbols();
  }
  getSymbols(){
    this.dash.getUserList()
    .subscribe(
      response => this.symbolList = response.stocksTracking,
      error => {
        this.isError = true;
        console.log(error)
      },
      () => {
      //  this.getData()
        this.getQuotes();
      }
    );
  }
/* DOESNT LOOK LIKE LIGHTWEIGHT API DOES WEEKENDS
  getData(){
    this._stocks.getLightweightStocks(this.symbolList)
    .pipe(
      map(x => {
        for (let attributes of x){
          attributes.lastUpdated = this.renderDate(attributes.lastUpdated);
          attributes.lastSaleSize = undefined; //undefined because we will never use this, now just as buy price indicator
          attributes.lastSaleTime = undefined; //like above, use as number of shares indicator
        }
        return x;
      })
    )
    .subscribe(
      data => {
        console.log(data);
        this.stockList = data;
      },
      error => {
        this.isError = true;
        console.log(error)
      },
      () =>{ 
        console.log("done lightweight");
        this.onInitLoadingProgressBarDisplay = false;
        this.marketIsOpen() && this.updatePrices(); //short circuit, only run constant update is market is open
      }
    )
  }
  //contains update timer for constant checks, start after 2 seconds on load
  updatePrices(){
    this.tickingSub$ = timer(2000, 10000)
    .pipe(
      tap(_ => this.getPrices())
    ).subscribe();
  }
  //get current prices to update
  getPrices(){
    this._stocks.getLightweightStocks(this.symbolList)
    .subscribe(
      data => {
        for (let i = 0; i < this.stockList.length; i++){
          this.stockList[i].lastSalePrice = data[i].lastSalePrice;
          console.log(data[i].lastSalePrice)
        }
        console.log(this.stockList)
      },
      error => console.log(error),
      () => console.log("completed a run")
    )
  }
*/
  getQuotes(){
    this._stocks.getBatchQuotes(this.symbolList)
    .pipe(
      map(raw => {
        let refined = Object.values(raw); //convert obj of obj into array of obj
        for (let quote of refined){
          console.log(quote)
          quote["quote"]["latestUpdate"] = this.renderDate(quote["quote"]["latestUpdate"]);
          quote["quote"]["highTime"] = undefined;
          quote["quote"]["lowTime"] = undefined;
        }
        return refined;
      })
    )
    .subscribe(
      data => {
        console.log(data);
        for(let q of data){
          this.quoteList.push(q["quote"])
        }
        console.log(this.quoteList)
      },
      error => {
        console.log("ERROR:", error);
        this.isError = true
      },
      () => {
        console.log("done heavyweight");
        this.onInitLoadingProgressBarDisplay = false;
        this.marketIsOpen() && this.updatePrices();
      }
    )
  }
  //contains update timer for constant checks, start after 2 seconds on load
  updatePrices(){
    this.tickingSub$ = timer(2000, 10000)
    .pipe(
      tap(_ => this.getQuotes())
    ).subscribe();
  }

  renderPrice(curPrice:number, userBuyPrice:number, numShares:number){
    return ( (curPrice*numShares) - (userBuyPrice*numShares)).toFixed(2);
  }
  
  renderStyle(curPrice:number, userBuyPrice:number){
    let style = {
      'color': (curPrice - userBuyPrice) > 0 ? 'green' : (curPrice - userBuyPrice) < 0 ? 'red' : 'gray'
    };
    
    return style;
  }
  renderDate(d:any){
    return new Date(d).toLocaleString("en-US", {
      timeZone: "America/New_York"
    });
  }

  marketIsOpen(){
    let curTime = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York"
    });
    let curDateTime = new Date(curTime)
    //Might need to check for daylight savings?
    if (curDateTime.getDay() >= 1 && curDateTime.getDay() <= 5){
      if (curDateTime.getHours() >= 9 && curDateTime.getHours() < 16){
        if (curDateTime.getHours() === 9){
          return curDateTime.getMinutes() >= 30 ? true : false;
        }
        return true;
      }
    }
    return false;
  }

  ngOnDestroy(){
    this.tickingSub$ !== undefined && this.tickingSub$.unsubscribe();
  }

}
