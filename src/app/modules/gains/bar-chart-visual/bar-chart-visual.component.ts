import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { scaleBand } from 'd3';
import { Datum } from 'src/app/shared/interfaces/IDatum';
import { UtilsService } from 'src/app/shared/services/utilities/utils.service';
@Component({
  selector: 'app-bar-chart-visual',
  templateUrl: './bar-chart-visual.component.html',
  styleUrls: ['./bar-chart-visual.component.css']
})
export class BarChartVisualComponent implements OnInit {

  @Input('accountTotalValueList') accountTotalValueList:any[][];
  @Input('portfolioTotalValueList') portfolioTotalValueList:any[][];
  formatter:Intl.NumberFormat;
  constructor(private utils: UtilsService) { 
    this.formatter = utils.numberToCurrency();
  }
  
  WIDTH:number = Math.floor(window.screen.width * .4);
  HEIGHT:number = Math.floor(window.screen.height * .5);
  MARGIN = { 
    LEFT: Math.floor(window.screen.height * .1), 
    RIGHT: Math.floor(window.screen.height * .08), 
    TOP: Math.floor(window.screen.height * .08), 
    BOTTOM: Math.floor(window.screen.height * .1)
  };
  FLAGS = {ACCOUNT: 1, PORTFOLIO: 2};

  private createSvg = () => {
    const svg = d3.select("#chart-area")
      .append("svg")
        .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM)
        .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT);
 
    // structure data
    const _data:Datum[] = new Array<Datum>();
    this.accountTotalValueList.forEach(element => _data.push(new Datum(element)));
    const maxAmount = Math.max(..._data.map(_ => _.amount))

    // create group where chart will do
    const g = svg.append("g")
      .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);

    // x label
    const xLabel = g.append("text")
    .attr("class", "x axis-label")
    .attr("x", this.WIDTH / 2)
    .attr("y", this.HEIGHT + this.MARGIN.BOTTOM*.9)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Accounts")

    const yLabel = g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (this.HEIGHT / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Value")

    // returns a color between the two args, from [0, 1]
  //  let color = 

    // x and y scales
    const x = d3.scaleBand()
      .domain(this.accountTotalValueList.map(_ => _[0]))
      .range([0, this.WIDTH])
      .paddingInner(0.3)
      .paddingOuter(0.2)

    const y = d3.scaleLinear()
      .domain([0, maxAmount])
      .range([this.HEIGHT, 0]);

    // create calls for x and y
    const xAxisCall = d3.axisBottom(x);
    const yAxisCall = d3.axisLeft(y)
      .tickFormat(d => `$${d}`);
     
    // create x and y axis
    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${this.HEIGHT})`)
        .call(xAxisCall)
        .selectAll("text")
            .attr("y", 10)
            .attr("x", -5)
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)")

    g.append("g")
        .attr("class", "y-axis")
        .call(yAxisCall)

    // enter() data
    const dataPoints = g.selectAll("rect");

    // create bar rectangles, enter data first then add new group to enable adding the labels
    const rects = dataPoints
    .data(_data)
    .enter()
    .append("g")

    rects.append("rect")
    .attr("x", (item) => x(item.k))
    .attr("y", (item) => y(item.amount))
    .attr("width", x.bandwidth) // bandwidth of scale is now the width
    .attr("height", (item) => this.HEIGHT - y(item.amount))
    .attr('fill', d => d3.interpolatePuBuGn(d.amount / maxAmount))
    .attr("opacity", .7)

    rects.append("text")
    .text((d:any) => {
      console.log(d)
      return `${this.formatter.format(d.amount)}`;
    })
    .attr("x", (d:any) => x(d.k) + x.bandwidth()/2)
    .attr("y", (d:any) => y(d.amount) - 5)
    .attr("font-family" , "sans-serif")
    .attr("font-size" , "14px")
    .attr("fill" , "black")
    .attr("text-anchor", "middle");
  }

  ngAfterViewInit(){
    console.log(this.accountTotalValueList)
    console.log(this.portfolioTotalValueList)
    this.createSvg();
  }

  ngOnInit(): void {
  }

}
