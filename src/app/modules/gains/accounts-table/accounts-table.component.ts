import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Data, DetailAttributes } from 'src/app/shared/interfaces/IAccount';

@Component({
  selector: 'app-accounts-table',
  templateUrl: './accounts-table.component.html',
  styleUrls: ['./accounts-table.component.css']
})
export class AccountsTableComponent implements OnInit {
  @Input('accountData') accountData:DetailAttributes;
  displayedColumns: string[] = ["symbol", "position", "price"]//, "shares", "price"]//, "date"];
  //dataSource$:Observable<any[]>;

  //behavior subject to listen to data changes
  // might want to make a separate, distinct structure for table usage
  private dataSubject:BehaviorSubject<Data[]>;
  dataObserv:Observable<Data[]>;
  constructor() {
    
   }

  ngOnInit(): void {
    console.log(this.accountData)
    console.log("Data:", this.accountData.data)
    this.dataSubject = new BehaviorSubject<Data[]>(this.accountData.data);
    this.dataObserv = this.dataSubject.asObservable();
  }

  getSubject(){
    return this.dataSubject;
  }
  print(toPrint){
    console.log(toPrint)
  }

  accumulateTotalPosition(symbol:string){
    return this.dataSubject.value.find(d => d.symbol === symbol).values.reduce(((tot, acc) => tot += acc.position), 0);
  }

  determineCostBasis(symbol:string){
    return this.dataSubject.value.find(d => d.symbol === symbol).values.reduce(((tot, acc) => tot += acc.priceOfBuy), 0);
  }
/*

CREATE SEPARATE STRUCTURE FOR TABLE WITH THESE METHODS

  getAvgPrice(symbol:string){
    let data = this.dataSource.data.find(d => { return d.symbol === symbol});
    let total = 0;
    data.values.forEach(element => {
      total += element.priceOfBuy;
    })
    return total / data.values.length;
  }
  condensePositions(symbol:string){
    let temp = this.dataSource.data.find(d => { return d.symbol === symbol});
    let total = 0;
    temp.values.forEach(element => {
      total += element.position;
    })
    return total;
  }
  */

  ngAfterViewInit(){
    //this.accountData.
  }

}
