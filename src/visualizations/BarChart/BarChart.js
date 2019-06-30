import React, { Component } from "react";
import * as d3 from "d3";
import { getTicks } from '../../utils/label-utils';
import './BarChart.scss';
const margin = { top: 5, right: 5, bottom: 20, left: 45 };

class BarChart extends Component {
  state = {
    bars: [],
    yTickFormat: 1,
    yTickLabel: 'M',
  };

  xAxis = d3.axisBottom();
  yAxis = d3.axisLeft();

  static getDerivedStateFromProps(nextProps, prevState) {
    const { visData, width, height, dataProperty } = nextProps;

    if (!visData) return {};

    const countries = visData.map(d => d.country.value);
    const xScale = d3
      .scaleBand()
      .domain(countries)
      .range([margin.left, width - margin.right])
      .paddingInner(0.75)
      .paddingOuter(.4);

    const [yMin, yMax] = d3.extent(visData, d => d[dataProperty].value);
    const { format: yTickFormat } = getTicks(yMax);
    const { label: yTickLabel} = getTicks(yMax);

    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([0, height - margin.bottom - margin.top]);
      
    const yAxisScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height - margin.bottom, margin.top]);

    const bars = visData.map(d => {
      return {
        x: xScale(d.country.value),
        y: height - yScale(d[dataProperty].value) - margin.bottom,
        height: yScale(d[dataProperty].value),
        fill: '#999',
        country: d.country.value,
      };
    });

    return { bars, xScale, yScale, yAxisScale, yTickFormat, yTickLabel };
  }

  componentDidUpdate() {
    const {
      xScale,
      yAxisScale,
      yTickFormat,
      yTickLabel,
    } = this.state;
    this.xAxis
      .scale(xScale);
    d3.select(this.refs.xAxis).call(this.xAxis);
    this.yAxis
      .scale(yAxisScale)
      .tickFormat(
        d => `${parseInt((d) / yTickFormat)}${yTickLabel}`
      );
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  onBarMouseOver = (country) => {
    const { onCountryHover } = this.props;
    onCountryHover(country);
  }

  onBarMouseOut = () => {
    const { onCountryHover } = this.props;
    onCountryHover('');
  }

  render() {
    const {
      bars,
      xScale,
    } = this.state;

    const { width, height, chartTitle, hoveredCountry } = this.props;

    const barWidth = xScale.bandwidth();
    const linePlacement = barWidth / 2;

    return (
      <div className='chart-container primary-chart'>
        {chartTitle && <h3 className='chart-title'>{chartTitle}</h3>}
        <svg width={width} height={height}>
          {bars.map(d => (
            <g>
              {hoveredCountry === d.country &&
                <line 
                  x1={d.x + linePlacement} y1={margin.top} 
                  x2={d.x + linePlacement} y2={height - margin.bottom} 
                  stroke='#999' strokeDasharray='5,5' strokeWidth='1' 
                />
              }
              
              <rect 
                className='country-bar'
                x={d.x} y={d.y} 
                width={barWidth} 
                height={d.height} 
                fill={d.fill} 
              />
              <rect 
                className='bar-overlay'
                x={d.x} y={margin.top} 
                width={barWidth} 
                height={height - margin.bottom} 
                fill={d.fill}
                fill-opacity={0}
                onMouseOver={() => this.onBarMouseOver(d.country)}
                onMouseOut={this.onBarMouseOut}
              />
            </g>
          ))}
          <g ref="xAxis" transform={`translate(0, ${height - margin.bottom})`} />
          <g ref="yAxis" transform={`translate(${margin.left}, 0)`} />
        </svg>
      </div>
    );
  }
}

export default BarChart;
