import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineChart = ({ trigger }) => {
  const ref = useRef();
  const data = [10, 50, 30, 80, 60, 100];

  useEffect(() => {
    if (!trigger) return; // Don't run animation if trigger is false

    const svg = d3.select(ref.current)
      .attr('width', 400)
      .attr('height', 200);
    
    svg.selectAll('*').remove(); // Clear previous content

    const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, 400]);
    const y = d3.scaleLinear().domain([0, d3.max(data)]).range([200, 0]);

    const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'purple')
      .attr('stroke-width', 2)
      .attr('d', line)
      .attr('stroke-dasharray', function() { return this.getTotalLength(); })
      .attr('stroke-dashoffset', function() { return this.getTotalLength(); })
      .transition()
      .duration(1500)
      .attr('stroke-dashoffset', 0);
  }, [trigger]);

  return <svg ref={ref}></svg>;
};

export default LineChart;