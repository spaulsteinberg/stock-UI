import { Component, ElementRef, OnInit } from '@angular/core';
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
  constructor(private fb: FormBuilder, private _register: RegisterUserService, private router: Router, private el:ElementRef) { }


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
  ngAfterViewInit(){
    this.el.nativeElement.ownerDocument.body.style.backgroundImage = "url('../assets/general-images/nasdaq-nums.jpg')"
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
          this._register.usernameSubject$.next(this.registerForm.get('username').value);
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
