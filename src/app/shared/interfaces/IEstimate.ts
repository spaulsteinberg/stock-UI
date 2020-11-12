export interface IEstimate {
    estimates:estimate;
}

class estimate {
    estimates:attributes[] = [];
    symbol:string;
}

class attributes {
    announceTime:string;
    consensusEPS:number;
    currency:string;
    fiscalEndDate:string;
    fiscalPeriod:string;
    numberOfEstimates:number;
    reportDate:string;
}