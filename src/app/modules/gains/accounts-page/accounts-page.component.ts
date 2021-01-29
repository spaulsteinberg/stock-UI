import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DetailAttributes } from 'src/app/shared/interfaces/IAccount';
import { ICombinationRoute } from 'src/app/shared/interfaces/ICombinationRoute';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { BackendService } from 'src/app/shared/services/backend.service';
import { DialogEnum } from 'src/app/shared/services/utilities/DialogEnum';
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
  public userHasProfile:boolean;
  tooltipPosition: TooltipPosition = "above";
  tooltipMessage = "Select an account to view";
  constructor(private account: AccountsService,
              private el: ElementRef,
              private router: Router,
              private route: ActivatedRoute,
              private backend: BackendService,
              private dialog: MatDialog,
              private cdr: ChangeDetectorRef) {
    this.el.nativeElement.ownerDocument.body.style.backgroundColor = "lightblue";
    this.el.nativeElement.ownerDocument.body.style.backgroundImage = "none";
  }
  isErr: boolean = false;
  initialLoad:boolean = true;
  //init account data
  async ngOnInit() {
    //swallow the exception -- user needs to create an account
    try {
      if (!this.account.hasBeenCheckedForProfile) await this.account.checkForProfile();
    } catch (err){ }
    if (this.account.userHasProfile && !this.account.isInit){
      this.account.getAccounts();
    }
    this.backend.getStockListAsObservable();
    this.accountNames$ = this.account.accountNames$;
    this.accountData$ = this.account.accountsData$;
    this.listOfSymbols$ = this.backend.stockList$;
    this.userHasProfile = this.account.userHasProfile;
    this.initialLoad = false;
  }

  ROUTES:Array<ICombinationRoute> = new Array<ICombinationRoute>(
    {name: "WATCHLIST", route: "../watchlist/table"},
    {name: "CHARTS", route: "../interactive/accounts/charts"},
    {name: "HOME", route: ".."}
  )
  nav(name:string) {
    const routeTo = this.ROUTES.find(_ => _.name === name);
    this.router.navigate([routeTo.route], {relativeTo: this.route})
  }

  // give the next data to subject
  selectChange(event){
    console.log("select change:", event)
    this.accountDisplay$ = this.account.filterAccounts(this.selectedAccount); // get the filtered account to give data to table
    if (this.tableComponent !== undefined){
      this.accountDisplay$.subscribe(data => {
          if (data !== undefined){
            this.tableComponent.getSubject().next(data.data);
            this.tableComponent.getDataSource().data = data.data
          }
      })
    }
  }

  createProfileClick = () => {
    console.log("user wants to create an account")
    let dialogRef = this.dialog.open(PositionDialogComponent, {data: {
      flag: DialogEnum.CREATE_PROFILE
    }})

    dialogRef.afterClosed().pipe(finalize(() => console.log("dialog ref create profile complete")))
    .subscribe(
      data => {
        if (data !== undefined){
          console.log(data)
          this.userHasProfile = true;
        }
      }
    )
  }

  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }
}
