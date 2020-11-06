import { Component, Input, OnInit } from '@angular/core';
import { NewsData } from '../../../shared/models/NewsData';

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.css']
})
export class NewsCardComponent implements OnInit {
  @Input('article') articleList:NewsData[];
  constructor() { }

  MAX_CHARS_SUMMARY:number = 220;
  MAX_CHARS_HEADLINE:number = 80;
  ngOnInit(): void {
  }
  renderCharCountSummary(chars:number, displayed:string, arg:string){
    let cutoff = "";
    let maxCharsAllowed = arg === "summary" ? this.MAX_CHARS_SUMMARY : this.MAX_CHARS_HEADLINE;
    if (chars > maxCharsAllowed){
      cutoff = displayed.substring(0, maxCharsAllowed) + "...";
      return cutoff;
    }
    return displayed;
  }
  renderDate(d:number){
    return new Date(d).toLocaleString()
  }

}
