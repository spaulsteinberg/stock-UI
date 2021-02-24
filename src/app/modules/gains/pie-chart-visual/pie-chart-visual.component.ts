import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Datum, IDatum } from 'src/app/shared/interfaces/IDatum';
import { PortfolioStatistics } from 'src/app/shared/models/PortfolioStatisticsModel';
import { UtilsService } from 'src/app/shared/services/utilities/utils.service';
@Component({
  selector: 'app-pie-chart-visual',
  templateUrl: './pie-chart-visual.component.html',
  styleUrls: ['./pie-chart-visual.component.css']
})
export class PieChartVisualComponent implements OnInit {

  @Input('accountTotalValueList') accountValues;
  @Input('portfolioTotalValueList') portfolioValues;
  @Input('portfolioStatisticsWrapper') portfolioStatisticsWrapper:PortfolioStatistics;
  constructor(private utils: UtilsService) { }

  formatter:Intl.NumberFormat;
  WIDTH:number = Math.floor(window.screen.width * .45);
  HEIGHT:number = Math.floor(window.screen.height * .4);
  MARGIN:number = Math.floor(window.screen.height * .04);
  RADIUS:number = Math.min(this.WIDTH, this.HEIGHT) / 2 - this.MARGIN;
  FLAGS = {ACCOUNT: 1, PORTFOLIO: 2};
  ngOnInit(): void {
    this.formatter = this.utils.numberToCurrency();
  }
  // segments of this code derived from d3.js site examples and modified to needs
  private createAccountsSvg = (flag:number) => {
    let areaSelection = "";
    let data:Datum[] = new Array<Datum>();
    console.log("FLAGS", flag)
    //total portfolio
    if (flag === 1){
      areaSelection = "#chart-area-1";
      this.accountValues.forEach(element => {
        data.push(new Datum(element))
      })
    }
    //individual stocks
    else if (flag === 2){
      areaSelection = "#chart-area-2";
      let chartArr = this.portfolioValues;
      chartArr.forEach(element => {
        element[0] = `${element[0]} (${((element[1] / this.portfolioStatisticsWrapper.totalPortfolioValue) * 100).toFixed(2)}%)`;
        data.push(new Datum(element))
      })
      data = data.length < 5 ? data : data.slice(0, 5);
    }
    let svg = d3.select(areaSelection)
      .append("svg")
        .attr("width", this.WIDTH)
        .attr("height", this.HEIGHT)
      .append("g")
        .attr("transform", "translate(" + this.WIDTH / 2 + "," + this.HEIGHT / 2 + ")");

    let color = d3.scaleOrdinal()
      .domain(data.map(_ => _.k))
      .range(d3.schemeDark2);

    let pie = d3.pie<IDatum>()
      .sort(null)
      .value(d => d.amount)

    let data_ready = pie(data)

    let arc = d3.arc<IDatum>()
      .innerRadius(this.RADIUS * 0.5)
      .outerRadius(this.RADIUS * 0.8)

    // Labels positioning
    let outerArc = d3.arc<IDatum>()
      .innerRadius(this.RADIUS * 0.9)
      .outerRadius(this.RADIUS * 0.9)

    svg
      .selectAll('allSlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', <any>arc)
      .attr('fill', (d:any):any => color(d.data.k))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)

      svg.append("text")
      .attr("x", 0)             
      .attr("y", -2.5 * .175 * this.HEIGHT)
      .attr("text-anchor", "middle")  
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .text(flag === 1 ? "Portfolio Accounts" : "My Top 5 Positions");

    svg
      .selectAll('allPolylines')
      .data(data_ready)
      .enter()
      .append('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', (d:any):any => {
          let posA = arc.centroid(d)
          let posB = outerArc.centroid(d)
          let posC = outerArc.centroid(d);
          let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          posC[0] = this.RADIUS * 0.95 * (midangle < Math.PI ? 1 : -1);
          return [posA, posB, posC]
        })

    svg
      .selectAll('allLabels')
      .data(data_ready)
      .enter()
      .append('text')
        .text(d => this.formatter.format(d.data.amount))
        .attr('transform', (d:any) => {
            let pos = outerArc.centroid(d);
            let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = this.RADIUS * 0.99 * (midangle < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
        })
        .style('text-anchor', d => ((d.startAngle + (d.endAngle - d.startAngle) / 2) < Math.PI ? 'start' : 'end'))

    svg.selectAll("myLegendDots")
      .data(data.map(_ => _.k))
      .enter()
        .append("circle")
        .attr("cx", 180)
        .attr("cy", (d, i) => flag === 1 ? -150 + 25*i : -50 + 25*i)
        .attr("r", 7)
        .attr('fill', (d:any):any => (color(d)))

    svg.selectAll("mylabels")
    .data(data.map(_ => _.k))
    .enter()
    .append("text")
      .attr("x", 200)
      .attr("y", (d, i) => flag === 1 ? -150 + 25*i : -50 + 25*i)
      .style("fill", (d:any):any => color(d))
      .text(d => d)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
  }

  ngAfterViewInit(){
    this.createAccountsSvg(this.FLAGS.ACCOUNT);
    this.createAccountsSvg(this.FLAGS.PORTFOLIO);
    console.log("after view")
  }

}
