export class ViewChartData {
    close:number[] = [];
    date:string[] = [];

    pushData = (close, date) => {
        this.close.push(close);
        this.date.push(date);
    }
}