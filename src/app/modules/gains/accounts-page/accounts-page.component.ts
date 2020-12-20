import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DetailAttributes } from 'src/app/shared/interfaces/IAccount';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { BackendService } from 'src/app/shared/services/backend.service';
import { AccountsTableComponent } from '../accounts-table/accounts-table.component';
import { PositionDialogComponent } from '../position-dialog/position-dialog.component';

@Component({
  selector: 'app-accounts-page',
  templateUrl: './accounts-page.component.html',
  styleUrls: ['./accounts-page.component.css']
})
export class AccountsPageComponent implements OnInit {
  @ViewChild(AccountsTableComponent) tableComponent:AccountsTableComponent;
  listOfSymbols$:Observable<string[]>;
  accountNames$:Observable<string[]>;
  accountData$:Observable<DetailAttributes[]>;
  accountDisplay$:Observable<DetailAttributes>;
  selectedAccount:string;
  tooltipPosition: TooltipPosition = "above";
  tooltipMessage = "Select an account to view";
  tooltipAddPosition = "Add a position to account";
  tooltipRemovePosition = "Remove a position from account";
  constructor(private account: AccountsService,
              private el: ElementRef,
              private router: Router,
              private route: ActivatedRoute,
              private backend: BackendService,
              private dialog: MatDialog) {
    this.el.nativeElement.ownerDocument.body.style.backgroundColor = "lightblue"
    this.el.nativeElement.ownerDocument.body.style.backgroundImage = "none"
  }
  isErr: boolean = false;
  //init account data
  async ngOnInit() {
    this.accountNames$ = this.account.accountNames$;
    this.accountData$ = this.account.accountsData$;
    this.backend.getStockListAsObservable();
    this.listOfSymbols$ = this.backend.stockList$;
  }

  navBack() {
    this.router.navigate([".."], {relativeTo: this.route})
  }

  selectChange(event){
    console.log("select change:", event)
    this.accountDisplay$ = this.account.filterAccounts(this.selectedAccount);
    if (this.tableComponent !== undefined){
      this.accountDisplay$.subscribe(data => {
        this.tableComponent.getSubject().next(data.data);
      })
    }
  }

  openPositionDialog(flag:number){
    this.dialog.open(PositionDialogComponent, {data: {
      flag: flag,
      accountName: this.selectedAccount
    }});
  }

  /*
    REMOVE: 
    - If there are no accounts then give a toast message if they try to remove
    - Pass in account names as data

  */
}
