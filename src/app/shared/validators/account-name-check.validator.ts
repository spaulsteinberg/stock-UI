import { AbstractControl } from '@angular/forms';

export function validateSameAccountNamesRemoveDialog(control: AbstractControl): {[key:string]: boolean} | null {
    return control.get('accountName').value !== control.get('confirmAccountName').value 
                ? {'nameMisMatch': true} : null;
}