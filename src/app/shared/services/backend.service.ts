import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
/* Service for server-side calls */
export class BackendService {

  constructor(private http: HttpClient) { }

  private _url = "http://localhost:3000/api";
  private params: HttpParams;
  
  addStockToUserList(symbol){
    this.params = new HttpParams().set('user', localStorage.getItem("u"));
    const url = `${this._url}/stock?${this.params.toString()}`;
    let objToSend = { 'symbol': symbol};
    return this.http.patch<any>(url, objToSend).pipe(catchError(this.errorAddingUser));
  }
  deleteFromUserList(symbol){
    this.params = new HttpParams().set('user', localStorage.getItem("u"));
    const url = `${this._url}/stock?${this.params.toString()}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        symbol: symbol
      },
    };
    
    return this.http.delete<any>(url, options).pipe(catchError(this.errorDeletingUser));
  }

  getStockList():Promise<any>{
    const url = `${this._url}/retrievestocks`;
    return this.http.get<any>(url).toPromise();
  }

  //as observable to pass async
  private listSubject = new BehaviorSubject<string[]>([]);
  stockList$:Observable<string[]> = this.listSubject.asObservable();
  getStockListAsObservable():void{
    const url = `${this._url}/retrievestocks`;
    this.http.get<any>(url)
            .pipe(
              map(res => {
                console.log(res);
                return res.nyse.concat(res.nasdaq)
              })
            )
            .subscribe(data => this.listSubject.next(data), err => console.log(err, "IN BACKEND SERVICE"));
  }

  getCurrentStockListFromSubject(){
    return this.listSubject.value;
  }

  errorAddingUser(error: HttpErrorResponse){
    return throwError(error || "Something went wrong adding a stock. Please try again.");
  }

  errorDeletingUser(error: HttpErrorResponse){
    return throwError(error || "Something went wrong deleting a stock. Please try again.");
  }

  errorStockMasterList(error: HttpErrorResponse){
    return throwError(error || "Trouble retrieving master list of stocks.");
  }

}
