import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { validateSameAccountNamesRemoveDialog } from 'src/app/shared/validators/account-name-check.validator';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-remove-dialog',
  templateUrl: './remove-dialog.component.html',
  styleUrls: ['./remove-dialog.component.css']
})
export class RemoveDialogComponent implements OnInit {

  removeForm:FormGroup;
  accountName = new FormControl('', Validators.required);
  confirmAccountName = new FormControl('', [Validators.required])
  constructor(private fb: FormBuilder, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              private account: AccountsService,
              private dialogRef: MatDialogRef<RemoveDialogComponent>,
              private _snackBar: MatSnackBar) {
    this.removeForm = this.fb.group({
      accountName: this.accountName,
      confirmAccountName: this.confirmAccountName
    }, { validator: validateSameAccountNamesRemoveDialog });
  }

  get selectAccount(){
    return this.removeForm.get('accountName').value;
  }
  get confirmAccount(){
    return this.removeForm.get('confirmAccountName').value;
  }

  openAccountError:boolean = false;
  confirmError:boolean = false;
  isLoading:boolean = false;
  confirm(){
    this.isLoading = true;
    const currentName = this.data.currentAccount;
    if (currentName === this.confirmAccount){
      this.openAccountError = true;
      return;
    }
    this.openAccountError = false;
    this.account.deleteAnAccount(this.confirmAccount)
    .subscribe(response => {
      console.log(response)
      this.openSnackbar(response.details, "Close")
    },
    error => {
      console.log(error)
      this.confirmError = true;
      this.openSnackbar(`${error.status} error`, "Close")
    },
    () => {
      this.isLoading = false;
      this.dialogRef.close();
    })
  }

  discard(){
    this.removeForm.reset();
  }

  configureErrorMessages(){
    if (this.confirmAccountName.hasError('required')){
      return "This field is required";
    }
  }
  
  openSnackbar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000
    });
  }

  ngOnInit(): void {
  }

}