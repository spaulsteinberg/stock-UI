import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Data, DetailAttributes, Values } from 'src/app/shared/interfaces/IAccount';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { RemovePositionRequest } from 'src/app/shared/models/RemovePositionRequest';
import { AddPositionRequest } from 'src/app/shared/models/AddPositionRequest';
import { UtilsService } from 'src/app/shared/services/utilities/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { PositionDialogComponent } from '../position-dialog/position-dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogEnum } from 'src/app/shared/services/utilities/DialogEnum';

@Component({
  selector: 'app-accounts-table',
  templateUrl: './accounts-table.component.html',
  styleUrls: ['./accounts-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AccountsTableComponent implements OnInit {
  @Input('accountData') accountData:DetailAttributes;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ["symbol", "position", "price", "cost-basis"]
  expandedElement:Data | null;

  //behavior subject to listen to data changes
  // might want to make a separate, distinct structure for table usage
  dataObserv:Observable<Data[]>;
  upDownIcon = "keyboard_arrow_up";
  innerColumns:string[] = ["openDate", "position", "sharePrice", "actions"];
  paginatorOptionsArray:Array<number> = [5, 10, 15];
  constructor
  (private cdr : ChangeDetectorRef,
   private accounts: AccountsService,
   private utils: UtilsService,
   private dialog: MatDialog) { }

  dataSource = new MatTableDataSource<Data>();
  addFromTableFlag = DialogEnum.ADD_FROM_TABLE;
  removeFromTableFlag = DialogEnum.REMOVE_FROM_TABLE;
  ngOnInit(): void {
    console.log(this.accountData)
    console.log("Data:", this.accountData.data)
    this.accounts.initTableSubject(this.accountData.data); // initialize the subject in service
    this.dataObserv = this.accounts.tableData$; //tableData$ is an observale of the table data subject
    this.dataSource.data = this.accountData.data;
    this.dataSource.paginator = this.paginator;
  //  this.dataSource.filterPredicate = (data: Data, filter:string) => data.symbol.startsWith(filter);
  }

  // let accounts page (parent) access subject
  getSubject(){
    return this.accounts.tableDataSubject;
  }

  getDataSource():MatTableDataSource<Data>{
    return this.dataSource
  }

  // return the data at the symbol
  curVals(s:string):Data{
    return this.accounts.tableDataSubject.value.find(_ => _.symbol === s);
  }

  accumulateTotalPosition(symbol:string){
    if(this.curVals(symbol) === undefined) return;
    try {
      return this.curVals(symbol).values.reduce(((tot, acc) => tot += acc.position), 0);
    }catch (err){
      console.log("ERR ACCUMULATING TOTAL POSITION", err)
    }
  }

  determineCostBasis(symbol:string){
    if(this.curVals(symbol) === undefined) return;
    try {
      return this.determineAvgPriceOfShare(symbol) * this.accumulateTotalPosition(symbol);
    }
    catch (err){
      console.log("err in cost basis")
    }
  }

  determineAvgPriceOfShare(symbol:string){
    if(this.curVals(symbol) === undefined) return;
    try {
      let totPrice = 0;
      let totAccumulated = 0;
      const values = this.curVals(symbol).values;
      for (let i = 0; i < values.length; i++){
        totPrice += (values[i].priceOfBuy * values[i].position)
        totAccumulated += values[i].position;
      }
      return (totPrice / totAccumulated)
    }
    catch (err) { console.log("err in avg share")}
  //  return (this.curVals(symbol).values.reduce(((tot, acc) => tot += (acc.priceOfBuy*acc.position)), 0) / this.curVals(symbol).values.length).toFixed(2);
  }
  
  generateExpansionArray(symbol:string):Array<Values>{
    if(this.curVals(symbol) === undefined) return;
    try {
      return this.curVals(symbol).values.sort((a, b) => this.sortDates(a.dateOfBuy, b.dateOfBuy));
    }catch (err) {}
  }

  sortDates(date1:string, date2:string){
    let a = new Date(date1);
    let b = new Date(date2);
    return (b.getTime() - a.getTime());
  }

  // keep track of symbol of expanded row
  symbolContext:string;
  createContext(row){
    this.symbolContext = row;
  }

  openDeleteDialog = (element, flag) => {
    const raw = {
      name: this.accountData.name,
      symbol: this.symbolContext,
      position: element.position,
      date: element.dateOfBuy,
      price: element.priceOfBuy
    }
    const model = new RemovePositionRequest(raw)
    let dialogRef = this.dialog.open(PositionDialogComponent, {data: {
      flag: flag,
      accountName: model.name,
      obj: model
    }});
    dialogRef.afterClosed().subscribe({
      next: (data) => {
        // data will come back undefined if user clicks out with entering data
        if (data !== undefined){
          console.log("Data recieved back:", data.data)
          this.dataSource.data = data.data;
        }
      }
    })
  }

  openAddDialog = (element, flag) => {
    let dialogRef = this.dialog.open(PositionDialogComponent, {data: {
      flag: flag,
      accountName: this.accountData.name,
      priceOfBuy: element.priceOfBuy,
      dateOfBuy: element.dateOfBuy,
      symbol: this.symbolContext.toUpperCase()
    }});
    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data !== undefined){
          console.log("Data recieved back:", data.data)
          this.dataSource.data = data.data;
        }
      }
    })
  }

  tooltipProperties = {
    tooltipPosition: "above",
    tooltipAddPosition: "Add a position to account",
    tooltipRemovePosition: "Remove a position from account",
    showDelay: 3000
  };

  // get total value in account
  getTotalAccountValue(){
    const dataArr = this.accounts.tableDataSubject.value;
    let total = 0;
    for (const element of dataArr){
      for (const val of element.values){
        total += (val.position*val.priceOfBuy);
      }
    }
    return total.toFixed(2);
  }

  // get nearest multiple of 5 for paginator...if over 100 cap it
  getPaginatorCeiling():Array<number>{
    const len = this.accountData.data.length;
    let temp = []
    if (len <= 5) return [5];
    for (let i = 0; i < len; i++){
      if (i%5 == 0 && i != 0) temp.push(i);
    }
    if (len < 100){
      let ceil = Math.ceil(len/5.0) * 5;
      return [...temp, ceil]
    }
    else return [...temp, 100]
  }

  applyFilter(filterValue:string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }

}
