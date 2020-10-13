import { Component, OnInit } from '@angular/core';
import { IQuote } from '../../shared/interfaces/IQuote';
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
    items: 6, 
    loop: true,
  //  dots: true,
    margin: 0, 
    autoplay: true, 
    autoplayTimeout:2000, 
    autoplayHoverPause:true
  };
  carouselClasses = ['owl-theme', 'row', 'sliding'];

  getArrowDirection(change){
    return change >= 0 ? "../../../../../assets/dash-images/arrow_upward-24px.svg"
                       : "../../../../../assets/dash-images/arrow_downward-24px.svg";
  }
  getItemBoxColor(quote:IQuote){
    return {'background-color': quote.change > 0.00 ? 'green' : quote.change < 0.00 ? 'red' : 'gray'}
  }

  renderDayChange(percent:number, change:number){
    return `${change} (${percent.toFixed(3)}%)`;
  }
}
