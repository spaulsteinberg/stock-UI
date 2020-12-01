export class AddAccountRequest {
    name:string;
    accounts:Account;
    constructor(name:string | null, acc:Account | null){
        if (name !== null) this.name = name;
        if (acc !== null) this.accounts = acc;
    }

    public createNewAddAccountRequest(name:string, symbol:string, numShares:number, price:number, date:string): AddAccountRequest{
        let accounts = this.configSubStructures(name, symbol, numShares, price, date)
        return new AddAccountRequest(name, accounts);
    }
    protected configSubStructures(name:string, symbol:string, numShares:number, price:number, date:string):Account {
        let attributes = new AttributeData(numShares, date, price);
        let data = new AccountData(symbol, attributes);
        return new Account(name, data);
    }
}

class Account {
    name:string;
    data:AccountData[] = new Array();
    constructor(n:string, data:AccountData){
        this.name = n;
        this.data.push(data);
    }
}

class AccountData {
    symbol:string;
    values:AttributeData[] = new Array();
    constructor(sym:string, vals:AttributeData){
        this.symbol = sym;
        this.values.push(vals);
    }
}

class AttributeData {
    position:number;
    dateOfBuy:string;
    priceOfBuy:number;
    constructor(p:number, d:string, pr:number){
        this.position = p;
        this.dateOfBuy = d;
        this.priceOfBuy = pr;
    }
}