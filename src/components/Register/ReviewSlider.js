"use client";
import { REGISTER_REVIEWS } from "@/services/constants";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const ReviewSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex(
      currentIndex === 0 ? REGISTER_REVIEWS.length - 1 : currentIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex(
      currentIndex === REGISTER_REVIEWS.length - 1 ? 0 : currentIndex + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentIndex]); // re-run when currentIndex changes

  const getSlideStyle = (index) => {
    if (index === currentIndex) {
      return {
        bg: "bg-orange-500",
        text: "text-white",
        zIndex: "z-20",
        scale: "scale-100",
        translate: "translate-x-0",
      };
    } else if (
      index ===
      (currentIndex === 0 ? REGISTER_REVIEWS.length - 1 : currentIndex - 1)
    ) {
      return {
        bg: "bg-white",
        text: "text-black",
        zIndex: "z-10",
        scale: "scale-90",
        translate: "-translate-x-[60%]",
      };
    } else if (
      index ===
      (currentIndex === REGISTER_REVIEWS.length - 1 ? 0 : currentIndex + 1)
    ) {
      return {
        bg: "bg-white",
        text: "text-black",
        zIndex: "z-10",
        scale: "scale-90",
        translate: "translate-x-[60%]",
      };
    } else {
      return { hidden: true };
    }
  };

  return (
    <div className="relative w-full py-20 max-md:mb-20 overflowx-visible">

      <div className="relative max-w-md  flex max-h-50 justify-center md:right-110 2xl:w-lg  top-20">
        {REGISTER_REVIEWS.map((t, index) => {
          const style = getSlideStyle(index);
          if (style.hidden) return null;

          return (
            <div
              key={index}
              className={`absolute md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                ${style.translate} ${style.scale} ${style.zIndex} ${style.bg} ${style.text} 
                rounded-xl p-6 shadow-lg transition-all duration-500 ease-in-out text-center flex flex-col items-center max-md:w-[270px] md:w-[300px]`}
            >
              {/* Design bar and quote */}
              <span className="flex gap-5 items-center mb-3">
                <span className="h-[2px] bg-current w-20"></span>
                <svg
                  className="text-orange-500"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.1973 23.488V14.4814C15.1973 5.57855 17.9951 0.877707 23.5882 0.378906V5.21147C21.5675 6.06154 20.5576 7.95049 20.5576 10.8792H23.5882V23.488H15.1973Z"
                    fill="currentColor"
                  />
                  <path
                    d="M0.435547 23.488V14.4814C0.435547 5.57855 3.2334 0.877707 8.82647 0.378906V5.21147C6.8058 6.06154 5.79502 7.95049 5.79502 10.8792H8.82647V23.488H0.435547Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="h-[2px] w-20 bg-current"></span>
              </span>

              <p className="text-xs md:text-sm leading-relaxed">“{t.text}”</p>
              <h4 className="mt-1 mb-5 font-semibold">{t.name}</h4>

              {/* Image */}
              <div className="absolute -bottom-10 h-20 w-20 border-4 border-white rounded-full overflow-hidden">
                <Image
                  src={t.image}
                  alt={t.name}
                  height={500}
                  width={500}
                  className="object-cover scale-140"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-32 gap-3">
        {REGISTER_REVIEWS.slice(0, 3).map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 relative md:right-74 top-30 rounded-full cursor-pointer ${
              index === currentIndex ? "bg-orange-500 w-6" : "bg-orange-500"
            }`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ReviewSlider;
