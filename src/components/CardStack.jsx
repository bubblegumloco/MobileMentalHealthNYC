import React, { useRef, useEffect, useState } from "react";

const solutions = [
  { title: "Anxiety & Stress", description: "The weight of daily life leaves little energy to prioritize mental health." },
  { title: "Language Barrier", description: "Limited English proficiency cuts off access to culturally competent care." },
  { title: "Service Deserts", description: "In many parts of the 5 Boroughs, the nearest mental health provider is miles away." },
  { title: "Cost Barrier", description: "High therapy fees and lack of insurance coverage price out those who need it most." },
  { title: "Lack of Safe Spaces", description: "Without a private, stigma-free environment, many fear being seen or judged." },
  { title: "School Environment", description: "Bullying and toxic school climates are driving a silent crisis among youth." },
];

const CardStack = () => {
  const containerRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  // Simple scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollY = window.innerHeight - rect.top; // distance from top of viewport
      const step = rect.height / solutions.length;
      const index = Math.min(Math.floor(scrollY / step), solutions.length - 1);
      setActiveIndex(index);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-3xl mx-auto h-[80vh] sm:h-[60vh] mt-16"
    >
      {solutions.map((sol, i) => (
        <div
          key={i}
          className={`absolute top-0 left-0 w-full h-full p-8 rounded-xl shadow-2xl transition-transform duration-700 ease-out`}
          style={{
            backgroundColor: `hsl(${30 + i * 20}, 90%, 70%)`,
            zIndex: solutions.length - i,
            transform:
              i <= activeIndex ? "translateY(0%) scale(1)" : "translateY(10%) scale(0.95)",
            opacity: i <= activeIndex ? 1 : 0.5,
          }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
            {sol.title}
          </h2>
          <p className="text-white text-base">{sol.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CardStack;