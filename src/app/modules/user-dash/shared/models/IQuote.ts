export class IQuote {
    companyName:string;
    symbol:string;
    iexRealtimePrice:number;
    change:number;
    changePercent:number;
    latestPrice:number;

    constructor(comp:string, s:string, i:number, c:number, ch:number, lp:number){
        this.companyName = comp;
        this.symbol = s;
        this.iexRealtimePrice = i;
        this.change = c;
        this.changePercent = ch;
        this.latestPrice = lp;
    }
}