import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TooltipPosition } from '@angular/material/tooltip';
import { DialogEnum } from 'src/app/shared/services/utilities/DialogEnum';
import { AccountsTableComponent } from '../accounts-table/accounts-table.component';
import { PositionDialogComponent } from '../position-dialog/position-dialog.component';

@Component({
  selector: 'app-menu-dialog-container',
  templateUrl: './menu-dialog-container.component.html',
  styleUrls: ['./menu-dialog-container.component.css']
})
export class MenuDialogContainerComponent implements OnInit {
  @Input('accountNames') accountNames:string[];
  @Input('currentAccount') currentAccount:string;
  @Input('symbols') symbols:string[];
  @Input('tableComponent') tableComponent: AccountsTableComponent;
  tooltipPosition: TooltipPosition = "above";
  tooltipMessage = "Select an account to view";
  tooltipAddPosition = "Add a position to account";
  tooltipRemovePosition = "Remove a position from account";
  
  addFullPositionFlag = DialogEnum.ADD_FULL_POSITION;
  removeFullPositionFlag = DialogEnum.REMOVE_FULL_POSITION;
  deleteProfileFlag = DialogEnum.DELETE_PROFILE;
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openPositionDialog(flag:number){
    let dialogRef = this.dialog.open(PositionDialogComponent, {data: {
      flag: flag,
      accountName: this.currentAccount
    }});

    try {
      dialogRef.afterClosed().subscribe(data => {
        if (data !== undefined){
          this.tableComponent.getDataSource().data = data.data;
        }
      })
    }
    //swallow, might be when theres a 404
    catch (err){ }
  }

  deleteProfileDialog = (flag:number) => {
    console.log("delete profile click", 5)
  }

}
