import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Your plans array here (unchanged)
const plans = [
  {
    name: "Dehradun Military Academy",
    location: "Garhi Cantt, Dehradun",
    plan: "5 Yrs - Professional Plan",
    badgeColor: "bg-[linear-gradient(90deg,_#01B5A1_0%,_#014F46_100%)]",
  },
  {
    name: "Brigadier Defence Academy",
    location: "Vasant Vihar, Dehradun",
    plan: "Lifetime - Premium Plan",
    badgeColor: "bg-[linear-gradient(90deg,_#DF6C5E_0%,_#7B3B33_100%)]",
  },
  {
    name: "Doon Sainik Academy",
    location: "Garhi Cantt, Dehradun",
    plan: "9 Yrs - Professional Plan",
    badgeColor: "bg-[linear-gradient(90deg,_#01B5A1_0%,_#014F46_100%)]",
  },
  {
    name: "Dehradun School of Online Marketing-DOSM",
    location: "Chakrata Road, Dehradun",
    plan: "Lifetime - Premium Plan",
    badgeColor: "bg-[linear-gradient(90deg,_#DF6C5E_0%,_#7B3B33_100%)]",
  },
  {
    name: "Dehradun School of Online Marketing-DOSM",
    location: "Chakrata Road, Dehradun",
    plan: "Lifetime - Premium Plan",
    badgeColor: "bg-[linear-gradient(90deg,_#01B5A1_0%,_#014F46_100%)]",
  },
  {
    name: "Dehradun School of Online Marketing-DOSM",
    location: "Chakrata Road, Dehradun",
    plan: "Lifetime - Premium Plan",
    badgeColor: "bg-green-600",
  },
  {
    name: "Dehradun School of Online Marketing-DOSM",
    location: "Chakrata Road, Dehradun",
    plan: "Lifetime - Premium Plan",
    badgeColor: "bg-green-600",
  },
];

// Custom arrow components
const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute z-10 right-[-20px] top-1/2 transform -translate-y-1/2 bg-white text-orange-500 shadow-md rounded-full p-2 cursor-pointer hover:scale-105 transition"
  >
    <FaArrowRight size={16} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute z-10 left-[-20px] top-1/2 transform -translate-y-1/2 bg-white text-orange-500 shadow-md rounded-full p-2 cursor-pointer hover:scale-105 transition"
  >
    <FaArrowLeft size={16} />
  </div>
);

const SliderComponent = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full ">
      {/* heading */}
      <div className="flex items-center gap-4 my-10 px-10">
        <h3 className="uppercase text-xl font-semibold">Your Competitors</h3>
        <hr className="w-30 h-[2px] bg-orange-500 text-orange-500" />
      </div>

      {/* slider */}
      <div className="relative w-[95%] mx-auto px-10">
        <Slider {...settings}>
          {plans.map((academy, index) => (
            <div key={index} className=" px-1  ">
              <div className="rounded-xl h-65 w-full  shadow-md relative">
                <Image
                  src="/assets/our-plans/sliderimg.png"
                  alt={academy.name}
                  height={500}
                  width={500}
                  className="h-36 object-cover p-2 rounded-xl overflow-hidden"
                />
                <div className="px-3 space-y-1">
                  <h3 className="font-bold text-[15px]">{academy.name}</h3>
                  <p className="text-xs font-semibold text-gray-500">
                    {academy.location}
                  </p>
                  <div
                    className={`mt-2 px-3 py-1 text-xs font-semibold text-white absolute bottom-3 rounded-md ${academy.badgeColor}`}
                  >
                    {academy.plan}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SliderComponent;
