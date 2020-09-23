import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { RegisterUserService } from './shared/services/register-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _login: RegisterUserService, private router: Router){ }
  
  //implement canActivate, redirect to login screen if user not logged in
  canActivate():boolean {
    if (this._login.isUserLoggedIn()) return true;

    this.router.navigate(['/login']);
    return false;
  }
}
