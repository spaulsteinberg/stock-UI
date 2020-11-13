import { Component, ElementRef, OnInit } from '@angular/core';
import { noop, timer } from 'rxjs';
import { concatMap, map, switchMap, tap } from 'rxjs/operators';
import { ILightWeightQuote } from 'src/app/shared/interfaces/ILightWeightQuote';
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
  isError:boolean = false;
  onInitLoadingProgressBarDisplay:boolean = true;
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
      () => this.getData()
    );
  }
  
  renderDate(d:string){
    return new Date(d).toLocaleString()
  }

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
  renderPrice(curPrice:number, userBuyPrice:number, numShares:number){
    return ( (curPrice*numShares) - (userBuyPrice*numShares)).toFixed(2);
  }
  //contains update timer for constant checks, start after 2 seconds on load
  updatePrices(){
    timer(2000, 5000)
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
        }
      },
      error => console.log(error),
      () => console.log("completed a run")
    )
  }

  marketIsOpen(){
    let curTime = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York"
    });
    let curDateTime = new Date(curTime)
    if (curDateTime.getDay() >= 1 && curDateTime.getDay() <= 5){
      if (curDateTime.getHours() >= 9 && curDateTime.getHours() < 4){
        if (curDateTime.getHours() === 9){
          return curDateTime.getMinutes() >= 30 ? true : false;
        }
        return true;
      }
    }
    return false;
  }

}
