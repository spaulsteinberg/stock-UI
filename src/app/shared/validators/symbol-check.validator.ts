import { AbstractControl, ValidatorFn } from '@angular/forms';

//factory function to allow sending the list to validator
export function checkIfSymbolIsValid(listOfsymbols:string[]): ValidatorFn {
    console.log("LIST", listOfsymbols)
    return (control: AbstractControl): {[key:string]: boolean} | null => {
        if (control.value !== null && control.value !== undefined){
            const symbol = control.value.toUpperCase();
            return listOfsymbols.indexOf(symbol) < 0 ? { "OK" : false} : null;
        }
    }
}