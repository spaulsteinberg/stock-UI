import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ListServiceService } from 'src/app/modules/user-dash/shared/services/list-service.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  constructor(private http: HttpClient, private router: Router, private _list: ListServiceService) { }
  private _url = "http://localhost:3000/api";
  registerUser(formData){
    const registerUrl = `${this._url}/register`;
    return this.http.post<any>(registerUrl, formData).pipe(catchError(this.errorRegisterUser));
  }

  loginUser(formData){
    const loginUrl = `${this._url}/login`;
    return this.http.post<any>(loginUrl, formData).pipe(catchError(this.errorLogin));
  }

  // double negation: localStorage.get() -> val, !local -> inverted bool, !!local -> true bool value
  isUserLoggedIn(){
    return !!localStorage.getItem('token');
  }

  // return the token
  getToken(){
    return localStorage.getItem('token');
  }

  //log the user out
  logoutUser(){
    localStorage.removeItem('token');
    localStorage.removeItem('u');
    this._list.clearQuotes(); //clears list for logout/login
    this.router.navigate(['/login']);
  }

  errorRegisterUser(error: HttpErrorResponse){
    return throwError(error || "Something went wrong registering the user");
  }

  errorLogin(error: HttpErrorResponse){
    return throwError(error.message || "Something went wrong logging in. Please try again.");
  }
}
