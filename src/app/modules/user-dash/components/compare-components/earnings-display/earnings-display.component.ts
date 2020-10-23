import { Component, Input, OnInit } from '@angular/core';
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
  ngOnInit(): void {
    this.getEarnings();
  }
  //add a loading icon when finished
  getEarnings(){
    this.estimatesDisplay = new EstimateData();
    console.log(this.leftSymbol, this.rightSymbol);
    let el = "JPM";
    let ei = "ROKU";
    this._stocks.getNextEarningsReport("JPM,ROKU")
    .subscribe
    (data => {
      for (const [key, value] of Object.entries(data)){
        this.estimates.push(data[key]);
        console.log("Estimates", this.estimates)
      }
      this.estimatesDisplay.createNewSets(this.estimates);
      console.log(this.estimatesDisplay);
    },
    error => console.log(error),
    () => console.log("Done with earnings")
    );
  }

  //on changes call getEarnings again
  ngOnChanges(){

  }

}
