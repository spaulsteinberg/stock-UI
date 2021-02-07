export class PortfolioStatistics {
    totalPortfolioValue:number;
    totalAccountsInPortfolio:number;
    accountTotalsMap:Map<string, Map<string, PositionAccumulation>> = new Map<string, Map<string, PositionAccumulation>>();
    positionTotalsMap:Map<string, PositionAccumulation> = new Map<string, PositionAccumulation>();
    constructor(totalValue:number, totalAccounts:number, accMap:Map<string, Map<string, PositionAccumulation>>, portMap:Map<string, PositionAccumulation>){
        this.totalPortfolioValue = totalValue;
        this.totalAccountsInPortfolio = totalAccounts;
        this.accountTotalsMap = accMap;
        this.positionTotalsMap = portMap;
    }
}

export class PositionAccumulation {
    numShares:number;
    totalValue:number;
    constructor(n:number, t:number){
        this.numShares = n;
        this.totalValue = t;
    }
}