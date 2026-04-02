import React from "react";
import landingImg from "../assets/landingImg.png";

const LandingSection = () => {
  return (
    <section
      className="relative h-screen bg-cover bg-center flex items-end justify-center pb-15 text-center text-white font-sans"
      style={{ backgroundImage: `url(${landingImg})` }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 opacity-0 animate-fadeIn flex flex-col items-center">
        
        <h1 className="text-5xl font-bold drop-shadow-lg">
          The Invisible Illness
        </h1>

        <p className="text-2xl mt-4 font-light">
          Hidden In Plain Sight
        </p>

        <div className="mt-10 opacity-0 animate-fadeInScroll delay-2000ms flex flex-col items-center">
          <span className="uppercase text-sm tracking-widest">
            Explore
          </span>

          <div className="text-2xl mt-2 animate-bounce">
            ↓
          </div>
        </div>

      </div>
    </section>
  );
};

export default LandingSection;