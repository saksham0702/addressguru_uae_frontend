import React, { useState } from "react";

const Steps = ({ steps, setActiveStep }) => {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:flex">
        {steps?.map((step, index) => (
          <div
            key={index}
            className="relative scale-90 p-1 cursor-pointer"
            onClick={() => setActiveStep(step.step)}
          >
            {/* Connector shape */}
            <span className="absolute top-2.5 left-4.5">
              <svg
                width="54"
                height="67"
                viewBox="0 0 54 67"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6079 63.5266C7.12221 63.5266 3.47257 59.8743 3.47257 55.3877V0H0V55.3877C0 61.7905 5.20756 67 11.6079 67H54V63.5266H11.6079Z"
                  fill={step.active || step.completed ? "#FF6E04" : "#000000"}
                />
              </svg>
            </span>
            {/* Horizontal line between steps */}
            <span className="absolute top-[69px] left-17">
              <svg
                width="104"
                height="12"
                viewBox="0 0 104 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M103.38 5.95776L97.0792 0V5.53015H1.38009V5.52057H0.664062V5.53015H3.00153V6.38677H0.664062V6.39395H1.38009V6.38677H97.0792V11.9145L103.38 5.95776Z"
                  fill={step.active || step.completed ? "#FF6E04" : "#000000"}
                />
              </svg>
            </span>
            {/* Step number & title */}
            <span className="flex md:gap-2.5">
              <span
                className={`${
                  step.active || step.completed ? "bg-[#FF6E04]" : "bg-black"
                } text-white z-10 rounded-full flex p-5 font-bold text-xl items-center justify-center h-10 w-10`}
              >
                {step.step}
              </span>
              <span className="flex flex-col justify-around gap-1 h-14">
                <h5 className="text-[15px] font-semibold leading-4.5 text-[#323232]">
                  {step.title}
                </h5>
                <p className="text-[10px] leading-3 w-32 font-[500] text-[#5B5B5B]">
                  {step.description}
                </p>
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex items-start px-2 py-2">
        {steps?.map((step, index) => (
          <div key={index} className="flex items-center ">
            {/* Step circle and info */}
            <div
              className="flex flex-col items-center cursor-pointer"
              // onClick={() => setActiveStep(step.step)}
            >
              <div
                className={`${
                  step.active || step.completed ? "bg-[#FF6E04]" : "bg-black"
                } text-white rounded-full flex items-center justify-center h-8 w-8 font-bold text-sm mb-2`}
              >
                {step.step}
              </div>
              <p className="text-[11px] font-semibold text-center  text-[#323232] w-12.5 leading-tighter line-clamp-2">
                {step.title}
              </p>
              <p className="text-[8px] text-center max-md:hidden text-[#5B5B5B] w-20 mt-1 leading-tight">
                {step.description}
              </p>
            </div>

            {/* Arrow between steps */}
            {index < steps.length - 1 && (
              <div className=" relative bottom-5 ">
                <svg
                  className=" scale-140"
                  width="20"
                  height="10"
                  viewBox="0 0 31 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M30.3784 4.95776L24.0777 0V4.53015H1.37856V4.52057H0.662529V4.53015H0V5.38677H0.662529V5.39395H1.37856V5.38677H24.0777V9.91452L30.3784 4.95776Z"
                    fill={step.active || step.completed ? "#FF6E04" : "#000000"}
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Steps

