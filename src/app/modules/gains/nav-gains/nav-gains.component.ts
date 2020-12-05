import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService } from 'src/app/shared/services/accounts.service';

@Component({
  selector: 'app-gains-navigation-cards',
  templateUrl: './nav-gains.component.html',
  styleUrls: ['./nav-gains.component.css']
})
export class NavGainsComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private account: AccountsService) { }

  ngOnInit(): void {
    // init account data
    this.account.getAccounts();
  }
  WATCHLIST_ROUTE:string = "watchlist/table";
  ACCOUNTS_VIEW_ROUTE:string = "accounts";
  relativeTo = {relativeTo: this.route};

  nav(key:number){
    if (key === 1){
      this.router.navigate([this.WATCHLIST_ROUTE], this.relativeTo);
    } else if (key === 2){
      this.router.navigate([this.ACCOUNTS_VIEW_ROUTE], this.relativeTo);
    }
  }

}
