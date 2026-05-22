import React from "react";

const BusinessCardSkeleton = () => {
  return (
    <div className="animate-pulse w-full">
      <div className="rounded-xl md:border border-gray-200 flex gap-4 md:p-3 p-2">
        {/* Left Image Skeleton */}
        <div className="bg-gray-300 md:h-[190px] md:w-[150px] max-md:h-[110px] max-md:max-w-[34%] w-full rounded-sm"></div>

        {/* Right Content */}
        <div className="flex flex-col md:gap-7 max-md:gap-3.5 gap-3 w-full">
          <div className="bg-gray-300 h-6 w-2/3 rounded max-md:mt-1"></div>
          <div className="bg-gray-300 h-4 md:w-1/2 w-3/4 rounded"></div>

          <div className="flex gap-2 mt-2">
            <div className="bg-gray-300 h-6 w-16 rounded"></div>
            <div className="bg-gray-300 h-6 w-10 rounded"></div>
          </div>

          <div className="bg-gray-300 h-4 w-1/4 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCardSkeleton;
