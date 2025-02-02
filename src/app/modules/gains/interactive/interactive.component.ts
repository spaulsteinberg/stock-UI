import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteDirect } from 'src/app/shared/services/utilities/RouteEnum';
import { UtilsService } from 'src/app/shared/services/utilities/utils.service';
import { Observable, Subscription } from 'rxjs';
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
  portfolioStatisticsWrapper:PortfolioStatistics;
  accountsValues:Map<string, number>;
  totalPortfolioValue:Observable<PortfolioStatistics>;
  accountValuesSub:Subscription;
  portfolioSub:Subscription;
  portfolioTotalValueList = []; //make a list of tuples with the symbol and val
  accountTotalValueList = [];
  loading:boolean = false;
  errorOnRetrieval:boolean = false;
  userHasNoProfile:boolean = false;
  async ngOnInit() {
    this.loading = true;
    try {
      if (!this.account.hasBeenCheckedForProfile) await this.account.checkForProfile();
    } catch (err){ }
    this.retrieveData();
  }

  retrieveData = () => {
    if (this.account.userHasProfile && !this.account.isInit) this.account.getAccounts();
    if (this.account.userHasProfile) this.getPortfolioData();
    else this.redirectWhenNoPortfolioPresent();
  }

  getPortfolioData = () => {
    this.totalPortfolioValue = this.account.getTotalPortfolioStats();
      this.portfolioSub = this.totalPortfolioValue.subscribe({
        next: (data) => {
          this.portfolioStatisticsWrapper = data;
          this.loading = false;
          this.tupleWrap();
          try {
            console.log("Potfolio stats:", data)
            console.log(data.totalAccountsInPortfolio)
            console.log(data.totalPortfolioValue)
          }
          catch (err) {console.log(err); this.errorOnRetrieval = true}
        },
        error: (err) => {
          this.errorOnRetrieval = true;
          console.log(err)
          this.loading = false;
        }
    });
    this.accountValuesSub = this.account.getTotalAccountValue()
      .subscribe(
        data => {
          this.accountsValues = data;
          let tempMap = new Map([...this.accountsValues.entries()].sort((a, b) => b[1] - a[1]))
          for (const [key, value] of tempMap){
            this.accountTotalValueList.push([key, value]);
          }
        },
        err => console.log(err)
      )
  }

  //convert the map into a list of tuples
  tupleWrap = () => {
    if (this.portfolioStatisticsWrapper.totalPortfolioValue === 0) return;
    let pMap = this.portfolioStatisticsWrapper.positionTotalsMap;
    pMap = new Map([...pMap.entries()].sort( (a, b) => b[1].totalValue - a[1].totalValue));
    for (const [key, value] of pMap){
      this.portfolioTotalValueList.push([key, value.totalValue])
    }
  }

  redirectWhenNoPortfolioPresent = () => {
    this.loading = false;
      this.userHasNoProfile = true;
      setTimeout(() => {
        this.router.navigate(["../../../accounts"], {relativeTo: this.route})
      }, 2000)
  }


  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }

  ngOnDestroy(){
    if (this.portfolioSub !== undefined) this.portfolioSub.unsubscribe();
    if (this.accountValuesSub !== undefined)  this.accountValuesSub.unsubscribe();
  }

}
