import { Component, OnInit } from '@angular/core';
import { IQuote } from '../../shared/models/IQuote';
import { ListServiceService } from '../../shared/services/list-service.service';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent implements OnInit {

  constructor(private _stocks: ListServiceService) { }

  quotes:IQuote[] = [];
  // get quotes from service
  ngOnInit(): void {
    this.quotes = this._stocks.getQuotes();
  }
  options = {
    items: 8, 
    loop: true,
    dots: true, 
    navigation: true,
    margin: 0, 
    autoplay: true, 
    autoplayTimeout:5000, 
    autoplayHoverPause:true
  };
  carouselClasses = ['owl-theme', 'row', 'sliding'];
}
