import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { RegisterUserService } from 'src/app/shared/services/register-user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private fb: FormBuilder, private _register: RegisterUserService) { }


  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
    password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]]
  });
  errorOccurred:boolean = false;
  errorMessage:string;
  
  ngOnInit(): void {
  }

  get username(){
    return this.registerForm.get('username');
  }
  get password(){
    return this.registerForm.get('password');
  }

  submitRegisterUserData(){
    this.errorOccurred = false;
    let objSend = {
      username: this.registerForm.get('username').value,
      password: this.registerForm.get('password').value
    };
    this._register.registerUser(objSend)
      .subscribe({
        next: (data) => console.log(data),
        error: (error) => {
          this.errorOccurred = true;
          this.errorMessage = error.status === 401 ? 
          "Username already exists. Please choose another and try again." : 
          "Something went wrong registering you. Please try again."
        },
        complete: () => console.log("Done.")
      });
  }

}
