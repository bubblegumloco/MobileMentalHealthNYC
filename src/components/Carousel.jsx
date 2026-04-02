// Carousel.jsx
import React, { useState } from "react";
import { slides } from "./slidesData";
import Lottie from "lottie-react";

/*
// slidesData.js
import animation1 from "./assets/animation1.json";
import animation2 from "./assets/animation2.json";
import animation3 from "./assets/animation3.json";

export const slides = [
  { animation: animation1, text: "This is the first slide text" },
  { animation: animation2, text: "Second slide is here!" },
  { animation: animation3, text: "And the third slide looks like this" },
];
*/

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  const slide = slides[currentIndex];

  // Check if index is even or odd for alternating layout
  const isEven = currentIndex % 2 === 0;

  return (
    <div className="max-w-4xl mx-auto py-8 relative">
      <div className="flex items-center justify-between gap-8">
        {isEven ? (
          <>
            <div className="flex-1">
              <Lottie animationData={slide.animation} loop={true} />
            </div>
            <div className="flex-1 text-lg text-gray-700">
              {slide.text}
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 text-lg text-gray-700">
              {slide.text}
            </div>
            <div className="flex-1">
              <Lottie animationData={slide.animation} loop={true} />
            </div>
          </>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
        <button
          onClick={prevSlide}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          &#8592;
        </button>
      </div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
        <button
          onClick={nextSlide}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default Carousel;