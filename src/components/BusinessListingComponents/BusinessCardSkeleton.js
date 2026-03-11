import React from "react";

const BusinessCardSkeleton = () => {
  return (
    <div className="animate-pulse w-full">
      <div className="rounded-xl border border-gray-200 flex gap-4 p-3">
        {/* Left Image Skeleton */}
        <div className="bg-gray-300 h-[190px] w-[150px] rounded-xl"></div>

        {/* Right Content */}
        <div className="flex flex-col gap-7 w-full">
          <div className="bg-gray-300 h-5 w-2/3 rounded"></div>
          <div className="bg-gray-300 h-4 w-1/2 rounded"></div>

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
