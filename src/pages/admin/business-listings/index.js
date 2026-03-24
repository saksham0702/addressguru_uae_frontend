import React, { useEffect, useState } from "react";
import {
  approve_listing,
  get_all_listings,
  reject_listing,
} from "@/api/listing-form";
import FollowUpModal from "@/components/admin/business/FollowUpModal";
import RejectReasonModal from "@/components/admin/business/rejectreasonModal";
import Link from "next/link";

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

// ── BADGES ────────────────────────────────────────────────────────────────────
function LeadBadge({ status }) {
  const map = {
    warm: "bg-amber-400 text-white",
    cold: "bg-blue-500 text-white",
    hot: "bg-red-500 text-white",
    convert: "bg-emerald-500 text-white",
  };
  const label = status || "cold";
  const cls = map[label.toLowerCase()] || map.cold;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${cls}`}
    >
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  );
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
    className="w-3 h-3 flex-shrink-0 text-black"
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
const ExternalIcon = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
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

// ── MAIN ──────────────────────────────────────────────────────────────────────
const BusinessListings = () => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [followUpModal, setFollowUpModal] = useState(null);
  const [followUps, setFollowUps] = useState({});
  const [toast, setToast] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [showEntries, setShowEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [rejectModalData, setRejectModalData] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleApproveReject(listing, action) {
    if (action === "approved") {
      try {
        // ✅ call API first
        await approve_listing(listing._id);

        // ✅ update UI AFTER success
        setListings((prev) =>
          prev.map((l) =>
            l._id === listing._id ? { ...l, status: "approved" } : l,
          ),
        );

        showToast("Listing approved successfully", "success");
      } catch (error) {
        console.error(error);
        showToast("Failed to approve listing", "error");
      }
    }

    if (action === "rejected") {
      // same as before
      setRejectModalData(listing);
    }
  }
  async function handleRejectSubmit({ listingId, reason }) {
    try {
      const payload = {
        status: "rejected",
        rejectionReason: reason,
      };

      await reject_listing(listingId, payload);

      // ✅ update AFTER API success
      setListings((prev) =>
        prev.map((l) =>
          l._id === listingId ? { ...l, status: "rejected" } : l,
        ),
      );

      setRejectModalData(null);
      showToast("Listing rejected successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to reject listing", "error");
    }
  }

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await get_all_listings();
        setListings(res?.data?.listings || []);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };
    fetchListings();
  }, []);

  function handleFollowUpSubmit(listingId, entry) {
    setFollowUps((prev) => ({
      ...prev,
      [listingId]: [entry, ...(prev[listingId] || [])],
    }));
    showToast("Follow up logged.", "success");
  }

  const stats = [
    {
      label: "Total",
      key: "all",
      color: "text-orange-500",
      bg: "bg-orange-50",
      activeBg: "bg-orange-500",
      ring: "ring-orange-200",
    },
    {
      label: "Pending",
      key: "pending",
      color: "text-amber-600",
      bg: "bg-amber-50",
      activeBg: "bg-amber-500",
      ring: "ring-amber-200",
    },
    {
      label: "Approved",
      key: "approved",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      activeBg: "bg-emerald-600",
      ring: "ring-emerald-200",
    },
    {
      label: "Rejected",
      key: "rejected",
      color: "text-red-500",
      bg: "bg-red-50",
      activeBg: "bg-red-500",
      ring: "ring-red-200",
    },
  ];

  const statCounts = {
    all: listings.length,
    pending: listings.filter((l) => l.status === "pending").length,
    approved: listings.filter((l) => l.status === "approved").length,
    rejected: listings.filter((l) => l.status === "rejected").length,
  };

  const filtered = listings.filter((l) => {
    const matchSearch = [
      l.businessName,
      l.category?.name,
      l.city?.name,
      l.contactPersonName,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / showEntries));

  const paginated = filtered.slice(
    (page - 1) * showEntries,
    page * showEntries,
  );
  const startEntry = filtered.length === 0 ? 0 : (page - 1) * showEntries + 1;
  const endEntry = Math.min(page * showEntries, filtered.length);

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
    <div
      className="bg-gray-50 min-h-screen p-6"
      style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
    >
      {/* ── PAGE HEADER ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800 leading-tight">
            Business Listings
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-medium">
            Manage and review all business listings on the platform
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition-colors"
          >
            Assign Lead
            <ChevronIcon dir={dropdownOpen ? "up" : "down"} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
              {["Ayushe Gupta", "Vikas Suyal", "Shivani Gupta"].map((u) => (
                <button
                  key={u}
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
                >
                  {u}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── STAT / FILTER CARDS ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const active = statusFilter === s.key;
          const count = statCounts[s.key];
          return (
            <button
              key={s.key}
              onClick={() => {
                setStatusFilter(s.key);
                setPage(1);
              }}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all duration-150
                ${
                  active
                    ? `${s.activeBg} border-transparent shadow-lg`
                    : `bg-white border-slate-200 hover:border-slate-200 hover:shadow-md`
                }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-extrabold text-base
                ${active ? "bg-white/20 text-white" : `${s.bg} ${s.color}`}`}
              >
                {count}
              </div>
              <div>
                <div
                  className={`text-[11px] font-bold uppercase tracking-widest ${active ? "text-white/80" : "text-slate-400"}`}
                >
                  {s.label}
                </div>
                <div
                  className={`text-[11px] mt-0.5 font-medium ${active ? "text-white/60" : "text-slate-300"}`}
                >
                  listings
                </div>
              </div>
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
          <table className="w-full border-collapse" style={{ minWidth: 1000 }}>
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                {/* Checkbox TH */}
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
                <TH_Cell className="w-14">Sr No.</TH_Cell>
                <TH_Cell highlight className="min-w-[228px]">
                  Client Info
                </TH_Cell>
                <TH_Cell className="w-32">Plan</TH_Cell>
                <TH_Cell className="min-w-[130px]">Country & City</TH_Cell>
                <TH_Cell className="w-36">Follow Up</TH_Cell>
                <TH_Cell className="min-w-[190px]">User</TH_Cell>
                <TH_Cell className="w-32">Action</TH_Cell>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      No listings found.
                    </div>
                  </td>
                </tr>
              )}

              {paginated.map((listing, idx) => {
                const leadStatus =
                  listing.leadStatus || (idx % 3 === 0 ? "warm" : "cold");
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

                    {/* Sr No */}
                    <TD vAlign="top" className="w-14">
                      <span className="text-sm font-bold text-gray-900">
                        {String((page - 1) * showEntries + idx + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>
                    </TD>

                    {/* Client Info */}
                    <TD vAlign="top" className="min-w-[260px]">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <img
                            className="w-14 h-14 rounded-xl object-contain border border-slate-200 bg-white shadow-sm"
                            src={`https://addressguru.ae/api/${listing.logo}`}
                            alt={listing.businessName}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div
                            className="w-14 h-14 rounded-xl flex-shrink-0 items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-lg shadow-sm"
                            style={{ display: "none" }}
                          >
                            {listing.businessName?.charAt(0)}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1 pt-0.5">
                          <a
                            className="font-semibold text-blue-600 text-md leading-snug truncate max-w-[210px]"
                            href={`/${listing?.slug}?preview=true`}
                            target="_blank"
                          >
                            {listing.businessName}
                          </a>

                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[11px] text-slate-500">
                              ({listing.category?.name})
                            </span>

                            <span className="text-slate-200 text-xs">|</span>
                            <Link
                              className="text-[11px] text-blue-500 font-semibold hover:text-blue-700 hover:underline transition-colors"
                              href={`/dashboard/listing-forms?category=${
                                listing?.category?._id
                              }&categoryName=${encodeURIComponent(
                                listing?.businessName,
                              )}&name=${encodeURIComponent(listing?.slug)}`}
                            >
                              Edit
                            </Link>

                            {/* <button className="text-[11px] text-blue-500 font-semibold hover:text-blue-700 hover:underline transition-colors">
                              Bulk Lead
                            </button>
                            <LeadBadge status={leadStatus} /> */}
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
                            <CalIcon className="text-black" />
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
                    <TD vAlign="top" className="w-32">
                      <div className="mt-0.5">
                        {listing?.plan?.name === "Free Plan" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-600">
                            Unpaid
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold  ${listing?.plan?.name ? "text-emerald-600 bg-emerald-100 " : "bg-red-100 text-red-600"}`}
                          >
                            {listing?.plan?.name || "Unpaid"}
                          </span>
                        )}
                      </div>
                    </TD>

                    {/* Country & City */}
                    <TD vAlign="top" className="min-w-[130px]">
                      <div className="flex items-start gap-1.5 mt-0.5">
                        <PinIcon />
                        <div>
                          <div className="text-sm font-semibold text-black">
                            {listing.country || "India"}
                          </div>
                          <div className="text-[11px] text-gray-900  font-medium mt-0.5">
                            ({listing.city?.name || "N/A"})
                          </div>
                        </div>
                      </div>
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
                          },

                          // ✅ Show ONLY when approved or rejected
                          ...(["approved", "rejected"].includes(listing.status)
                            ? [
                                {
                                  label: "Approved by",
                                  value:
                                    listing.assignedBy ||
                                    listing.contactPersonName ||
                                    "Admin",
                                },
                              ]
                            : []),

                          {
                            label: "Assigned User",
                            value:
                              listing.assignedUser ||
                              listing.contactPersonName ||
                              "Admin",
                          },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="flex items-center gap-1.5"
                          >
                            <UserIcon />
                            <span className="text-[11px] text-slate-400 font-medium">
                              {label}:
                            </span>
                            <span className="text-[11px] font-bold text-slate-700 truncate max-w-[110px]">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TD>

                    {/* Action */}
                    <TD vAlign="top" className="w-32">
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() =>
                            handleApproveReject(listing, "approved")
                          }
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200 transition-colors whitespace-nowrap shadow-sm"
                        >
                          <CheckIcon /> Approve
                        </button>
                        <button
                          onClick={() =>
                            handleApproveReject(listing, "rejected")
                          }
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 transition-colors whitespace-nowrap shadow-sm"
                        >
                          <XIcon /> Reject
                        </button>
                        <a
                          href={`/${listing.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors whitespace-nowrap no-underline shadow-sm"
                        >
                          <ExternalIcon /> Visit
                        </a>
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
          <span className="font-bold text-slate-700">{filtered.length}</span>{" "}
          entries
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
                ${
                  page === p
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
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

      {/* ── MODALS ── */}
      {followUpModal && (
        <FollowUpModal
          listing={followUpModal}
          history={followUps[followUpModal._id] || []}
          onClose={() => setFollowUpModal(null)}
          onSubmit={handleFollowUpSubmit}
        />
      )}

      {rejectModalData && (
        <RejectReasonModal
          listing={rejectModalData}
          onClose={() => setRejectModalData(null)}
          onSubmit={handleRejectSubmit}
        />
      )}

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

export default BusinessListings;
