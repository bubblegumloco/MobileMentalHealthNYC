import React from "react";

const FloatingCircles = ({ data }) => {
  const positions = [
    "top-20 left-20",
    "top-40 right-20",
    "bottom-32 left-1/3",
    "top-1/2 right-10",
  ];

  return (
    <section className="relative h-screen bg-black overflow-hidden flex items-center justify-center">

      {data.map((d, i) => {
        const size = d.value * 2; // scaling

        return (
          <div
            key={i}
            className={`absolute ${positions[i % positions.length]} flex items-center justify-center text-white font-bold opacity-90`}
            style={{
              width: size,
              height: size,
              borderRadius: "9999px",
              backgroundColor: "rgba(147, 51, 234, 0.7)",
            }}
          >
            {d.name}
          </div>
        );
      })}

      <h1 className="relative z-10 text-white text-3xl font-bold">
        Population Bubbles
      </h1>

    </section>
  );
};

export default FloatingCircles;