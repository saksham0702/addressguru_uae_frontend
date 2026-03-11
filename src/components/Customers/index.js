"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Ashiwini Rajput",
    star: 4,
    text: "Best website for business promotion. We can promote our video, photo, google map and about our self also & best best part is there's no ad's in our land page. Best classified website for business.",
  },
  {
    name: "Rohit Sharma",
    star: 5,
    text: "I love how smooth the experience is. No ads and easy promotion tools helped me grow my business reach significantly.",
  },
  {
    name: "Sneha Kapoor",
    star: 4,
    text: "Perfect place to showcase your services. The ad-free experience makes it stand out from others. Highly recommended!",
  },
  {
    name: "Arjun Mehta",
    star: 5,
    text: "It's one of the cleanest classified platforms I've used. Promoting photos, videos, and maps without hassle is amazing.",
  },
];

const Customers = () => {
  return (
    <div className="bg-[#FFFBF8] lg:h-[400px]  w-full lg:my-10 max-md:pb-7 h-full  relative flex flex-col lg:items-center  lg:gap-5 lg:justify-center">
      {/* Design Images */}
      <Image
        src="/assets/Png/customer-img/left-design.png"
        alt="design"
        height={500}
        width={500}
        className="absolute h-28 w-48 top-0 left-0 max-md:w-14 max-md:h-10"
      />
      <Image
        src="/assets/Png/customer-img/left-dots.png"
        alt="dots"
        height={500}
        width={500}
        className="absolute h-4 w-15 bottom-15 max-md:scale-75 left-10"
      />
      <Image
        src="/assets/Png/customer-img/circle.png"
        alt="circle"
        height={500}
        width={500}
        className="absolute h-5 w-5 bottom-5 max-md:bottom-24 max-md:scale-50 right-10 md:right-20"
      />
      <Image
        src="/assets/Png/customer-img/right-dots.png"
        alt="dots"
        height={500}
        width={500}
        className="absolute h-16 w-5 top-10 right-20 max-md:scale-60 max-md:bottom-20 max-md:top-2 max-md:right-2"
      />

      {/* Heading */}
      <div className="max-md:mt-10 ">
        <h3 className="uppercase font-bold text-[#323232] md:hidden text-center">
          Testimonial
        </h3>
        <h3 className="text-[#FF6E04] font-bold text-[2.5rem] max-md:text-lg w-full text-center capitalize">
          Customers say about our services
        </h3>
      </div>

      {/* Testimonial Section */}
      <div className="lg:w-[980px] max-md:w-full lg:h-52 flex lg:p-3  max-md:bottom-7  lg:bottom-2 relative max-md:flex-col max-md:items-center ">
        {/* Static Image */}
        <div className="lg:w-[25%]  px-7 relative max-md:scale-50 z-30  ">
          <Image
            src="/assets/Png/customer-img/girl.png"
            alt="customer"
            height={1000}
            width={1000}
            className="lg:absolute h-48 w-52 object-cover lg:left-0 max-md:border-6 z-40 max-md:border-white max-md:rounded-2xl"
          />
        </div>

        {/* Swiper Section */}
        <div className="lg:w-[75%]  max-md:max-w-[90%] max-md:mx-auto max-md:bottom-20  relative lg:right-5 lg:top-1  ">
          <div className="bg-[#323232] w-full h-full rounded-2xl text-center max-md:pt-10 max-md:pb-5  text-white flex flex-col items-center gap-2 px-10 capitalize relative overflow-hidden">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 2500 }}
              loop
              pagination={{
                el: ".custom-dots",
                clickable: true,
              }}
              className="w-full h-full"
            >
              {testimonials.map((item, index) => (
                <SwiperSlide key={index}>
                  <span className="right-0 pb-3   md:mt-5 absolute">
                    <svg
                      width="74"
                      height="12"
                      viewBox="0 0 74 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.89555 0L7.70653 3.65239L11.7911 4.22129L8.8255 7.04668L9.5392 11.0503L5.89555 9.14511L2.25345 11.0542L2.96715 7.0505L0 4.22129L4.08458 3.65239L5.89555 0Z"
                        fill="white"
                      />
                      <path
                        d="M36.8477 0L38.6587 3.65239L42.7433 4.22129L39.7777 7.04668L40.4913 11.0503L36.8477 9.14511L33.2056 11.0542L33.9193 7.0505L30.9521 4.22129L35.0367 3.65239L36.8477 0Z"
                        fill="white"
                      />
                      <path
                        d="M21.3711 0L23.1821 3.65239L27.2667 4.22129L24.3011 7.04668L25.0148 11.0503L21.3711 9.14511L17.729 11.0542L18.4427 7.0505L15.4756 4.22129L19.5602 3.65239L21.3711 0Z"
                        fill="white"
                      />
                      <path
                        d="M52.3233 0L54.1343 3.65239L58.2188 4.22129L55.2532 7.04668L55.9669 11.0503L52.3233 9.14511L48.6812 11.0542L49.3949 7.0505L46.4277 4.22129L50.5123 3.65239L52.3233 0Z"
                        fill="white"
                      />
                      <path
                        d="M67.7989 0L69.6098 3.65239L73.6944 4.22129L70.7288 7.04668L71.4425 11.0503L67.7989 9.14511L64.1568 11.0542L64.8705 7.0505L61.9033 4.22129L65.9879 3.65239L67.7989 0Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                  <div className="flex flex-col items-center gap-2 h-full justify-center">
                    <p className="text-sm leading-relaxed max-md:mt-4 max-md:text-[11px]">
                      {item.text}
                    </p>
                    <h3 className="font-semibold text-lg mt-2 max-md:text-[15px]">
                      {item.name}
                    </h3>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Dots inside black box - bottom right */}
            <div className=" absolute right-6 bottom-3 max-w-17  bg-[#C8C8C84D]/30 p-2 rounded-full  ">
              <div className="custom-dots flex gap-2  rounded-full z-50"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
