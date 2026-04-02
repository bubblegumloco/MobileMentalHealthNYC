import React, { useEffect, useState } from "react";

const FloatingWords = () => {
  // Color palette
  const colors = ["#ffb074", "#ff7a00", "#ff9bb0", "#e07a8f", "#ff4f6d", "#3f5f45"];

  // Word list with some "important" words
  const allWords = [
    "support", "lack", "resources", "affordable", "community", "residents", "youth",
    "access", "depression", "struggle", "time", "need", "homeless", "health services",
    "mental", "wellness", "care", "therapy", "help", "awareness", "stigma",
    "treatment", "funding", "education", "prevention", "recovery", "counseling",
    "social", "outreach", "programs", "empathy", "hope", "resilience", "services",
    "guidance", "support groups", "connection", "advocacy", "intervention"
  ];

  // Decide font sizes: important words bigger
  const bigWords = ["health services", "community", "lack", "support", "limited", "access", "struggle"];
  const fontSizes = ["text-3xl", "text-4xl", "text-6xl"];

  const [words, setWords] = useState([]);

  useEffect(() => {
    const newWords = allWords.map((text, i) => {
      // Important words bigger
      const size = bigWords.includes(text) ? fontSizes[2] : fontSizes[Math.floor(Math.random() * fontSizes.length)];

      return {
        text,
        style: {
          top: `${Math.random() * 80 + 5}%`,
          left: `${Math.random() * 80 + 5}%`,
          color: colors[i % colors.length],
        },
        size,
        delay: `delay-${i * 100}`, // stagger fade-in
      };
    });
    setWords(newWords);
  }, []);

  return (
    <section className="relative h-screen bg-[#fffdf1] overflow-hidden flex items-center justify-center px-4 md:px-8">

      {/* Floating words */}
      {words.map((w, i) => (
        <div
          key={i}
          className={`absolute font-bold opacity-0 animate-fadeIn ${w.size} ${w.delay}`}
          style={{ ...w.style }}
        >
          {w.text}
        </div>
      ))}

      {/* Title */}
      <h1 className="relative z-10 text-5xl sm:text-6xl md:text-8xl font-bold animate-fadeIn text-center">
        Mental Health
      </h1>

    </section>
  );
};

export default FloatingWords;

