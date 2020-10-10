import { Component, OnInit, ViewChild } from '@angular/core';
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
  ngOnInit(): void {
    // protect against direct navigation
    if (this._stocks.getQuotes() === undefined){
      this.router.navigate(['dash']);
    }
    this.quotes = this._stocks.getQuotes();
    if (this.nyseList.length === 0 && this.nasdaqList.length === 0){
      this.retrieveValidStockSymbols();
    }
  /*  this._stocks.getOneYearData("JPM")
    .pipe(catchError(this._stocks.errorOnHistoricalData))
    .subscribe(
      response => console.log(response),
      error => console.log(error),
      () => console.log("Done")
    )*/
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

  updateValue(market){
    this.chooseList = market;
  }

  actions = ['Add', 'Remove', 'View'];
  selectBoxValue;
  selectBoxAction;
  isAddError:boolean = false;
  viewClick:boolean = false;
  // on Execute, perform logic to add/delete stock depending on option selected
  executeAction(){
    this.viewClick = false;
    if (this.selectBoxAction === 'Add'){
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
    else if (this.selectBoxAction === 'Remove'){
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
        this._stocks.updateQuoteList(this.quotes);
        console.log(this.quotes);
        },
        error => this.toastErrorDelete(this.selectBoxValue),
        () => console.log("Delete complete"));
    }
    else {
      this.viewClick = true;
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
  backButton(){
    this.router.navigate(['dash']);
  }

}
