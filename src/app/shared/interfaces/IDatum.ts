export interface IDatum {
    k:string;
    amount:number;
}

export class Datum implements IDatum {
    k:string;
    amount:number;

    constructor(inputTupleArrayElement:any[]){
        this.k = inputTupleArrayElement[0];
        this.amount = inputTupleArrayElement[1];
    }
}