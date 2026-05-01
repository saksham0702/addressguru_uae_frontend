import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  ToggleLeft,
  ToggleRight,
  Plus,
  ChevronDown,
} from "lucide-react";
import {
  get_rooms_by_listing,
  create_room,
  update_room,
  delete_room,
  toggle_room_status,
} from "@/api/rooms";
import RoomsPanel from "./RoomsPanel";
import { API_URL } from "@/services/constants";

const ROOM_SUPPORTED_CATEGORIES = ["Hotel", "Hostel", "Yoga Studio"];

const stepToPercent = (step) => {
  const map = { 1: 17, 2: 33, 3: 50, 4: 67, 5: 83, 6: 100 };
  return map[step] ?? 0;
};

const stepLabel = (step) => {
  const map = {
    1: "Business Info",
    2: "Social Links",
    3: "Contact Details",
    4: "SEO",
    5: "Media",
    6: "Plan & Published",
  };
  return map[step] ?? "Incomplete";
};

const CircularProgress = ({ percentage }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 83) return "#16a34a";
    if (percentage >= 50) return "#ea580c";
    return "#ef4444";
  };

  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke={getColor()}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-in-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold text-gray-700 leading-tight">
          {percentage}%
        </span>
        <span className="text-[8px] text-gray-400 leading-tight">done</span>
      </div>
    </div>
  );
};

// ─── Main MyListings ──────────────────────────────────────────────────────────
const MyListings = ({ data, APP_URL }) => {
  const [expandedRooms, setExpandedRooms] = useState({});
  const toggleRooms = (id) =>
    setExpandedRooms((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="bg-white shadow-sm border w-full max-md:w-[98%] max-md:mx-auto rounded-md border-gray-200">
      <div className="px-6 py-4 border-b bg-[#FFF8F3] border-gray-200">
        <h2 className="font-semibold text-gray-900">MY LISTINGS</h2>
      </div>

      <div className="md:p-4 p-2 space-y-4">
        {data?.map((listing) => {
          const categoryName = listing?.category?.name;
          const supportsRooms =
            ROOM_SUPPORTED_CATEGORIES.includes(categoryName);
          const percent = stepToPercent(listing?.stepCompleted ?? 1);
          const listingId = listing._id ?? listing.id;
          const isRoomOpen = expandedRooms[listingId];

          return (
            <div
              key={listingId}
              className="border border-gray-200 rounded-lg md:p-4 p-2.5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between gap-4">
                <div className="flex md:gap-4 gap-2 min-w-0 flex-1">
                  <Link
                    href={`/dashboard/listing-details/${listing?.slug}`}
                    className="w-20 h-20 max-md:w-13 max-md:h-13 flex-shrink-0"
                  >
                    <Image
                      width={500}
                      height={500}
                      src={`${API_URL}/${listing?.logo}`}
                      alt={listing?.businessName?.slice(0, 12)}
                      className="w-full h-full rounded-lg object-cover border border-gray-100"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-base max-md:text-sm text-gray-900 line-clamp-1 leading-5">
                      {listing?.businessName}
                    </p>
                    <p
                      className="text-xs text-gray-500 truncate max-w-[220px] md:max-w-[340px] cursor-default"
                      title={listing?.businessAddress}
                    >
                      {listing?.businessAddress}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {categoryName && (
                        <span className="inline-block text-[10px] font-semibold bg-orange-50 text-[#b55e10] px-2 py-0.5 rounded-full">
                          {categoryName}
                        </span>
                      )}

                      {listing?.status && (
                        <span
                          className={`text-[10px] font-semibold ${
                            listing.status === "approved"
                              ? "text-green-600"
                              : listing.status === "rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                          }`}
                        >
                          {listing.status.charAt(0).toUpperCase() +
                            listing.status.slice(1)}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Step {listing?.stepCompleted ?? 1}/6 —{" "}
                      {stepLabel(listing?.stepCompleted ?? 1)}
                    </p>

                    <div className="flex mt-1 items-center md:hidden gap-3">
                      <span className="text-xs text-gray-600">
                        Status —{" "}
                        <span className="font-semibold">published</span>
                      </span>
                      {listing?.upgrade === "Paid" && (
                        <span className="flex items-center gap-1 text-xs text-green-700 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                          Paid
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 whitespace-nowrap max-md:mt-1 mt-2 flex-wrap">
                      <Link
                        href={`/dashboard/listing-forms?category=${listing?.category?._id}&categoryName=${encodeURIComponent(categoryName ?? "")}&name=${encodeURIComponent(listing?.slug)}`}
                        className="inline-flex items-center gap-1.5 px-3 max-md:px-2 py-1.5 max-md:text-[10px] max-md:border max-md:border-blue-500 max-md:text-blue-500 md:bg-blue-600 md:hover:bg-blue-700 md:text-white text-xs font-semibold rounded-sm transition-colors"
                      >
                        <svg
                          className="max-md:text-blue-500 md:text-white"
                          width="15"
                          height="15"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.356 4.5739L8.75696 12.1729C8.00024 12.9297 5.75395 13.2801 5.25212 12.7783C4.7503 12.2765 5.09281 10.0302 5.84954 9.2735L13.4566 1.66647C13.6442 1.4618 13.8713 1.29728 14.1243 1.18282C14.3772 1.06835 14.6507 1.0063 14.9283 1.00045C15.2058 0.994616 15.4818 1.04507 15.7393 1.14879C15.9968 1.25251 16.2307 1.40736 16.4267 1.60394C16.6227 1.80053 16.7769 2.0348 16.8799 2.29261C16.9829 2.55043 17.0327 2.82643 17.0261 3.10399C17.0195 3.38155 16.9566 3.65492 16.8415 3.90754C16.7264 4.16017 16.5612 4.38686 16.356 4.5739Z"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8.16894 2.66211H4.1862C3.34116 2.66211 2.53079 2.99779 1.93326 3.59532C1.33574 4.19285 1 5.00327 1 5.84831V13.8138C1 14.6589 1.33574 15.4693 1.93326 16.0668C2.53079 16.6643 3.34116 17 4.1862 17H12.9482C14.7086 17 15.3379 15.5662 15.3379 13.8138V9.83105"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        EDIT
                      </Link>

                      <Link
                        href={{
                          pathname: `/${listing?.slug}`,
                          query: { preview: true },
                        }}
                        className="inline-flex items-center gap-1.5 px-3 max-md:px-2 py-1.5 max-md:text-[10px] uppercase text-orange-600 border border-orange-600 text-xs font-semibold rounded-sm transition-colors hover:bg-orange-50"
                      >
                        Preview
                      </Link>

                      {supportsRooms && (
                        <button
                          onClick={() => toggleRooms(listingId)}
                          className="inline-flex items-center gap-1.5 px-3 max-md:px-2 py-1.5 max-md:text-[10px] uppercase text-white bg-[#e07b20] hover:bg-[#c96d18] text-xs font-semibold rounded-sm transition-colors"
                        >
                          Rooms
                          <ChevronDown
                            size={12}
                            className={`transition-transform duration-200 ${isRoomOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="max-md:hidden flex flex-col items-center">
                    {listing?.upgrade === "Paid" && (
                      <span className="flex items-center gap-1 text-xs text-green-700 font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                        Paid
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <CircularProgress percentage={percent} />
                    <span className="text-[9px] text-gray-400 mt-0.5 text-center leading-tight max-w-[56px]">
                      Profile
                    </span>
                  </div>
                </div>
              </div>

              {supportsRooms && isRoomOpen && <RoomsPanel listing={listing} />}
            </div>
          );
        })}
      </div>

      {(!data || data.length === 0) && (
        <div className="p-12 text-center text-gray-500">
          <p>No listings found. Create your first listing to get started.</p>
        </div>
      )}
    </div>
  );
};

export default MyListings;
