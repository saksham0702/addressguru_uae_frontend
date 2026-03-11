import React from "react";
import Image from "next/image";

const NeedSupport = () => {
  return (
    <div className="bg-[#FFFAF6] md:w-xs w-full  md:max-h-[400px] md:h-[40%] max-md:flex  max-md:items-center py-4 rounded-4xl md:px-5 md:py-10">
      <Image
        src="/assets/register/support-illustrator.png"
        alt="illustrator"
        height={500}
        width={500}
        className="md:h-[220px] md:w-[90%] w-[50%]  md:mx-2 "
      />
      <div className=" max-md:px-3 ">
        <h4 className="font-semibold max-md:font-extrabold md:text-2xl max-md:text-[16px] md:text-center my-3">
          Not finding the help you need?
        </h4>
        <button className="md:w-60 md:ml-4 max-md:text-xs hover:bg-blue-500 transition-transform ease hover:scale-105 text-center bg-blue-600 text-white font-semibold p-2 cursor-pointer rounded-md">
          Need Support
        </button>
      </div>
    </div>
  );
};

export default NeedSupport;
