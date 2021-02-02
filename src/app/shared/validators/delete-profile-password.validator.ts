import { AbstractControl, ValidatorFn } from "@angular/forms";

// USAGE: pass the string keys with the validators in form group. they will be used to key in for the value
//the control:AbstractControl is a FormGroup because its validating on the form as a whole
// this works because in the initial val call in position-dialog the strings "password" and "confirmPassword" are passed as the keys
export function confirmPasswordCheck(password:string, confirmPassword:string): ValidatorFn {
    return (control:AbstractControl): {[key:string]: boolean} => control.value[password] === control.value[confirmPassword] ? {"OK": true} : {"OK": false};
}