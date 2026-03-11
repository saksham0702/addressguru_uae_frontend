import React from "react";
import Image from "next/image";
import { APP_URL } from "@/services/constants";
import Link from "next/link"; 

const RecentBusinessCard = ({ data }) => {
  return (
    <Link
      href={`/${data?.slug}`}
      className="xl:w-47 min-2xl:w-54 border-gray-100 border 2xl:h-55 bg-white rounded-lg md:mt-5 shadow-md max-md:min-w-46  flex flex-col "
    >
      {/* Logo */}
      <div className="w-full flex justify-center border-b text-gray-200">
        <Image
          src={`${APP_URL}/${data?.logo}`} // Replace with your actual image path in public folder
          alt={data?.business_name}
          width={500}
          height={500}
          className="h-25 2xl:h-32 w-full  p-1 object-cover"
        />
      </div>

      {/* Title */}
      <div className="w-full p-1.5">
        <h3
          className="font-semibold leading-4 line-clamp-2
         text-[12px] 2xl:text-[16px]"
        >
          {data?.business_name}
        </h3>
      </div>

      {/* Service Icon and Label */}
      <div className="flex ">
        {/* <Image
          src="/assets/Png/recentBusiness/taxiIcon.png" // Replace with your actual icon path
          alt="Taxi Icon"
          width={500}
          height={500}
          className='relative h-10 w-15  2xl:scale-110 right-4 2xl:right-6 '
        /> */}
        <span className="text-[10px] 2xl:text-sm whitespace-nowrap text-gray-700  px-2 relative">
          {data?.category?.name || data?.sub_category?.name || "category"}
        </span>
      </div>

      {/* Date */}
      {/* <p className="text-[8px] text-gray-600 text-end p-1">1 Month Ago</p> */}
    </Link>
  );
};

export default RecentBusinessCard;
