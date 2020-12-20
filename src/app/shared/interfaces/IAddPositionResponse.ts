export interface IAddAccountResponse{
    status:number;
    msg:string;
    details:IDetails[];
}

export interface IDetails {
    data:IData[];
    name:string
}

interface IData {
    values:IValues[];
    symbol:string;
}

interface IValues {
    postion:number;
    dateOfBuy:string;
    priceOfBuy:number;
}