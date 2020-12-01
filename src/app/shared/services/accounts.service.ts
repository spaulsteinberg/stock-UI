import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AddAccountRequest } from '../models/AddAccountRequest';
import { RegisterUserService } from './register-user.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private http: HttpClient, private handler: HttpBackend, private auth: RegisterUserService) {
    this.http = new HttpClient(handler);
   }
  private URLS = {
    ACCOUNT: "http://localhost:3000/api/account",
    PROFILE: "http://localhost:3000/api/profile",
    POSITION: "http://localhost:3000/api/position",
    ACCOUNT_LIST: "http://localhost:3000/api/account/list"
  };
  private headers;
  private username;

  //get profiles to see if the user exists
  async doesUserExist(){
    this.username = await this.setHeaders();
    console.log(this.username)
    this.createHeaders();
    return await this.http.get<any>(this.URLS.PROFILE, {'headers': this.headers})
                .toPromise()
                .then(res => {
                  console.log("RES", res)
                  return Promise.resolve(res.details.accountNames)
                })
                .catch(err => {
                  console.log(err)
                  return Promise.reject([])
                });
  }

  //set the header of username is its undefined
  async setHeaders(){
    if (this.auth.usernameSubject$.getValue() === undefined || this.auth.usernameSubject$.getValue() === null){
      return await this.auth.getUsernameRefresh().toPromise()
                .then(res => {
                  return Promise.resolve(res.username);
                })
                .catch(err => {
                  return Promise.reject(err);
                })
    } 
    this.username = this.auth.usernameSubject$.getValue();
    return this.username;
  }
  createHeaders(){
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`).set('username', this.username)
  }
  createHeadersWithJsonContent(){
    return new HttpHeaders()
          .set('Authorization', `Bearer ${this.auth.getToken()}`)
          .set('username', this.username)
          .set('Content-Type', 'application/json');
  }

  /***************************************** Implementing store pattern *****************************************/

  private subject = new BehaviorSubject<string[]>([]); //init subject
  accountNames$:Observable<string[]> = this.subject.asObservable(); //get observable from subject data

  createAccount(payload: AddAccountRequest){
    const accNames = this.subject.getValue();
    const newArray = accNames.slice(0);
    newArray.push(payload.name);
    this.subject.next(newArray);
    return this.http.patch<any>(this.URLS.ACCOUNT, JSON.stringify(payload), {headers: this.createHeadersWithJsonContent()})
           .pipe(
             tap( () => console.log("Call to accounts")),
             catchError( (err:HttpErrorResponse) => throwError(err.message))
           )
  }
  
  deleteAnAccount(nameToDelete:string){
    //update the client side accounts
    const accNames = this.subject.getValue();
    const newNameArray = accNames.slice(0);
    newNameArray.splice(accNames.findIndex(name => nameToDelete === name), 1);
    console.log("Accounts after delete: ", newNameArray)
    this.subject.next(newNameArray);
    const params = new HttpParams().set('name', nameToDelete);
    const url = `${this.URLS.ACCOUNT}?${params}`;
    return this.http.delete<any>(url, {'headers': this.headers});
  }

  async initData(){
    if (this.username === undefined) this.username = await this.setHeaders();
    this.createHeaders();
    this.http.get<any>(this.URLS.ACCOUNT_LIST, {headers: this.headers})
            .pipe(
              tap(() => console.log("init data sent")),
              map(res => {return res.details;}),
              catchError((err:HttpErrorResponse) => throwError(err.message))
            )
            .subscribe(
              data => {
                console.log("Accounts: ", data);
                this.subject.next(data); // call next with the updated data array
              },
              error => console.log(error),
              () => console.log("subscribe complete"))
  }
}
