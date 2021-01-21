import { DetailAttributes, IAccount } from "./IAccount";

export interface ICreateProfileResponse {
    code:number;
    msg:string;
    accountNames:string[];
    accounts:DetailAttributes;
}