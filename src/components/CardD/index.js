import React from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const CardD = ({ data }) => {
  const { city } = useAuth();
  return (
    <div className=" rounded-xl md:shadow-sm w-46  max-md:min-w-45 max-md:mx-2 h-3xl min-[1600]:w-[440px] 2xl:w-[240px] ">
      <div
        style={{ backgroundColor: data?.color }}
        className={` rounded-t-xl text-white flex flex-col items-center py-3  w-auto`}
      >
        <h4 className="font-semibold text-sm">{data?.title}</h4>
        <p className="text-xs mt-1">{data?.desc}</p>
        <div className="mt-2">
          <Image
            src={`/assets/Png/popularService/${data?.img}`}
            alt="Budget Hotel"
            width={500}
            height={500}
            className="rounded-md w-40 h-32 2xl:w-48 2xl:h-42 relative top-3 "
          />
        </div>
      </div>

      <div
        style={{ backgroundColor: data.buttonBgColor }}
        className={` h-14 pt-5 rounded-b-xl text-xs text-center z-10  `}
      >
        <Link
          href={`${data?.link}/${city}`}
          className=" mt-3 px-3 py-1 bg-white opacity-100 z-20 font-semibold rounded-md cursor-pointer hover:bg-gray-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CardD;
