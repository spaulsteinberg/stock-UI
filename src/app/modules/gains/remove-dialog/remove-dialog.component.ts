import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { validateSameAccountNamesRemoveDialog } from 'src/app/shared/validators/account-name-check.validator';

@Component({
  selector: 'app-remove-dialog',
  templateUrl: './remove-dialog.component.html',
  styleUrls: ['./remove-dialog.component.css']
})
export class RemoveDialogComponent implements OnInit {

  removeForm:FormGroup;
  accountName = new FormControl('', Validators.required);
  confirmAccountName = new FormControl('', [Validators.required])
  constructor(private fb: FormBuilder) {
    this.removeForm = this.fb.group({
      accountName: this.accountName,
      confirmAccountName: this.confirmAccountName
    }, { validator: validateSameAccountNamesRemoveDialog });
  }

  get selectAccount(){
    return this.removeForm.get('accountName');
  }
  get confirmAccount(){
    return this.removeForm.get('confirmAccountName');
  }

  confirm(){

  }
  discard(){
    this.removeForm.reset();
  }
  configureErrorMessages(){
    if (this.confirmAccountName.hasError('required')){
      return "This field is required";
    }
  }

  ngOnInit(): void {
  }
  exampleAccounts = ["account1", "account 2", "Account 3"]

}