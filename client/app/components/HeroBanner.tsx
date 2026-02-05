"use client";


import { useState, useEffect } from "react";
import Image from "next/image";

const HeroBanner = () => {
  const images = [
    "/advertisement/1.jpg",
    "/advertisement/2.jpg",
    "/advertisement/3.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="w-full py-6 md:py-0 flex justify-center items-center">
      <div className="relative w-full h-[220px] md:h-[350px] rounded-3xl overflow-hidden shadow-2xl group">

        {/* Images */}
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={src}
              alt={`Banner ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        ))}

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/80"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

