import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TooltipPosition } from '@angular/material/tooltip';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import { RemoveDialogComponent } from '../remove-dialog/remove-dialog.component';

@Component({
  selector: 'app-accounts-page',
  templateUrl: './accounts-page.component.html',
  styleUrls: ['./accounts-page.component.css']
})
export class AccountsPageComponent implements OnInit {

  constructor(private dialog: MatDialog, private account: AccountsService, private el: ElementRef) {
    this.el.nativeElement.ownerDocument.body.style.backgroundColor = "lightblue"
    this.el.nativeElement.ownerDocument.body.style.backgroundImage = "none"
   }
  doneLoading:boolean = false;
  accountNames:string[];
  async ngOnInit() {
    const res = await this.account.doesUserExist();
    this.accountNames = res;
    this.doneLoading = true;
  }

  tooltipPosition: TooltipPosition = "above";
  tooltipMessageCreate = "Create a new account";
  tooltipMessageRemove = "Delete an account";
  openRemoveDialog() {
    this.dialog.open(RemoveDialogComponent, { data: {
      names: this.accountNames
    }});
  }
  openCreateAccountDialog(){
    this.dialog.open(AddDialogComponent);
  }
  /*
    REMOVE: 
    - If there are no accounts then give a toast message if they try to remove
    - Pass in account names as data

    ADD:
    - 
  */
}
