export class Dividend {
    symbol:string;
    dividends:attributes;

    setSymbol(s:string){
        this.symbol = s;
    }
}

class attributes {
    amount:string;
    currency:string;
    date:string;
    declaredDate:string;
    description:string;
    exDate:string;
    flag:string;
    frequency:string;
    paymentDate:string;
    recordDate:string;
}