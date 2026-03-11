import React from "react";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 ${className}`}></div>
);

export default function LandingPageSkeleton() {
  return (
    <div className="h-auto flex flex-col items-center w-full bg-[#F8F7F7] mt-2">
      <div className="flex flex-col md:w-[80%] max-w-[94%] bg-white md:px-5 px-2 pb-7">

        {/* Breadcrumb */}
        <Skeleton className="h-4 w-40 mt-5" />

        {/* Title + Logo (Desktop) */}
        <div className="max-md:hidden mt-5 flex items-center gap-5">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-52 mb-3" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        <div className="flex w-full justify-between max-md:flex-col mt-4 gap-4">

          {/* LEFT */}
          <div className="md:w-[64.5%] w-full">

            {/* Slider */}
            <Skeleton className="w-full h-64 rounded-md" />

            {/* Mobile Title */}
            <div className="md:hidden mt-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-40 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>

            {/* About */}
            <div className="mt-5 md:pl-2 px-1">
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-[90%]" />
            </div>

            {/* Facilities */}
            <div className="max-w-4xl mt-7 md:pl-2 px-1">
              <Skeleton className="h-5 w-32 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-4 w-[80%]" />
                  ))}
              </div>
            </div>

            {/* Services */}
            <div className="max-w-4xl mt-7 md:pl-2 px-1">
              <Skeleton className="h-5 w-32 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-4 w-[80%]" />
                  ))}
              </div>
            </div>

            {/* Overview */}
            <div className="max-w-5xl pl-2 mt-7">
              <Skeleton className="h-5 w-40 mb-4" />
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-[90%] mb-2" />
              <Skeleton className="h-3 w-[70%]" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="md:w-[34%] max-md:hidden h-auto mb-10 flex flex-col gap-5">

            {/* Quick Information */}
            <Skeleton className="h-52 w-full rounded-md" />

            {/* Enquiry Box */}
            <Skeleton className="h-[30rem] w-full rounded-md" />

            {/* User Info */}
            <Skeleton className="h-40 w-full rounded-md" />
          </div>
        </div>

        {/* Reviews */}
        <div className="h-70 w-full mt-10 space-y-4">
          <Skeleton className="h-5 w-60" />

          <div className="flex overflow-x-scroll gap-5 hide-scroll py-2">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-40 w-60 flex-shrink-0 rounded-md" />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
