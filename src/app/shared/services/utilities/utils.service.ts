import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public dateFilter = (date) => { return date.getDay() !== 0 && date.getDay() !== 6; }

  public convertToSlashes(date):string{
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDay();
    return `${year}-${month}-${day}`;
  }
}
