import { AccountsPageComponent } from 'src/app/modules/gains/accounts-page/accounts-page.component';
import { AccountsService } from '../services/accounts.service';

export interface IAddAccountRequest {
    name:string;
    accounts:Account;
}
interface Account {
    name:string;
    data:AccountData[];
}
interface AccountData {
    symbol:string;
    values:AttributeData[];
}

interface AttributeData {
    position:number;
    dateOfBuy:string;
    priceOfBuy:number;
}