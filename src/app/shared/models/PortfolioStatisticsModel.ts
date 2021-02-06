export class PortfolioStatistics {
    totalPorfolioValue:number;
    totalAccountsInPortfolio:number;
    positionTotals:Map<string, PositionAccumulation>;
    constructor(totalValue:number, totalAccounts:number, map:Map<string, PositionAccumulation>){
        this.totalPorfolioValue = totalValue;
        this.totalAccountsInPortfolio = totalAccounts;
        this.positionTotals = map;
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