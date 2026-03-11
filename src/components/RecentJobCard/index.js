import React from "react";
import Image from "next/image";
import { APP_URL } from "@/services/constants";

const RecentJobCard = ({ img, data }) => {
  const toK = (value) => {
    if (!value) return "";
    return Math.round(value / 1000) + "K";
  };

  return (
    <div className="w-[11.5rem] min-2xl:w-xs max-md:min-w-44 bg-white rounded-md shadow-xl overflow-hidden">
      {/* Logo Image */}
      <div className="w-full h-[100px] relative">
        <div className="absolute inset-0 rounded-md overflow-hidden">
          <Image
            src={`${APP_URL}/${data?.company?.image}`}
            alt="Company Logo"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="px-3 py-2 space-y-1">
        <p className="text-[11px] font-bold line-clamp-1 text-black leading-tight">
          {data?.title}
        </p>
        <div className="flex justify-between text-[11px] text-gray-700 font-medium">
          <span>Full Time</span>
          <span>
            {toK(data?.salary_from)}-{toK(data?.salary_to)}/monthly
          </span>
        </div>
        <p className="text-[12px] capitalize text-gray-500 font-semibold">{data?.company?.name || "NA"}</p>
        <p className="text-[9px] text-gray-500 w-40 truncate leading-tight">
          {data?.company?.address || "NA"}
        </p>
        <p className="text-[8px] text-gray-700 mt-1 py-1 text-end">TODAY</p>
      </div>
    </div>
  );
};

export default RecentJobCard;
