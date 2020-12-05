export interface IAccount {
    names:string[];
    details:Details
}

export interface Details {
    data:DetailAttributes[];
}

export interface DetailAttributes {
    data:Data[];
    name:string;
}

export interface Data {
    values:Values[];
    symbol:string;
}

export interface Values {
    position:number;
    dateOfBuy:string;
    priceOfBuy:number;
}