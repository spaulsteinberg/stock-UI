export class AddPositionRequest {
    name:string;
    symbol:string;
    data:Attributes;
    constructor(name:string, symbol:string, obj:any){
        this.name = name;
        this.symbol = symbol;
        this.data = new Attributes(obj);
    }
}

class Attributes {
    position:number;
    priceOfBuy:number;
    dateOfBuy:string;
    constructor(obj?:any){
        Object.assign(this, obj);
    }
}