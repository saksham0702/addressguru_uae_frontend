import Image from "next/image";
import React, { useState } from "react";
import CustomRadioGroup from "./OnlineOflineButtons";
import InputWithSvg from "../InputWithSvg";

const DiscoverCard = ({ layout }) => {
  return (
    <>
      <div
        className={`h-auto mb-2  ${
          layout === "col"
            ? "flex flex-col gap-2 py-8  "
            : "md:flex md:gap-7 items-center py-8 text-sm"
        }   md:w-[97.5%] bg-[#DAECFD] max-md:flex-col max-md:flex max-md:gap-2 rounded-lg relative`}
      >
        {/* title section */}
        <div
          className={`font-semibold pl-5 2xl:pl-20 ${
            layout === "col" ? "  pl-20 " : ""
          }     `}
        >
          <span className=" md:text-[17px] flex whitespace-nowrap max-md:text-[15px]  max-md:font-semibold  items-center gap-2 ">
            Discover the Best{" "}
            <p className="text-[#FF6E04]">Coaching Institute</p>
          </span>
          <p className="text-sm max-md:text-xs font-[500]">
            {" "}
            Get free access to contact details instantly.
          </p>
        </div>

        {/* button section  */}
        <div
          className={`md:w-sm ${
            layout === "col" ? "  md:ml-20  " : ""
          }     bg-white min-h-26 rounded-md w-[80%]  mx-auto px-5 py-3 relative space-y-1`}
        >
          {/* first text */}
          <p className="text-[13px] font-semibold">
            Select Your Preferred Tutorial Type?
          </p>
          {/* online ofline  */}
          <div className="scale-80   ">
            <CustomRadioGroup
              options={["online", "offline"]}
              defaultValue="online"
              // onChange={(val) => console.log("Selected:", val)}
            />{" "}
          </div>

          {/* last buttons section */}

          <div className="md:flex  relative h-full  bottom-0  ">
            <div className=" flex absolute overflow-visible  ">
              <span className="w-55 max-md:scale-60 md:scale-75 relative right-12">
                <InputWithSvg
                  placeholder={"Abhay"}
                  icon={
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 15 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.23948 12.7334C5.02909 12.7334 3.84588 12.3744 2.83948 11.702C1.83307 11.0295 1.04867 10.0737 0.585478 8.95547C0.122281 7.83722 0.00108708 6.60672 0.237223 5.41958C0.473359 4.23245 1.05622 3.14199 1.91209 2.28612C2.76797 1.43024 3.85842 0.847382 5.04556 0.611246C6.23269 0.375111 7.46319 0.496304 8.58145 0.959501C9.69971 1.4227 10.6555 2.20709 11.328 3.2135C12.0004 4.2199 12.3593 5.40311 12.3593 6.61351C12.3576 8.23604 11.7122 9.79162 10.5649 10.9389C9.41759 12.0862 7.86202 12.7316 6.23948 12.7334ZM6.23948 7.16429C5.00327 7.16429 2.58593 7.82952 2.56757 9.04921C2.96951 9.65515 3.51515 10.1522 4.15584 10.496C4.79653 10.8399 5.51236 11.0198 6.23948 11.0198C6.96661 11.0198 7.68244 10.8399 8.32313 10.496C8.96382 10.1522 9.50946 9.65515 9.91139 9.04921C9.90099 8.36746 9.15192 7.91214 8.52525 7.65021C7.79862 7.3525 7.02438 7.1879 6.23948 7.16429ZM6.23948 2.32961C5.87637 2.32961 5.5214 2.43729 5.21948 2.63902C4.91756 2.84076 4.68224 3.1275 4.54328 3.46298C4.40432 3.79845 4.36796 4.1676 4.4388 4.52374C4.50965 4.87988 4.6845 5.20702 4.94127 5.46378C5.19803 5.72055 5.52517 5.8954 5.88131 5.96624C6.23745 6.03708 6.6066 6.00073 6.94207 5.86177C7.27755 5.72281 7.56429 5.48749 7.76602 5.18557C7.96776 4.88365 8.07544 4.52868 8.07544 4.16557C8.07544 3.67864 7.88201 3.21166 7.5377 2.86735C7.19339 2.52304 6.72641 2.32961 6.23948 2.32961Z"
                        fill="#D1D1D1"
                      />
                    </svg>
                  }
                  text
                />
              </span>

              <span className="w-55 max-md:scale-60 md:scale-75 relative right-32 ">
                <InputWithSvg
                  placeholder={"91 9854785468"}
                  icon={
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 15 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.23948 12.7334C5.02909 12.7334 3.84588 12.3744 2.83948 11.702C1.83307 11.0295 1.04867 10.0737 0.585478 8.95547C0.122281 7.83722 0.00108708 6.60672 0.237223 5.41958C0.473359 4.23245 1.05622 3.14199 1.91209 2.28612C2.76797 1.43024 3.85842 0.847382 5.04556 0.611246C6.23269 0.375111 7.46319 0.496304 8.58145 0.959501C9.69971 1.4227 10.6555 2.20709 11.328 3.2135C12.0004 4.2199 12.3593 5.40311 12.3593 6.61351C12.3576 8.23604 11.7122 9.79162 10.5649 10.9389C9.41759 12.0862 7.86202 12.7316 6.23948 12.7334ZM6.23948 7.16429C5.00327 7.16429 2.58593 7.82952 2.56757 9.04921C2.96951 9.65515 3.51515 10.1522 4.15584 10.496C4.79653 10.8399 5.51236 11.0198 6.23948 11.0198C6.96661 11.0198 7.68244 10.8399 8.32313 10.496C8.96382 10.1522 9.50946 9.65515 9.91139 9.04921C9.90099 8.36746 9.15192 7.91214 8.52525 7.65021C7.79862 7.3525 7.02438 7.1879 6.23948 7.16429ZM6.23948 2.32961C5.87637 2.32961 5.5214 2.43729 5.21948 2.63902C4.91756 2.84076 4.68224 3.1275 4.54328 3.46298C4.40432 3.79845 4.36796 4.1676 4.4388 4.52374C4.50965 4.87988 4.6845 5.20702 4.94127 5.46378C5.19803 5.72055 5.52517 5.8954 5.88131 5.96624C6.23745 6.03708 6.6066 6.00073 6.94207 5.86177C7.27755 5.72281 7.56429 5.48749 7.76602 5.18557C7.96776 4.88365 8.07544 4.52868 8.07544 4.16557C8.07544 3.67864 7.88201 3.21166 7.5377 2.86735C7.19339 2.52304 6.72641 2.32961 6.23948 2.32961Z"
                        fill="#D1D1D1"
                      />
                    </svg>
                  }
                  text
                />
              </span>
            </div>
          </div>
        </div>

        {/* bottom image part */}
        <div
          className={`absolute min-w-full md:bottom-2 -bottom-3  h-10 2xl:bottom-5  ${
            layout === "col" ? " 2xl:bottom-[1px]" : " "
          } rounded-xl `}
        >
          <Image
            src="/assets/BusinessListingPng/border-discover-card.png"
            href="Border"
            height={1000}
            width={1000}
            className="w-full"
          />
        </div>
      </div>
    </>
  );
};

export default DiscoverCard;
