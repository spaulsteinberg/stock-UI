export class IQuote {
    companyName:string;
    symbol:string;
    iexRealtimePrice:number;
    change:number;
    changePercent:number;

    constructor(comp:string, s:string, i:number, c:number, ch:number){
        this.companyName = comp;
        this.symbol = s;
        this.iexRealtimePrice = i;
        this.change = c;
        this.changePercent = ch;
    }
}