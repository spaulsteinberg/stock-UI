import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  private _url = "http://localhost:3000/api";
  private params: HttpParams;
  
  addStockToUserList(symbol){
    this.params = new HttpParams().set('user', localStorage.getItem("u"));
    const url = `${this._url}/addstock?${this.params.toString()}`;
    let objToSend = { 'symbol': symbol};
    return this.http.patch<any>(url, objToSend).pipe(catchError(this.errorAddingUser));
  }
  deleteFromUserList(symbol){
    this.params = new HttpParams().set('user', localStorage.getItem("u"));
    const url = `${this._url}/deletestock?${this.params.toString()}`;
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

  errorAddingUser(error: HttpErrorResponse){
    return throwError(error || "Something went wrong adding a stock. Please try again.");
  }

  errorDeletingUser(error: HttpErrorResponse){
    return throwError(error || "Something went wrong deleting a stock. Please try again.");
  }

}
