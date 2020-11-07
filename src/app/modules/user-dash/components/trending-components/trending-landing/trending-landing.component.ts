import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { NewsData } from '../../../shared/models/NewsData';
import { ListServiceService } from '../../../shared/services/list-service.service';

@Component({
  selector: 'app-trending-landing',
  templateUrl: './trending-landing.component.html',
  styleUrls: ['./trending-landing.component.css']
})
export class TrendingLandingComponent implements OnInit {

  constructor(private _stocks : ListServiceService, private router : Router, private dash : DashboardService) { }
  articleList:NewsData[] = [];
  newsToDisplay:string = "All";
  isError:boolean = false;
  watchListSymbols:string[] = [];
  isLoading:boolean = false;
  ngOnInit(): void {
    if (this._stocks.getQuotes() === undefined) this.router.navigate(['dash']);
    else {
      this.getWatchList();
      this.getNews();
    }
  }
  /*
  First get last 2 articles for each subscribed stock, in dropdown pass symbol to request to search for just them
  */
 getNews(){
   if (this.watchListSymbols.length === 0) return;
   const toSend = this.watchListSymbols.join(',');
   this.isLoading = true;
    this._stocks.getLatestNews(toSend)
    .subscribe(
      response => {
        for (let [key, value] of Object.entries(response)){
          for (var entry of response[key]["news"]){
            this.articleList.push(new NewsData(key, entry))
          }
        }
        console.log(this.articleList);
        this.orderArticlesByTimestamp();
        console.log(this.articleList);
      },
      error => {
        console.log("ERROR: ", error)
      },
      () => {
        console.log("complete")
        this.isLoading = false;
      }
    )
 }

 //get all watchlist stocks
 getWatchList(){
   try {
     this.watchListSymbols = this._stocks.getQuoteSymbols()
   } catch (err){
     this.isError = true;
     console.log(err);
   }
 }

 //set time order
 orderArticlesByTimestamp(){
   this.articleList.sort(this.compareTimestamps)
 }

 // order by time compare callback
 compareTimestamps(a:NewsData, b:NewsData){
    return a.datetime - b.datetime;
 }


}
