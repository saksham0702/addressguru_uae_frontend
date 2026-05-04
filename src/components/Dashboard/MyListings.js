import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  ToggleLeft,
  ToggleRight,
  Plus,
  ChevronDown,
  Eye,
  Phone,
  MousePointerClick,
  Star,
  MessageSquare,
  Globe,
  X,
  Info,
  Calendar,
  MapPin,
  Mail,
  Building2,
  TrendingUp,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  get_rooms_by_listing,
  create_room,
  update_room,
  delete_room,
  toggle_room_status,
} from "@/api/rooms";
import RoomsPanel from "./RoomsPanel";
import { API_URL, APP_URL } from "@/services/constants";
import DetailsModal from "./MyListing/DetailsModal";
import { unpublish_listing, delete_listing } from "@/api/uae-dashboard";
import ConfirmationModal from "./MyListing/ConfirmationModal";
import PostAdsPop from "./Popups/PostAdsPop";

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

// ─── Enhanced Circular Progress ──────────────────────────────────────────────
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

// ─── Toast Notification ────────────────────────────────────────────────────────
const Toast = ({ toast }) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] animate-in slide-in-from-bottom-5">
      <div
        className={`flex items-center gap-2 px-5 py-3 rounded-lg shadow-xl border font-medium ${
          toast.type === "error"
            ? "bg-red-50 border-red-200 text-red-700"
            : "bg-green-50 border-green-200 text-green-700"
        }`}
      >
        <span className="text-lg">{toast.type === "error" ? "✕" : "✓"}</span>
        {toast.msg}
      </div>
    </div>
  );
};

// ─── Main MyListings ──────────────────────────────────────────────────────────
const MyListings = ({ data, onRefresh }) => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [roomsModalListing, setRoomsModalListing] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    action: null,
    listing: null,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState({});
  const [toast, setToast] = useState(null);

  const [postAdd,setPostAdd] = useState(false);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle publish (direct, no popup)
  const handlePublish = async (listing) => {
    console.log("listing", listing);
    const listingId = listing?.slug;
    console.log(listingId);
    setPublishLoading((prev) => ({ ...prev, [listingId]: true }));
    try {
      const res = await unpublish_listing(listingId, "publish");
      if (res) {
        showToast("Listing published successfully!");
        if (onRefresh) onRefresh();
      } else {
        showToast("Failed to publish listing.", "error");
      }
    } catch (err) {
      console.error("Publish failed:", err);
      showToast("An error occurred.", "error");
    } finally {
      setPublishLoading((prev) => ({ ...prev, [listingId]: false }));
    }
  };

  // Handle unpublish (popup)
  const handleUnpublish = (listing) => {
    setConfirmModal({ open: true, action: "unpublish", listing });
  };

  // Handle delete (popup)
  const handleDelete = (listing) => {
    setConfirmModal({ open: true, action: "delete", listing });
  };

  // Confirm action from modal
  const handleConfirmAction = async () => {
    const { action, listing } = confirmModal;
    const listingId = listing.slug;
    setActionLoading(true);
    try {
      let res;
      if (action === "delete") {
        res = await delete_listing(listingId);
      } else {
        res = await unpublish_listing(listingId, "unpublish");
      }

      if (res) {
        showToast(
          `Listing ${action === "delete" ? "deleted" : "unpublished"} successfully!`,
        );
        if (onRefresh) onRefresh();
      } else {
        showToast(`Failed to ${action} listing.`, "error");
      }
    } catch (err) {
      console.error(`${action} failed:`, err);
      showToast(`An error occurred while trying to ${action}.`, "error");
    } finally {
      setActionLoading(false);
      setConfirmModal({ open: false, action: null, listing: null });
    }
  };

  const handleRoomsModalOpen = (listing) => setRoomsModalListing(listing);
  const handleRoomsModalClose = () => setRoomsModalListing(null);

  return (
    <>
      <div className="bg-white shadow-sm border rounded-lg border-gray-200">
        <div className="px-6 py-4 border-b bg-gradient-to-r from-orange-50 to-amber-50 border-gray-200">
          <h2 className="font-medium text-xl text-gray-900">MY LISTINGS</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage and monitor your business listings
          </p>
        </div>

        <div className="p-6 space-y-6">
          {data?.map((listing) => {
            const categoryName = listing?.category?.name;
            const supportsRooms =
              ROOM_SUPPORTED_CATEGORIES.includes(categoryName);
            const percent = stepToPercent(listing?.stepCompleted ?? 1);
            const listingId = listing._id ?? listing.id;
            const stats = listing?.statistics || {};

            return (
              <div
                key={listingId}
                className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-orange-300 transition-all duration-200"
              >
                <div className="flex gap-6">
                  {/* Left Section - Image & Main Info */}
                  <div className="flex gap-4 flex-1 min-w-0">
                    <div className="relative w-28 h-28 flex-shrink-0">
                      <Image
                        width={500}
                        height={500}
                        src={`${APP_URL}/${listing?.logo}`}
                        alt={listing?.businessName}
                        className="w-full h-full rounded-xl object-contain border-2 border-gray-200 shadow-sm"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Business Name & Status */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Link href={`/dashboard/listings/listing-details/${listing?.slug}`} className="font-semibold text-lg hover:scale-105  hover:text-blue-600 text-gray-900 line-clamp-1">
                          {listing?.businessName}
                        </Link>
                        {listing?.status && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                              listing.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : listing.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {listing.status.charAt(0).toUpperCase() +
                              listing.status.slice(1)}
                          </span>
                        )}
                      </div>

                      {/* Address */}
                      <p
                        className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed"
                        title={listing?.businessAddress}
                      >
                        {listing?.businessAddress}
                      </p>

                      {/* Category & Tags */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {categoryName && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                            <Building2 size={12} />
                            {categoryName}
                          </span>
                        )}
                        {listing?.isPublished && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                            <Eye size={12} />
                            Published
                          </span>
                        )}
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 max-w-100 gap-1 mb-3">
                        <div
                          onClick={() => setSelectedListing(listing)}
                          className=" cursor-pointer rounded-lg px-2 py-1  "
                        >
                          <div className="flex items-center gap-1.5 ">
                            <Eye size={14} className="text-blue-600" />
                            <span className="text-xs text-gray-600">Views</span>
                            <p className="text-base font-semibold text-blue-700">
                              {stats.totalViews || 0}
                            </p>
                          </div>
                        </div>
                        <div
                          onClick={() => setSelectedListing(listing)}
                          className=" cursor-pointer rounded-lg px-2 py-1  "
                        >
                          <div className="flex items-center gap-1.5 ">
                            <Phone size={14} className="text-green-600" />
                            <span className="text-xs text-gray-600">Calls</span>
                            <p className="text-base font-semibold text-green-700">
                              {stats.totalCalls || 0}
                            </p>
                          </div>
                        </div>
                        <div
                          onClick={() => setSelectedListing(listing)}
                          className=" cursor-pointer rounded-lg px-2 py-1  "
                        >
                          <div className="flex items-center gap-1.5 ">
                            <MessageSquare
                              size={14}
                              className="text-orange-600"
                            />
                            <span className="text-xs text-gray-600">Leads</span>
                            <p className="text-base font-semibold text-orange-700">
                              {stats.totalLeads || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        <Link href={`/dashboard/listings/listing-details/${listing?.slug}`} className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all">
                          <Eye size={16} />
                          View Details
                        </Link>

                        <Link
                          href={`/dashboard/listing-forms?category=${listing?.category?._id}&categoryName=${encodeURIComponent(categoryName ?? "")}&name=${encodeURIComponent(listing?.slug)}`}
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

                        <Link
                          href={`/dashboard/listing-forms?category=${listing?.category?._id}&categoryName=${encodeURIComponent(categoryName ?? "")}&name=${encodeURIComponent(listing?.slug)}&mode=additional`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-all"
                        >
                          <Plus size={16} />
                          Add Info
                        </Link>

                        <Link
                          href={`/${listing?.slug}?preview=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-orange-500 text-orange-600 text-sm font-semibold rounded-lg hover:bg-orange-50 transition-all"
                        >
                          <MousePointerClick size={16} />
                          Preview
                        </Link>

                        {/* Publish / Unpublish Toggle */}
                        {listing?.isPublished ? (
                          <button
                            onClick={() => handleUnpublish(listing)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border-2 border-yellow-400 text-yellow-700 text-sm font-semibold rounded-lg hover:bg-yellow-100 hover:border-yellow-500 transition-all"
                          >
                            <ToggleRight size={16} />
                            Unpublish
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublish(listing)}
                            disabled={publishLoading[listingId]}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {publishLoading[listingId] ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <ToggleLeft size={16} />
                            )}
                            {publishLoading[listingId]
                              ? "Publishing..."
                              : "Publish"}
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(listing)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-400 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 hover:border-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>

                        {supportsRooms && (
                          <button
                            onClick={() => handleRoomsModalOpen(listing)}
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
                        Step {listing?.stepCompleted ?? 1}/6
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {stepLabel(listing?.stepCompleted ?? 1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {(!data || data.length === 0) && (
          <div className="p-16 text-center">
            <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No listings found
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first listing to get started
            </p>
            <button
            onClick={() => setPostAdd(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all"
            >
              <Plus size={20} />
              Create Listing
            </button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedListing && (
        <DetailsModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}

      {/* Confirmation Modal for Unpublish / Delete */}
      <ConfirmationModal
        isOpen={confirmModal.open}
        onClose={() =>
          setConfirmModal({ open: false, action: null, listing: null })
        }
        onConfirm={handleConfirmAction}
        action={confirmModal.action}
        listingName={confirmModal.listing?.businessName || ""}
        isLoading={actionLoading}
      />

      {/* Rooms Modal */}
      {roomsModalListing && (
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
                <p className="text-xs text-gray-500 mt-0.5">{roomsModalListing.businessName}</p>
              </div>
              <button
                onClick={handleRoomsModalClose}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto">
              <RoomsPanel
                listing={roomsModalListing}
                onRoomChanged={() => {
                  if (onRefresh) onRefresh();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast toast={toast} />
      {postAdd && <PostAdsPop setPostAdd={setPostAdd} />}
    </>
  );
};

export default MyListings;
