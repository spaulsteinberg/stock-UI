import { Pipe, PipeTransform } from '@angular/core';
import { IQuote } from './interfaces/IQuote';

@Pipe({
  name: 'symbolFilter'
})
export class SymbolFilterPipe implements PipeTransform {

  transform(quotes: string[], toSearch:string): any {
      return quotes.filter(val => val.toLowerCase().startsWith(toSearch.toLowerCase()));
    }

}
