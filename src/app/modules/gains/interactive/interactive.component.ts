import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteDirect } from 'src/app/shared/services/utilities/RouteEnum';
import { UtilsService } from 'src/app/shared/services/utilities/utils.service';
import * as d3 from 'd3';
import { color } from 'd3';
import { Observable } from 'rxjs';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { PortfolioStatistics } from 'src/app/shared/models/PortfolioStatisticsModel';

@Component({
  selector: 'app-interactive',
  templateUrl: './interactive.component.html',
  styleUrls: ['./interactive.component.css']
})
export class InteractiveComponent implements OnInit {

  public direct = RouteDirect.VISUAL;
  constructor(public utils: UtilsService,
    public route: ActivatedRoute,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private account: AccountsService,
    private router: Router) {
    this.el.nativeElement.ownerDocument.body.style.backgroundColor = "lightblue"
    this.el.nativeElement.ownerDocument.body.style.backgroundImage = "none"
   }
  totalPortfolioValue:Observable<PortfolioStatistics>;
  userHasNoProfile:boolean = false;
  async ngOnInit() {
    try {
      if (!this.account.hasBeenCheckedForProfile) await this.account.checkForProfile();
    } catch (err){ }
    if (this.account.userHasProfile && !this.account.isInit){
      this.account.getAccounts();
    }
    if (this.account.userHasProfile){
      this.totalPortfolioValue = this.account.getTotalPortfolioStats();
      this.totalPortfolioValue.subscribe(data => console.log(data))
    }
    if (!this.account.userHasProfile){
      this.userHasNoProfile = true;
      setTimeout(() => {
        this.router.navigate(["../../../accounts"], {relativeTo: this.route})
      }, 2000)
    }
  }

  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }

}
