export class NewsData {
    public datetime:number;
    public headline:string;
    public source:string;
    public url:string;
    public summary:string;
    public related:string; //this will be the symbol
    public image:string;
    public lang:string;
    public hasPaywall:boolean;

    constructor(symbol:string, data?:Partial<NewsData>){
        Object.assign(this, data);
    }
}