import { REGISTER_STEPS } from "@/services/constants";
import React from "react";
import Image from "next/image";

const HowDoesItWork = () => {
  return (
    <div className="bg-white md:shadow-lg rounded-md md:border border-gray-100   md:h-[450px] md:w-[70%] w-full flex flex-col gap-10 md:items-center md:text-center  pt-15">
      {/* heading section */}
      <div className="max-md:px-7">
        <h3 className="md:text-3xl max-md:text-xl font-semibold">How does Address Guru work?</h3>
        <p className="md:text-sm max-md:text-xs my-2 max-md:font-semibold font-[500]">
          List Your Business for FREE - Just 3 Easy Steps!
        </p>
      </div>
      {/* steps section */}
      <div>
        <div className="md:flex md:mt-10 px-3">
          {REGISTER_STEPS.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <div
                  className="flex flex-col md:gap-2 gap-1 max-w-55 pl-4 md:items-center md:text-center"
                >
                  <Image
                    src={item?.icon}
                    alt={item?.title}
                    height={500}
                    width={500}
                    className="md:w-20 max-md:w-14"
                  />
                  <h4 className="font-semibold max-md:text-[17px] text-[#323232]">
                    {item?.title}
                  </h4>
                  <p className=" max-md:text-[11px] md:text-sm">{item?.text}</p>
                </div>
                {/* Render arrow if not last item */}
                {index !== REGISTER_STEPS.length - 1 && (
                  <svg
                    width="30"
                    height="15"
                    viewBox="0 0 30 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className=" max-md:rotate-90 md:mt-8  max-md:my-7 ml-7"
                  >
                    <path
                      d="M29 7.5H1"
                      stroke="#FF6E04"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M24 1.5L29 7.5L24 13.5"
                      stroke="#FF6E04"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HowDoesItWork;
