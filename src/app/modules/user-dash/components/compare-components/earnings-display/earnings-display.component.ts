import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { IEstimate } from '../../../shared/interfaces/IEstimate';
import { EstimateData } from '../../../shared/models/EstimateData';
import { ListServiceService } from '../../../shared/services/list-service.service';

@Component({
  selector: 'app-earnings-display',
  templateUrl: './earnings-display.component.html',
  styleUrls: ['./earnings-display.component.css']
})
export class EarningsDisplayComponent implements OnInit {

  @Input('left') leftSymbol;
  @Input('right') rightSymbol;
  
  constructor(private _stocks : ListServiceService) { }

  estimates:IEstimate[] = [];
  estimatesDisplay:EstimateData;
  isError:boolean = false;
  errMessage:string = '';
  ngOnInit(): void {
  }
  //add a loading icon when finished
  getEarnings(){
    if (this.rightSymbol === undefined || this.leftSymbol === undefined) return;
    this.estimates = [];
    this.estimatesDisplay = new EstimateData();
    console.log(this.leftSymbol, this.rightSymbol);
    this._stocks.getNextEarningsReport(`${this.leftSymbol},${this.rightSymbol}`)
    .subscribe
    (data => {
      console.log(data)
      for (const [key, value] of Object.entries(data)){
        this.estimates.push(data[key]);
        if(Object.keys(data[key].estimates).length === 0 && data[key].estimates.constructor === Object){
          this.isError = true;
          this.errMessage = "Object was empty";
          break;
        }
        else this.isError = false;
        console.log("Estimates", this.estimates)
      }
      console.log(this.isError)
      if(this.isError !== true) this.estimatesDisplay.createNewSets(this.estimates);
      console.log(this.estimatesDisplay);
    },
    error => {
      this.isError = true;
      this.errMessage = error;
    },
    () => console.log("Done with earnings")
    );
  }

  //on changes call getEarnings again
  ngOnChanges(changes:SimpleChanges){
    console.log("Earnings changes: ", changes);
    if (changes.left === undefined || changes.right === undefined) console.log("hi");
    else if (changes.left.isFirstChange() && changes.right.isFirstChange()) return;
    if (changes.left !== undefined) this.leftSymbol = changes.left.currentValue;
    if (changes.right !== undefined) this.rightSymbol = changes.right.currentValue;
   // if (changes.left !== undefined && changes.right !== undefined) this.getEarnings();
   this.getEarnings()
  }

}
