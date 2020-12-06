import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { noop, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Data, DetailAttributes, Details } from 'src/app/shared/interfaces/IAccount';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { BackendService } from 'src/app/shared/services/backend.service';
import { AccountsTableComponent } from '../accounts-table/accounts-table.component';

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
  constructor(private account: AccountsService,
              private el: ElementRef,
              private router: Router,
              private route: ActivatedRoute,
              private backend: BackendService) {
    this.el.nativeElement.ownerDocument.body.style.backgroundColor = "lightblue"
    this.el.nativeElement.ownerDocument.body.style.backgroundImage = "none"
  }
  isErr: boolean = false;
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

  /*
    REMOVE: 
    - If there are no accounts then give a toast message if they try to remove
    - Pass in account names as data

  */
}
