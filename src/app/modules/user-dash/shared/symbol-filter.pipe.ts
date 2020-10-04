import { Pipe, PipeTransform } from '@angular/core';
import { IQuote } from './models/IQuote';

@Pipe({
  name: 'symbolFilter'
})
export class SymbolFilterPipe implements PipeTransform {

  transform(quotes: string[], toSearch:string): any {
      return quotes.filter(val => val.toLowerCase().includes(toSearch));
    }

}
