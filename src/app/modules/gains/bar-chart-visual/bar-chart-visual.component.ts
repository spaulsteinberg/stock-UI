import { DepFlags } from '@angular/compiler/src/core';
import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { scaleBand } from 'd3';
import { Datum } from 'src/app/shared/interfaces/IDatum';
import { PortfolioStatistics } from 'src/app/shared/models/PortfolioStatisticsModel';
import { UtilsService } from 'src/app/shared/services/utilities/utils.service';
@Component({
  selector: 'app-bar-chart-visual',
  templateUrl: './bar-chart-visual.component.html',
  styleUrls: ['./bar-chart-visual.component.css']
})
export class BarChartVisualComponent implements OnInit {

  @Input('accountTotalValueList') accountTotalValueList:any[][];
  @Input('portfolioTotalValueList') portfolioTotalValueList:any[][];
  @Input('portfolioStatisticsWrapper') portfolioStatisticsWrapper:PortfolioStatistics;
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
  public FLAGS = {ACCOUNT: "Accounts", PORTFOLIO: "Positions"};
  buttonGroupValue:string = this.FLAGS.ACCOUNT;
  svg:d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  g:d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  xAxisGroup:d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  yAxisGroup:d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  xLabel:d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
  yLabel:d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
  x:d3.ScaleBand<string>;
  y:d3.ScaleLinear<number, number, never>;

  private makeCanvas = (defaultChartValue:string) => {
    this.svg = d3.select("#chart-area")
      .append("svg")
        .attr("height", this.HEIGHT + this.MARGIN.TOP + this.MARGIN.BOTTOM)
        .attr("width", this.WIDTH + this.MARGIN.LEFT + this.MARGIN.RIGHT);

    // create group where chart will do
    this.g = this.svg.append("g")
      .attr("transform", `translate(${this.MARGIN.LEFT}, ${this.MARGIN.TOP})`);

    this.xAxisGroup = this.g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${this.HEIGHT})`);

    this.yAxisGroup = this.g.append("g")
      .attr("class", "y-axis")

    this.xLabel = this.g.append("text")
      .attr("class", "x axis-label")
      .attr("x", this.WIDTH / 2)
      .attr("y", this.HEIGHT + this.MARGIN.BOTTOM*.9)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle");

    this.yLabel = this.g.append("text")
      .attr("class", "y axis-label")
      .attr("x", - (this.HEIGHT / 2))
      .attr("y", -60)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")

    this.x = d3.scaleBand()
      .range([0, this.WIDTH])
      .paddingInner(0.3)
      .paddingOuter(0.2)

    this.y = d3.scaleLinear()
    .range([this.HEIGHT, 0])

    this.enterLabelText(defaultChartValue, defaultChartValue === this.FLAGS.ACCOUNT ? "Value" : "% of Portfolio")
  }

  private createSvg = (flag:string) => {
    console.log(`CREATE SVG PASSED FLAG ${flag}`)
    // structure data
    const transition = d3.transition().duration(1000)
    let _data:Datum[] = new Array<Datum>(),
        percentArr:number[] = new Array<number>(),
        maxPercent = 0;

    if (flag === this.FLAGS.ACCOUNT){
      this.accountTotalValueList.forEach(element => _data.push(new Datum(element)));
    }
    else {
      this.portfolioTotalValueList.forEach(element => {
        percentArr.push(parseFloat(((element[1] / this.portfolioStatisticsWrapper.totalPortfolioValue) * 100).toFixed(2)))
        _data.push(new Datum(element))
      });
    }

    _data = _data.length > 25 ? _data.slice(0, 24) : _data;
    const maxAmount = Math.max(..._data.map(_ => _.amount));
    if (percentArr.length > 0) maxPercent = Math.max(...percentArr)

    // x and y scales
    this.x.domain(_data.map(_ => _.k))

    if (flag === this.FLAGS.ACCOUNT) this.y.domain([0, maxAmount])
    else {
      console.log(`MAX PERCENT: ${maxPercent}`)
      this.y.domain([0, maxPercent > 70 ? 100 : maxPercent + 5])
    }
    // create calls for x and y
    const xAxisCall = d3.axisBottom(this.x);
    const yAxisCall = flag === this.FLAGS.ACCOUNT ? d3.axisLeft(this.y)
                                                    .tickFormat(d => `$${d}`)
                                                  : d3.axisLeft(this.y)
                                                    .tickFormat(d => `${d}`);
     
  // create x and y axis
    this.xAxisGroup.transition(transition)
      .call(xAxisCall)
      .selectAll("text")
          .attr("y", 10)
          .attr("x", -5)
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-40)")

    this.yAxisGroup.transition(transition).call(yAxisCall)

    // enter() data
    const dataPoints:any = this.g.selectAll("rect").data(_data, (d:Datum) => d.k);
    
    //remove old elements
    dataPoints.exit()
    .attr("fill", "orange")
    .attr("opacity", 0.6)
    .transition(transition)
        .attr("height", 0) // set height to 0
        .attr("y", this.y(0)) // move to pixel position at bottom of chart
        .remove();

    // create bar rectangles, enter data first then add new group to enable adding the labels
    const rects = dataPoints
      .enter()
      .append("g")
        .attr("class", "rectangle-group")

    // remove label text
    d3.selectAll(".rectangle-group").selectAll("text").transition(transition).text("");
    rects.append("rect")
      .attr("y", this.y(0))
      .attr('fill', d => d3.interpolatePuBuGn(d.amount / maxAmount))
      .attr("height", 0)
      .merge(dataPoints)
        .transition(transition)
        .attr("x", (item) => this.x(item.k))
        .attr("y", (item, index) => flag === this.FLAGS.ACCOUNT ? this.y(item.amount) : this.y(percentArr[index]))
        .attr("width", this.x.bandwidth) // bandwidth of scale is now the width
        .attr("height", (item, index) => flag === this.FLAGS.ACCOUNT ? this.HEIGHT - this.y(item.amount) : this.HEIGHT - this.y(percentArr[index]))

    rects.append("text")
    .attr("y", this.y(0))
    .attr("height", 0)
    .merge(dataPoints)
      .transition(transition)
      .text((d:Datum, i) => flag === this.FLAGS.ACCOUNT ? `${this.formatter.format(d.amount)}` : `${percentArr[i]}%`)
      .attr("x", (d:Datum) => this.x(d.k) + this.x.bandwidth()/2)
      .attr("y", (d:Datum, i) => flag === this.FLAGS.ACCOUNT ? this.y(d.amount) - 5 : this.y(percentArr[i]) - 5)
      .attr("font-family" , "sans-serif")
      .attr("font-size" , flag === this.FLAGS.ACCOUNT ? "14px" : "8px")
      .attr("fill" , "black")
      .attr("text-anchor", "middle");
  }

  // create x and y labels
  private enterLabelText = (xText:string, yText:string) => {
    this.xLabel.text(xText);
    this.yLabel.text(yText);
  }

  // on toggle change, change data
  public onSelectionChangeUpdate = (event) => {

    this.enterLabelText(event, event === this.FLAGS.ACCOUNT ? "Value" : "% of Portfolio")
    
    this.createSvg(event)
  }

  ngAfterViewInit(){
    this.makeCanvas(this.FLAGS.ACCOUNT);
    this.createSvg(this.FLAGS.ACCOUNT);
  }

  ngOnInit(): void {
  }

}
