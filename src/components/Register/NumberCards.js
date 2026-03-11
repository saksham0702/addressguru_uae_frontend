import React from "react";
import Image from "next/image";
const NumberCards = ({ img, color, number, text }) => {
  return (
    <div
      style={{ backgroundColor: color }}
      className=" max-md:h-12  rounded-xl p-1 md:min-w-30   max-md:w-auto "
    >
      <div className="h-full w-full border border-white border-dashed max-md:flex max-md:items-center px-2   rounded-xl flex md:flex-col max-md:gap-1 items-center py-1 md:px-3">
        <Image
          src={`/assets/register/${img}.svg`}
          alt="verified business"
          height={500}
          width={500}
          className="h-8 w-8 "
        />
        <div className="max-md:leading-0.5">
          <p className="font-bold text-xl max-md:text-base">{number}+ </p>
          <p className="text-nowrap text-[11px] font-semibold ">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default NumberCards;
