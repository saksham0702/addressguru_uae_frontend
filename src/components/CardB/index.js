import React from "react";
import Image from "next/image";

const CardB = () => {
  return (
    <div
      style={{
        background:
          "linear-gradient(126.95deg, #1B2134 5.32%, #50629A 104.28%)",
      }}
      className="lg:w-[400px] lg:h-[320px] 2xl:w-[500px] 2xl:h-[400px]  md:w-full max-md:h-30 max-md:min-w-full overflow-hidden rounded-lg text-white relative "
    >
      <div className="flex flex-col max-w-50 relative top-10 max-md:top-5 left-5 gap-3 max-md:gap-0">
        <h3 className="2xl:text-2xl max-md:text-sm max-md:font-medium max-md:tracking-tighter text-xl xl:font-medium">
          Looking for?
        </h3>
        <h3 className="2xl:text-3xl text-[24px] font-bold mb-1 max-md:whitespace-nowrap max-md:tracking-tighter max-md:text-base">
          Housekeeping services?
        </h3>

        <button className="bg-white px-4 2xl:w-58 w-47 max-md:px-2 max-md:tracking-tighter max-md:w-30 max-md:text-[11px] max-md:font-bold text-[17px]  2xl:text-[21px] whitespace-nowrap py-1 2xl:mt-6 mt-3 max-md:mt-1 rounded-xs text-black font-semibold ">
          GET BEST DEALS
        </button>
      </div>

      <Image
        src="/assets/Png/popularService/bigImg.png"
        alt="bannerimg"
        height={500}
        width={500}
        className="absolute md:left-51 2xl:left-65 max-md:w-40 max-md:h-44 max-md:top-[-10px] max-md:right-[-35px] max-md:absolute bottom-0 w-[255px] 2xl:w-[320px] h-full  "
      />
    </div>
  );
};

export default CardB;
