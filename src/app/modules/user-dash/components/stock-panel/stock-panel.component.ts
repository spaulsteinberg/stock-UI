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
  @Input('flag') flag:string;
  @Output() panelChange = new EventEmitter();
  letters:string[] = [];
  buttonClasses;
  constructor() { }

  ngOnInit(): void {
    console.log(this.quote, this.flag);
    this.resolveFlag();
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
    if (this.flag === "add-remove" && action === 'left'){
      n['action'] = 'View';
    }
    else if (this.flag === 'add-remove' && action === 'right'){
      n['action'] = 'Remove';
    }
    else if (this.flag === 'compare' && action === 'left'){
      n['action'] = 'Left';
    }
    else if (this.flag === "compare" && action === 'right'){
      n['action'] = 'Right';
    }
    this.panelChange.emit(n);
  }

  // resolve which flag is being passed for button names
  resolveFlag = () => {
    if (this.flag === "compare"){
      this.letters[0] = "L";
      this.letters[1] = "R";
      this.buttonClasses = {
        leftButtonClasses: {
          'btn': true,
          'btn-warning': true
        },
        rightButtonClasses: {
          'btn': true,
          'btn-info': true
        }
      };
    }
    else if (this.flag === "add-remove"){
      this.letters[0] = "V";
      this.letters[1] = "D";
      this.buttonClasses = {
        leftButtonClasses: {
          'btn': true,
          'btn-primary': true
        },
        rightButtonClasses: {
          'btn': true,
          'btn-danger': true
        }
      };
    }
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
