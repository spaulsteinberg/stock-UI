import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { RegisterUserService } from 'src/app/shared/services/register-user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public _auth: RegisterUserService, private router: Router, private accounts:AccountsService) { }
  links = [
    {
      'link': "/dash",
      'text': "Dashboard"
    },
    {
      'link': "/home",
      'text': "Home"
    }
  ];
  username;
  ngOnInit(): void {
    console.log(this.username);
    if ( this._auth.isUserLoggedIn() && this.username === undefined) {
      this._auth.getUsernameRefresh().subscribe({
      next: (response) => {
        console.log("refresh username value:", response.username)
        this._auth.usernameSubject$.next(response.username);
      },
      error: (error) => {
        console.log(error)
        this._auth.logoutUser();
      }
    });
  }
  // on first load
  this._auth.username$.subscribe(username => {this.username = username; console.log("username first load:", username)});
  }
  redirectToLogin() {
    this.router.navigate(['/login']);
  }
  signOut(){
    this._auth.usernameSubject$.next("");
    this.accounts.completeSubjectsForLogout();
    this._auth.logoutUser();
  }

}
