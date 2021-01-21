import { AddAccountRequest } from "./AddAccountRequest";
import { AddPositionRequest } from "./AddPositionRequest";

export class CreateProfileRequest {
    accountNames:string[];
    accounts:ProfileAccountObject;

    constructor(name:string, account:object){
        this.accountNames = new Array<string>(name);
        this.accounts = this.createInnerObjects(account);
    }

    public createInnerObjects(account:object){
        let {name, symbol, position, priceOfBuy, dateOfBuy}:any = account;
        let accountAtttibutes = new ProfileAttributeData(position, dateOfBuy, priceOfBuy);
        let accountData = new ProfileAccountData(symbol, accountAtttibutes);
        return new ProfileAccountObject(name, accountData);
    }
}

export class ProfileAccountObject {
    name:string;
    data:ProfileAccountData[] = new Array<ProfileAccountData>();
    constructor(n:string, data:ProfileAccountData){
        this.name = n;
        this.data.push(data);
    }
}

export class ProfileAccountData {
    symbol:string;
    values:ProfileAttributeData[] = new Array();
    constructor(sym:string, vals:ProfileAttributeData){
        this.symbol = sym;
        this.values.push(vals);
    }
}
export class ProfileAttributeData {
    position:number;
    dateOfBuy:string;
    priceOfBuy:number;
    constructor(p:number, d:string, pr:number){
        this.position = p;
        this.dateOfBuy = d;
        this.priceOfBuy = pr;
    }
}