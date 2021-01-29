import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { catchError, delayWhen, map, retry, retryWhen, take, tap } from 'rxjs/operators';
import { Data, DetailAttributes, IAccount } from '../interfaces/IAccount';
import { ICreateProfileResponse } from '../interfaces/ICreateProfileResponse';
import { IProfileCheck } from '../interfaces/IProfileCheck';
import { AddAccountRequest } from '../models/AddAccountRequest';
import { AddAccountResponse } from '../models/AddAccountResponse';
import { AddPositionRequest } from '../models/AddPositionRequest';
import { CreateProfileRequest } from '../models/CreateProfileRequest';
import { RemovePositionRequest } from '../models/RemovePositionRequest';
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
    POSITION: "http://localhost:3000/api/position"
  };
  private headers;
  private username;

  get _username():string {
    return this.username;
  }

  //get profiles to see if the user exists
  async doesUserExist(){
    console.log("I AM HERE")
    this.username = await this.setHeaders();
    console.log(this.username)
    this.createHeaders();
    console.log("I AM HERE")
    return await this.http.get<any>(this.URLS.PROFILE, {'headers': this.headers})
                .toPromise()
                .then(res => {
                  console.log("RES", res)
                  return Promise.resolve(res.details.accountNames)
                })
                .catch(err => {
                  console.log("ERROR:", err)
                  return Promise.reject([])
                });
  }

  //set the header of username is its undefined
  async setHeaders(){
    return await this.auth.getUsernameRefresh().toPromise()
              .then(res => {
                console.log("SET HEADER USERNAME", res.username)
                return Promise.resolve(res.username);
              })
              .catch(err => {
                return Promise.reject(err);
              })
  }
  createHeaders(){
    console.log("In create headers:", this.username)
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`).set('username', this.username)
  }
  createHeadersWithJsonContent(){
    return new HttpHeaders()
          .set('Authorization', `Bearer ${this.auth.getToken()}`)
          .set('username', this.username)
          .set('Content-Type', 'application/json');
  }

  /***************************************** Implementing store pattern *****************************************/

  // account data subject updates all big picture state management
  //table data subject is specific to table and is updated in component
  private subject = new BehaviorSubject<string[]>([]); //init subject
  private accountDataSubject = new BehaviorSubject<DetailAttributes[]>([]);
  public tableDataSubject:BehaviorSubject<Data[]> = new BehaviorSubject<Data[]>([]);
  accountNames$:Observable<string[]> = this.subject.asObservable(); //get observable from subject data
  accountsData$:Observable<DetailAttributes[]> = this.accountDataSubject.asObservable();
  tableData$:Observable<Data[]> = this.tableDataSubject.asObservable();

  addPosition(request:AddPositionRequest){
    console.log("ADD REQUEST:", request)
    return this.http.patch<any>(this.URLS.POSITION, JSON.stringify(request), {headers: this.createHeadersWithJsonContent()})
           .pipe(
             tap( (data) => console.log("Call to positions", data.details)),
             tap( (data) => this.accountDataSubject.next(data.details)),
             map( (data) => data.details.find(_ => _.name === request.name)),
             catchError((err:HttpErrorResponse) => throwError(err))
           )
  }

  
  removePosition = (request:RemovePositionRequest) => {
    console.log("REMOVE REQUEST:", request)
    return this.http.delete<any>(this.URLS.POSITION, 
      {
        headers: this.createHeadersWithJsonContent(),
        params: {
          name: request.name,
          symbol: request.symbol,
          position: request.position.toString(),
          date: request.date,
          price: request.price.toString()
      }
    })
    .pipe(
      tap( (data) => console.log("Call to remove", data, data.status)),
      tap( (data) => this.accountDataSubject.next(data.details)),
      map( (data) => data.details.find(_ => _.name === request.name)), // this will map us to the right account name
      catchError( (err:HttpErrorResponse) => throwError(err || "Error in call to remove position"))
    )
  }


  initTableSubject(d){
    this.tableDataSubject.next(d);
  }


  createAccount(payload: AddAccountRequest){
    const accNames = this.subject.getValue();
    const newArray = accNames.slice(0);
    newArray.push(payload.name);
    this.subject.next(newArray);
    return this.http.patch<AddAccountResponse>(this.URLS.ACCOUNT, JSON.stringify(payload), {headers: this.createHeadersWithJsonContent()})
           .pipe(
             tap( () => console.log("Call to accounts")),
             tap( (response) => {
               const currentState = this.accountDataSubject.getValue();
               currentState.push(response.details)
               this.accountDataSubject.next(currentState);
             }),
             catchError( (err:HttpErrorResponse) => throwError(err.message))
           )
  }
  
  deleteAnAccount(nameToDelete:string){
    //update the client side accounts
    const accNames = this.subject.getValue();
    const newNameArray = accNames.slice(0);
    newNameArray.splice(accNames.findIndex(name => nameToDelete === name), 1);
    this.subject.next(newNameArray);
    let encoded = encodeURI(nameToDelete);
    console.log(encoded)
    const params = new HttpParams().set('name', encoded);
    const url = `${this.URLS.ACCOUNT}?${params}`;
    return this.http.delete<any>(url, {'headers': this.headers});
  }
  

  // TODO: Integrate
  public userHasProfile:boolean = false;
  public hasBeenCheckedForProfile:boolean = false;
  checkForProfile = async ():Promise<boolean> => {
    console.log("checking for profile. Has user been checked -->", this.hasBeenCheckedForProfile)
    try {
      this.username = await this.setHeaders();
    }
    catch (err){
      console.log("ERROR OCCURRED: ", err)
    }
    return await this.http.get<IProfileCheck>(`${this.URLS.PROFILE}/exists`, {headers: this.createHeadersWithJsonContent()})
    .toPromise()
    .then(profile => {
      this.hasBeenCheckedForProfile = true;
      switch(profile.details.length){
        case 0:
          this.userHasProfile = false;
          return Promise.resolve(false);
        default:
          this.userHasProfile = true;
          return Promise.resolve(true);
      }
    })
    .catch( () => {this.userHasProfile = false; return Promise.reject(false)})
  }

  createNewProfile = (request:CreateProfileRequest) => {
    return this.http.post<ICreateProfileResponse>(this.URLS.PROFILE, JSON.stringify(request), {headers: this.createHeadersWithJsonContent()})
    .pipe(
      tap((profile) => {
        console.log(profile);
        this.userHasProfile = true;
        console.log("names", profile.accountNames);
        console.log("meat:", profile.accounts)
        this.subject.next(profile.accountNames);
        this.accountDataSubject.next(new Array(profile.accounts[0]));
      }),
      catchError((err:HttpErrorResponse) => throwError(err.message))
    )
  }


  isInit:boolean = false;
  async getAccounts(){
    try {
      this.username = await this.setHeaders();
      this.createHeaders();
    }
    catch (err){
      console.log(err)
    }
    console.log("HEADERS:", this.headers)
    console.log("USERNAME SENT:", this.username)
    this.http.get<IAccount>(this.URLS.ACCOUNT, {headers: this.headers})
            .pipe(
              tap((data) => {
                console.log("TAPPED ACCOUNT", data)
                this.subject.next(data.names)
                this.accountDataSubject.next(Object.values(data.details))
              }),
              catchError((err:HttpErrorResponse) => throwError(err.message)),
              retryWhen(errors => errors.pipe(delayWhen(() => timer(2000)), take(4)  //try 4 times
              ))
            )
            .subscribe({
              next: (response) => console.log("acc response:", response),
              error: (error) => console.log(error),
              complete: () => {
                console.log("request subscribe completed")
                this.isInit = true;
              }
            })
  }

  // enable filtering of accounts with find() to give back to filter on name for table
  filterAccounts(name:string):Observable<DetailAttributes>{
    return this.accountsData$
    .pipe(
      map(accounts => accounts.find(account => account.name === name)
    ))
  }

  public completeSubjectsForLogout():void{
    this.tableDataSubject.next([]);
    this.subject.next([]);
    this.accountDataSubject.next([]);
    this.isInit = false;
    this.userHasProfile = false;
    this.hasBeenCheckedForProfile = false;
  }
  
}
