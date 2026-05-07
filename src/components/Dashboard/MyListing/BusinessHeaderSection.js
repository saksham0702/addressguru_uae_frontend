import React from "react";
import {
  ChevronLeft,
  Eye,
  Phone,
  MessageSquare,
  Star,
  Globe,
  Plus,
  MousePointerClick,
  Building2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { APP_URL } from "@/services/constants";
import { useRouter } from "next/router";
import { X } from "lucide-react";
import RoomsPanel from "../RoomsPanel";
import AddInfoModal from "./AddInfoModal";

// ── Circular Progress ─────────────────────────────────────────────────────────
const CircularProgress = ({ percentage }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 83) return "#16a34a";
    if (percentage >= 50) return "#ea580c";
    return "#ef4444";
  };

  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 70 70">
        <circle
          cx="35"
          cy="35"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="7"
          fill="none"
        />
        <circle
          cx="35"
          cy="35"
          r={radius}
          stroke={getColor()}
          strokeWidth="7"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-in-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-semibold text-gray-800 leading-tight">
          {percentage}%
        </span>
        <span className="text-[10px] text-gray-500 leading-tight">
          Complete
        </span>
      </div>
    </div>
  );
};

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

const ROOM_SUPPORTED_CATEGORIES = ["Hotel", "Hostel", "Yoga Studio"];

const BusinessHeaderSection = ({ data }) => {
  const router = useRouter();
  const [showRoomsModal, setShowRoomsModal] = React.useState(false);
  const [showAddInfoModal, setShowAddInfoModal] = React.useState(false);

  const percent = stepToPercent(data?.stepCompleted ?? 1);
  const stats = data?.statistics || {};
  const categoryName = data?.category?.name || data?.category?.slug || "";
  const supportsRooms = ROOM_SUPPORTED_CATEGORIES.includes(categoryName);

  return (
    <div className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-orange-300 transition-all duration-200 bg-white">
      <div className="flex gap-6">
        {/* Left Section - Image & Main Info */}
        <div className="flex gap-4 flex-1 min-w-0">
          {/* Back Button + Logo */}
          <div className="flex items-start gap-2">
            <button
              onClick={() => router.push("/dashboard/listings")}
              className="mt-2 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-orange-500 transition-all flex-shrink-0"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="relative w-28 h-28 flex-shrink-0">
              <Image
                width={500}
                height={500}
                src={`${APP_URL}/${data?.logo}`}
                alt={data?.businessName || "Business"}
                className="w-full h-full rounded-xl object-contain border-2 border-gray-200 shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Business Name & Status */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h1 className="font-semibold text-lg text-gray-900 line-clamp-1">
                {data?.businessName}
              </h1>
              <div className="flex items-center gap-2 flex-shrink-0">
                {data?.isPublished && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    <Eye size={12} />
                    Published
                  </span>
                )}
                {data?.status && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      data.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : data.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {data.status.charAt(0).toUpperCase() +
                      data.status.slice(1)}
                  </span>
                )}
              </div>
            </div>

            {/* Address */}
            <p
              className="text-sm text-gray-600 line-clamp-1 mb-3 leading-relaxed"
              title={data?.businessAddress}
            >
              {data?.businessAddress}
            </p>

            {/* Category & Plan */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {categoryName && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                  <Building2 size={12} />
                  {categoryName}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                Starter Plan
              </span>
              <span className="text-xs bg-orange-50 text-orange-500 px-3 py-1 font-bold rounded-full cursor-pointer hover:bg-orange-100 transition-colors">
                UPGRADE NOW
              </span>
            </div>

            {/* Quick Stats */}
            {/* <div className="grid grid-cols-5 max-w-xl gap-1 mb-3">
              <div className="rounded-lg px-2 py-1">
                <div className="flex items-center gap-1.5">
                  <Eye size={14} className="text-blue-600" />
                  <span className="text-xs text-gray-600">Views</span>
                  <p className="text-base font-semibold text-blue-700">
                    {stats.totalViews || 0}
                  </p>
                </div>
              </div>
              <div className="rounded-lg px-2 py-1">
                <div className="flex items-center gap-1.5">
                  <Phone size={14} className="text-green-600" />
                  <span className="text-xs text-gray-600">Calls</span>
                  <p className="text-base font-semibold text-green-700">
                    {stats.totalCalls || 0}
                  </p>
                </div>
              </div>
              <div className="rounded-lg px-2 py-1">
                <div className="flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-orange-600" />
                  <span className="text-xs text-gray-600">Leads</span>
                  <p className="text-base font-semibold text-orange-700">
                    {stats.totalLeads || 0}
                  </p>
                </div>
              </div>
              <div className="rounded-lg px-2 py-1">
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-yellow-500" />
                  <span className="text-xs text-gray-600">Reviews</span>
                  <p className="text-base font-semibold text-yellow-600">
                    {stats.totalReviews || 0}
                  </p>
                </div>
              </div>
              <div className="rounded-lg px-2 py-1">
                <div className="flex items-center gap-1.5">
                  <Globe size={14} className="text-purple-600" />
                  <span className="text-xs text-gray-600">Web</span>
                  <p className="text-base font-semibold text-purple-700">
                    {stats.totalWebsiteVisits || 0}
                  </p>
                </div>
              </div>
            </div> */}

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Link
                href={`/dashboard/listing-forms?category=${data?.category?._id}&categoryName=${encodeURIComponent(categoryName ?? "")}&name=${encodeURIComponent(data?.slug ?? "")}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all"
              >
                <svg
                  width="16"
                  height="16"
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
                Edit
              </Link>

              <button
                onClick={() => setShowAddInfoModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-all"
              >
                <Plus size={16} />
                Add Info
              </button>

              <Link
                href={`/${data?.slug}?preview=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-orange-500 text-orange-600 text-sm font-semibold rounded-lg hover:bg-orange-50 transition-all"
              >
                <MousePointerClick size={16} />
                Preview
              </Link>

              {supportsRooms && (
                <button
                  onClick={() => setShowRoomsModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-all"
                >
                  Rooms
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Progress */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          <CircularProgress percentage={percent} />
          <div className="text-center">
            <p className="text-xs text-gray-500 font-medium">
              Step {data?.stepCompleted ?? 1}/6
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {stepLabel(data?.stepCompleted ?? 1)}
            </p>
          </div>
        </div>
      </div>

      {/* Rooms Modal */}
      {showRoomsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-gray-50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Manage Rooms</h3>
                <p className="text-xs text-gray-500 mt-0.5">{data?.businessName}</p>
              </div>
              <button
                onClick={() => setShowRoomsModal(false)}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto">
              <RoomsPanel
                listing={data}
                onRoomChanged={() => {
                  // Option: You can trigger a refresh of the single listing data here
                  // if needed, by passing a callback prop from the parent.
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Info Modal */}
      <AddInfoModal
        isOpen={showAddInfoModal}
        onClose={() => setShowAddInfoModal(false)}
        listingData={data}
      />
    </div>
  );
};

export default BusinessHeaderSection;
