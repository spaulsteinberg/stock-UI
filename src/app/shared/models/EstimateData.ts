import { IEstimate } from '../interfaces/IEstimate';

export class EstimateData {
    symbols:string[] = [];
    announceTime:string[] = [];
    consensusEPS:number[] = [];
    currency:string[] = [];
    fiscalEndDate:string[] = [];
    fiscalPeriod:string[] =[];
    numberOfEstimates:number[] = [];
    reportDate:string[] = [];

    public createNewSets(estimates:IEstimate[]){
        for (let estimate of estimates){
            this.symbols.push(estimate.estimates.symbol);
            for (const [key, value] of Object.entries(estimate.estimates.estimates)){
                this.announceTime.push(value["announceTime"]);
                this.consensusEPS.push(value["consensusEPS"]);
                this.currency.push(value["currency"]);
                this.fiscalEndDate.push(value["fiscalEndDate"]);
                this.fiscalPeriod.push(value["fiscalPeriod"]);
                this.numberOfEstimates.push(value["numberOfEstimates"]);
                this.reportDate.push(value["reportDate"]);
            }
        }
        return [
            this.symbols, 
            this.announceTime, 
            this.consensusEPS, 
            this.currency, 
            this.fiscalEndDate, 
            this.fiscalPeriod,
            this.numberOfEstimates,
            this.reportDate
        ];
    }
}