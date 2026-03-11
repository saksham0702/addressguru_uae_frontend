import React from "react";
import InputWithSvg from "../InputWithSvg";
import Image from "next/image";
import Accordian from "./Accordian";

const FAQ = () => {
  return (
    <div className="w-full border border-gray-200 rounded-3xl overflow-hidden h-[600px] ">
      <div className="relative h-[30%] bg-[#E8F4FF] space-y-5 px-5 pt-6 overflow-hidden">
        <Image
          src="/assets/register/FAQ-balls.png"
          alt="orange sphere"
          height={500}
          width={500}
          className="h-40 w-60 absolute top-7 right-30"
        />
        <h3 className="font-bold text-5xl mb-5 mt-4 z-10">FAQ</h3>

        <div className="flex justify-between items-center z-10">
          <p>Not finding the help you need?</p>
          <div className="w-xs z-10">
            <InputWithSvg
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.2828 0.213379H3.21343C1.75035 0.213379 0.566406 1.39732 0.566406 2.8604V17.78C0.566406 19.2431 1.75035 20.427 3.21343 20.427H11.0486C10.2016 19.272 9.71067 17.8666 9.71067 16.3362C9.71067 12.4859 12.839 9.35764 16.6892 9.35764C16.7662 9.35764 16.8528 9.35765 16.9298 9.36727V2.8604C16.9298 1.39732 15.7459 0.213379 14.2828 0.213379ZM4.41662 4.0636H8.26684C8.79625 4.0636 9.2294 4.49675 9.2294 5.02615C9.2294 5.55556 8.79625 5.9887 8.26684 5.9887H4.41662C3.88722 5.9887 3.45407 5.55556 3.45407 5.02615C3.45407 4.49675 3.88722 4.0636 4.41662 4.0636ZM9.2294 13.6891H4.41662C3.88722 13.6891 3.45407 13.256 3.45407 12.7266C3.45407 12.1972 3.88722 11.764 4.41662 11.764H9.2294C9.7588 11.764 10.1919 12.1972 10.1919 12.7266C10.1919 13.256 9.7588 13.6891 9.2294 13.6891ZM13.0796 9.83892H4.41662C3.88722 9.83892 3.45407 9.40577 3.45407 8.87637C3.45407 8.34696 3.88722 7.91381 4.41662 7.91381H13.0796C13.609 7.91381 14.0422 8.34696 14.0422 8.87637C14.0422 9.40577 13.609 9.83892 13.0796 9.83892Z"
                    fill="#D1D1D1"
                  />
                  <path
                    d="M16.6901 21.39C13.9035 21.39 11.6367 19.1232 11.6367 16.3366C11.6367 13.55 13.9035 11.2832 16.6901 11.2832C19.4767 11.2832 21.7435 13.55 21.7435 16.3366C21.7435 19.1232 19.4767 21.39 16.6901 21.39ZM16.6901 13.2083C14.9652 13.2083 13.5618 14.6117 13.5618 16.3366C13.5618 18.0615 14.9652 19.4649 16.6901 19.4649C18.415 19.4649 19.8184 18.0615 19.8184 16.3366C19.8184 14.6117 18.415 13.2083 16.6901 13.2083Z"
                    fill="#D1D1D1"
                  />
                  <path
                    d="M22.7063 23.3154C22.4599 23.3154 22.2135 23.221 22.0258 23.0333L18.8975 19.905C18.5211 19.5287 18.5211 18.9203 18.8975 18.544C19.2739 18.1676 19.8822 18.1676 20.2586 18.544L23.3869 21.6723C23.7632 22.0486 23.7632 22.657 23.3869 23.0333C23.1992 23.221 22.9527 23.3154 22.7063 23.3154Z"
                    fill="#D1D1D1"
                  />
                </svg>
              }
              placeholder={"SEARCH YOUR QUERY HERE"}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center py-6 px-4 ">
        <h4 className="text-xl font-semibold">Top Questions</h4>

        <div className="flex items-center gap-3 whitespace-nowrap">
          <button className={`text-center bg-orange-500 px-3 py-2 text-sm font-[500] text-white rounded-full`}>Listing</button>
          <button className={`text-center bg-orange-500 px-3 py-2 text-sm font-[500] text-white rounded-full`}>Register</button>
          <button className={`text-center bg-orange-500 px-3 py-2 text-sm font-[500] text-white rounded-full`}>Payments</button>
          <button className={`text-center bg-orange-500 px-3 py-2 text-sm font-[500] text-white rounded-full`}>Addressguru  Guru Mobile App</button>
        </div>
      </div>
       <div className="px-2">
        <Accordian />
        </div>
    </div>
  );
};

export default FAQ;
