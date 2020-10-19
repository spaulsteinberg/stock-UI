import {  Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListServiceService } from '../../shared/services/list-service.service';
import { IQuote } from '../../shared/interfaces/IQuote';
import { IHistoricalQuote } from '../../shared/interfaces/IHistoricalQuote';
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
  constructor(private router: Router, 
    private _stocks: ListServiceService,
    private _backend: BackendService) { }
   

  quotes:IQuote[] = [];
  finishedLoadingFlag:boolean = true;
  inputFilter="";
  chooseList:string;
  nyseList:string[] = [];
  nasdaqList:string[] = [];
  stockSymbolRetrieveError:boolean = false;
  monthDataFromChild:IHistoricalQuote[] = [];
  flagForPanel:string = "add-remove";
  ngOnInit(): void {
    // protect against direct navigation
    if (this._stocks.getQuotes() === undefined){
      this.router.navigate(['dash']);
    }
    this.quotes = this._stocks.getQuotes();
    if (this.nyseList.length === 0 && this.nasdaqList.length === 0){
      this.retrieveValidStockSymbols();
    }
  }

  // Get stock lists
  retrieveValidStockSymbols(){
    this._backend.getStockList()
    .then(response => {
      this.nyseList = response.nyse;
      this.nasdaqList = response.nasdaq;
    })
    .catch(err => {
      console.log(err);
      this.stockSymbolRetrieveError = true;
    });
  }

  //render function helper
  renderStockItem(fullName:string, symbol:string):string {
      return `${fullName} (${symbol})`;
  }
  getItemBoxColor(quote:IQuote){
   // return {'color': quote.change > 0.00 ? 'green' : quote.change < 0.00 ? 'red' : 'gray', 'float': 'right'}
   return {'color': quote.change > 0.00 ? '#00e600' : quote.change < 0.00 ? 'red' : 'gray'}
  }

  updateValue(market){
    this.chooseList = market;
  }
  process(ev){
    this.executeAction(ev.symbol, ev.action);
  }

  actions = ['Add', 'Remove', 'View'];
  selectBoxValue;
  selectBoxAction;
  isAddError:boolean = false;
  viewClick:boolean = false;
  viewSelectChange:string;
  // on Execute, perform logic to add/delete stock depending on option selected
  executeAction(symb?:string, action?:string){
    let mainAction = action === undefined ? this.selectBoxAction : action;
    this.viewClick = false;
    if (mainAction === 'Add'){
        this._backend.addStockToUserList(this.selectBoxValue)
        .subscribe(
        data => {
          this._stocks.getIndividualQuote(this.selectBoxValue)
          .then(quote => {
            console.log("quote is:", quote, typeof(quote));
            this.quotes.push(quote);
            this._stocks.updateQuoteList(this.quotes); //update shared quote list
            this.toastSuccessAdd(this.selectBoxValue);
            this.inputFilter = "";
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
            console.log("Patch Complete");
        });
    }
    else if (mainAction === 'Remove'){
        let main = symb === undefined ? this.selectBoxValue : symb;
        this._backend.deleteFromUserList(main)
        .subscribe(
        data => {
        
        for (let i = 0; i < this.quotes.length; i++){
          if (main === this.quotes[i].symbol){
            this.quotes.splice(i, 1);
            this.toastSuccessDelete(main);
            break;
          }
        }
        this._stocks.updateQuoteList(this.quotes);
        console.log(this.quotes);
        },
        error => this.toastErrorDelete(main),
        () => console.log("Delete complete"));
    }
    else {
      console.log("in view")
      // set the passed variable to child. Assigning value here makes it so value changes only trigger on click
      this.viewClick = true;
      this.viewSelectChange = symb === undefined ? this.selectBoxValue : symb;
      this.selectBoxAction = "View";
    }
  }

  // destination of event emitted from child
  switchData(quoteData:IHistoricalQuote[]){
    this.monthDataFromChild = quoteData;
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
  backButton(){
    this.router.navigate(['dash']);
  }

  /* Below functions for right pane */
  renderDateRange():string{
    return `(${this.monthDataFromChild[0].date} - ${this.monthDataFromChild[this.monthDataFromChild.length - 1].date})`;
  }
  renderPanelData():string{
    let maxClose = -100000;
    let maxVolume = -1;
    let maxHigh = -1;
    let floorLow = 100000;
    let dates = new Object();
    this.monthDataFromChild.forEach(element => {
      if (element.close > maxClose){
        maxClose = element.close;
        dates['close'] = element.date;
      }
      if (element.volume > maxVolume){
        maxVolume = element.volume; 
        dates['volume'] = element.date;
      }
      if (element.high > maxHigh){
        maxHigh = element.high; 
        dates['high'] = element.date;
      } 
      if (element.low < floorLow){
        floorLow = element.low;
        dates['low'] = element.date;
      } 
    });
    return `<p>Highest close: ${maxClose} &nbsp ${dates['close']}</p>
            <p>Highest volume: ${maxVolume} &nbsp ${dates['volume']}</p>
            <p>Month High: ${maxHigh} &nbsp ${dates['high']}</p>
            <p>Month Low: ${floorLow} &nbsp ${dates['low']}</p>`;
  }
}
