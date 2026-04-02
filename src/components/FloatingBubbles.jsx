import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const FloatingBubbles = ({ data, width = 700, height = 400 }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height);

    // initialize particles
    const nodes = data.map(d => ({
      ...d,
      r: Math.sqrt(d.value) * 2,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }));

    const node = svg.selectAll("g")
      .data(nodes)
      .enter()
      .append("g");

    node.append("circle")
      .attr("r", d => d.r)
      .attr("fill", "rgba(99, 102, 241, 0.7)");

    node.append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("fill", "white")
      .style("font-size", "12px");

    function tick() {
      nodes.forEach(d => {
        // movement
        d.x += d.vx;
        d.y += d.vy;

        // slight randomness (molecule jitter)
        d.vx += (Math.random() - 0.5) * 0.1;
        d.vy += (Math.random() - 0.5) * 0.1;

        // damping (prevents runaway speed)
        d.vx *= 0.98;
        d.vy *= 0.98;

        // boundary bounce
        if (d.x < d.r || d.x > width - d.r) d.vx *= -1;
        if (d.y < d.r || d.y > height - d.r) d.vy *= -1;

        d.x = Math.max(d.r, Math.min(width - d.r, d.x));
        d.y = Math.max(d.r, Math.min(height - d.r, d.y));
      });

      node.attr("transform", d => `translate(${d.x},${d.y})`);

      requestAnimationFrame(tick);
    }

    tick();

  }, [data, width, height]);

  return <svg ref={ref} />;
};

export default FloatingBubbles;