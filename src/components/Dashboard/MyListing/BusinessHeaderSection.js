import React from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";
import Image from "next/image";
import { APP_URL } from "@/services/constants";

const BusinessHeaderSection = ({ data }) => {
  const profileScore = 25;

  // Calculate stroke-dasharray for circular progress
  const circumference = 2 * Math.PI * 16; // radius = 16
  const strokeDasharray = `${
    (profileScore / 100) * circumference
  } ${circumference}`;

  return (
    <>
      <div className="flex items-center justify-between h-full max-md:px-2 md:px-6">
        {/* Left Side - Back button and Company Info */}
        <div className="flex items-center md:gap-4 gap-2">
          {/* Back Button */}
          <button className="md:p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-black" />
          </button>

          {/* Company Logo */}
          <div className="w-16 max-md:w-20 h-16 overflow-hidden rounded-lg">
            <Image
              src={`${APP_URL}/${data?.logo}`}
              alt="company-logo"
              height={500}
              width={500}
              className="h-full w-full "
            />
          </div>

          {/* Company Details */}
          <div className="flex flex-col ">
            <div className="">
              <h1 className="font-semibold text-gray-900 text-sm max-md:text-xs   max-md:leading-4 max-md:font-bold 2xl:max-w-sm lg:max-w-[21rem] 2xl:leading-5 2xl:text-lg">
                {data?.business_name} {" "}
                <span className="text-[11px] font-semibold max-md:text-[9px] md:whitespace-nowrap text-gray-600">
                   {" "}{data?.business_address}
                 </span>
              </h1>
            </div>

            <section className="flex md:items-center md:gap-7 max-md:flex-col ">
              <span className="flex gap-2 items-center mt-[2px]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.837168 0.7177C0.771118 0.7177 0.717572 0.771255 0.717572 0.837317V3.70812C0.717572 3.77418 0.771118 3.82773 0.837168 3.82773H3.70746C3.77351 3.82773 3.82705 3.77418 3.82705 3.70812V0.837317C3.82705 0.771255 3.77351 0.7177 3.70746 0.7177H0.837168ZM0 0.837317C0 0.374879 0.374812 0 0.837168 0H3.70746C4.16981 0 4.54462 0.374879 4.54462 0.837317V3.70812C4.54462 4.17056 4.16981 4.54543 3.70746 4.54543H0.837168C0.374812 4.54543 0 4.17056 0 3.70812V0.837317Z"
                    fill="#323232"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.837168 6.45793C0.771118 6.45793 0.717572 6.51147 0.717572 6.57755V9.44835C0.717572 9.51443 0.771118 9.56797 0.837168 9.56797H3.70746C3.77351 9.56797 3.82705 9.51443 3.82705 9.44835V6.57755C3.82705 6.51147 3.77351 6.45793 3.70746 6.45793H0.837168ZM0 6.57755C0 6.11511 0.374812 5.74023 0.837168 5.74023H3.70746C4.16981 5.74023 4.54462 6.11511 4.54462 6.57755V9.44835C4.54462 9.91079 4.16981 10.2857 3.70746 10.2857H0.837168C0.374812 10.2857 0 9.91079 0 9.44835V6.57755Z"
                    fill="#323232"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.57936 0.7177C6.51329 0.7177 6.45976 0.771255 6.45976 0.837317V3.70812C6.45976 3.77418 6.51329 3.82773 6.57936 3.82773H9.44964C9.51571 3.82773 9.56924 3.77418 9.56924 3.70812V0.837317C9.56924 0.771255 9.51571 0.7177 9.44964 0.7177H6.57936ZM5.74219 0.837317C5.74219 0.374879 6.117 0 6.57936 0H9.44964C9.912 0 10.2868 0.374879 10.2868 0.837317V3.70812C10.2868 4.17056 9.912 4.54543 9.44964 4.54543H6.57936C6.117 4.54543 5.74219 4.17056 5.74219 3.70812V0.837317Z"
                    fill="#323232"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.74219 6.09908C5.74219 5.9009 5.90283 5.74023 6.10097 5.74023H9.92803C10.1262 5.74023 10.2868 5.9009 10.2868 6.09908C10.2868 6.29727 10.1262 6.45793 9.92803 6.45793H6.10097C5.90283 6.45793 5.74219 6.29727 5.74219 6.09908Z"
                    fill="#323232"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.65625 8.01315C7.65625 7.81497 7.81689 7.6543 8.01504 7.6543H9.92856C10.1267 7.6543 10.2873 7.81497 10.2873 8.01315C10.2873 8.21133 10.1267 8.372 9.92856 8.372H8.01504C7.81689 8.372 7.65625 8.21133 7.65625 8.01315Z"
                    fill="#323232"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.74219 9.92721C5.74219 9.72903 5.90283 9.56836 6.10097 9.56836H9.92803C10.1262 9.56836 10.2868 9.72903 10.2868 9.92721C10.2868 10.1254 10.1262 10.2861 9.92803 10.2861H6.10097C5.90283 10.2861 5.74219 10.1254 5.74219 9.92721Z"
                    fill="#323232"
                  />
                </svg>
                <p className="text-sm max-md:text-[10px] whitespace-nowrap font-medium ">
                  Category : <strong className="capitalize">{data?.category?.slug}</strong>{" "}
                </p>
              </span>

              <div className="flex items-center whitespace-nowrap gap-1 md:gap-4">
                <span className="text-xs max-md:text-[8px] md:hidden text-gray-500">
                  you have starter plan
                </span>
                <span className="text-xs max-md:text-[9px] bg-orange-50 text-orange-500 md:px-4 px-2 py-1 max-md:font-semibold rounded-full md:font-bold">
                  UPGRADE NOW
                </span>
                <span className="text-xs max-md:hidden text-gray-500">
                  you have starter plan
                </span>
              </div>
            </section>
          </div>
        </div>

        {/* Circular Progress */}
        <div className="relative max-md:scale-85 bottom-2 w-17 h-17">
          <svg className="w-17 h-17 transform -rotate-90" viewBox="0 0 40 40">
            {/* Background circle */}
            <circle
              cx="20"
              cy="20"
              r="16"
              stroke="#fee2e2"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="20"
              cy="20"
              r="16"
              stroke="#ef4444"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              className="transition-all duration-500 ease-in-out"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-900">
              {profileScore}%
            </span>
          </div>
          <p className="text-gray-500 text-[10px] ml-1 mt-1 font-medium capitalize text-cenrer md:hidden">
            profit score
          </p>
        </div>
      </div>
    </>
  );
};

export default BusinessHeaderSection;
