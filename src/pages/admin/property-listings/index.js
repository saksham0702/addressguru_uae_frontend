import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  approve_property_listing,
  get_all_property_listing,
  reject_property_listing,
} from "@/api/uae-property";
// import { get_all_property_listings } from "@/api/uae-property"; // wire up your API

// ── HELPERS ───────────────────────────────────────────────────────────────────
export function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}
export function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
function daysAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "1 Day Ago";
  return `${diff} Days Ago`;
}
function fmtPrice(price) {
  if (!price?.amount) return "N/A";
  const formatted = Number(price.amount).toLocaleString();
  const currency = price.currency || "AED";
  const period =
    price.period && price.period !== "one-time"
      ? `/${price.period.replace("ly", "")}`
      : "";
  return `${currency} ${formatted}${period}`;
}
function fmtArea(area) {
  if (!area?.size) return null;
  return `${area.size.toLocaleString()} ${area.unit || "sqft"}`;
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-2xl border
      ${toast.type === "error" ? "bg-red-50 border-red-200 text-red-600" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}
      style={{ animation: "slideUp 0.2s ease" }}
    >
      <span className="text-base">{toast.type === "error" ? "✕" : "✓"}</span>
      {toast.msg}
    </div>
  );
}

// ── ICONS ─────────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg
    className="w-3 h-3 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);
const MailIcon = () => (
  <svg
    className="w-3 h-3 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);
const CalIcon = () => (
  <svg
    className="w-3 h-3 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);
const PinIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-blue-500 flex-shrink-0"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
const ChevronIcon = ({ dir = "down" }) => (
  <svg
    className={`w-3.5 h-3.5 transition-transform ${dir === "up" ? "rotate-180" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const CheckboxIcon = ({ checked }) => (
  <div
    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${checked ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"}`}
  >
    {checked && (
      <svg
        className="w-2.5 h-2.5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    )}
  </div>
);
const UserIcon = () => (
  <svg
    className="w-3 h-3 text-slate-400 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const CheckIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const XIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const HomeIcon = () => (
  <svg
    className="w-3 h-3 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);
const RulerIcon = () => (
  <svg
    className="w-3 h-3 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
    />
  </svg>
);
const TagIcon = () => (
  <svg
    className="w-3 h-3 flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);
const SpinnerIcon = () => (
  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24">
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      className="opacity-25"
    />
    <path
      d="M22 12a10 10 0 00-10-10"
      stroke="currentColor"
      strokeWidth="3"
      className="opacity-75"
    />
  </svg>
);

// ── REUSABLE TABLE CELLS ──────────────────────────────────────────────────────
const TD = ({ children, className = "", vAlign = "top" }) => (
  <td
    className={`px-4 py-4 border-r border-slate-200 last:border-r-0 align-${vAlign} ${className}`}
  >
    {children}
  </td>
);
const TH_Cell = ({ children, className = "", highlight = false }) => (
  <th
    className={`px-4 py-3.5 text-left text-[11px] font-bold tracking-widest uppercase border-r border-slate-200 last:border-r-0 whitespace-nowrap
    ${highlight ? "text-blue-600 underline underline-offset-2 cursor-pointer" : "text-slate-500"} ${className}`}
  >
    {children}
  </th>
);

// ── PURPOSE BADGE ─────────────────────────────────────────────────────────────
const PurposeBadge = ({ purpose }) => {
  const map = {
    sale: { bg: "bg-violet-100", text: "text-violet-700", label: "For Sale" },
    rent: { bg: "bg-sky-100", text: "text-sky-700", label: "For Rent" },
    lease: { bg: "bg-teal-100", text: "text-teal-700", label: "Lease" },
  };
  const s = map[purpose] || {
    bg: "bg-slate-100",
    text: "text-slate-600",
    label: purpose || "N/A",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${s.bg} ${s.text}`}
    >
      {s.label}
    </span>
  );
};

// ── PLAN BADGE ────────────────────────────────────────────────────────────────
const PlanBadge = ({ plan }) => {
  if (!plan?.name || plan.name === "Free Plan") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-600">
        Unpaid
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold text-emerald-600 bg-emerald-100">
      {plan.name}
    </span>
  );
};

// ── MAIN ──────────────────────────────────────────────────────────────────────
const PropertyListings = () => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [followUpModal, setFollowUpModal] = useState(null);
  const [followUps, setFollowUps] = useState({});
  const [toast, setToast] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [showEntries, setShowEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [rejectModalData, setRejectModalData] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  // counts
  const [totalAll, setTotalAll] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleApproveReject(listing, action) {
    try {
      setLoadingId(listing._id);
      if (action === "rejected") {
        setRejectModalData(listing);
        return;
      }
      const res = await approve_property_listing(listing._id);
      console.log("res of approve listing", res);

      // await unapprove_property_listing(listing._id);
      showToast(`Listing ${action} successfully`, "success");
      await fetchListings();
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleRejectSubmit({ listingId, reason }) {
    try {
      // await reject_property_listing(listingId, {
      //   status: "rejected",
      //   rejectionReason: reason,
      // });
      await fetchListings();
      setRejectModalData(null);
      showToast("Listing rejected successfully", "success");
    } catch {
      showToast("Failed to reject listing", "error");
    }
  }

  const fetchListings = async () => {
    try {
      // Replace with your actual API call:
      const res = await get_all_property_listing({
        page,
        limit: showEntries,
        ...(statusFilter !== "all" && { status: statusFilter }),
      });
      setListings(res?.data?.listings || []);
      setTotalPages(res?.data?.pagination?.totalPages || 1);
      setTotalCount(res?.data?.pagination?.total || 0);
      setTotalAll(res?.data?.totalAll || 0);
      setApprovedCount(res?.data?.statusCounts?.approved || 0);
      setRejectedCount(res?.data?.statusCounts?.rejected || 0);
      setPendingCount(res?.data?.statusCounts?.pending || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [page, showEntries, statusFilter]);

  const stats = [
    {
      label: "Pending",
      key: "pending",
      activeBg: "bg-amber-500",
      ring: "ring-amber-200",
    },
    {
      label: "Approved",
      key: "approved",
      activeBg: "bg-emerald-600",
      ring: "ring-emerald-200",
    },
    {
      label: "Rejected",
      key: "rejected",
      activeBg: "bg-red-500",
      ring: "ring-red-200",
    },
  ];

  const statCounts = {
    pending: statusFilter === "pending" ? totalCount : pendingCount,
    approved: statusFilter === "approved" ? totalCount : approvedCount,
    rejected: statusFilter === "rejected" ? totalCount : rejectedCount,
  };

  const paginated = listings;
  const startEntry = totalCount === 0 ? 0 : (page - 1) * showEntries + 1;
  const endEntry = Math.min(page * showEntries, totalCount);

  function toggleSelect(id) {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  function toggleAll() {
    if (selected.size === paginated.length) setSelected(new Set());
    else setSelected(new Set(paginated.map((l) => l._id)));
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* ── PAGE HEADER ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800 leading-tight">
            Property Listings
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-slate-500 font-medium">
              Total Listings:
            </span>
            <span className="px-2.5 py-0.5 text-sm font-bold bg-orange-100 text-orange-600 rounded-lg">
              {totalAll}
            </span>
          </div>
        </div>
      </div>

      {/* ── STAT / FILTER CARDS ── */}
      <div className="flex gap-3 mb-5">
        {stats.map((s) => {
          const active = statusFilter === s.key;
          return (
            <button
              key={s.key}
              onClick={() => {
                setStatusFilter(s.key);
                setPage(1);
              }}
              className={`flex items-center justify-between min-w-[140px] px-4 py-2.5 rounded-lg border text-left transition-all
                ${active ? `${s.activeBg} text-white border-transparent shadow` : "bg-white border-slate-200 hover:shadow-sm"}`}
            >
              <div className="flex flex-col">
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wide ${active ? "text-white/80" : "text-slate-400"}`}
                >
                  {s.label}
                </span>
                <span
                  className={`text-sm font-bold ${active ? "text-white" : "text-slate-800"}`}
                >
                  {statCounts[s.key]}
                </span>
              </div>
              <div
                className={`w-2.5 h-2.5 rounded-full ${active ? "bg-white" : "bg-slate-300"}`}
              />
            </button>
          );
        })}
      </div>

      {/* ── TABLE TOOLBAR ── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
          <span>Show</span>
          <div className="relative">
            <select
              value={showEntries}
              onChange={(e) => {
                setShowEntries(Number(e.target.value));
                setPage(1);
              }}
              className="appearance-none bg-white border border-slate-300 rounded-lg px-3 py-1.5 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer shadow-sm font-medium"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronIcon />
            </span>
          </div>
          <span>entries</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
          <span>Search:</span>
          <div className="relative">
            <svg
              className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search listings…"
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-56 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 1200 }}>
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="px-4 py-3.5 w-10 border-r border-slate-200">
                  <button
                    onClick={toggleAll}
                    className="flex items-center justify-center"
                  >
                    <CheckboxIcon
                      checked={
                        selected.size === paginated.length &&
                        paginated.length > 0
                      }
                    />
                  </button>
                </th>
                <TH_Cell highlight className="min-w-[240px]">
                  Property Info
                </TH_Cell>

                <TH_Cell className="w-28">Plan</TH_Cell>
                <TH_Cell className="min-w-[130px]">City</TH_Cell>
                <TH_Cell className="w-36">Follow Up</TH_Cell>
                <TH_Cell className="min-w-[190px]">User</TH_Cell>
                <TH_Cell className="w-32">Action</TH_Cell>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-20 text-slate-300 text-sm font-medium"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="w-10 h-10 text-slate-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      No property listings found.
                    </div>
                  </td>
                </tr>
              )}

              {paginated.map((listing) => {
                const isSelected = selected.has(listing._id);
                return (
                  <tr
                    key={listing._id}
                    className={`border-b border-slate-200 last:border-b-0 transition-colors
                      ${isSelected ? "bg-blue-50/50" : "hover:bg-slate-50/60"}`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-4 w-10 border-r border-slate-200 align-top">
                      <button
                        onClick={() => toggleSelect(listing._id)}
                        className="flex items-center justify-center mt-0.5"
                      >
                        <CheckboxIcon checked={isSelected} />
                      </button>
                    </td>

                    {/* Property Info */}
                    <TD vAlign="top" className="min-w-[240px]">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <img
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-white shadow-sm"
                            src={`https://addressguru.ae/api/${listing.images?.[0]}`}
                            alt={listing.title}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div
                            className="w-14 h-14 rounded-xl flex-shrink-0 items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-lg shadow-sm"
                            style={{ display: "none" }}
                          >
                            {listing.title?.charAt(0)}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1 pt-0.5">
                          <a
                            className="font-semibold text-blue-600 text-md leading-snug truncate max-w-[210px] block"
                            href={`/${listing?.slug}?preview=true`}
                            target="_blank"
                          >
                            {listing.title}
                          </a>

                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[11px] text-slate-500">
                              ({listing.category?.name})
                            </span>
                            {listing.subCategory?.name && (
                              <>
                                <span className="text-slate-200 text-xs">
                                  ›
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {listing.subCategory.name}
                                </span>
                              </>
                            )}
                            <span className="text-slate-200 text-xs">|</span>
                            <Link
                              className="text-[11px] text-blue-500 font-semibold hover:text-blue-700 hover:underline transition-colors"
                              href={`/dashboard/property-forms?category=${listing?.category?._id}&name=${encodeURIComponent(listing?.slug)}`}
                            >
                              Edit
                            </Link>
                          </div>

                          {listing.mobileNumber && (
                            <div className="flex items-center font-medium gap-1.5 mt-2">
                              <PhoneIcon />
                              <span className="text-[11px] text-black font-medium">
                                {listing.countryCode} {listing.mobileNumber}
                              </span>
                            </div>
                          )}
                          {listing.email && (
                            <div className="flex items-center font-medium gap-1.5 mt-1">
                              <MailIcon />
                              <span className="text-[11px] text-black truncate max-w-[200px]">
                                {listing.email}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center font-medium text-black gap-1.5 mt-1">
                            <CalIcon />
                            <span className="text-[11px] text-black">
                              Create Date: {fmtDate(listing.createdAt)}{" "}
                              {fmtTime(listing.createdAt)}
                            </span>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-700 text-white leading-none ml-0.5">
                              {daysAgo(listing.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TD>
                    {/* Plan */}
                    <TD vAlign="top" className="w-28">
                      <div className="mt-0.5">
                        <PlanBadge plan={listing.plan} />
                      </div>
                    </TD>

                    {/* City */}
                    <TD vAlign="top" className="min-w-[130px]">
                      <div className="flex items-center gap-1">
                        <PinIcon />
                        <div className="text-[14px] text-gray-900 font-medium">
                          {listing.city?.name || "N/A"}
                        </div>
                      </div>
                      {listing.location?.locality && (
                        <div className="text-[11px] text-slate-400 mt-0.5 ml-5">
                          {listing.location.locality}
                        </div>
                      )}
                      {listing.location?.address && (
                        <div className="text-[10px] text-slate-300 mt-0.5 ml-5 truncate max-w-[120px]">
                          {listing.location.address}
                        </div>
                      )}
                    </TD>

                    {/* Follow Up */}
                    <TD vAlign="top" className="w-36">
                      <button
                        onClick={() => setFollowUpModal(listing)}
                        className="relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-sm whitespace-nowrap"
                      >
                        <PhoneIcon />
                        Follow Up
                        {followUps[listing._id]?.length > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center shadow">
                            {followUps[listing._id].length}
                          </span>
                        )}
                      </button>
                    </TD>

                    {/* User */}
                    <TD vAlign="top" className="min-w-[190px]">
                      <div className="space-y-2">
                        {[
                          {
                            label: "Created by",
                            value:
                              listing?.createdBy?.name ||
                              listing.contactPersonName ||
                              "Admin",
                          },
                          {
                            label: "Status",
                            value: listing.status,
                            isStatus: true,
                          },
                          ...(["approved", "rejected"].includes(listing.status)
                            ? [
                                {
                                  label:
                                    listing.status === "approved"
                                      ? "Approved by"
                                      : "Rejected by",
                                  value:
                                    listing.approvedBy?.name ||
                                    listing.rejectedBy?.name ||
                                    "Admin",
                                },
                              ]
                            : []),
                          ...(listing.rejectionReason
                            ? [
                                {
                                  label: "Reason",
                                  value: listing.rejectionReason,
                                  isReason: true,
                                },
                              ]
                            : []),
                        ].map(({ label, value, isStatus, isReason }) => {
                          const statusColor =
                            value === "approved"
                              ? "text-green-600"
                              : value === "rejected"
                                ? "text-red-600"
                                : value === "pending"
                                  ? "text-yellow-500"
                                  : "text-slate-700";
                          return (
                            <div
                              key={label}
                              className="flex items-start gap-1.5"
                            >
                              <UserIcon />
                              <span className="text-[11px] text-slate-400 font-medium flex-shrink-0">
                                {label}:
                              </span>
                              <span
                                className={`text-[11px] font-bold truncate max-w-[110px]
                                ${isStatus ? statusColor : isReason ? "text-red-400 font-normal" : "text-slate-700"}`}
                              >
                                {value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </TD>

                    {/* Action */}
                    <TD vAlign="top" className="w-32">
                      <div className="flex flex-col gap-1.5">
                        {listing.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleApproveReject(listing, "approved")
                              }
                              disabled={loadingId === listing._id}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors shadow-sm"
                            >
                              {loadingId === listing._id ? (
                                <>
                                  <SpinnerIcon /> Approving...
                                </>
                              ) : (
                                <>
                                  <CheckIcon /> Approve
                                </>
                              )}
                            </button>
                            <button
                              onClick={() =>
                                handleApproveReject(listing, "rejected")
                              }
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                            >
                              <XIcon /> Reject
                            </button>
                          </>
                        )}
                        {listing.status === "approved" && (
                          <button
                            onClick={() =>
                              handleApproveReject(listing, "unapproved")
                            }
                            disabled={loadingId === listing._id}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors shadow-sm"
                          >
                            {loadingId === listing._id ? (
                              <>
                                <SpinnerIcon /> Updating...
                              </>
                            ) : (
                              "Unapprove"
                            )}
                          </button>
                        )}
                        {listing.status === "rejected" && (
                          <button
                            onClick={() =>
                              handleApproveReject(listing, "approved")
                            }
                            disabled={loadingId === listing._id}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors shadow-sm"
                          >
                            {loadingId === listing._id ? (
                              <>
                                <SpinnerIcon /> Approving...
                              </>
                            ) : (
                              <>
                                <CheckIcon /> Approve
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── PAGINATION ── */}
      <div className="flex items-center justify-between mt-4 px-1">
        <span className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-700">{startEntry}</span>{" "}
          to <span className="font-bold text-slate-700">{endEntry}</span> of{" "}
          <span className="font-bold text-slate-700">{totalCount}</span> entries
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 text-xs font-bold border rounded-lg transition-colors shadow-sm
                ${page === p ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                {p}
              </button>
            ),
          )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Next
          </button>
        </div>
      </div>

      {/* ── MODALS (wire up FollowUpModal & RejectReasonModal here) ── */}
      {/* {followUpModal && <FollowUpModal listing={followUpModal} history={followUps[followUpModal._id] || []} onClose={() => setFollowUpModal(null)} onSubmit={handleFollowUpSubmit} />} */}
      {/* {rejectModalData && <RejectReasonModal listing={rejectModalData} onClose={() => setRejectModalData(null)} onSubmit={handleRejectSubmit} />} */}

      <Toast toast={toast} />

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(8px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PropertyListings;
