import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ListServiceService } from 'src/app/shared/services/list-service.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  constructor(private http: HttpClient, private router: Router, private _list: ListServiceService) { }
  private _url = "http://localhost:3000/api";
  username:string;
  private params:HttpParams;
  s = new Subject();
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

  setUsername(u){
    if (u !== undefined && u !== null && u !== ''){
      this.s.next(u);
      this.username = u;
    }
  }
  get _username(){
    return this.username;
  }

  getUsernameRefresh(){
    this.params = new HttpParams().set('user', localStorage.getItem("u"));
    const url = `${this._url}/whoami?${this.params.toString()}`;
    return this.http.get<any>(url).pipe(catchError(this.errorOnGettingLogin));
  }
  //log the user out
  logoutUser(){
    localStorage.removeItem('token');
    localStorage.removeItem('u');
    this._list.clearQuotes(); //clears list for logout/login
    this.setUsername(undefined);
    this.router.navigate(['/login']);
  }

  errorRegisterUser(error: HttpErrorResponse){
    return throwError(error || "Something went wrong registering the user");
  }

  errorLogin(error: HttpErrorResponse){
    return throwError(error.message || "Something went wrong logging in. Please try again.");
  }

  errorOnGettingLogin(error: HttpErrorResponse){
    return throwError(error.message || "Bad getting username");
  }
}
