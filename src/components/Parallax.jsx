import { useEffect, useRef, useState } from "react";

const Parallax= ({ src, alt, title, subtitle }) => {
  const imgRef = useRef(null);
  const textRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [textOffset, setTextOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!imgRef.current || !textRef.current) return;

      const rect = imgRef.current.getBoundingClientRect();
      const speed = window.innerWidth < 768 ? 0.15 : 0.3; // slower on mobile
      const textSpeed = -speed * 0.5; // opposite direction for text

      const imgOffset = rect.top * speed;
      const tOffset = rect.top * textSpeed;

      setOffset(imgOffset);
      setTextOffset(tOffset);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full overflow-hidden h-[40vh] sm:h-[50vh] md:h-[70vh] lg:h-[80vh]">
      {/* Image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-200"
        style={{ transform: `translateY(${offset}px)` }}
      />

      {/* Floating Text */}
      <div
        ref={textRef}
        className="absolute inset-0 flex flex-col justify-center items-center text-center px-4"
        style={{ transform: `translateY(${textOffset}px)` }}
      >
        {title && (
          <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mt-2 text-sm md:text-lg text-white drop-shadow-md max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default Parallax;