export class ViewChartData {
    close:number[] = [];
    open:number[] = [];
    high:number[] = [];
    low:number[] = [];
    date:string[] = [];

    pushData = (close, open, high, low, date) => {
        this.close.push(close);
        this.open.push(open);
        this.high.push(high);
        this.low.push(low);
        this.date.push(date);
    }
}