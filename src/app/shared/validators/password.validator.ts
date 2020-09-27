import { AbstractControl } from '@angular/forms';

export function validatePassword(control: AbstractControl): {[key:string]: any} | null {
    const userPass = control.value;
    if (!userPass || userPass === 'admin') return {'notValid': {value: 'Invalid Password'}};
    if (!userPass.includes('@')
        && !userPass.includes('!') 
        && !userPass.includes('#')
        && !userPass.includes('$')
        && !userPass.includes('%')) return {'notValid': {value: 'Must include at least one @!#$%'}};
    
    return null;
}