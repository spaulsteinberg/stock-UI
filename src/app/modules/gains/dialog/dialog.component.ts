import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TooltipPosition } from '@angular/material/tooltip';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import { RemoveDialogComponent } from '../remove-dialog/remove-dialog.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  @Input('accountNames') accountNames;
  @Input('symbols') listOfSymbols:string[];
  @Input('currentAccount') curName:string;
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    console.log(this.accountNames)
    console.log(this.listOfSymbols)
  }
  tooltipPosition: TooltipPosition = "above";
  tooltipMessageCreate = "Create a new account";
  tooltipMessageRemove = "Delete an account";
  openRemoveDialog() {
    this.dialog.open(RemoveDialogComponent, { data: {
      names: this.accountNames,
      currentAccount: this.curName
    }});
  }
  openCreateAccountDialog(){
    this.dialog.open(AddDialogComponent, { data: {
      symbols: this.listOfSymbols
    }});
  }

}
