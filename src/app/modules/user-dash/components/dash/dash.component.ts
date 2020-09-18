import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/shared/services/dashboard.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {

  constructor(private _dash: DashboardService) { }
  watchList = [];
  isError:boolean = false;
  ngOnInit(): void {
    this._dash.getUserList()
    .subscribe(response => {
      if (response.stocksTracking !== null || response.stocksTracking !== undefined){
        this.watchList = response.stocksTracking;
      }
      else {
        console.log(response);
      }
      this.isError = false;
    },
    error => this.isError = true,
    () => console.log("Stock list req complete."));
  }

}
