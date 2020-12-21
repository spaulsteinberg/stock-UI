import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Data, DetailAttributes, Values } from 'src/app/shared/interfaces/IAccount';
import { AccountsService } from 'src/app/shared/services/accounts.service';

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
  displayedColumns: string[] = ["symbol", "position", "price", "cost-basis"]
  expandedElement:Data | null;

  //behavior subject to listen to data changes
  // might want to make a separate, distinct structure for table usage
  dataObserv:Observable<Data[]>;
  upDownIcon = "keyboard_arrow_up";
  innerColumns:string[] = ["openDate", "position", "sharePrice"];
  constructor(private cdr : ChangeDetectorRef, private accounts: AccountsService) {
    
   }

  ngOnInit(): void {
    console.log(this.accountData)
    console.log("Data:", this.accountData.data)
    this.accounts.initTableSubject(this.accountData.data);
    this.dataObserv = this.accounts.tableData$; //tableData$ is an observale of the table data subject
  }

  getSubject(){
    return this.accounts.tableDataSubject;
  }

  // return the data at the symbol
  curVals(s:string):Data{
    return this.accounts.tableDataSubject.value.find(_ => _.symbol === s);
  }

  accumulateTotalPosition(symbol:string){
    return this.curVals(symbol).values.reduce(((tot, acc) => tot += acc.position), 0);
  }

  determineCostBasis(symbol:string){
    return this.determineAvgPriceOfShare(symbol) * this.accumulateTotalPosition(symbol);
  }

  determineAvgPriceOfShare(symbol:string){
    let totPrice = 0;
    let totAccumulated = 0;
    const values = this.curVals(symbol).values;
    for (let i = 0; i < values.length; i++){
      totPrice += (values[i].priceOfBuy * values[i].position)
      totAccumulated += values[i].position;
    }
    return (totPrice / totAccumulated)
  //  return (this.curVals(symbol).values.reduce(((tot, acc) => tot += (acc.priceOfBuy*acc.position)), 0) / this.curVals(symbol).values.length).toFixed(2);
  }
  
  generateExpansionArray(symbol:string):Array<Values>{
    return this.curVals(symbol).values.sort((a, b) => this.sortDates(a.dateOfBuy, b.dateOfBuy));
  }

  sortDates(date1:string, date2:string){
    let a = new Date(date1);
    let b = new Date(date2);
    return (b.getTime() - a.getTime());
  }

  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }

}
