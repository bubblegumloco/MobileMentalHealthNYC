import { useEffect, useRef } from "react";
import * as d3 from "d3";

const GeoMap = ({ geoData, dataMap }) => {
  const ref = useRef();

  useEffect(() => {
    const width = 600;
    const height = 560;
    const padding = 48; // uniform padding on all 4 sides → truly centered

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    // viewBox + preserveAspectRatio makes the map scale responsively
    // and stay centered in whatever container it lives in
    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "auto")
      .attr("width", null)   // remove fixed px width so CSS/container controls it
      .attr("height", null);

    // fitExtent with equal padding on all sides forces the projection
    // to be computed relative to the full canvas — no more left-drift
    const projection = d3.geoMercator()
      .fitExtent(
        [[padding, padding], [width - padding, height - padding]],
        geoData
      );

    const path = d3.geoPath().projection(projection);

    // 🎨 COLOR SCALE
    const values = Object.values(dataMap);

    const color = d3.scaleSequential()
      .domain([d3.min(values), d3.max(values)])
      .interpolator(
        d3.interpolateRgbBasis([
          "#BEE3BA",
          "#9FD4A3",
          "#41dc8e",
          "#388E3C",
          "#27a567"
        ])
      );

    // ✅ TOOLTIP (only create once)
    let tooltip = d3.select(".tooltip");

    if (tooltip.empty()) {
      tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "white")
        .style("padding", "6px 10px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0);
    }

    // 🗺 DRAW MAP
    svg.selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "#333")
      .attr("fill", d => {
        const value = dataMap[d.properties.name];
        return value ? color(value) : "#ccc";
      })

      // 🖱 HOVER
      .on("mouseover", function (event, d) {
        const name = d.properties.name;
        const value = dataMap[name];

        tooltip
          .style("opacity", 1)
          .html(`
            <strong>${name}</strong><br/>
            Count: ${value?.toLocaleString() ?? "N/A"}
          `);

        d3.select(this).attr("stroke-width", 2);
      })

      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })

      .on("mouseout", function () {
        tooltip.style("opacity", 0);
        d3.select(this).attr("stroke-width", 1);
      });

  }, [geoData, dataMap]);

  return <svg ref={ref}></svg>;
};

export default GeoMap;
