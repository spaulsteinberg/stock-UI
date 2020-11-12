export class CalendarObject {
    title:string;
    date:any;
    constructor(s:string, d:any){
        this.title = s;
        this.date = d;
    }
}

export class CalendarContainer {
    calendarObjects: CalendarObject[];
    errorObjects:string[];
    constructor(){
        this.calendarObjects = [];
        this.errorObjects = [];
    }
}