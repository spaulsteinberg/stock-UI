import { HttpClient, HttpErrorResponse, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, pipe, Observable, of } from 'rxjs';
import { IQuote } from '../interfaces/IQuote';
import { IHistoricalQuote } from '../interfaces/IHistoricalQuote';
import { CalendarContainer, CalendarObject } from '../models/CalendarObject';
import { ILightWeightQuote } from '../interfaces/ILightWeightQuote';

@Injectable({
  providedIn: 'root'
})
export class ListServiceService {

  private http: HttpClient;
  private _base = "https://cloud.iexapis.com/v1/stock";
  private _token = "pk_37940397ebe547018bb0721e95c37432";
  private _sandboxToken = "Tpk_fd6c779103b3400b96861977097e17de";
  private _sandboxTokenAlt = "Tpk_5abe84814d2b432f84281d9e38b65317";
  private sandbox = "https://sandbox.iexapis.com/stable/stock";
  private stableDatapointUrl = "https://cloud.iexapis.com/stable/data-points";
  private lightweightUrl = "https://api.iextrading.com/1.0/tops?";
  public quoteList: IQuote[];
  //http backend will ignore HTTP_INTERCEPTORS from core module
  constructor(private handler: HttpBackend){
    this.http = new HttpClient(handler);
  }
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

  getOneYearData(symbol:string):Observable<IHistoricalQuote[]>{
   //const url = `${this._base}/${symbol}/batch?types=quote,chart&range=1m&token=${this._token}`;
   //https://sandbox.iexapis.com/stable/stock/AAPL/chart/1m?token=Tpk_fd6c779103b3400b96861977097e17de
    const url = `https://sandbox.iexapis.com/stable/stock/${symbol}/chart/1m?token=${this._sandboxToken}`;
    return this.http.get<IHistoricalQuote[]>(url);
  }

  getNextEarningsReport(symbols:string):Observable<any>{
    const url = `${this.sandbox}/market/batch?types=estimates&symbols=${symbols}&range=1m&token=${this._sandboxTokenAlt}`;
    return this.http.get<any>(url).pipe(catchError(this.errorOnEstimates));
  }

  getDividends(symbols:string):Promise<any>{
    const url = `${this.sandbox}/market/batch?types=dividends&symbols=${symbols}&range=1y&token=${this._sandboxTokenAlt}`;
    return this.http.get<any>(url).toPromise();
  }

  getBatchHistoricalData(symbols:string):Observable<IHistoricalQuote[]>{
    const token = "Tpk_5abe84814d2b432f84281d9e38b65317";
    const url = `${this.sandbox}/market/batch?types=chart&symbols=${symbols}&range=1y&token=${this._sandboxTokenAlt}`
    return this.http.get<IHistoricalQuote[]>(url);
  }

  getOneMonthHistoricalData(symbols:string, timespan:string):Promise<IHistoricalQuote[]>{
    const url = `${this.sandbox}/market/batch?types=chart&symbols=${symbols}&range=${timespan}&token=${this._sandboxTokenAlt}`
    return this.http.get<IHistoricalQuote[]>(url).toPromise();
  }

  getLatestNews(symbols:string){
    const url = `${this._base}/market/batch?types=news&symbols=${symbols}&last=2&token=${this._token}`;
    return this.http.get<any>(url).pipe(catchError(this.errorOnNews));
  }

  getNextDividendDate(symbol){
    const url = `${this.stableDatapointUrl}/${symbol}/NEXTDIVIDENDDATE?token=${this._token}`;
    return this.http.get<any>(url).pipe(catchError(this.catchNextDividendError));
  }

  getNextDividendOnBadStocks(symbols:string[]) {
    let calendarContainer = new CalendarContainer();
    symbols.forEach(symbol => {
      const url = `${this.stableDatapointUrl}/${symbol}/NEXTDIVIDENDDATE?token=${this._token}`;
      this.http.get<any>(url)
      .pipe(catchError(this.catchNextDividendError))
      .subscribe(
        data => {
          calendarContainer.calendarObjects.push(new CalendarObject(symbol, data))
        },
        error => {
          console.log(error)
          calendarContainer.errorObjects.push(symbol);
        },
        () => console.log("Done in requests")
      );
    });
    console.log("done here")
    return calendarContainer;
  }

  getLightweightStocks(symbolList:string[]):Observable<ILightWeightQuote[]>{
    console.log(symbolList)
    let payload = symbolList.join();
    const url = `${this.lightweightUrl}symbols=${payload}`;
    return this.http.get<ILightWeightQuote[]>(url).pipe(catchError(this.catchLightWeightError));
  }

  catchNextDividendError(error : HttpErrorResponse){
    return throwError(error || "Error getting next data");
  }

  catchLightWeightError(error: HttpErrorResponse){
    return throwError(error || "Couldnt retrieve lightweigh stocks")
  }

  errorOnNews(error : HttpErrorResponse){
    return throwError(error || "Error retrieving latest news articles");
  }

  errorOnQuotes(error: HttpErrorResponse){
    return throwError(error.message || "Error retrieving quotes.");
  }

  errorOnHistoricalData(error: HttpErrorResponse){
    return throwError(error.message || "Error occurred fetching historical stock data.");
  }
  
  errorOnEstimates(error: HttpErrorResponse){
    return throwError(error.message || "Error on estimates");
  }

  errorOnDividends(error:HttpErrorResponse){
    return throwError(error.message || "Error fetching dividends. Please reload and try again.");
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

  getQuoteSymbols(){
    return this.quoteList.map(x => x.symbol);
  }
}
