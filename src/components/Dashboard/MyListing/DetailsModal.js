import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  X,
  MapPin,
  Mail,
  Phone,
  Globe,
  TrendingUp,
  Eye,
  MessageSquare,
  Star,
} from "lucide-react";
import { API_URL, APP_URL } from "@/services/constants";

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

// Reuse StatCard inside this file (or import if already separated)
const StatCard = ({ icon: Icon, label, value, color = "gray" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-green-50 text-green-700 border-green-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    pink: "bg-pink-50 text-pink-700 border-pink-100",
    gray: "bg-gray-50 text-gray-700 border-gray-100",
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${colorClasses[color]}`}
    >
      {" "}
      <Icon size={16} />{" "}
      <div>
        {" "}
        <span className="text-xs text-gray-600">{label}</span>{" "}
        <span className="text-sm font-semibold block">{value}</span>{" "}
      </div>{" "}
    </div>
  );
};

const DetailsModal = ({ listing, onClose }) => {
  const stats = listing?.statistics || {};

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 overflow-y-scroll flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="text-orange-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">
              Listing Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Business Info */}
          <div className="flex gap-4">
            <Image
              width={500}
              height={500}
              src={`${APP_URL}/${listing?.logo}`}
              alt={listing?.businessName}
              className="w-24 h-24 rounded-lg object-contain border-2 border-gray-200"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {listing?.businessName}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{listing?.businessAddress}</span>
                </div>
                {listing?.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="flex-shrink-0" />
                    <span>{listing?.email}</span>
                  </div>
                )}
                {listing?.mobileNumber && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="flex-shrink-0" />
                    <span>
                      {listing?.countryCode} {listing?.mobileNumber}
                    </span>
                  </div>
                )}
                {listing?.websiteLink && (
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="flex-shrink-0" />
                    <a
                      href={listing?.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {listing?.websiteLink}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {listing?.description && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {listing?.description}
              </p>
            </div>
          )}

          {/* Statistics Grid */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp size={18} />
              Performance Statistics
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <StatCard
                icon={Eye}
                label="Total Views"
                value={stats.totalViews || 0}
                color="blue"
              />
              <StatCard
                icon={Phone}
                label="Total Calls"
                value={stats.totalCalls || 0}
                color="green"
              />
              <StatCard
                icon={MessageSquare}
                label="Total Leads"
                value={stats.totalLeads || 0}
                color="orange"
              />
              <StatCard
                icon={Globe}
                label="Website Visits"
                value={stats.websiteVisits || 0}
                color="purple"
              />
              <StatCard
                icon={Star}
                label="Avg Rating"
                value={
                  stats.averageRating ? stats.averageRating.toFixed(1) : "N/A"
                }
                color="pink"
              />
              <StatCard
                icon={MessageSquare}
                label="Total Reviews"
                value={stats.totalReviews || 0}
                color="gray"
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Business Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">
                    {listing?.category?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Established:</span>
                  <span className="font-medium">
                    {listing?.establishedYear || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      listing?.status === "approved"
                        ? "text-green-600"
                        : listing?.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {listing?.status?.charAt(0).toUpperCase() +
                      listing?.status?.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Published:</span>
                  <span className="font-medium">
                    {listing?.isPublished ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Plan & Progress
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">
                    {listing?.plan?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completion:</span>
                  <span className="font-medium">
                    Step {listing?.stepCompleted || 1}/6
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Step:</span>
                  <span className="font-medium">
                    {stepLabel(listing?.stepCompleted || 1)}
                  </span>
                </div>
                {listing?.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <Link
            href={`/dashboard/listing-forms?category=${listing?.category?._id}&categoryName=${encodeURIComponent(listing?.category?.name ?? "")}&name=${encodeURIComponent(listing?.slug)}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Edit Listing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
