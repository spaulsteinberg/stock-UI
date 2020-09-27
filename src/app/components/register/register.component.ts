import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterUserService } from 'src/app/shared/services/register-user.service';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { validatePassword } from '../../shared/validators/password.validator'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private fb: FormBuilder, private _register: RegisterUserService, private router: Router) { }


  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
    password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15), validatePassword]]
  });
  errorOccurred:boolean = false;
  errorMessage:string;
  successMessage:string;
  mode: ProgressSpinnerMode = "indeterminate";
  color: ThemePalette = "warn";
  reqCompleted:boolean = true;
  ngOnInit(): void {
  }

  get username(){
    return this.registerForm.get('username');
  }
  get password(){
    return this.registerForm.get('password');
  }

  submitRegisterUserData(){
    this.reqCompleted = false;
    this.errorOccurred = false;
    let objSend = {
      username: this.registerForm.get('username').value,
      password: this.registerForm.get('password').value
    };
    this._register.registerUser(objSend)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.successMessage = "Registered successfully!";
          localStorage.setItem('token', response.token); //store the jwt token
          localStorage.setItem('u', response.id);
          this.registerForm.reset();
          this.router.navigate(['/dash']);
        },
        error: (error) => {
          this.errorOccurred = true;
          this.reqCompleted = true;
          this.errorMessage = error.status === 401 ? 
          "Username already exists. Please choose another and try again." : 
          "Something went wrong registering you. Please try again.";
        },
        complete: () => {
          this.reqCompleted = true;
          console.log("Done.");
        }
      });
  }

}
