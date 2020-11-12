import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NewsData } from '../../../../../shared/models/NewsData';
import { NewsDataKey } from '../../../../../shared/models/NewsFilterStructure';

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.css']
})
export class NewsCardComponent implements OnInit {
  @Input('article') articleList:NewsData[];
  @Input('display') toDisplay:string;
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

  ngOnChanges(changes: SimpleChanges){
    console.log("Changes: ", changes);
    if (changes.toDisplay.isFirstChange() === true) return;
    if (changes.toDisplay.currentValue === changes.toDisplay.previousValue) return;
    this.toDisplay = changes.toDisplay.currentValue;
    console.log(this.toDisplay)
  }

  applySymbolFilter(){
    console.log("here again")
    if (this.toDisplay === "All") return this.articleList;
    console.log(this.toDisplay)
    return this.articleList.filter(x => x.related === this.toDisplay);
  }

}
