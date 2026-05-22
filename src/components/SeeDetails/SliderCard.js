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

const SliderCard = ({ images }) => {
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
    customPaging: () => <div className="custom-dot" />,
    dotsClass: "slick-dots custom-dots",
  };

  return (
    <div className="slider-card-wrapper">
      <Slider {...settings}>
        {images?.map((src, idx) => (
          <div key={idx} className="slide-item">
            <div className="slide-inner">
              <Image
                src={`${APP_URL}/${src}`}
                alt={`slider-image-${idx}`}
                fill
                className="slide-image"
                sizes="(max-width: 768px) 100vw, 700px"
              />
            </div>
          </div>
        ))}
      </Slider>

      <style jsx global>{`
        /* ── Wrapper ── */
        .slider-card-wrapper {
          position: relative;
          width: 100%;
          /* Consistent 16:9 aspect ratio for both mobile and desktop */
          aspect-ratio: 16 / 9;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
          background: #f3f4f6;
        }

        @media (min-width: 768px) {
          .slider-card-wrapper {
            max-height: 450px;
          }
        }

        /* ── Slick core overrides ── */
        .slider-card-wrapper .slick-slider,
        .slider-card-wrapper .slick-list,
        .slider-card-wrapper .slick-track {
          height: 100%;
        }

        .slider-card-wrapper .slick-slide > div {
          height: 100%;
        }

        /* ── Each slide ── */
        .slide-item {
          height: 100%;
        }

        .slide-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }

        /* ── Image: cover so it fills the card fully ── */
        .slide-image {
          object-fit: cover;
          object-position: center;
        }

        /* ── Hide default slick arrows ── */
        .slider-card-wrapper .slick-prev,
        .slider-card-wrapper .slick-next {
          display: none !important;
        }

        /* ── Dots container ── */
        .custom-dots {
          position: absolute;
          bottom: 12px;
          left: 0;
          right: 0;
          display: flex !important;
          justify-content: center;
          align-items: center;
          gap: 5px;
          padding: 0;
          margin: 0;
          list-style: none;
          z-index: 20;
        }

        .custom-dots li {
          margin: 0;
          width: auto;
          height: auto;
        }

        /* Inactive dot — orange bar, NO border-radius */
        .custom-dot {
          width: 20px;
          height: 3px;
          border-radius: 0;
          background: #ff7a00;
          opacity: 1;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        /* Active dot — white bar, slightly wider, NO border-radius */
        .custom-dots li.slick-active .custom-dot {
          width: 28px;
          height: 3px;
          border-radius: 0;
          background: #ffffff;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default SliderCard;
