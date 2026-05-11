import React, { useEffect, useState, useCallback } from "react";
import {
  Star,
  Shield,
  Flag,
  MessageSquare,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  AlertTriangle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
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

// ─── Star Rating ──────────────────────────────────────────────────────────────
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={13}
        className={
          i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }
      />
    ))}
    <span className="ml-1 text-xs font-semibold text-gray-600">
      {rating}/5
    </span>
  </div>
);

// ─── Stats Chips ──────────────────────────────────────────────────────────────
const StatsChips = ({ statistics }) => {
  if (!statistics) return null;
  const chips = Object.entries(statistics).filter(
    ([key]) => key !== "total",
  );
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-bold text-gray-700">
        Total: {statistics.total || 0}
      </span>
      {chips.map(([key, val]) => (
        <span
          key={key}
          className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusColor(key)}`}
        >
          {key}: {val}
        </span>
      ))}
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages } = pagination;

  const getPageNumbers = () => {
    const items = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(pages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) items.push(i);
    return items;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      {getPageNumbers().map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
            num === page
              ? "bg-orange-500 text-white shadow-sm"
              : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          {num}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

// ─── Loading / Empty States ───────────────────────────────────────────────────
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <Loader2 size={28} className="text-orange-500 animate-spin" />
    <p className="text-sm text-gray-500 mt-3 font-medium">Loading…</p>
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

// ─── Review Card ──────────────────────────────────────────────────────────────
const ReviewCard = ({ item }) => (
  <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-green-200 hover:shadow-sm transition-all">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(item.status)}`}
        >
          {item.status?.toUpperCase()}
        </span>
        {item.rating && <StarRating rating={item.rating} />}
      </div>
      <span className="text-[11px] text-gray-400 font-mono">
        #{item._id?.slice(-8)}
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      <div className="flex items-center gap-2">
        <User size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-800 font-medium truncate">
          {item.fullName || item.name || "Anonymous"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Mail size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-600 truncate">
          {item.email || item.rating_email || "N/A"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <FileText size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-600 truncate">
          {item.title || item.listingId?.businessName || item.listingSlug || "N/A"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-600">
          {formatDate(item.createdAt)}
        </span>
      </div>
    </div>

    {(item.reviewText || item.message) && (
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-start gap-2">
          <MessageSquare size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {item.reviewText || item.message}
          </p>
        </div>
      </div>
    )}
  </div>
);

// ─── Claim Card ───────────────────────────────────────────────────────────────
const ClaimCard = ({ item }) => (
  <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all">
    <div className="flex items-center justify-between mb-3">
      <span
        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(item.status)}`}
      >
        {item.status?.toUpperCase()}
      </span>
      <span className="text-[11px] text-gray-400 font-mono">
        #{item._id?.slice(-8)}
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      <div className="flex items-center gap-2">
        <User size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-800 font-medium truncate">
          {item.fullName || item.name || "N/A"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Mail size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-600 truncate">
          {item.email || "N/A"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Phone size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-600">
          {item.countryCode && item.mobileNumber
            ? `+${item.countryCode} ${item.mobileNumber}`
            : item.phone || item.mobileNumber || "N/A"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-600">
          {formatDate(item.createdAt)}
        </span>
      </div>
      <div className="flex items-center gap-2 md:col-span-2">
        <FileText size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-600 truncate">
          {item.title || item.listingId?.businessName || item.listingSlug || "N/A"}
        </span>
      </div>
    </div>

    {(item.reasonForClaim || item.message) && (
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-start gap-2">
          <FileText size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[11px] text-gray-500 mb-0.5">Reason</p>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {item.reasonForClaim || item.message}
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
);

// ─── Report Card ──────────────────────────────────────────────────────────────
const ReportCard = ({ item }) => (
  <div className="bg-white rounded-lg p-5 border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all">
    <div className="flex items-center justify-between mb-3">
      <span
        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(item.status)}`}
      >
        {item.status?.toUpperCase()}
      </span>
      <span className="text-[11px] text-gray-400 font-mono">
        #{item._id?.slice(-8)}
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      <div className="flex items-center gap-2">
        <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
        <span className="text-sm text-gray-800 font-medium truncate">
          {item.reason || "N/A"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <FileText size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-600 truncate">
          {item.title || item.listingId?.businessName || item.listingSlug || "N/A"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-600">
          {formatDate(item.createdAt)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Shield size={14} className="text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-600">
          {item.listingModel || "N/A"}
        </span>
      </div>
    </div>

    {(item.description || item.message) && (
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-start gap-2">
          <MessageSquare size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {item.description || item.message}
          </p>
        </div>
      </div>
    )}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  TAB CONFIG
// ═══════════════════════════════════════════════════════════════════════════════
const TABS = [
  {
    key: "reviews",
    label: "Reviews",
    icon: Star,
    color: "text-green-600",
    activeBg: "bg-green-50 border-green-500 text-green-700",
    fetcher: getMyReviews,
    Card: ReviewCard,
    emptyText: "No reviews yet",
  },
  {
    key: "claims",
    label: "Claims",
    icon: Shield,
    color: "text-blue-600",
    activeBg: "bg-blue-50 border-blue-500 text-blue-700",
    fetcher: getMyClaims,
    Card: ClaimCard,
    emptyText: "No claims yet",
  },
  {
    key: "reports",
    label: "Reports",
    icon: Flag,
    color: "text-red-600",
    activeBg: "bg-red-50 border-red-500 text-red-700",
    fetcher: getMyReports,
    Card: ReportCard,
    emptyText: "No reports yet",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const ListingFeaturesPanel = () => {
  const [activeTab, setActiveTab] = useState("reviews");
  const [tabData, setTabData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Normalize the various API response shapes into { items, statistics, pagination }
  const normalizeResponse = (response) => {
    let items = [];
    let statistics = null;
    let pagination = null;

    if (Array.isArray(response)) {
      items = response;
    } else if (response?.listings && Array.isArray(response.listings)) {
      items = response.listings;
      statistics = response.statistics || null;
      pagination = response.pagination || null;
    } else if (response?.data?.listings && Array.isArray(response.data.listings)) {
      items = response.data.listings;
      statistics = response.data.statistics || null;
      pagination = response.data.pagination || null;
    } else if (response?.data && Array.isArray(response.data)) {
      items = response.data;
      statistics = response.statistics || null;
      pagination = response.pagination || null;
    }

    return { items, statistics, pagination };
  };

  const fetchTab = useCallback(
    async (tabKey, page = 1) => {
      const tab = TABS.find((t) => t.key === tabKey);
      if (!tab) return;

      setLoading(true);
      setError(null);

      try {
        const response = await tab.fetcher(page);
        const normalized = normalizeResponse(response);
        setTabData((prev) => ({
          ...prev,
          [tabKey]: normalized,
        }));
      } catch (err) {
        console.error(`${tabKey} fetch error:`, err);
        setError(`Failed to load ${tabKey}.`);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchTab(activeTab);
  }, [activeTab, fetchTab]);

  const handlePageChange = (page) => {
    fetchTab(activeTab, page);
  };

  const currentTab = TABS.find((t) => t.key === activeTab);
  const currentData = tabData[activeTab] || { items: [], statistics: null, pagination: null };

  return (
    <div className="bg-white shadow-sm border rounded-lg border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-gradient-to-r from-orange-50 to-amber-50 border-gray-200">
        <h2 className="font-medium text-xl text-gray-900">
          ACTIVITY & ENGAGEMENT
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Reviews, claims, and reports across all your listings
        </p>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4 pb-0 border-b border-gray-200">
        <div className="flex gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            const count = tabData[tab.key]?.statistics?.total ?? tabData[tab.key]?.items?.length ?? "";
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${
                  isActive
                    ? tab.activeBg
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon size={16} className={isActive ? "" : tab.color} />
                {tab.label}
                {count !== "" && (
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/60 text-current"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Bar */}
      {currentData.statistics && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <StatsChips statistics={currentData.statistics} />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {loading && <LoadingState />}
        {error && <ErrorState text={error} />}
        {!loading && !error && currentData.items.length === 0 && (
          <EmptyState
            icon={currentTab?.icon || Star}
            text={currentTab?.emptyText || "No data found"}
          />
        )}
        {!loading && !error && currentData.items.length > 0 && (
          <>
            <div className="space-y-3">
              {currentData.items.map((item) => {
                const Card = currentTab.Card;
                return <Card key={item._id || item.id} item={item} />;
              })}
            </div>

            {/* Pagination */}
            {currentData.pagination && (
              <Pagination
                pagination={currentData.pagination}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListingFeaturesPanel;
