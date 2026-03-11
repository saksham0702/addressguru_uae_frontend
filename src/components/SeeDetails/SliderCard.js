"use client";
import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { APP_URL } from "@/services/constants";

const SliderCard = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    customPaging: function (i) {
      return <div className="custom-dot"></div>;
    },
    dotsClass: "slick-dots custom-dots",
  };

  return (
    <div className="relative md:w-full md:max-h-[450px] max-md:h-[240px] border-2  border-gray-200 p-[2px] flex justify-center rounded-lg overflow-hidden">
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
          gap: 8px;
          z-index: 50;
        }

        .custom-dots li {
          margin: 0;
          width: auto;
          height: auto;
        }

        /* Inactive dots (ORANGE, small circle) */
        .custom-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff6b35;
          opacity: 0.8;
          transition: all 0.35s ease;
          cursor: pointer;
        }

        /* Active slide (GRAY, thin & long cylindrical bar) */
        .custom-dots li.slick-active .custom-dot {
          width: 28px; /* little long */
          height: 4px; /* thin */
          border-radius: 10px; /* cylindrical */
          background: #bcbcbc; /* gray */
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
      `}</style>
    </div>
  );
};

export default SliderCard;
