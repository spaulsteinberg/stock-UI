import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICombinationRoute } from '../../interfaces/ICombinationRoute';
import { RouteDirect } from './RouteEnum';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private router: Router) { }

  /**** Date functions ****/
  public dateFilter = (date) => { return date.getDay() !== 0 && date.getDay() !== 6; }

  public convertToSlashes(date):string{
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1; //months are 0-11
    const day = d.getDate();
    console.log("date:", d, "year", year, "month", month, "day", day)
    return `${year}-${month}-${day}`;
  }

  /***** Shared Route *****/
  ACCOUNT_LEVEL_ROUTES:Array<ICombinationRoute> = new Array<ICombinationRoute>(
    {name: "WATCHLIST", route: "../watchlist/table"},
    {name: "CHARTS", route: "../interactive/accounts/charts"},
    {name: "HOME", route: ".."}
  )
  TABLE_LEVEL_ROUTES:ICombinationRoute[] = [
    {name: "HOME", route: "../.."},
    {name: "ACCOUNTS", route: "../../accounts"}
  ];
  INTERACTIVE_LEVEL_ROUTES:ICombinationRoute[] = [
    {name: "HOME", route: "../../.."},
    {name: "ACCOUNTS", route: "../../../accounts"}
  ];
  nav(name:string, route:ActivatedRoute, routeArryFind:RouteDirect) {
    let routeTo = null;
    if (routeArryFind === 0) routeTo = this.TABLE_LEVEL_ROUTES.find(_ => _.name === name);
    else if (routeArryFind === 1) routeTo = this.ACCOUNT_LEVEL_ROUTES.find(_ => _.name === name);
    else routeTo = this.INTERACTIVE_LEVEL_ROUTES.find(_ => _.name === name);

    this.router.navigate([routeTo.route], {relativeTo: route})
  }

  public numberToCurrency = ():Intl.NumberFormat => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
  
}
