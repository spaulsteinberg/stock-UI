import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IQuote } from '../../../../../shared/interfaces/IQuote';
import { BackendService } from '../../../../../shared/services/backend.service';
import { ListServiceService } from '../../../../../shared/services/list-service.service';
import * as $ from 'jquery/dist/jquery.min.js';
import * as toastr from 'toastr';

@Component({
  selector: 'app-main-landing',
  templateUrl: './main-landing.component.html',
  styleUrls: ['./main-landing.component.css']
})
export class MainLandingComponent implements OnInit {

  constructor(public _stocks: ListServiceService, private router: Router, private _backend: BackendService) { }

  quotes:IQuote[] = [];
  symbolsList:string[] = [];
  stockSymbolRetrieveError:boolean = false;
  inputFilterLeft:string = '';
  inputFilterRight:string = '';
  selectBoxLeft:string;
  selectBoxRight:string;
  flagForPanel:string = "compare";
  executionClick:boolean = false;
  ngOnInit(): void {
    if (this._stocks.getQuotes() === undefined) this.router.navigate(['dash']);
    this.quotes = this._stocks.getQuotes();
    if (this.symbolsList.length === 0) this.retrieveValidStockSymbols();
  }

  async retrieveValidStockSymbols(){
    this._backend.getStockList()
    .then(response => {
      if (response === undefined || response === null) return;
      let temp = (response.nyse).concat(response.nasdaq);
      this.symbolsList = temp
      this.stockSymbolRetrieveError = false;
    })
    .catch(err => {
      console.log("error: ", err);
      this.stockSymbolRetrieveError = true;
    });
  }
  //process a click on L or R from child
  processClick(ev){
    if (ev.action === "Left") {
      this.inputFilterLeft = ev.symbol;
      this.selectBoxLeft = ev.symbol;
    }
    if (ev.action === "Right"){
      this.inputFilterRight = ev.symbol;
      this.selectBoxRight = ev.symbol;
    }
    console.log("Click", ev)
  }
  changeBoxesOnClick(){
    console.log("changeBoxes");
  }
  getItemBoxColor(quote:IQuote){
    return {'color': quote.change > 0.00 ? '#00e600' : quote.change < 0.00 ? 'red' : 'gray'}
  }

  goCompare(event){
    if (this.selectBoxLeft === this.selectBoxRight){
      toastr.error("Cannot compare the same stock!");
      return;
    }
    this.executionClick = true;
  }

}
