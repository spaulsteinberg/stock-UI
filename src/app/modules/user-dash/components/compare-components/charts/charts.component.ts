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
  leftDataSet;
  rightDataSet;
  ngOnInit(): void {
    this.handleData();
  }

  handleData(){
    this.leftDataSet = new ViewChartHistoricalData(this.left);
    this.rightDataSet = new ViewChartHistoricalData(this.right)
    const symbols = this.left + "," + this.right;
    console.log("Symbols are", symbols);
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

  private makeSets(){
    this.labels = this.leftDataSet.date;
    this.chartData = [
      { data: this.leftDataSet.close, label: `${this.leftDataSet.symbol}`, backgroundColor: 'transparent', borderColor: 'red' },
      { data: this.rightDataSet.close, label: `${this.rightDataSet.symbol}`, backgroundColor: 'transparent', borderColor: 'green'}
    ]
  }

  // if statement is on change, catch the undefineed and cont. is first changes in if/else happens once
  ngOnChanges(changes: SimpleChanges){
    console.log(changes);
    if (changes.left === undefined || changes.right === undefined) console.log("hi");
    else if (changes.left.isFirstChange() && changes.right.isFirstChange()) return;
    this.labels = [];
    this.chartData = [];
    this.handleData();
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
