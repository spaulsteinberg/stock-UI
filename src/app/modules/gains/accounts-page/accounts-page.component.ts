import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { BackendService } from 'src/app/shared/services/backend.service';

@Component({
  selector: 'app-accounts-page',
  templateUrl: './accounts-page.component.html',
  styleUrls: ['./accounts-page.component.css']
})
export class AccountsPageComponent implements OnInit {

  listOfSymbols$:Observable<string[]>;
  accountNames:string[]; // used to be a checker...if length > 0 then there is a profile, if not must be created
  accountNames$:Observable<string[]>;
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
    this.accountNames$.subscribe(val => this.accountNames = val, err => this.isErr = true);
    console.log("ACCOUNT NAMES IN COMPONENT: ", this.accountNames)
    this.backend.getStockListAsObservable();
    this.listOfSymbols$ = this.backend.stockList$;
  }
  navBack() {
    this.router.navigate([".."], {relativeTo: this.route})
  }
  /*
    REMOVE: 
    - If there are no accounts then give a toast message if they try to remove
    - Pass in account names as data

    ADD:
    - 
  */
}
