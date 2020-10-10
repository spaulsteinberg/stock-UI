import { Component, Input, OnInit } from '@angular/core';
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
  ngOnInit(): void {
    this._stocks.getOneYearData(this.symbolToSearch)
    .pipe(catchError(this._stocks.errorOnHistoricalData))
    .subscribe(
      response => {
        response.forEach(quote => {
          this.monthData.push(quote);
          this.dataToInsertInChart.close.push(quote.close);
          this.dataToInsertInChart.date.push(quote.date);
        })
      },
      error => {
        this.isError = true;
        this.errorMessage = error;
      },
      () => {
        this.createDataSets();
        this.isFinishedLoading = true;
      }
    )
  }
  
  createDataSets(){
    this.labels = this.dataToInsertInChart.date;
    this.monthDataLineChart = [
      { data: this.dataToInsertInChart.close, label: "Close Price", backgroundColor: 'transparent', borderColor: 'red' }
    ]
  }
  public monthData = [];
  public labels = [];
  public monthDataLineChart: ChartDataSets[] = [];
  public monthLineLabels: Label[] = [];
  public type= "line";
  public legend = true;
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
            fontColor: 'whitesmoke',
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
            labelString: 'Price',
            fontColor: 'whitesmoke',
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
      text: `${this.symbolToSearch} Previous Month Data`,
      display: true,
      fontColor: 'whitesmoke',
      fontSize: 20
    },
    plugins: {
      datalabels: {
        display: false
      }
    }
  };
  
}
