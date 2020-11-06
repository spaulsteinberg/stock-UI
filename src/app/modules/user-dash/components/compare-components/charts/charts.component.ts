import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { catchError } from 'rxjs/operators';
import { ViewChartHistoricalData } from '../../../shared/models/ViewChartHistoricalData';
import { ListServiceService } from '../../../shared/services/list-service.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  @Input('left') left:string;
  @Input('right') right:string;
  constructor(private _stocks : ListServiceService) { }

  showLoadingIcon:boolean = true;
  isError:boolean;
  errMessage:string;
  public chartData: ChartDataSets[] = [];
  public labels: Label[] = [];
  public type= "line";
  public legend = true;
  leftColor:string = 'orange';
  rightColor:string = 'blue'
  setToDisplay:string = "Close";
  timespanToDisplay:string = "1Month";
  leftDataSet;
  rightDataSet;
  async ngOnInit() {
    await this.handleData("1m");
  }

  async handleData(timespan:string){
    this.leftDataSet = new ViewChartHistoricalData(this.left);
    this.rightDataSet = new ViewChartHistoricalData(this.right)
    const symbols = this.left + "," + this.right;
    return this._stocks.getOneMonthHistoricalData(symbols, timespan)
    .then((data) =>{
      for (const [key, value] of Object.entries(data[this.left])) {
        for (let d of data[this.left][key]){
          this.leftDataSet._pushData(d.close, d.open, d.high, d.low, d.date, d.volume);
        }
      }
      for (const [key, value] of Object.entries(data[this.right])) {
        for (let d of data[this.right][key]){
          this.rightDataSet._pushData(d.close, d.open, d.high, d.low, d.date, d.volume);
        }
      }
    })
    .catch((error) => {
      this.isError = true;
      this.errMessage = error;
    })
    .finally(() => {
      this.makeSets();
      this.showLoadingIcon = false;
      this.monthLineOptions.title.text = `${this.left} vs. ${this.right}`;
    })
  }

  async dataOneYear(){
    this.leftDataSet = new ViewChartHistoricalData(this.left);
    this.rightDataSet = new ViewChartHistoricalData(this.right)
    const symbols = this.left + "," + this.right;
    this._stocks.getBatchHistoricalData(symbols)
    .pipe(catchError(this._stocks.errorOnHistoricalData))
    .subscribe(
      data => {
          for (const [key, value] of Object.entries(data[this.left])) {
            for (let d of data[this.left][key]){
              this.leftDataSet._pushData(d.close, d.open, d.high, d.low, d.date, d.volume);
            }
          }
          for (const [key, value] of Object.entries(data[this.right])) {
            for (let d of data[this.right][key]){
              this.rightDataSet._pushData(d.close, d.open, d.high, d.low, d.date, d.volume);
            }
          }
      },
      error => {
        this.isError = true;
        this.errMessage = error;
      },
      () => {
        this.makeSets();
        this.showLoadingIcon = false;
        this.monthLineOptions.title.text = `${this.left} vs. ${this.right}`;

      }
    );
  }

  private async makeSets(displayNew?:string){
    this.labels = this.leftDataSet.date;
    if (displayNew === undefined){
      this.chartData = [
        { data: this.leftDataSet.close, label: `${this.leftDataSet.symbol}`, backgroundColor: 'transparent', borderColor: this.leftColor },
        { data: this.rightDataSet.close, label: `${this.rightDataSet.symbol}`, backgroundColor: 'transparent', borderColor: this.rightColor}
      ]
    }
    else {
      if (displayNew === "Close"){
        this.chartData = [
        { data: this.leftDataSet.close, label: `${this.leftDataSet.symbol}`, backgroundColor: 'transparent', borderColor: this.leftColor },
        { data: this.rightDataSet.close, label: `${this.rightDataSet.symbol}`, backgroundColor: 'transparent', borderColor: this.rightColor}
      ]
      }
      else if (displayNew === "Open"){
        this.chartData = [
          { data: this.leftDataSet.open, label: `${this.leftDataSet.symbol}`, backgroundColor: 'transparent', borderColor: this.leftColor },
          { data: this.rightDataSet.open, label: `${this.rightDataSet.symbol}`, backgroundColor: 'transparent', borderColor: this.rightColor}
        ]
      }
      else if (displayNew === "High"){
        this.chartData = [
          { data: this.leftDataSet.high, label: `${this.leftDataSet.symbol}`, backgroundColor: 'transparent', borderColor: this.leftColor },
          { data: this.rightDataSet.high, label: `${this.rightDataSet.symbol}`, backgroundColor: 'transparent', borderColor: this.rightColor}
        ]
      }
      else if (displayNew === "Low"){
        this.chartData = [
          { data: this.leftDataSet.low, label: `${this.leftDataSet.symbol}`, backgroundColor: 'transparent', borderColor: this.leftColor },
          { data: this.rightDataSet.low, label: `${this.rightDataSet.symbol}`, backgroundColor: 'transparent', borderColor: this.rightColor}
        ]
      }
      else if (displayNew === "Volume"){
        this.chartData = [
          { data: this.leftDataSet.volume, label: `${this.leftDataSet.symbol}`, backgroundColor: 'transparent', borderColor: this.leftColor },
          { data: this.rightDataSet.volume, label: `${this.rightDataSet.symbol}`, backgroundColor: 'transparent', borderColor: this.rightColor}
        ]
      }
    }
  }

  async toggleSet(){
    await this.makeSets(this.setToDisplay);
    let t = await this.test();
    console.log("test finished:", t);
  }

  async toggleTime(){
    if (this.timespanToDisplay == "1Year"){
      await this.dataOneYear();
    }
    else if (this.timespanToDisplay == "1Month"){
      await this.handleData("1m");
    }
    else if (this.timespanToDisplay == "3Month"){
      await this.handleData("3m");
    }
    else if (this.timespanToDisplay == "5Year"){
      await this.handleData("5y");
    }
  }

  // if statement is on change, catch the undefineed and cont. is first changes in if/else happens once
  async ngOnChanges(changes: SimpleChanges){
    console.log(changes);
    if (changes.left === undefined || changes.right === undefined) console.log("hi");
    else if (changes.left.isFirstChange() && changes.right.isFirstChange()) return;
    this.labels = [];
    this.chartData = [];
    await this.toggleTime();
  }

  async test(){
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve("waiting..."), 2000)
    });
    return promise;
  }

  public monthLineOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    legend : {
      labels : {
        fontColor : 'whitesmoke',
        fontSize: 14  
      }
    },
    elements: {
      line: {
        tension: 0,
        fill: false
      },
      point: {
        radius: 0
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [
        {
          ticks: {
            fontColor: 'white',
          },
          scaleLabel: {
            display: true,
            labelString: 'Date',
            fontColor: 'lightblue',
            fontSize: 18
          },
          gridLines: {
            color: 'turquoise'
          }
        }
      ],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          ticks: {
            fontColor: 'white',
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: 'Price ($)',
            fontColor: 'lightblue',
            fontSize: 18
          },
          gridLines: {
            color: 'turquoise'
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'white',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'white',
            content: 'LineAnno'
          }
        },
      ],
    },
    title : {
      text: `Previous Month Data`,
      display: true,
      fontColor: 'lightblue',
      fontSize: 20
    },
    plugins: {
      datalabels: {
        display: false,
        formatter: function(value){
          return `$${value}`;
        },
      }
    }
  };

}
