import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IQuote } from '../../../shared/interfaces/IQuote';
import { BackendService } from '../../../shared/services/backend.service';
import { ListServiceService } from '../../../shared/services/list-service.service';

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

  
  renderQuoteData(quote:IQuote){
    return `<p>Open: ${quote.open}</p>
            <p>Day High: ${quote.high}</p>
            <p>Day Low: ${quote.low}</p>
            <p>Volume: ${quote.volume}</p>
            <p>52 Week High: ${quote.week52High}</p>
            <p>52 Week Low: ${quote.week52Low}</p>`;
  }

}
