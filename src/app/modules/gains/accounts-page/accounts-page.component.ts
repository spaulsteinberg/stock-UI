import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TooltipPosition } from '@angular/material/tooltip';
import { RemoveDialogComponent } from '../remove-dialog/remove-dialog.component';

@Component({
  selector: 'app-accounts-page',
  templateUrl: './accounts-page.component.html',
  styleUrls: ['./accounts-page.component.css']
})
export class AccountsPageComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  tooltipPosition: TooltipPosition = "above";
  tooltipMessageCreate = "Create a new account";
  tooltipMessageRemove = "Delete an account";
  openRemoveDialog() {
    this.dialog.open(RemoveDialogComponent)
  }
  
  /*
    REMOVE: 
    - If there are no accounts then give a toast message if they try to remove
    - Pass in account names as data

    ADD:
    - 
  */
}
