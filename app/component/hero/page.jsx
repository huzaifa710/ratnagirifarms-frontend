"use client";
import { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
import { banners } from "@/app/lib/data";
// import { Button } from "@/components/ui/button";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const bannersImage = ["/home/hero1.jpg", "/home/hero2.jpg", "/home/hero3.jpg"];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Add auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannersImage.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannersImage.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannersImage.length) % bannersImage.length
    );
  };

  return (
    <div
      className="relative h-[400px] md:h-[600px] overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {" "}
      {bannersImage.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={banner}
            alt={`Banner ${index + 1}`}
            width={1200}
            height={600}
            className="w-full h-full object-fill"
          />
        </div>
      ))}
      <button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-transparent"
        onClick={prevSlide}
      >
        <IoIosArrowBack className="h-8 w-8 cursor-pointer" />
      </button>
      <button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent"
        onClick={nextSlide}
      >
        <IoIosArrowForward className="h-8 w-8 cursor-pointer" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {bannersImage.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentSlide ? "bg-primary" : "bg-white/60"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
