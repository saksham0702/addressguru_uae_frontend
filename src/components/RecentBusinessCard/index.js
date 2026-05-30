import React, { useState } from "react";
import Image from "next/image";
import { APP_URL } from "@/services/constants";
import Link from "next/link";
import { MapPin } from "lucide-react";

const RecentBusinessCard = ({ data }) => {
  const [current, setCurrent] = useState(0);
  const images = data?.images || [];
  const hasImages = images.length > 0;

  const prev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((p) => (p === 0 ? images.length - 1 : p - 1));
  };

  const next = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((p) => (p === images.length - 1 ? 0 : p + 1));
  };

  return (
    <Link
      href={`/${data?.slug}`}
      className="flex flex-col bg-white rounded-sm overflow-hidden border h-60 border-gray-100 flex-shrink-0 w-[calc(20%-13px)] max-md:min-w-[160px] max-md:w-[160px] hover:opacity-90 transition-opacity"
    >
      {/* Image Slider */}
      <div className="relative w-full h-[130px] max-md:h-[140px] bg-gray-100 overflow-hidden group">
        {hasImages ? (
          <>
            <Image
              src={`${APP_URL}/${images[current]}`}
              alt={data?.businessName}
              width={500}
              height={500}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>

                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className={`block rounded-full transition-all ${
                        i === current
                          ? "w-2.5 h-1 bg-white"
                          : "w-1 h-1 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-gray-300 text-[10px]">No image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 p-3">
        {/* Category */}
        <span className="text-[12px] font-semibold text-orange-500">
          {data?.category?.name || "General"}
        </span>

        {/* Name */}
        <h3 className="text-md font-semibold text-[#212121] line-clamp-1 leading-snug">
          {data?.businessName}
        </h3>

        {/* Address */}
        <div className="flex items-start gap-0.5">
          <MapPin size={14} className="text-gray-800 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-800 line-clamp-2 leading-snug">
            {data?.businessAddress}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RecentBusinessCard;
