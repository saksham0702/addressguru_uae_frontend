import Image from "next/image";
import React, { useState } from "react";

const HelpFull = ({ layout }) => {
  const [clicked, setClicked] = useState(false);
  return (
    <div
      className={` py-15 flex justify-around  ${
        layout === "col" ? "w-full" : "md:w-full"
      } items-center bg-[#DAECFD] rounded-lg relative`}
    >
      <div
        className={` ${
          layout === "col"
            ? "flex flex-col  gap-2 md:ml-10"
            : "md:flex  gap-10 md:pl-10"
        } max:w-full absolute md:left-7 left-5`}
      >
        <h3 className="font-semibold max-md:text-sm max-md:tracking-tight">
          Were our search results helpful?
        </h3>
        <div className="flex gap-5 max-md:mt-1">
          <button
            onClick={() => setClicked(false)}
            className={`md:px-3 md:py-2 rounded-md text-xs max-md:w-16 max-md:h-6 cursor-pointer font-semibold ${
              clicked === true
                ? "bg-white border border-[#FF6E04] text-[#FF6E04]"
                : "text-white bg-[#FF6E04]"
            } `}
          >
            Yes
          </button>
          <button
            onClick={() => setClicked(true)}
            className={`md:px-3 md:py-2 rounded-md text-xs max-md:w-16 max-md:h-6 cursor-pointer font-semibold ${
              clicked === false
                ? "bg-white border border-[#FF6E04] text-[#FF6E04]"
                : "text-white bg-[#FF6E04]"
            } `}
          >
            No
          </button>
        </div>
      </div>

      <div>
        <Image
          src="/assets/BusinessListingPng/tower.png"
          alt="tower"
          height={500}
          width={500}
          className="md:h-[85%] h-[70%] w-fit absolute bottom-3 right-20 md:right-35"
        />
        <Image
          src="/assets/BusinessListingPng/ques-mark.png"
          alt="tower"
          height={500}
          width={500}
          className="md:h-[85%] h-[70%] w-fit absolute bottom-3  right-4 md:right-10"
        />
      </div>

      {/* bottom image part */}
      <div
        className={`absolute min-w-full   bottom-[-7]  ${
          layout === "col" ? " " : "  "
        }  rounded-xl `}
      >
        <Image
          src="/assets/BusinessListingPng/border-discover-card.png"
          href="Border"
          height={1000}
          width={1000}
          className={`w-full${
            layout === "col" ? " bottom-1  relative  " : " relative bottom-1"
          }`}
        />
      </div>
    </div>
  );
};

export default HelpFull;
