import React, { useEffect, useState } from "react";
import {
  X,
  Calendar,
  Phone,
  Mail,
  User,
  FileText,
  Clock,
  AlertTriangle,
  Star,
  MessageSquare,
  Shield,
  Flag,
} from "lucide-react";
import {
  getMyClaims,
  getMyReports,
  getMyReviews,
} from "@/api/listing-features";

// ─── Shared Helpers ───────────────────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "approved":
      return "bg-green-100 text-green-700 border-green-200";
    case "reviewed":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "action_taken":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "rejected":
    case "dismissed":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

// ─── Star Rating Component ────────────────────────────────────────────────────
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={
            i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }
        />
      ))}
      <span className="ml-1.5 text-sm font-semibold text-gray-700">
        {rating}/5
      </span>
    </div>
  );
};

// ─── Modal Shell ──────────────────────────────────────────────────────────────
const ModalShell = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  iconColor,
  count,
  children,
}) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColor}`}
            >
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                {count !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-gray-200 text-gray-600 rounded-full">
                    {count}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 flex justify-end bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Loading / Empty / Error States ───────────────────────────────────────────
const LoadingState = ({ text }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-10 h-10 border-3 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
    <p className="text-sm text-gray-500 mt-4 font-medium">
      {text || "Loading…"}
    </p>
  </div>
);

const EmptyState = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
      <Icon size={24} className="text-gray-400" />
    </div>
    <p className="text-sm font-medium text-gray-500">{text}</p>
  </div>
);

const ErrorState = ({ text }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-3">
      <AlertTriangle size={24} className="text-red-400" />
    </div>
    <p className="text-sm font-medium text-red-500">{text}</p>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  CLAIMS MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const ClaimsModal = ({ isOpen, onClose, slug }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setError(null);

    getMyClaims()
      .then((response) => {
        let all = [];

        if (Array.isArray(response)) {
          all = response;
        } else if (response?.listings && Array.isArray(response.listings)) {
          all = response.listings; // ✅ add this
        } else if (response?.data && Array.isArray(response.data)) {
          all = response.data;
        } else if (response?.claims && Array.isArray(response.claims)) {
          all = response.claims;
        }

        const filtered = all.filter(
          (c) => c?.listingId?.slug === slug || c?.listingSlug === slug,
        );

        setData(filtered);
      })
      .catch((err) => {
        console.error("Claims error:", err);
        setError("Failed to load claims.");
      })
      .finally(() => setLoading(false));
  }, [isOpen, slug]);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Claims"
      subtitle={slug}
      icon={Shield}
      iconColor="bg-blue-500"
      count={data.length}
    >
      {loading && <LoadingState text="Loading claims…" />}
      {error && <ErrorState text={error} />}
      {!loading && !error && data.length === 0 && (
        <EmptyState icon={Shield} text="No claims found for this listing." />
      )}
      {!loading && !error && data.length > 0 && (
        <div className="space-y-4">
          {data.map((claim) => (
            <div
              key={claim._id}
              className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-blue-200 transition-colors"
            >
              {/* Top row: Status + ID */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(claim.status)}`}
                >
                  {claim.status?.toUpperCase() || "UNKNOWN"}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  #{claim._id?.slice(-8)}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {claim.fullName || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <p className="text-sm font-medium text-gray-900 break-all">
                      {claim.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">
                      Mobile Number
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {claim.countryCode && claim.mobileNumber
                        ? `+${claim.countryCode} ${claim.mobileNumber}`
                        : claim.mobileNumber || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Submitted</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(claim.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reason */}
              {claim.reasonForClaim && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">
                        Reason for Claim
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {claim.reasonForClaim}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Updated timestamp */}
              {claim.updatedAt && claim.updatedAt !== claim.createdAt && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Last updated: {formatDate(claim.updatedAt)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ModalShell>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  REPORTS MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const ReportsModal = ({ isOpen, onClose, slug }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    getMyReports()
      .then((response) => {
        console.log("Reports response:", response);

        let all = [];

        if (Array.isArray(response)) {
          all = response;
        } else if (response?.listings && Array.isArray(response.listings)) {
          all = response.listings; // ✅ ADD THIS
        } else if (response?.data && Array.isArray(response.data)) {
          all = response.data;
        }

        const filtered = all.filter(
          (r) => r?.listingId?.slug === slug || r?.listingSlug === slug,
        );

        setData(filtered);
      })
      .catch((err) => {
        console.error("Reports error:", err);
        setError("Failed to load reports.");
      })
      .finally(() => setLoading(false));
  }, [isOpen, slug]);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Reports"
      subtitle={slug}
      icon={Flag}
      iconColor="bg-red-500"
      count={data.length}
    >
      {loading && <LoadingState text="Loading reports…" />}
      {error && <ErrorState text={error} />}
      {!loading && !error && data.length === 0 && (
        <EmptyState icon={Flag} text="No reports found for this listing." />
      )}
      {!loading && !error && data.length > 0 && (
        <div className="space-y-4">
          {data.map((report) => (
            <div
              key={report._id}
              className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-red-200 transition-colors"
            >
              {/* Top row: Status + ID */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}
                >
                  {report.status?.toUpperCase() || "UNKNOWN"}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  #{report._id?.slice(-8)}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reason */}
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Reason</p>
                    <p className="text-sm font-medium text-gray-900">
                      {report.reason || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Listing */}
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Listing</p>
                    <p className="text-sm font-medium text-gray-900">
                      {report.listingId?.businessName ||
                        report.listingSlug ||
                        "N/A"}
                    </p>
                  </div>
                </div>

                {/* Submitted Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Submitted</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(report.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Model Type */}
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Type</p>
                    <p className="text-sm font-medium text-gray-900">
                      {report.listingModel || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {report.description && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Description</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {report.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Updated timestamp */}
              {report.updatedAt && report.updatedAt !== report.createdAt && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Last updated: {formatDate(report.updatedAt)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ModalShell>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  REVIEWS MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const ReviewsModal = ({ isOpen, onClose, slug }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    getMyReviews()
      .then((response) => {
        console.log("response", response);
        // API returns { listings: [...], total, statistics, pagination }
        let all = [];
        if (Array.isArray(response)) {
          all = response;
        } else if (response?.listings && Array.isArray(response.listings)) {
          all = response.listings;
        } else if (response?.data && Array.isArray(response.data)) {
          all = response.data;
        } else if (response?.reviews && Array.isArray(response.reviews)) {
          all = response.reviews;
        }

        const filtered = all.filter(
          (r) => r?.listingId?.slug === slug || r?.listingSlug === slug,
        );
        setData(filtered);
      })
      .catch((err) => {
        console.error("Reviews error:", err);
        setError("Failed to load reviews.");
      })
      .finally(() => setLoading(false));
  }, [isOpen, slug]);

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Reviews"
      subtitle={slug}
      icon={Star}
      iconColor="bg-green-500"
      count={data.length}
    >
      {loading && <LoadingState text="Loading reviews…" />}
      {error && <ErrorState text={error} />}
      {!loading && !error && data.length === 0 && (
        <EmptyState icon={Star} text="No reviews found for this listing." />
      )}
      {!loading && !error && data.length > 0 && (
        <div className="space-y-4">
          {data.map((review) => (
            <div
              key={review._id}
              className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-green-200 transition-colors"
            >
              {/* Top row: Status + Rating + ID */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(review.status)}`}
                  >
                    {review.status?.toUpperCase() || "UNKNOWN"}
                  </span>
                  {review.rating && <StarRating rating={review.rating} />}
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  #{review._id?.slice(-8)}
                </span>
              </div>

              {/* Reviewer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Reviewer</p>
                    <p className="text-sm font-medium text-gray-900">
                      {review.fullName || review.name || "Anonymous"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Email</p>
                    <p className="text-sm font-medium text-gray-900 break-all">
                      {review.email || review.rating_email || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Listing */}
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Listing</p>
                    <p className="text-sm font-medium text-gray-900">
                      {review.title ||
                        review.listingId?.businessName ||
                        review.listingSlug ||
                        "N/A"}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Submitted</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Text */}
              {(review.reviewText || review.message) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Review</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {review.reviewText || review.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Updated timestamp */}
              {review.updatedAt && review.updatedAt !== review.createdAt && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Last updated: {formatDate(review.updatedAt)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ModalShell>
  );
};
