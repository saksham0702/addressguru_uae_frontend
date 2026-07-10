import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IMG_URL } from "@/services/constants";

const RecentListingCard = ({ data, slugData }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    if (!price?.amount) return null;
    return new Intl.NumberFormat("en-AE").format(price.amount);
  };

  return (
    <Link
      href={`/${slugData}/${data?.slug}?id=${data?._id}`}
      className="block w-[180px] h-[360px] md:w-[200px] 2xl:min-w-[240px] rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex-shrink-0 bg-white border border-gray-100 group"
    >
      {/* Image Section */}
      <div className="w-full h-[200px] bg-gray-100 relative overflow-hidden">
        {data?.images?.length > 0 ? (
          <Image
            height={500}
            width={500}
            src={`${IMG_URL}/${data.images[0]}`}
            alt={data?.title || "Listing"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg
              className="w-14 h-14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Condition Badge */}
        {data?.condition && (
          <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 px-2 py-0.5 rounded-full capitalize">
            {data.condition}
          </span>
        )}

        {/* City Badge */}
        {data?.city?.name && (
          <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <svg
              className="w-2.5 h-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {data.city.name}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="h-[160px] px-3 py-3 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Price or Enquire */}
          {data?.price?.amount ? (
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-semibold text-gray-400">
                {data.price.currency}
              </span>
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                {formatPrice(data.price)}
              </span>
              {data.price.isNegotiable && (
                <span className="text-[10px] text-emerald-600 font-medium ml-1 bg-emerald-50 px-1.5 py-0.5 rounded">
                  Negotiable
                </span>
              )}
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Enquire for price
            </span>
          )}

          {/* Title */}
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
            {data?.title || "Untitled Listing"}
          </h3>

          {/* Category */}
          {data?.category?.name && (
            <p className="text-xs text-gray-400 font-normal">
              in {data.category.name}
              {data?.subCategory?.name && ` › ${data.subCategory.name}`}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-gray-400">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-[11px]">{formatDate(data?.createdAt)}</span>
          </div>

          {/* Verification Badge */}
          {data?.isVerified && (
            <span className="text-[10px] text-blue-600 font-medium flex items-center gap-0.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecentListingCard;
