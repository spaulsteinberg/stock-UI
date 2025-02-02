import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AddAccountRequest } from 'src/app/shared/models/AddAccountRequest';
import { AddPositionRequest } from 'src/app/shared/models/AddPositionRequest';
import { CreateProfileRequest } from 'src/app/shared/models/CreateProfileRequest';
import { RemovePositionRequest } from 'src/app/shared/models/RemovePositionRequest';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { BackendService } from 'src/app/shared/services/backend.service';
import { UtilsService } from 'src/app/shared/services/utilities/utils.service';
import { confirmPasswordCheck } from 'src/app/shared/validators/delete-profile-password.validator';
import { checkIfSymbolIsValid } from 'src/app/shared/validators/symbol-check.validator';

@Component({
  selector: 'app-position-dialog',
  templateUrl: './position-dialog.component.html',
  styleUrls: ['./position-dialog.component.css']
})
export class PositionDialogComponent implements OnInit {
  accountName:string;
  symbolList:string[];
  flag:number;
  form:FormGroup;
  minDate:Date = new Date(1960, 1, 1);
  maxDate:Date = new Date();
  isDialogErr:boolean = false;
  dialogErrMessage:string;
  dataContainer;
  createProfileForm:FormGroup;
  deleteProfileForm:FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public utils: UtilsService,
              private account: AccountsService,
              private backend: BackendService,
              private dialogRef:MatDialogRef<PositionDialogComponent>,
              private snackBar:MatSnackBar) {
    this.accountName = data.accountName;
    this.flag = data.flag;
    if (this.flag === 0 || this.flag === 1){
      this.symbolList = this.backend.getCurrentStockListFromSubject();
      this.form = this.fb.group({
        symbol: ['', [Validators.required, checkIfSymbolIsValid(this.symbolList)]],
        position: [null, [Validators.required, Validators.min(0.01), Validators.max(10000000)]],
        priceOfBuy: [null, [Validators.required, Validators.max(10000), Validators.min(0.001)]],
        dateOfBuy: ['', [Validators.required]]
      })
    }
    if (this.flag === 4){
      this.symbolList = this.backend.getCurrentStockListFromSubject();
      this.createProfileForm = this.fb.group({
        profileName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
        profileSymbol: ['', [Validators.required, checkIfSymbolIsValid(this.symbolList)]],
        profilePosition: [null, [Validators.required, Validators.min(0.01), Validators.max(1000000)]],
        profilePriceOfBuy: [null, [Validators.required, Validators.max(10000), Validators.min(0.001)]],
        profileDateOfBuy: ['', [Validators.required]]
      });
      console.log(this.symbolList)
    }
    if (this.flag === 5){
      this.deleteProfileForm = this.fb.group({
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]
      }, {validators: confirmPasswordCheck('password', 'confirmPassword')})
    }
  }

  get symbol(){
    return this.form.get('symbol');
  }

  get position(){
    return this.form.get('position');
  }

  get priceOfBuy(){
    return this.form.get('priceOfBuy');
  }

  get dateOfBuy(){
    return this.form.get('dateOfBuy');
  }

  get _symbol():string{
    return this.form.get('symbol').value;
  }

  get _position():number{
    return this.form.get('position').value;
  }

  get _priceOfBuy():number{
    return this.form.get('priceOfBuy').value;
  }

  get _dateOfBuy(){
    return this.form.get('dateOfBuy').value;
  }

  // creating profile form getters
  get profileName(){
    return this.createProfileForm.get('profileName');
  }
  get profileSymbol(){
    return this.createProfileForm.get('profileSymbol');
  }
  get profilePosition(){
    return this.createProfileForm.get('profilePosition')
  }
  get profilePriceOfBuy(){
    return this.createProfileForm.get('profilePriceOfBuy');
  }
  get profileDateOfBuy(){
    return this.createProfileForm.get('profileDateOfBuy');
  }
  get _profileName(){
    return this.createProfileForm.get('profileName').value;
  }
  get _profileSymbol(){
    return this.createProfileForm.get('profileSymbol').value;
  }
  get _profilePosition(){
    return this.createProfileForm.get('profilePosition').value;
  }
  get _profilePriceOfBuy(){
    return this.createProfileForm.get('profilePriceOfBuy').value;
  }
  get _profileDateOfBuy(){
    return this.createProfileForm.get('profileDateOfBuy').value;
  }

  // delete profile getters
  get password(){ return this.deleteProfileForm.get('password'); }
  get confirmPassword(){ return this.deleteProfileForm.get('confirmPassword') }
  get _password(){ return this.deleteProfileForm.get('password').value; }
  get _confirmPassword(){ return this.deleteProfileForm.get('confirmPassword').value; }

  configureError = (v:any):string => {
      if (v.hasError('required')){
        return "This field is required";
      }
      else if (v.hasError('min')){
        return "Must be greater than .01"
      }
      else if (v.hasError('max')){
        return "Number is too large."
      }
      else if (v.hasError('minlength')){
        return "Must be at least 5 characters long";
      }
      else if (v.hasError('maxlength')){
        return "Must be at less than 21 characters long";
      }
      else {
        return "Invalid format or symbol."
      }
  }
  confirmClickLoading = false;
  createError:boolean = false;
  profileCreateError:string = "Could not create profile. Please reload and try again.";
  createProfileClick = () => {
    const date = this.utils.convertToSlashes(this._profileDateOfBuy);
    this.confirmClickLoading = true;
    const obj = {
      name: this._profileName,
      symbol: this._profileSymbol.toUpperCase(),
      position: this._profilePosition,
      priceOfBuy: this._profilePriceOfBuy,
      dateOfBuy: date
    };
    
    const request = new CreateProfileRequest(this._profileName, obj);
    console.log(request)

    this.account.createNewProfile(request)
    .subscribe(
      response => {
        this.createError = false;
        console.log("subscribed:", response);
        this.openSnackbar(response.msg, "Close");
        this.dialogRef.close({data: response.accounts[0]});
      },
      error => {
        this.createError = true;
        console.log(error);
      },
      () => this.confirmClickLoading = false
    )
  }

  sendData() {
    const date = this.utils.convertToSlashes(this._dateOfBuy);
    console.log("DATE AFTER SLASHES:", date)
    this.confirmClickLoading = true;
    // if add account else remove
    if (this.flag === 0) {
      const obj = {
        position: this._position,
        priceOfBuy: this._priceOfBuy,
        dateOfBuy: date
      };
      const request = new AddPositionRequest(this.accountName, this._symbol.toUpperCase(), obj);
      console.log(JSON.stringify(request))
      this.addPosition(request, 1);
    }
    else if (this.flag === 1){
      const rawObj = {
        name: this.accountName,
        symbol: this._symbol.toUpperCase(),
        position: this._position,
        price: this._priceOfBuy,
        date: date
      }
      const request = new RemovePositionRequest(rawObj);
      console.log(request)
      this.removePostion(request, 1);
    }
  }

  addPosition(request:AddPositionRequest, option){
    this.account.addPosition(request)
      .subscribe(
        response => {
          console.log(response)
          console.log(response.data)
          this.isDialogErr = false;
          this.account.tableDataSubject.next(response.data);
          option === 1 ? this.openSnackbar(`${request.data.position} shares of ${this._symbol.toUpperCase()} added to ${this.accountName}`, "Close")
                       : this.openSnackbar(`${request.data.position} shares added to ${request.symbol}`, "Close")
          this.dialogRef.close({data: response.data});
        },
        error => {
          this.isDialogErr = true;
          this.dialogErrMessage = "Something went wrong processing your request. Please check your input and try again."
        },
        () => this.confirmClickLoading = false
      )
  }

  removePostion(request, option){
    this.account.removePosition(request)
      .subscribe(
        response => {
          console.log(response);
          this.isDialogErr = false;
          this.account.tableDataSubject.next(response.data)
          option === 1 ? this.openSnackbar(`Position of ${this._symbol.toUpperCase()} removed from ${this.accountName}`, "Close")
                       : this.openSnackbar(`Position of ${request.symbol.toUpperCase()} removed from ${request.name}`, "Close")
          this.dialogRef.close({data: response.data});
        },
        error => {
          this.isDialogErr = true;
          error.status === 404 ? this.dialogErrMessage = "Error: Could not find specified position."
                               : this.dialogErrMessage = "Error: Something went wrong. Please try again."
        },
        () => this.confirmClickLoading = false
      )
  }

  confirmDelete(){
    this.confirmClickLoading = true;
    this.removePostion(this.data.obj, 2)
  }

  positionToAdd:number;
  addError:boolean = false;
  addOntoPosition(){
    this.confirmClickLoading = true;
    console.log(this.positionToAdd)
    if (this.positionToAdd === undefined || this.positionToAdd === 0 || this.positionToAdd < 0 || this.positionToAdd > 100000 || isNaN(this.positionToAdd)){
      this.addError = true;
      return;
    }
    this.addError = false;
    const name = this.data.accountName;
    const symbol = this.data.symbol;
    const rawObj = {
      position: this.positionToAdd,
      priceOfBuy: this.data.priceOfBuy,
      dateOfBuy: this.data.dateOfBuy
    };
    const request = new AddPositionRequest(name, symbol, rawObj);
    console.log(request)
    this.addPosition(request, 2)
  }

  addIsDisabled = ():boolean => {
    //console.log(this.positionToAdd)
    try {
      if (this.positionToAdd === undefined
         || this.positionToAdd === 0 
         || this.positionToAdd < 0 
         || this.positionToAdd > 100000 
         || isNaN(this.positionToAdd)
         || this.positionToAdd === null){
        return true;
      }
      else return false;
    }
    catch (err){
      return true;
    }
  }

  errOnDelete:boolean = false;
  deleteUserProfile = () => {
    this.errOnDelete = false;
    this.account.confirmUserPasswordAndDeleteProfile(this._password)
    .subscribe({
      next: (response) => {
        console.log(response);
        this.openSnackbar("Profile deleted", "Close");
        this.dialogRef.close();
      },
      error: (err) => {
        this.errOnDelete = true;
        console.log(err)
      }
    })
  }

  createDeleteHeaderString(){
    return `Delete ${this.data.obj.position} shares of ${this.data.obj.symbol}`;
  }

  createAdditionHeader(){
    return `Add onto ${this.data.symbol}`;
  }

  revert(){
    this.dialogRef.close();
  }

  openSnackbar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }
  
  async ngOnInit() {
    await this.account.setHeaders();
  }

}
