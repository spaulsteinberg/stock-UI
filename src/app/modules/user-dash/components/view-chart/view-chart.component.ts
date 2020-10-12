import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { ListServiceService } from '../../shared/services/list-service.service';
import { catchError } from 'rxjs/internal/operators';
import { ViewChartData } from '../../shared/models/ViewChartData';

@Component({
  selector: 'app-view-chart',
  templateUrl: './view-chart.component.html',
  styleUrls: ['./view-chart.component.css']
})
export class ViewChartComponent implements OnInit {
  @Input('symb')
  symbolToSearch = '';
  constructor(private _stocks : ListServiceService) { }

  dataToInsertInChart:ViewChartData = new ViewChartData();
  isFinishedLoading:boolean = false;
  isError:boolean = false;
  errorMessage:string;
  closeCheck:boolean = true;
  openCheck:boolean = false;
  highCheck:boolean = false;
  lowCheck:boolean = false;
  close:boolean;
  open:boolean;
  high:boolean;
  low:boolean;
  public monthData = [];
  public labels = [];
  public monthDataLineChart: ChartDataSets[] = [];
  public monthLineLabels: Label[] = [];
  public type= "line";
  public legend = true;

  ngOnInit(): void {
    this.close = this.closeCheck;
    this.open = this.openCheck;
    this.high = this.highCheck;
    this.low = this.lowCheck;
    this.getChartData();
  }

  //make call to get chart data. comes in as an IHistoricalQuote and is processed into the chart as ViewChartData
  getChartData(){
    console.log(this.symbolToSearch);
    if (this.symbolToSearch !== '' && this.symbolToSearch !== undefined && this.symbolToSearch !== null){
      this._stocks.getOneYearData(this.symbolToSearch)
      .pipe(catchError(this._stocks.errorOnHistoricalData))
      .subscribe(
        response => {
          console.log(response);
          response.forEach(quote => {
            this.monthData.push(quote);
            this.dataToInsertInChart.pushData(quote.close, quote.date);
          })
        },
        error => {
          this.isError = true;
          this.errorMessage = error;
        },
        () => {
          this.createDataSets();
          this.isFinishedLoading = true;
          this.monthLineOptions.title.text = `${this.symbolToSearch} Previous Month Data`
        }
      );
    }
  }

  // listen for changes to input from parent
  ngOnChanges(changes: SimpleChanges){
    console.log(changes);
    if (changes.symbolToSearch.currentValue !== changes.symbolToSearch.previousValue && changes.symbolToSearch.isFirstChange() === false){
      this.monthData = [];
      this.labels = [];
      this.monthDataLineChart = [];
      this.monthLineLabels = [];
      this.dataToInsertInChart = new ViewChartData();
      this.getChartData();
    }
  }
  
  //create chart datasets
  createDataSets(){
    this.labels = this.dataToInsertInChart.date;
    this.monthDataLineChart = [
      { data: this.dataToInsertInChart.close, label: "Close Price", backgroundColor: 'transparent', borderColor: 'red' }
    ]
  }

  processCheckBoxEvent(event){
    console.log(event);
    console.log(this.close, this.open, this.high, this.low);
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
            fontColor: 'white'
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
