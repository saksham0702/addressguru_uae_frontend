import React from "react";
import CardB from "../CardB";
import CardS from "../CardS";
// import CardD from "../CardD";
import dynamic from "next/dynamic";

// const CardD = dynamic(() => import("../CardD"), { ssr: false });

// OR with SSR (default behavior)
const CardD = dynamic(() => import("../CardD"));

const data = [
  {
    title: "Domestic Services",
    imgSrc: "small1.png",
  },
  {
    title: "Packers and Movers",
    imgSrc: "small2.png",
  },
  {
    title: "Pest Control Service",
    imgSrc: "small3.png",
  },
  {
    title: "AC Service",
    imgSrc: "small4.png",
  },
  {
    title: "Repair & Service",
    imgSrc: "small5.png",
  },
  {
    title: "Carpenter",
    imgSrc: "small6.png",
  },
];
const data2 = [
  {
    title: "Budget Hotel",
    desc: "Quick Quotes",
    img: "dets1.png",
    link: "/hotel",
    color: "#6D5D89",
    buttonBgColor: "#F1EEF4",
  },
  {
    title: "Real State",
    desc: "Finest Agent",
    img: "dets2.png",
    color: "#E06C5E",
    link: "/real-estate",
    buttonBgColor: "#FDF0ED",
  },
  {
    title: "Doctor",
    desc: "Book an Appointment",
    img: "dets3.png",
    color: "#00B5A1",
    link: "/doctor",
    buttonBgColor: "#E5F8F4",
  },
  {
    title: "Women Beauty",
    desc: "Parlour Service",
    img: "dets4.png",
    color: "#89573D",
    link: "/salon",
    buttonBgColor: "#F3EFEC",
  },
  {
    title: "Car Rental",
    desc: "Best Dealers",
    img: "dets5.png",
    link: "/car-rental",
    color: "#0876FE",
    buttonBgColor: "#D5E7FE",
  },
];
const PopularServices = () => {
  return (
    <>
      <div className="w-full md:pr-5 2xl:pr-10 min-md:pl-4 ">
        <div className="lg:flex lg:justify-between gap-5 2xl:gap-7 h-auto">
          <div className="max-md:w-full md:pr-4 max-md:pl-2">
            <CardB />
          </div>
          <div className="flex flex-col 2xl:gap-5 xl:gap-5 max-md:flex-row max-md:overflow-x-scroll hide-scroll max-md:w-full max-md:mt-5 max-md:gap-4 2xl:pt-2 w-[65%] relative left-2 min-2xl:pr-10">
            {/* Desktop: Show in grid format */}
            <div className="md:block hidden">
              {/* First Row */}
              <div className="grid grid-cols-3 2xl:gap-10 mb-5">
                {data.slice(0, 3).map((item, index) => (
                  <CardS key={index} data={item} />
                ))}
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-3 2xl:gap-10">
                {data.slice(3, 6).map((item, index) => (
                  <CardS key={index + 3} data={item} />
                ))}
              </div>
            </div>

            {/* Mobile: Show all cards in a single row with horizontal scroll */}
            <div className="md:hidden flex flex-row gap-4 overflow-x-scroll  hide-scroll">
              {data.slice(0, 6).map((item, index) => (
                <CardS key={index} data={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className=" py-8 ">
        <div className=" w-full md:pl-4 flex md:pr-7 2xl:pr-10 max-md:overflow-x-scroll max-md:bg-[#FEF5EF] max-md:py-3 rounded-xl hide-scroll   justify-between">
          {data2.map((item, index) => (
            <CardD key={index} data={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default PopularServices;
