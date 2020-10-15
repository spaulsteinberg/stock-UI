import { Component, Input, OnInit } from '@angular/core';
import { IQuote } from '../../shared/interfaces/IQuote';

@Component({
  selector: 'app-stock-panel',
  templateUrl: './stock-panel.component.html',
  styleUrls: ['./stock-panel.component.css']
})
export class StockPanelComponent implements OnInit {

  @Input() quote: IQuote;
  @Input('color') getColor:any; 
  constructor() { }

  ngOnInit(): void {
    console.log(this.quote);
  }

  // display field depending on whether market is opened/closed
  displayPrice(quote:IQuote){
    let tempPlus = "";
    //add missing plus for positive change
    if (quote.change > 0.00000) tempPlus = "+";
    if (quote.close === null) return `Currently: ${quote.iexRealtimePrice}     ${tempPlus}${quote.change} (${quote.changePercent*100}%)`;
    return `Last close: ${quote.close}     ${tempPlus}${quote.change} (${(quote.changePercent*100).toFixed(3)}%)`;
  }

  // call function in parent
  callColor(quote){
    return this.getColor(quote);
  }

  renderQuoteData(quote:IQuote){
    return `<p>Open: ${quote.open}</p>
            <p>Day High: ${quote.high}</p>
            <p>Day Low: ${quote.low}</p>
            <p>Volume: ${quote.volume}</p>
            <p>52 Week High: ${quote.week52High}</p>
            <p>52 Week Low: ${quote.week52Low}</p>
            <p>YTD Change: ${(quote.ytdChange*100).toFixed(2)}%</p>`;
  }

}
