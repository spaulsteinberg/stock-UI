import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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

  constructor(private dash : DashboardService,
              private _stocks : ListServiceService,
              private el : ElementRef,
              private cdr : ChangeDetectorRef) { }

  symbolList:string[] = [];
  stockList:ILightWeightQuote[] = [];
  quoteList:IQuote[] = [];
  isError:boolean = false;
  onInitLoadingProgressBarDisplay:boolean = true;
  tickingSub$;
  sumColumnValues:number[] = [];
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
        this.getQuotes();
      }
    );
    if (this.marketIsOpen()){
      this.updatePrices();
    }
  }

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
          quote["quote"]["lastTradeTime"] = undefined;
        }
        this.sumColumnValues = new Array(refined.length).fill(0);
        return refined.map(_ => _["quote"]);
      })
    )
    .subscribe(
      data => {
        console.log(this.sumColumnValues)
        this.quoteList = data;
      },
      error => {
        console.log("ERROR:", error);
        this.isError = true
      },
      () => {
        console.log("done heavyweight");
        this.onInitLoadingProgressBarDisplay = false;
      }
    )
  }
  //contains update timer for constant checks, start after 2 seconds on load
  updatePrices(){
    this.tickingSub$ = timer(2000, 10000)
    .pipe(
      tap(_ => this.getIndividualPrice())
    ).subscribe();
  }

  getIndividualPrice(){
    this._stocks.getBatchQuotes(this.symbolList)
    .pipe(
      map(raw => {
        let refined = Object.values(raw);
        for (let quote of refined){
          console.log(quote)
          quote["quote"]["latestUpdate"] = this.renderDate(quote["quote"]["latestUpdate"]);
          quote["quote"]["highTime"] = undefined;
          quote["quote"]["lowTime"] = undefined;
          quote["quote"]["lastTradeTime"] = undefined;
        }
        return refined.map(_ => _["quote"]);
      })
    )
    .subscribe(
      data => {
        for (let i = 0; i < data.length; i++){
          this.quoteList[i].latestPrice = data[i].latestPrice;
        }
      },
      error => console.log(error),
      () => console.log("completed a run")
    )
  }

  renderPrice(curPrice:number, userBuyPrice:number, numShares:number, index:number):string | void{
    if (numShares <= 0) return;
    try {
      let sum = ( (curPrice*numShares) - (userBuyPrice*numShares)).toFixed(2);
      this.sumColumnValues[index] = Number.parseFloat(sum);
      return sum;
    }
    catch (err){
      console.log(err)
    }
  }
  globalStyle:object = {};
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

  sumGains(){
    let total = this.sumColumnValues.reduce((acc, cur) => acc + cur)
    let style = {
      'color': total > 0 ? 'green' : total < 0 ? 'red' : 'gray'
    };
    this.globalStyle = style;
    return total;
  }
  //function sumGains() is called on changes, need this so view isnt checked too soon...only show totals when defined
  ngAfterViewChecked(){
    for (let i = 0; i < this.quoteList.length; i++){
      if (this.quoteList[i].highTime === undefined || this.quoteList[i].highTime === null
          || this.quoteList[i].lowTime === undefined || this.quoteList[i].lowTime === null){
            this.sumColumnValues[i] = 0;
          }
    }
    this.cdr.detectChanges();
 }

  ngOnDestroy(){
    if (this.tickingSub$ !== undefined) this.tickingSub$.unsubscribe();
  }

}
