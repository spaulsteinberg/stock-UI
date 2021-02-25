export interface IDatum {
    k:string;
    amount:number;
}

export class Datum implements IDatum {
    k:string;
    amount:number;

    constructor(inputTupleArrayElement:any[], altKey:string | null = null){
        this.k = altKey === null ? inputTupleArrayElement[0] : altKey;
        this.amount = inputTupleArrayElement[1];
    }
}