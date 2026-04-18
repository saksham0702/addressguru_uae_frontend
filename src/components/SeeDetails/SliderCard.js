"use client";
import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 18l-6-6 6-6"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 18l6-6-6-6"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

const SliderCard = ({ images, slider }) => {
  const APP_URL = "https://addressguru.ae/api";

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    customPaging: () => <div className="custom-dot"></div>,
    dotsClass: "slick-dots custom-dots",
  };

  return (
    <div className="relative md:w-full md:max-h-[450px] max-md:h-[240px] border-2 border-gray-200 p-[2px] flex justify-center rounded-lg overflow-hidden">
      <Slider {...settings} className="w-full h-full">
        {images?.map((src, idx) => (
          <div key={idx} className="h-[450px] w-full relative">
            <Image
              src={`${APP_URL}/${src}`}
              alt={`slider-image-${idx}`}
              height={1000}
              width={1000}
              className="h-full w-full rounded-lg absolute object-cover"
            />
          </div>
        ))}
      </Slider>

      <style jsx global>{`
        .custom-dots {
          bottom: 16px;
          display: flex !important;
          justify-content: center;
          align-items: center;
          gap: 5px;
          z-index: 20;
        }
        .custom-dots li {
          margin: 0;
          width: auto;
          height: auto;
        }
        /* Inactive — orange thin line */
        .custom-dot {
          width: 20px;
          height: 3px;
          border-radius: 999px;
          background: #ff7a00;
          opacity: 1;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        /* Active — white thin line, slightly wider */
        .custom-dots li.slick-active .custom-dot {
          width: 28px;
          height: 3px;
          border-radius: 999px;
          background: #ffffff;
          opacity: 1;
        }
        .slick-slider {
          width: 100%;
          height: 100%;
        }
        .slick-list,
        .slick-track {
          height: 100%;
        }
        .slick-slide > div {
          height: 100%;
        }
        /* Reset slick default arrow styles */
        .slick-prev,
        .slick-next {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default SliderCard;
