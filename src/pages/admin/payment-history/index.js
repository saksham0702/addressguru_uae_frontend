import React, { useEffect, useState, useCallback } from "react";
import { get_all_payments } from "@/api/payment"; // adjust path

// ── HELPERS ──────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
function fmtAmount(amount, currency = "AED") {
  return `${currency} ${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

// ── STATUS CONFIG ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  captured: {
    label: "Success",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  created: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    border: "border-amber-200",
  },
  failed: {
    label: "Failed",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    border: "border-red-200",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
    border: "border-slate-200",
  },
  authorized: {
    label: "Authorized",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    border: "border-blue-200",
  },
};

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.created;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${c.bg} ${c.text} ${c.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ── ICONS ─────────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);
const SearchIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-slate-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="11" cy="11" r="8" />
    <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
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
const CloseIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const ReceiptIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
    />
  </svg>
);

// ── INVOICE MODAL ─────────────────────────────────────────────────────────────
function InvoiceModal({ payment, onClose, isAdmin }) {
  if (!payment) return null;
  const snap = payment.planSnapshot || {};

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <ReceiptIcon />
            </div>
            <div>
              <div className="text-white font-bold text-sm">
                Payment Invoice
              </div>
              <div className="text-slate-400 text-[11px]  mt-0.5">
                {payment.receipt}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status + Amount */}
          <div className="flex items-center justify-between">
            <StatusBadge status={payment.status} />
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900">
                {fmtAmount(payment.amount, payment.currency)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {fmtDate(payment.createdAt)} · {fmtTime(payment.createdAt)}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Plan Details */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              Plan Details
            </div>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              {[
                { label: "Plan Name", value: snap.name || "—" },
                { label: "Billing Cycle", value: snap.billingCycle || "—" },
                {
                  label: "Price",
                  value: fmtAmount(snap.price || 0, payment.currency),
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[12px] text-slate-500 font-medium">
                    {label}
                  </span>
                  <span className="text-[12px] text-slate-800 font-bold">
                    {value}
                  </span>
                </div>
              ))}
              {snap.features?.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-[10px] text-slate-400 font-semibold mb-1.5">
                    Features
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {snap.features.map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-medium text-slate-600"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              Payment Details
            </div>
            <div className="space-y-2">
              {[
                { label: "Order ID", value: payment.razorpay?.orderId || "—" },
                {
                  label: "Payment ID",
                  value: payment.razorpay?.paymentId || "—",
                },
                { label: "Method", value: payment.razorpay?.method || "—" },
                ...(payment.paidAt
                  ? [
                      {
                        label: "Paid At",
                        value: `${fmtDate(payment.paidAt)} ${fmtTime(payment.paidAt)}`,
                      },
                    ]
                  : []),
                ...(payment.failureReason
                  ? [{ label: "Failure Reason", value: payment.failureReason }]
                  : []),
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4"
                >
                  <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                    {label}
                  </span>
                  <span className="text-[11px] text-slate-700  text-right break-all">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin: User Info */}
          {isAdmin && payment.user && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                User
              </div>
              <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3 border border-blue-100">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {payment.user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    {payment.user.name || "—"}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {payment.user.email || "—"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Listing info if present */}
          {payment.listing?.businessName && (
            <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Listing
              </span>
              <span className="text-[11px] font-bold text-blue-600">
                {payment.listing.businessName}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
// Pass isAdmin={true/false} as prop from your page
const PaymentHistory = ({ isAdmin = false }) => {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showEntries, setShowEntries] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  // Summary counts
  const [counts, setCounts] = useState({ captured: 0, failed: 0, created: 0 });

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await get_all_payments({
        page,
        limit: showEntries,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: search || undefined,
      });
      setPayments(res?.data?.payments || []);
      setTotalPages(res?.data?.pagination?.totalPages || 1);
      setTotalCount(res?.data?.pagination?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, showEntries, statusFilter, search]);

  // Fetch summary counts separately (no status filter)
  const fetchCounts = useCallback(async () => {
    try {
      const [captured, failed, pending] = await Promise.all([
        get_all_payments({ page: 1, limit: 1, status: "captured" }),
        get_all_payments({ page: 1, limit: 1, status: "failed" }),
        get_all_payments({ page: 1, limit: 1, status: "created" }),
      ]);
      setCounts({
        captured: captured?.data?.pagination?.total || 0,
        failed: failed?.data?.pagination?.total || 0,
        created: pending?.data?.pagination?.total || 0,
      });
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchPayments, 350);
    return () => clearTimeout(t);
  }, [fetchPayments]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const startEntry = (page - 1) * showEntries + 1;
  const endEntry = Math.min(page * showEntries, totalCount);

  const statCards = [
    {
      key: "all",
      label: "All",
      count: totalCount,
      activeBg: "bg-slate-800",
      border: "border-slate-300",
    },
    {
      key: "captured",
      label: "Successful",
      count: counts.captured,
      activeBg: "bg-emerald-600",
      border: "border-emerald-200",
    },
    {
      key: "created",
      label: "Pending",
      count: counts.created,
      activeBg: "bg-amber-500",
      border: "border-amber-200",
    },
    {
      key: "failed",
      label: "Failed",
      count: counts.failed,
      activeBg: "bg-red-500",
      border: "border-red-200",
    },
  ];

  return (
    <div
      className="bg-gray-50 min-h-screen p-6"
      style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">
          {isAdmin ? "All Payments" : "My Payments"}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {isAdmin
            ? "Manage and review all transactions"
            : "View your transaction history"}
        </p>
      </div>

      {/* Stat Filter Cards */}
      <div className="flex flex-wrap gap-3 mb-5">
        {statCards.map((s) => {
          const active = statusFilter === s.key;
          return (
            <button
              key={s.key}
              onClick={() => {
                setStatusFilter(s.key);
                setPage(1);
              }}
              className={`flex items-center justify-between min-w-[130px] px-4 py-2.5 rounded-lg border text-left transition-all
                ${active ? `${s.activeBg} text-white border-transparent shadow` : `bg-white ${s.border} hover:shadow-sm`}`}
            >
              <div className="flex flex-col">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide ${active ? "text-white/70" : "text-slate-400"}`}
                >
                  {s.label}
                </span>
                <span
                  className={`text-sm font-black ${active ? "text-white" : "text-slate-800"}`}
                >
                  {s.count}
                </span>
              </div>
              <div
                className={`w-2 h-2 rounded-full ${active ? "bg-white/60" : "bg-slate-200"}`}
              />
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
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

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Search:</span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Order ID, Plan…"
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-52 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table
            className="w-full border-collapse"
            style={{ minWidth: isAdmin ? 900 : 750 }}
          >
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="px-4 py-3.5 text-left text-[11px] font-bold tracking-widest uppercase text-slate-500 border-r border-slate-200 whitespace-nowrap w-14">
                  #
                </th>
                {isAdmin && (
                  <th className="px-4 py-3.5 text-left text-[11px] font-bold tracking-widest uppercase text-slate-500 border-r border-slate-200 whitespace-nowrap min-w-[160px]">
                    User
                  </th>
                )}
                <th className="px-4 py-3.5 text-left text-[11px] font-bold tracking-widest uppercase text-slate-500 border-r border-slate-200 whitespace-nowrap min-w-[140px]">
                  Plan
                </th>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold tracking-widest uppercase text-slate-500 border-r border-slate-200 whitespace-nowrap w-32">
                  Amount
                </th>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold tracking-widest uppercase text-slate-500 border-r border-slate-200 whitespace-nowrap w-28">
                  Status
                </th>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold tracking-widest uppercase text-slate-500 border-r border-slate-200 whitespace-nowrap min-w-[160px]">
                  Order ID
                </th>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold tracking-widest uppercase text-slate-500 border-r border-slate-200 whitespace-nowrap w-36">
                  Date
                </th>
                <th className="px-4 py-3.5 text-left text-[11px] font-bold tracking-widest uppercase text-slate-500 whitespace-nowrap w-20">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={isAdmin ? 8 : 7}
                    className="text-center py-16 text-slate-400 text-sm"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="w-5 h-5 animate-spin text-blue-500"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
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
                      Loading…
                    </div>
                  </td>
                </tr>
              )}

              {!loading && payments.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="text-center py-20">
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        No payments found
                      </span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                payments.map((p, idx) => (
                  <tr
                    key={p._id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Sr */}
                    <td className="px-4 py-4 text-[12px] font-bold text-slate-400 border-r border-slate-100 align-top">
                      {String((page - 1) * showEntries + idx + 1).padStart(
                        2,
                        "0",
                      )}
                    </td>

                    {/* User (admin only) */}
                    {isAdmin && (
                      <td className="px-4 py-4 border-r border-slate-100 align-top">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-black flex-shrink-0">
                            {p.user?.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[12px] font-semibold text-slate-800 truncate">
                              {p.user?.name || "—"}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {p.user?.email || "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* Plan */}
                    <td className="px-4 py-4 border-r border-slate-100 align-top">
                      <div className="text-[12px] font-bold text-slate-800">
                        {p.planSnapshot?.name || p.plan?.name || "—"}
                      </div>
                      {p.planSnapshot?.billingCycle && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {p.planSnapshot.billingCycle}
                        </div>
                      )}
                      {p.listing?.businessName && (
                        <div className="text-[10px] text-blue-500 mt-0.5 font-medium truncate max-w-[120px]">
                          {p.listing.businessName}
                        </div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-4 border-r border-slate-100 align-top">
                      <div className="text-[13px] font-black text-slate-900">
                        {fmtAmount(p.amount, p.currency)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 border-r border-slate-100 align-top">
                      <StatusBadge status={p.status} />
                    </td>

                    {/* Order ID */}
                    <td className="px-4 py-4 border-r border-slate-100 align-top">
                      <div className="text-[11px]  text-slate-500 truncate max-w-[150px]">
                        {p.razorpay?.orderId || "—"}
                      </div>
                      {p.razorpay?.paymentId && (
                        <div className="text-[10px]  text-slate-400 truncate max-w-[150px] mt-0.5">
                          {p.razorpay.paymentId}
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 border-r border-slate-100 align-top">
                      <div className="text-[12px] text-slate-700 font-medium">
                        {fmtDate(p.createdAt)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {fmtTime(p.createdAt)}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-4 align-top">
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
                      >
                        <EyeIcon /> View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 px-1">
        <span className="text-xs text-slate-500 font-medium">
          Showing{" "}
          <span className="font-bold text-slate-700">
            {totalCount === 0 ? 0 : startEntry}
          </span>{" "}
          to <span className="font-bold text-slate-700">{endEntry}</span> of{" "}
          <span className="font-bold text-slate-700">{totalCount}</span> entries
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
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
            disabled={page === totalPages || totalPages === 0}
            className="px-3.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            Next
          </button>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedPayment && (
        <InvoiceModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
};

export default PaymentHistory;

// ── USAGE ──────────────────────────────────────────────────────────────────────
// Admin page:   <PaymentHistory isAdmin={true} />
// User page:    <PaymentHistory isAdmin={false} />
//
// Detect from your auth context:
// const isAdmin = user?.role?.includes(1);
// <PaymentHistory isAdmin={isAdmin} />
