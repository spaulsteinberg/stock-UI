export class RemovePositionRequest {
    name:string;
    symbol:string;
    position:number;
    date:string;
    price:number;
    constructor(obj?:any){
        Object.assign(this, obj);
    }
}