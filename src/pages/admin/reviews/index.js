import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Check,
  X,
} from "lucide-react";
import { getAllReviewsAdmin, updateReviewStatus } from "@/api/listing-features";

const LIMIT = 10;

const statusStyles = {
  approved: "bg-green-50 text-green-700 border border-green-200",
  rejected: "bg-red-50 text-red-600 border border-red-200",
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
};

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={13}
        className={
          s <= rating
            ? "text-[#FF6E04] fill-[#FF6E04]"
            : "text-gray-200 fill-gray-200"
        }
      />
    ))}
    <span className="text-xs font-semibold text-gray-700 ml-1">{rating}</span>
  </div>
);

const StatCard = ({ title, value, icon: Icon, iconClass }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}
    >
      <Icon size={18} />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{title}</p>
      <p className="text-xl font-bold text-gray-800 leading-tight">{value}</p>
    </div>
  </div>
);

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(LIMIT);
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });
  const [actionLoading, setActionLoading] = useState(null);

  const fetchReviews = async (overrides = {}) => {
    try {
      setLoading(true);
      const res = await getAllReviewsAdmin({
        page: overrides.page ?? page,
        limit,
        status: overrides.status ?? status,
        sort: overrides.sort ?? sort,
        search: overrides.search ?? search,
      });
      setReviews(res.data || []);
      setStatistics(res.statistics || {});
      setPagination(res.pagination || {});
    } catch (err) {
      console.error("Fetch Reviews Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, status, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReviews({ page: 1, search });
  };

  const handleAction = async (reviewId, action) => {
    try {
      setActionLoading(reviewId);
      await updateReviewStatus(reviewId, action);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: action } : r)),
      );
      fetchReviews();
    } catch (err) {
      console.error("Review Action Error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="w-full py-8 px-1">
      <div className="max-w-8xl mx-auto space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Reviews Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage all listing reviews across the platform
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Reviews"
            value={statistics.total || 0}
            icon={MessageSquare}
            iconClass="bg-orange-50 text-[#FF6E04]"
          />
          <StatCard
            title="Approved"
            value={statistics.approved || 0}
            icon={CheckCircle}
            iconClass="bg-green-50 text-green-600"
          />
          <StatCard
            title="Pending"
            value={statistics.pending || 0}
            icon={Clock}
            iconClass="bg-yellow-50 text-yellow-600"
          />
          <StatCard
            title="Rejected"
            value={statistics.rejected || 0}
            icon={XCircle}
            iconClass="bg-red-50 text-red-500"
          />
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex flex-col lg:flex-row gap-3 items-start lg:items-center">
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 flex-1 min-w-0"
            >
              <div className="relative flex-1 max-w-sm">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search reviewer, listing..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setSearch(e.target.value);
                  }}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6E04]/20 focus:border-[#FF6E04] transition placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#FF6E04] hover:bg-[#e65f00] text-white text-sm font-medium rounded-lg transition active:scale-95"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-2 flex-shrink-0">
              <select
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6E04]/20 focus:border-[#FF6E04] transition"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={sort}
                onChange={(e) => {
                  setPage(1);
                  setSort(e.target.value);
                }}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6E04]/20 focus:border-[#FF6E04] transition"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm border-collapse"
              style={{ tableLayout: "fixed" }}
            >
              <colgroup>
                <col style={{ width: "18%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "24%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "8%" }} />
              </colgroup>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Reviewer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Listing
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Review
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading && (
                  <tr>
                    <td colSpan="7" className="text-center py-14">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-7 h-7 border-2 border-[#FF6E04] border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-400">
                          Loading reviews...
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && reviews.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-14">
                      <div className="flex flex-col items-center gap-2">
                        <MessageSquare size={30} className="text-gray-200" />
                        <p className="text-sm text-gray-400">
                          No reviews found
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading &&
                  reviews.map((review) => (
                    <tr
                      key={review.id}
                      className="hover:bg-orange-50/20 transition-colors duration-100"
                    >
                      {/* Reviewer */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {review.reviewerName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {review.reviewerEmail}
                        </p>
                      </td>

                      {/* Listing */}
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {review.listingTitle}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {review.listingModel}
                        </p>
                      </td>

                      {/* Rating */}
                      <td className="px-4 py-4">
                        <StarRating rating={review.rating} />
                      </td>

                      {/* Review text */}
                      <td className="px-4 py-4">
                        <p
                          title={review.reviewText}
                          className="text-sm text-gray-700 cursor-pointer line-clamp-2 leading-relaxed"
                        >
                          {review.reviewText || "—"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[review.status] || statusStyles.pending}`}
                        >
                          {review.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-700 whitespace-nowrap">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </p>
                        {review.approvedBy && (
                          <p className="text-xs text-gray-400 truncate">
                            by {review.approvedBy}
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            disabled={
                              actionLoading === review.id ||
                              review.status === "approved"
                            }
                            onClick={() => handleAction(review.id, "approved")}
                            title="Approve"
                            className={`p-1.5 rounded-lg transition-all duration-150 ${
                              review.status === "approved"
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-green-600 hover:bg-green-50 hover:text-green-700"
                            }`}
                          >
                            {actionLoading === review.id ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Check size={15} strokeWidth={2.5} />
                            )}
                          </button>

                          <button
                            disabled={
                              actionLoading === review.id ||
                              review.status === "rejected"
                            }
                            onClick={() => handleAction(review.id, "rejected")}
                            title="Reject"
                            className={`p-1.5 rounded-lg transition-all duration-150 ${
                              review.status === "rejected"
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-red-500 hover:bg-red-50 hover:text-red-600"
                            }`}
                          >
                            <X size={15} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500">
                Total{" "}
                <span className="font-semibold text-gray-700">
                  {pagination.total || 0}
                </span>{" "}
                reviews
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={16} className="text-gray-600" />
                </button>
                <span className="text-xs font-semibold text-gray-700">
                  Page {page} of {pagination.pages || 1}
                </span>
                <button
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
