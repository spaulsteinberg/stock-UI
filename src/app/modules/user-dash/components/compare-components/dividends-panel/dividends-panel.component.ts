import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Dividend } from '../../../shared/models/DividendData';
import { ListServiceService } from '../../../shared/services/list-service.service';

@Component({
  selector: 'app-dividends-panel',
  templateUrl: './dividends-panel.component.html',
  styleUrls: ['./dividends-panel.component.css']
})
export class DividendsPanelComponent implements OnInit {
  @Input('left') leftSymbol:string;
  @Input('right') rightSymbol:string;
  constructor(private _stocks : ListServiceService) { }
  isError:boolean = false;
  loading:boolean;
  topPanel:Dividend;
  bottomPanel:Dividend;
  ngOnInit(): void {
    this.getDividendData();
  }

  getDividendData(){
    if (this.rightSymbol === undefined || this.leftSymbol === undefined) return;
    const sendToCall = `${this.leftSymbol},${this.rightSymbol}`;
    this.loading = true;
    this.topPanel = new Dividend();
    this.bottomPanel = new Dividend();
    this._stocks.getDividends(sendToCall)
    .subscribe
    (data => {
      let temp = [];
      let tempData = [];
      for (const [key, value] of Object.entries(data)){
        temp.push(key);
        tempData.push(data[key]);
      }
      console.log(tempData[0].dividends[0]);
      try {
        this.topPanel.setSymbol(temp[0]);
        this.bottomPanel.setSymbol(temp[1]);
        this.topPanel.dividends = tempData[0].dividends[0];
        this.bottomPanel.dividends = tempData[1].dividends[0];
      } catch (err){
        console.log(err);
        this.isError = true;
        this.loading = false;
      }
      console.log("Top", this.topPanel, "Bottom", this.bottomPanel);
      this.isError = false;
    }, 
    error => {
      this.isError = true;
      console.log(error);
    },
    () => {
      console.log("Dividends complete.");
      this.loading = false;
    });
  }

  renderPanelData(dividend:Dividend){
    return `<p>Amount: ${dividend.dividends.amount}</p>
            <p>Currency: ${dividend.dividends.currency}</p>
            <p>Current Date: ${dividend.dividends.date}</p>
            <p>Declared Date: ${dividend.dividends.declaredDate}</p>
            <p>Ex-Date: ${dividend.dividends.exDate}</p>
            <p>Payment Date: ${dividend.dividends.paymentDate}</p>
            <p>Amount: ${dividend.dividends.recordDate}</p>`
  }
  //on changes call getEarnings again
  ngOnChanges(changes:SimpleChanges){
    console.log("Earnings changes: ", changes);
    try {
      if (changes.left === undefined || changes.right === undefined) console.log("hi");
      else if (changes.left.isFirstChange() && changes.right.isFirstChange()) return;
      if (changes.left !== undefined) this.leftSymbol = changes.left.currentValue;
      if (changes.right !== undefined) this.rightSymbol = changes.right.currentValue;
      this.isError = false;
      this.loading = false;
    } catch (err){
      console.log(err);
      this.isError = true;
      this.loading = false;
    }
   // if (changes.left !== undefined && changes.right !== undefined) this.getEarnings();
   this.getDividendData()
  }

}
