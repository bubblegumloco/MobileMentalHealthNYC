import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BubbleChart = ({ data, trigger }) => {
  const ref = useRef();
  const [containerWidth, setContainerWidth] = useState(800); // fallback width

  // Container width
  useEffect(() => {
    if (!ref.current?.parentElement) return;

    const width = ref.current.parentElement.offsetWidth || 800;
    setContainerWidth(width);

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        if (newWidth && newWidth !== containerWidth) setContainerWidth(newWidth);
      }
    });

    resizeObserver.observe(ref.current.parentElement);
    return () => resizeObserver.disconnect();
  }, [containerWidth]);

  // Draw chart
  useEffect(() => {
    if (!data || !containerWidth) return;

    const width = containerWidth;
    const height = width * 0.6;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const colors = ["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fcae91","#fb6a8a","#de2d6c"];
    const colorScale = d3.scaleOrdinal().domain(data.map(d => d.name)).range(colors);

    const sizeScale = d3.scaleSqrt().domain([0, d3.max(data, d => d.value)]).range([30, 80]);
    const nodes = data.map(d => ({ ...d, radius: sizeScale(d.value) }));

    const simulation = d3.forceSimulation(nodes)
      .force("center", d3.forceCenter(width/2, height/2))
      .force("charge", d3.forceManyBody().strength(5))
      .force("collision", d3.forceCollide().radius(d => d.radius + 6))
      .force("x", d3.forceX(d => ((nodes.indexOf(d)+0.5)/nodes.length) * width).strength(0.5))
      .force("y", d3.forceY(height/2).strength(0.05))
      .on("tick", ticked);

    const node = svg.selectAll("g").data(nodes).enter().append("g");

    node.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => colorScale(d.name))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("opacity", trigger ? 0 : 1)
      .transition()
      .duration(1000)
      .attr("opacity", 1);

    const formatNumber = new Intl.NumberFormat();

    // Auto-scaling text
    node.append("text")
      .attr("text-anchor", "middle")
      .style("pointer-events", "none")
      .each(function(d) {
        const tspanData = [d.name, formatNumber.format(d.value)];
        tspanData.forEach((text, i) => {
          const tspan = d3.select(this)
            .append("tspan")
            .attr("x", 0)
            .attr("dy", i === 0 ? "-0.2em" : "1.2em")
            .text(text);

          // Auto scale font to fit circle
          let fontSize = d.radius / (text.length * 0.3); // adjust multiplier if needed
          fontSize = Math.min(fontSize, 16); // cap max font
          tspan.style("font-size", `${fontSize}px`);
        });
      });

    function ticked() {
      node.attr("transform", d => {
        const padding = 10;
        d.x = Math.max(d.radius + padding, Math.min(width - d.radius - padding, d.x));
        d.y = Math.max(d.radius + padding, Math.min(height - d.radius - padding, d.y));
        return `translate(${d.x},${d.y})`;
      });
    }

    return () => simulation.stop();

  }, [data, containerWidth, trigger]);

  return <svg ref={ref} style={{ width: "100%", height: "auto" }} />;
};

export default BubbleChart;