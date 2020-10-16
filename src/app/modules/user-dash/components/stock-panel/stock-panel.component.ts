import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IQuote } from '../../shared/interfaces/IQuote';

@Component({
  selector: 'app-stock-panel',
  templateUrl: './stock-panel.component.html',
  styleUrls: ['./stock-panel.component.css']
})
export class StockPanelComponent implements OnInit {

  @Input() quote: IQuote;
  @Input('color') getColor:any; 
  @Input('execute') sendAction:any;
  @Output() panelChange = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    console.log(this.quote);
  }

  // display field depending on whether market is opened/closed
  displayPrice(quote:IQuote){
    let tempPlus = "";
    //add missing plus for positive change
    if (quote.change > 0.00000) tempPlus = "+";
    if (quote.close === null && quote.isUSMarketOpen === false) return `Last close: ${quote.iexClose}     ${tempPlus}${quote.change} (${(quote.changePercent*100).toFixed(3)}%)`;
    if (quote.close === null) return `<p>Currently: ${quote.iexRealtimePrice}     ${tempPlus}${quote.change} (${(quote.changePercent*100).toFixed(3)}%)</p>`;
    return `Last close: ${quote.close}     ${tempPlus}${quote.change} (${(quote.changePercent*100).toFixed(3)}%)`;
  }

  // call function in parent
  callColor(quote){
    return this.getColor(quote);
  }

  /* emit an event to parent to show chart/delete */
  panelButtonClick(symbol:string, action:string){
    let n = new Object();
    n['symbol'] = symbol;
    n['action'] = action;
    this.panelChange.emit(n);
  }

  //basically the same thing as call in parent, but less logic needed for this
  colorText(change:number){
    return {'color': change > 0.00 ? '#00e600' : change < 0.00 ? 'red' : 'gray'}
   }

  renderQuoteData(quote:IQuote){
    return `<p>Open: ${quote.open}</p>
            <p>Day High: ${quote.high}</p>
            <p>Day Low: ${quote.low}</p>
            <p>Volume: ${quote.volume}</p>
            <p>52 Week High: ${quote.week52High}</p>
            <p>52 Week Low: ${quote.week52Low}</p>`;
  }

}
