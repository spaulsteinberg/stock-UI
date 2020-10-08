import { HttpClient, HttpErrorResponse, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, pipe, Observable } from 'rxjs';
import { IQuote } from '../models/IQuote';

@Injectable({
  providedIn: 'root'
})
export class ListServiceService {

  private http: HttpClient;
  private _base = "https://cloud.iexapis.com/v1/stock";
  private _token = "pk_37940397ebe547018bb0721e95c37432";
  private _sandboxToken = "Tpk_fd6c779103b3400b96861977097e17de";
  public quoteList: IQuote[];
  //http backend will ignore HTTP_INTERCEPTORS from core module
  constructor(private handler: HttpBackend){
    this.http = new HttpClient(handler);
  }
  //
  //https://sandbox.iexapis.com/stable/stock/${symbol}/quote?token=Tpk_fd6c779103b3400b96861977097e17de
  getUserListQuotes(symbol){
    const url = `${this._base}/${symbol}/quote?token=${this._token}`;
    return this.http.get<IQuote>(url).pipe(catchError(this.errorOnQuotes));
  }

  // for add/delete quote on add-remove
  getIndividualQuote(symbol){
    const url = `${this._base}/${symbol}/quote?token=${this._token}`;
    return this.http.get<IQuote>(url).toPromise();
  }

  // get a batch list of quotes...stocks need to go in comma separated (hence join())
  getBatchQuotes(symbolList: string[]): Observable<any>{
    const batchSymbols = symbolList.join();
    const url = `${this._base}/market/batch?&types=quote&symbols=${batchSymbols}&token=${this._token}`;
    return this.http.get<IQuote[]>(url).pipe(catchError(this.errorOnQuotes));
  }

  errorOnQuotes(error: HttpErrorResponse){
    return throwError(error.message || "Error retrieving quotes.");
  }

  // functions to share stock list
  updateQuoteList(arr: IQuote[]){
    this.quoteList = arr;
  }
  pushQuoteList(quote: IQuote){
    this.quoteList.push(quote);
  }
  popQuote(index:number){
    this.quoteList.splice(index, 1);
  }
  getQuotes(){
    return this.quoteList;
  }
  clearQuotes(){
    delete this.quoteList;
  }
  initQuoteList(){
    this.quoteList = [];
  }
}
