import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  async doesUserExist(){
    this.username = await this.setHeaders();
    console.log(this.auth._username)
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`).set('username', this.username)
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

  async setHeaders(){
    if (this.auth._username === undefined || this.auth._username === null){
      return await this.auth.getUsernameRefresh().toPromise()
                .then(res => {
                  return Promise.resolve(res.username);
                })
                .catch(err => {
                  return Promise.reject(err);
                })
    } 
    this.username = this.auth._username
    return this.username;
  }
  deleteAnAccount(nameToDelete:string){
    const params = new HttpParams().set('name', nameToDelete);
    const url = `${this.URLS.ACCOUNT}?${params}`;
    return this.http.delete<any>(url, {'headers': this.headers});
  }

}
