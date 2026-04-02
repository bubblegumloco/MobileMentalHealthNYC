import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SimpleBar = ({ trigger, data }) => {
  const ref = useRef();
  const tooltipRef = useRef(); // single tooltip per chart

  // Create tooltip only once when the component mounts
  useEffect(() => {
    tooltipRef.current = d3.select("body")
      .append("div")
      .attr("class", "chart-tooltip") // optional for CSS styling
      .style("position", "absolute")
      .style("background", "#333")
      .style("color", "#fff")
      .style("padding", "6px 10px")
      .style("border-radius", "5px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Cleanup on unmount
    return () => {
      tooltipRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!trigger || !data || data.length === 0) return;

    const width = 450;
    const height = 280;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.year))
      .range([0, innerWidth])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.reviews)])
      .nice()
      .range([innerHeight, 0]);

    // Axes
    chart.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x));

    chart.append('g')
      .call(d3.axisLeft(y));

    // Bars
    chart.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.year))
      .attr('y', innerHeight)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', '#A5D6A7')
      .on('mouseover', (event, d) => {
        tooltipRef.current
          .style("opacity", 1)
          .html(`Reviews: ${d.reviews}`);
      })
      .on('mousemove', (event) => {
        tooltipRef.current
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on('mouseout', () => {
        tooltipRef.current.style("opacity", 0);
      })
      .transition()
      .duration(1000)
      .attr('y', d => y(d.reviews))
      .attr('height', d => innerHeight - y(d.reviews));

    // X-axis label
    chart.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 45)
      .attr('text-anchor', 'middle')
      .attr('fill', '#444')
      .text('Year');

    // Y-axis label
    chart.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('fill', '#444')
      .text('Reviews');

  }, [trigger, data]);

  return <svg ref={ref}></svg>;
};

export default SimpleBar;