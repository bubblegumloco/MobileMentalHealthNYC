import React from "react";

const tilesData = [
  { title: "Timing That Fits", description: "Operating 3 PM – 8 PM, specifically designed for after-school and post-work hours." },
  { title: "Right in the Neighborhood", description: "Parked at schools and community centers where people already gather." },
  { title: "Speaking Your Language", description: "Every bus includes trained community liaisons and instant video interpretation." },
  { title: "Safe & Private", description: "A dedicated space to talk, free from judgment or scheduling conflicts." },
];

// Colors in pink/orange palette
const tileColors = [
  "#BEE3BA", 
  "#9FD4A3", // peach
  "#A5D6A7", // soft pink
  "#BEE3BA", // coral-orange
];

const TileGrid = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
        {tilesData.map((tile, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center text-center aspect-square p-6 hover:brightness-110 transition"
            style={{ backgroundColor: tileColors[index % tileColors.length] }}
          >
            <h1 className="text-white text-2xl sm:text-3xl font-bold mb-2">
              {tile.title}
            </h1>
            <p className="text-white text-sm sm:text-base">{tile.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


export default TileGrid;