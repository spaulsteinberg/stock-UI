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

  async ngOnInit() {
    // swallow the exception -- user w 400 does not exist yet
    try {
      if (!this.account.hasBeenCheckedForProfile) await this.account.checkForProfile();
    } catch (err){ }
    if (this.account.userHasProfile && !this.account.isInit){
      this.account.getAccounts();
    }
    console.log("user has been check in nav:", this.account.hasBeenCheckedForProfile);
    console.log("user has a profile:", this.account.userHasProfile)
  }
  WATCHLIST_ROUTE:string = "watchlist/table";
  ACCOUNTS_VIEW_ROUTE:string = "accounts";
  INTERACTIVE_ROUTE:string = "interactive/accounts/charts"
  relativeTo = {relativeTo: this.route};

  nav(key:number){
    if (key === 1){
      this.router.navigate([this.WATCHLIST_ROUTE], this.relativeTo);
    } else if (key === 2){
      this.router.navigate([this.ACCOUNTS_VIEW_ROUTE], this.relativeTo);
    }
    else if (key === 3){
      this.router.navigate([this.INTERACTIVE_ROUTE], this.relativeTo);
    }
  }

}
