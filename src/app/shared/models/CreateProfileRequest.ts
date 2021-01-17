import { AddAccountRequest } from "./AddAccountRequest";

export class CreateProfileRequest {
    accountNames:string[];
    accounts:AddAccountRequest;

    constructor(name:string, account){
        this.accountNames.push(name);
        this.accounts = account;
    }
}