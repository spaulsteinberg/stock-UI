import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsData } from '../../../shared/models/NewsData';
import { ListServiceService } from '../../../shared/services/list-service.service';

@Component({
  selector: 'app-trending-landing',
  templateUrl: './trending-landing.component.html',
  styleUrls: ['./trending-landing.component.css']
})
export class TrendingLandingComponent implements OnInit {

  constructor(private _stocks : ListServiceService, private router : Router) { }
  articleList:NewsData[] = [];
  ngOnInit(): void {
    if (this._stocks.getQuotes() === undefined) this.router.navigate(['dash']);
    else this.getNews();
  }
  /*
  First get last 2 articles for each subscribed stock, in dropdown pass symbol to request to search for just them
  */
 getNews(){
    this._stocks.getLatestNews("JPM,ROKU")
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
      }
    )
 }

 orderArticlesByTimestamp(){
   this.articleList.sort(this.compareTimestamps)
 }

 compareTimestamps(a:NewsData, b:NewsData){
    return a.datetime - b.datetime;
 }

}
