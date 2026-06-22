import React from "react";
import CardB from "../CardB";
import CardS from "../CardS";
import dynamic from "next/dynamic";

const CardD = dynamic(() => import("../CardD"));

const data = [
  {
    title: "Domestic Services",
    imgSrc: "small1.png",
    link: "/maid",
  },
  {
    title: "Packers and Movers",
    imgSrc: "small2.png",
    link: "/logistics-services",
  },
  {
    title: "Pest Control Service",
    imgSrc: "small3.png",
    link: "/pest-control",
  },
  {
    title: "AC Service",
    imgSrc: "small4.png",
    link: "/ac-service",
  },
  {
    title: "Repair & Service",
    imgSrc: "small5.png",
    link: "/repair-service",
  },
  {
    title: "Carpenter",
    imgSrc: "small6.png",
    link: "/carpenter",
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
    title: "Doctor & Hospital",
    desc: "Book an Appointment",
    img: "dets3.png",
    color: "#00B5A1",
    link: "/hospital",
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
    <div className="w-full flex flex-col gap-10 py-3 px-4 ">
      {/* Top Section: CardB + Small Cards Grid */}
      <div className="flex flex-col lg:flex-row lg:items-stretch gap-8">
        {/* Large Card Section */}
        <div className="w-full lg:w-auto shrink-0">
          <CardB />
        </div>

        {/* Small Cards Grid */}
        <div className="w-full flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8 lg:gap-6 2xl:gap-10">
            {data.map((item, index) => (
              <CardS key={index} data={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: CardD Row */}
      <div className="py-3">
        <div className="w-full md:pl-4 flex md:pr-7 2xl:pr-10 overflow-x-scroll bg-[#FEF5EF] md:bg-transparent py-4 rounded-xl hide-scroll justify-between gap-4">
          {data2.map((item, index) => (
            <CardD key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularServices;
