import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { AddPositionRequest } from 'src/app/shared/models/AddPositionRequest';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { BackendService } from 'src/app/shared/services/backend.service';
import { UtilsService } from 'src/app/shared/services/utilities/utils.service';
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
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public utils: UtilsService,
              private account: AccountsService,
              private backend: BackendService,
              private dialogRef:MatDialogRef<PositionDialogComponent>,
              private snackBar:MatSnackBar) {
    this.accountName = data.accountName;
    this.flag = data.flag;
    this.symbolList = this.backend.getCurrentStockListFromSubject();
    this.form = this.fb.group({
      symbol: ['', [Validators.required, checkIfSymbolIsValid(this.symbolList)]],
      position: [null, [Validators.required, Validators.min(0.01), Validators.max(10000000)]],
      priceOfBuy: [null, [Validators.required, Validators.max(10000), Validators.min(0.001)]],
      dateOfBuy: ['', [Validators.required]]
    })
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

  configureError(v:any){
    if (v.hasError('required')){
      return "This field is required";
    }
    else if (v.hasError('min')){
      return "Must be greater than .01"
    }
    else if (v.hasError('max')){
      return "Number is too large."
    }
    else {
      return "Invalid format or symbol."
    }
  }

  sendData() {
    const date = this.utils.convertToSlashes(this._dateOfBuy);
    const obj = {
      position: this._position,
      priceOfBuy: this._priceOfBuy,
      dateOfBuy: date
    };
    // if add account else remove
    if (this.flag === 0) {
      const request = new AddPositionRequest(this.accountName, this._symbol.toUpperCase(), obj);
      console.log(JSON.stringify(request))
      this.account.addPosition(request, this.accountName)
      .subscribe(
        response => {
          console.log(response)
          console.log(response.data)
          this.account.tableDataSubject.next(response.data);
          this.dialogRef.close()
        },
        err => console.log(err),
        () => {
          this.openSnackbar(`${this._symbol.toUpperCase()} added to ${this.accountName}`, "Close")
        }
      )
    }
    else if (this.flag === 1){

    }
  }

  openSnackbar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }
  
  ngOnInit(): void {
  }

}
