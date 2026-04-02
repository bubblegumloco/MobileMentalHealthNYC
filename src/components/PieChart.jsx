import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const PieChart = ({ data, width = 400, height = 400, trigger = true }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const radius = Math.min(width, height) / 2;

    const svg = d3.select(ref.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${width/2}, ${height/2})`);

    // Bright colors
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.topic))
      .range(d3.schemeSet3);

    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius * 0.8);

    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const arcs = g.selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g");

    // Draw slices
    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.topic))
      .attr("opacity", 0)
      .transition()
      .duration(800)
      .attr("opacity", 1);

    // Labels outside slices
    arcs.append("text")
      .attr("transform", d => {
        const pos = outerArc.centroid(d);
        const midAngle = (d.startAngle + d.endAngle) / 2;
        pos[0] = radius * 0.85 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr("text-anchor", d => {
        const midAngle = (d.startAngle + d.endAngle) / 2;
        return midAngle < Math.PI ? "start" : "end";
      })
      .style("font-size", "12px")
      .text(d => `${d.data.topic}: ${d.data.value}%`);

  }, [data, width, height]);

  return <svg ref={ref}></svg>;
};

export default PieChart;