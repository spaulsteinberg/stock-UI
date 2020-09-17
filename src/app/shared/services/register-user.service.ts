import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  constructor(private http: HttpClient) { }
  private _url = "http://localhost:3000/api";
  registerUser(formData){
    const registerUrl = `${this._url}/register`;
    return this.http.post<any>(registerUrl, formData).pipe(catchError(this.errorRegisterUser));
  }

  errorRegisterUser(error: HttpErrorResponse){
    return throwError(error || "Something went wrong registering the user");
  }
}
