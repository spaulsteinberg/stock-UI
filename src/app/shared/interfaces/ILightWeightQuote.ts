export interface ILightWeightQuote {
    symbol:string;
    sector:string;
    securityType:string;
    bidPrice:number;
    bidSize:number;
    askPrice:number;
    askSize:number;
    lastUpdated:string;
    lastSalePrice:number;
    lastSaleSize:number;
    lastSaleTime:number;
    volume:number;
    marketPercent:number;
}