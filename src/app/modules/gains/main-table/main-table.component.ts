import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-table',
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.component.css']
})
export class MainTableComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  testObj = [
    {
      symbol: "JPM",
      price: "finance",
      lastUpdated: "10-12-2020",
      volume: 30000,
      lastSale: 120.10,
      mybuy: undefined
    },
    {
      symbol: "ROKU",
      price: "media",
      lastUpdated: "10-12-2020",
      volume: 30001,
      lastSale: 220.10,
      mybuy: undefined
    }
  ];
  renderPrice(mock1, mock2){
    return (mock1 - mock2).toFixed(2);
  }

}
