import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterUserService } from 'src/app/shared/services/register-user.service';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private _login : RegisterUserService, private router: Router) { }

  errorOccurred:boolean = false;
  reqCompleted:boolean = true;
  mode: ProgressSpinnerMode = "indeterminate";
  color: ThemePalette = "warn";
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  get username(){
    return this.loginForm.get('username');
  }
  get password(){
    return this.loginForm.get('password');
  }

  submitLoginUserData(){
    this.reqCompleted = false;
    this.errorOccurred = false;
    let objSend = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    };
    this._login.loginUser(objSend).subscribe({
      next: (response) => {
        console.log(response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('u', response.id);
        this.loginForm.reset();
        this.router.navigate(['/dash']);
      },
      error: () => {
        this.errorOccurred = true;
        this.reqCompleted = true;
      },
      complete: () => {
        this.reqCompleted = true;
        console.log("Done.");
      }
    });
      
  }

  ngOnInit(): void {
  }

}
