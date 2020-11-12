import { ViewChartData } from './ViewChartData';

export class ViewChartHistoricalData extends ViewChartData {
    volume:number[] = [];
    symbol:string;
    _pushData = (close, open, high, low, date, volume) => {
        this.close.push(close);
        this.open.push(open);
        this.high.push(high);
        this.low.push(low);
        this.date.push(date);
        this.volume.push(volume);
    }

    constructor(s:string){
        super();
        this.symbol = s;
    }
}