export class AddPositionResponse{
    status:number;
    msg:string;
    details:PositionDetails[];
    constructor(obj?:any){
        Object.assign(this, obj);
    }
}

export class PositionDetails {
    data:PositionData[];
    name:string
}

class PositionData {
    values:PositionValues[];
    symbol:string;
}

class PositionValues {
    postion:number;
    dateOfBuy:string;
    priceOfBuy:number;
}