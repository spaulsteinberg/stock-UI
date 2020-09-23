import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }
  private params:HttpParams;
  private _url = "http://localhost:3000/api";

  // get users saved stock list
  getUserList(){
    this.params = new HttpParams().set('user', localStorage.getItem("u"));
    const url = `${this._url}/userlist?${this.params.toString()}`;
    return this.http.get<any>(url).pipe(catchError(this.errorUserList));
  }

  errorUserList(error: HttpErrorResponse){
    return throwError(error || "Error retrieving list.");
  }
}
