import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddAccountRequest } from 'src/app/shared/models/AddAccountRequest';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { UtilsService } from 'src/app/shared/services/utilities/utils.service';
import { checkIfSymbolIsValid } from 'src/app/shared/validators/symbol-check.validator';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit {

  addAccountForm:FormGroup;
  request:AddAccountRequest = new AddAccountRequest(null, null);
  errCreatingRequest:boolean = false;
  minDate:Date = new Date(1960, 1, 1);
  maxDate:Date = new Date();
  constructor(private fb:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private account: AccountsService,
    private dialogRef: MatDialogRef<AddDialogComponent>,
    private _snackBar: MatSnackBar,
    private utils: UtilsService) {
        this.addAccountForm = this.fb.group({
          name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
          symbol: ['', [Validators.required, Validators.minLength(1), checkIfSymbolIsValid(data.symbols)]], //check is symbol is really there
          shares: [undefined, [Validators.required, Validators.min(0.01)]],
          price: [undefined,[Validators.required, Validators.max(10000), Validators.min(0.001)]],
          date: ['', [Validators.required]]
        })
        console.log(data.symbols)
  }
get _name(){
    return this.addAccountForm.get('name').value;
 }
 get _symbol(){
   return this.addAccountForm.get('symbol').value;
 }
 get _shares(){
   return this.addAccountForm.get('shares').value;
 }
 get _price(){
   return this.addAccountForm.get('price').value;
 }
 get _date(){
   return this.addAccountForm.get('date').value;
 }

  get name(){
     return this.addAccountForm.get('name');
  }
  get symbol(){
    return this.addAccountForm.get('symbol');
  }
  get shares(){
    return this.addAccountForm.get('shares');
  }
  get price(){
    return this.addAccountForm.get('price');
  }
  get date(){
    return this.addAccountForm.get('date');
  }

  submitAccount(){
   // const req = new AddAccountRequest();
   /* -check to see if symbol exists here  or in service.
      -JSON stringfiy to get into json format and add application/json as the headers
   */
    const dateOfBuy = this.convertToSlashes(this._date);
    const req = this.createAccountObject(dateOfBuy);
    this.account.createAccount(req)
    .subscribe(
      response => {
        console.log(response)
        this.dialogRef.close();
        this.openSnackbar(`${req.name} added successfully`, "Close");
      },
      err => {
        console.log(err)
        this.openSnackbar(`${req.name} failed to save. Please try again.`, "Close");
      },
      () => {
        console.log("add account request complete")
      }
    )
  }

  openSnackbar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000
    });
  }

  discard(){
    this.addAccountForm.reset();
  }

  convertToSlashes(date):string{
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDay();
    return `${year}-${month}-${day}`;
  }

  createAccountObject(dateOfBuy:string):AddAccountRequest {
    try {
      return this.request.createNewAddAccountRequest(this._name, this._symbol, this._shares, this._price, dateOfBuy);
    } catch (err) {
      console.log(err)
      this.errCreatingRequest = true;
    }
  }
  configErrorSymbol() {
    if (this.symbol.hasError('required')){
      return "This field is required";
    }
    else if (this.symbol.hasError('minlength')){
      return "Must be at least 1 char"
    }
    else {
      return "Symbol is not listed. Please check your spelling."
    }
  }

  public dateFilter = (date) => { return date.getDay() !== 0 && date.getDay() !== 6; }

  configErrorName(){
    if (this.name.hasError('required')){
      return "This field is required";
    }
    else if (this.name.hasError('minlength')){
      return "Must be at least 5 characters long";
    }
    else if (this.name.hasError('maxlength')){
      return "Must be at less than 21 characters long";
    }
    else {
      return "Field is invalid. Please make sure your symbol is correct."
    }
  }

  ngOnInit(): void {
  }

}
