import React from "react";
import Image from "next/image";

const CardS = ({ data }) => {
  return (
    <>
      <div className="  relative xl:w-45 xl:h-38  2xl:w-58 2xl:h-47 max-md:min-w-40  flex flex-col gap-1.5  text-xs font-semibold text-[#4B4B4B]">
        <Image
          src={`/assets/Png/popularService/${data?.imgSrc}`}
          alt="cardImage"
          height={500}
          width={500}
          className=" rounded-md w-full h-full "
        />
        <p className="pl-2  !text-sm font-semibold max-md:whitespace-nowrap ">
          {data?.title}
        </p>
      </div>
    </>
  );
};

export default CardS;
