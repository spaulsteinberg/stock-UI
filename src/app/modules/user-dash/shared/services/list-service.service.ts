import { HttpClient, HttpErrorResponse, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListServiceService {

  private http: HttpClient;
  //http backend will ignore HTTP_INTERCEPTORS from core module
  constructor(private handler: HttpBackend){
    this.http = new HttpClient(handler);
  }
  //
  //https://sandbox.iexapis.com/stable/stock/${symbol}/quote?token=Tpk_fd6c779103b3400b96861977097e17de
  getUserListQuotes(symbol){
    const url = `https://cloud.iexapis.com/v1/stock/${symbol}/quote?token=pk_37940397ebe547018bb0721e95c37432`;
    return this.http.get<any>(url).pipe(catchError(this.errorOnQuotes));
  }

  getIndividualQuote(symbol){
    const url = `https://cloud.iexapis.com/v1/stock/${symbol}/quote?token=pk_37940397ebe547018bb0721e95c37432`;
    return this.http.get<any>(url);
  }

  errorOnQuotes(error: HttpErrorResponse){
    return throwError(error.message || "Error retrieving quotes.");
  }
}
