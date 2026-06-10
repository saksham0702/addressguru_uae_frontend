import React, { useEffect, useState, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Eye,
  FileText,
  Check,
  X,
  UserPlus,
} from "lucide-react";
import { getAllClaimsAdmin, transferOwnership } from "@/api/listing-features";
import { API_URL } from "@/services/constants";

const LIMIT = 10;
const IMG_URL = API_URL;

const statusStyles = {
  approved: "bg-green-50 text-green-700 border border-green-200",
  rejected: "bg-red-50 text-red-600 border border-red-200",
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
};

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

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(LIMIT);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });
  const [actionLoading, setActionLoading] = useState(null);

  const fetchClaims = useCallback(
    async (overrides = {}) => {
      try {
        setLoading(true);
        const res = await getAllClaimsAdmin({
          page: overrides.page ?? page,
          limit,
          status: overrides.status ?? status,
          search: overrides.search ?? search,
        });
        // Handle the response correctly based on the sample data structure
        setClaims(res.data || []);

        // Calculate simple stats locally since the backend might not return them exactly like reviews
        const total = res.pagination?.total || 0;
        setPagination(res.pagination || { total: 0, pages: 0 });

        // If statistics aren't returned, we could calculate them or just use placeholders
        // For now let's assume they might be there or build them
        if (res.statistics) {
          setStatistics(res.statistics);
        } else {
          // Fallback if statistics missing
          setStatistics({ total });
        }
      } catch (err) {
        console.error("Fetch Claims Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [page, status, search, limit],
  );

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchClaims({ page: 1, search: searchInput });
  };

  const handleTransfer = async (claimId) => {
    if (
      !window.confirm(
        "Are you sure you want to transfer ownership of this listing to this claimant?",
      )
    )
      return;

    try {
      setActionLoading(claimId);
      const res = await transferOwnership(claimId);
      if (res.success) {
        alert(res.message);
        fetchClaims();
      }
    } catch (err) {
      alert(err?.message || "Transfer failed");
      console.error("Transfer error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const openImage = (path) => {
    if (!path) return;
    const fullPath = path.startsWith("http") ? path : `${IMG_URL}${path}`;
    window.open(fullPath, "_blank");
  };

  return (
    <div className="w-full py-8 px-1">
      <div className="max-w-8xl mx-auto space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Claims Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage ownership claims for business listings
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Claims"
            value={statistics.total || 0}
            icon={ShieldCheck}
            iconClass="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="Pending"
            value={statistics.pending || 0}
            icon={Clock}
            iconClass="bg-yellow-50 text-yellow-600"
          />
          <StatCard
            title="Approved"
            value={statistics.approved || 0}
            icon={CheckCircle}
            iconClass="bg-green-50 text-green-600"
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
                  placeholder="Search claimant, listing..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
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
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm border-collapse"
              style={{ tableLayout: "fixed" }}
            >
              <colgroup>
                <col style={{ width: "20%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "12%" }} />
              </colgroup>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Claimant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Listing
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    ID Proof
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Reason
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
                          Loading claims...
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && claims.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-14">
                      <div className="flex flex-col items-center gap-2">
                        <ShieldCheck size={30} className="text-gray-200" />
                        <p className="text-sm text-gray-400">No claims found</p>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading &&
                  claims.map((claim) => (
                    <tr
                      key={claim._id}
                      className="hover:bg-orange-50/20 transition-colors duration-100"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {claim.fullName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {claim.email}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {claim.mobileNumber}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p
                          className="text-sm font-medium text-gray-800 truncate"
                          title={claim.listingSlug}
                        >
                          {claim.listingSlug}
                        </p>
                        <p className="text-xs text-gray-500">
                          {claim.listingModel}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => openImage(claim.idProofImage)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="View ID Proof"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="group relative">
                          <p className="text-sm text-gray-700 line-clamp-2 cursor-help">
                            {claim.reasonForClaim}
                          </p>
                          <div className="absolute z-10 hidden group-hover:block bg-gray-900 text-white p-2 rounded text-xs w-48 -top-2 left-full ml-2 shadow-xl">
                            {claim.reasonForClaim}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[claim.status] || statusStyles.pending}`}
                        >
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-500">
                        {new Date(claim.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleTransfer(claim._id)}
                          disabled={actionLoading === claim._id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            actionLoading === claim._id
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          {actionLoading === claim._id ? (
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <UserPlus size={14} />
                          )}
                          Transfer Ownership
                        </button>
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
                claims
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

export default Claims;
