import React from "react";
import Image from "next/image";

const CountCard = ({ data }) => {
  return (
    <div className="bg-white rounded-l-full rounded-r-xs flex md:gap-7 max-md:gap-1 max-md:p-2 px-4  py-4 2xl:min-w-56  items-center justify-between">
      <Image
        src={`/assets/Dashboard${data.image}.png`}
        alt={data?.title}
        width={500}
        height={500}
        className="h-11 w-11 max-md:scale-60"
      />

      <span>
        <p className="text-sm max-md:text-xs font-semibold whitespace-nowrap text-right">
          {data?.title}
        </p>
        <p className=" font-[1000] text-lg max-md:text-md  text-right">
          {data?.count}
        </p>
      </span>
    </div>
  );
};

export default CountCard;
