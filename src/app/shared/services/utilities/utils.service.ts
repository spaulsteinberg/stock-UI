import { Injectable } from '@angular/core';
import { AccountsService } from '../accounts.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public dateFilter = (date) => { return date.getDay() !== 0 && date.getDay() !== 6; }

  public convertToSlashes(date):string{
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1; //months are 0-11
    const day = d.getDate();
    console.log("date:", d, "year", year, "month", month, "day", day)
    return `${year}-${month}-${day}`;
  }

}
