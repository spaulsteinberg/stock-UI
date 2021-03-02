import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ListServiceService } from 'src/app/shared/services/list-service.service';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  constructor(private http: HttpClient, private router: Router, private _list: ListServiceService) {}
  private _url = "http://localhost:3000/api";

  private params:HttpParams;
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

  // on hard refresh 
  getUsernameRefresh(){
    this.params = new HttpParams().set('user', localStorage.getItem("u"));
    const url = `${this._url}/whoami?${this.params.toString()}`;
    return this.http.get<any>(url).pipe(catchError(this.errorOnGettingLogin));
  }

  usernameSubject$:BehaviorSubject<string> = new BehaviorSubject<string>("");
  username$:Observable<string> = this.usernameSubject$.asObservable();

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
    return throwError(error || "Something went wrong logging in. Please try again.");
  }

  errorOnGettingLogin(error: HttpErrorResponse){
    return throwError(error.message || "Bad getting username");
  }
}
