import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { RegisterUserService } from './register-user.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private _auth: RegisterUserService) { }

  //next passes execution..set an Authorization header w the token
  intercept(req, next) {
    let tokenizedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this._auth.getToken()}`
      }
    });
    return next.handle(tokenizedRequest);
  }
}
