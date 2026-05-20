import React, { useEffect, useState, useCallback } from "react";
import { get_all_payments } from "@/api/payment"; // adjust path
import DashboardLayout from "@/components/Dashboard/DashboardLayout";

// ── HELPERS ───────────────────────────────────────────────────────────────────
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
    label: "Paid",
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
    text: "text-slate-500",
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

// ── REUSABLE: STATUS BADGE ────────────────────────────────────────────────────
export function StatusBadge({ status }) {
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

// ── REUSABLE: INVOICE MODAL ───────────────────────────────────────────────────
export function InvoiceModal({ payment, onClose }) {
  if (!payment) return null;
  const snap = payment.planSnapshot || {};

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[420px] overflow-hidden"
        style={{
          borderRadius: "2px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Receipt top tear */}
        <div
          className="w-full h-4 relative overflow-hidden"
          style={{ background: "#1a1a2e" }}
        >
          <div className="absolute bottom-0 left-0 right-0 flex">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded-t-full"
                style={{ background: "#f8f7f4", margin: "0 1px" }}
              />
            ))}
          </div>
        </div>

        <div style={{ background: "#f8f7f4" }} className="px-8 pb-0 pt-6">
          {/* Logo area */}
          <div className="text-center mb-6">
            <div className="text-[11px] tracking-[0.3em] text-slate-400 uppercase mb-1">
              Payment Receipt
            </div>
            <div className="text-[22px] font-black tracking-tight text-slate-900">
              AddressGuru
            </div>
            <div className="text-[10px] text-slate-400 mt-1 tracking-widest">
              addressguru.ae
            </div>
          </div>

          {/* Dashed divider */}
          <div className="border-t-2 border-dashed border-slate-300 mb-5" />

          {/* Receipt number + date */}
          <div className="flex justify-between text-[11px] text-slate-500 mb-5">
            <div>
              <div className="text-[9px] uppercase tracking-widest text-slate-400 mb-0.5">
                Receipt No.
              </div>
              <div className="font-bold text-slate-700">{payment.receipt}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-widest text-slate-400 mb-0.5">
                Date
              </div>
              <div className="font-bold text-slate-700">
                {fmtDate(payment.createdAt)}
              </div>
              <div className="text-slate-400">{fmtTime(payment.createdAt)}</div>
            </div>
          </div>

          {/* Status */}
          <div className="flex justify-center mb-5">
            <StatusBadge status={payment.status} />
          </div>

          {/* Amount — big */}
          <div className="text-center mb-6">
            <div className="text-[11px] uppercase tracking-widest text-slate-400 mb-1">
              Amount Charged
            </div>
            <div className="text-[38px] font-black text-slate-900 leading-none">
              {fmtAmount(payment.amount, payment.currency)}
            </div>
          </div>

          <div className="border-t-2 border-dashed border-slate-300 mb-5" />

          {/* Line items */}
          <div className="space-y-3 mb-5">
            {[
              { label: "Plan", value: snap.name || payment.plan?.name || "—" },
              { label: "Billing Cycle", value: snap.billingCycle || "—" },
              { label: "Method", value: payment.razorpay?.method || "Online" },
              { label: "Order ID", value: payment.razorpay?.orderId || "—" },
              ...(payment.razorpay?.paymentId
                ? [{ label: "Payment ID", value: payment.razorpay.paymentId }]
                : []),
              ...(payment.listing?.businessName
                ? [{ label: "Listing", value: payment.listing.businessName }]
                : []),
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-start gap-3"
              >
                <span className="text-[11px] uppercase tracking-wider text-slate-400 whitespace-nowrap">
                  {label}
                </span>
                <span className="text-[11px] font-bold text-slate-700 text-right break-all max-w-[200px]">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Features */}
          {snap.features?.length > 0 && (
            <>
              <div className="border-t border-dashed border-slate-300 mb-4" />
              <div className="mb-5">
                <div className="text-[9px] uppercase tracking-widest text-slate-400 mb-2">
                  Included Features
                </div>
                <div className="space-y-1">
                  {snap.features.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 text-[11px] text-slate-600"
                    >
                      <span className="text-emerald-500">✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="border-t-2 border-dashed border-slate-300 mb-5" />

          {/* Thank you */}
          <div className="text-center mb-6">
            <div className="text-[13px] font-bold text-slate-600">
              Thank you for your payment!
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              For support: support@addressguru.ae
            </div>
          </div>

          {/* Close */}
          <div className="pb-6">
            <button
              onClick={onClose}
              className="w-full py-3 text-[12px] font-bold tracking-widest uppercase border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Receipt bottom tear */}
        <div
          className="w-full h-4 relative overflow-hidden"
          style={{ background: "#f8f7f4" }}
        >
          <div className="absolute top-0 left-0 right-0 flex">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded-b-full"
                style={{ background: "#e5e3dc", margin: "0 1px" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── REUSABLE: BILL CARD (user view row) ───────────────────────────────────────
export function BillCard({ payment, index, page, showEntries, onView }) {
  const snap = payment.planSnapshot || {};
  const cfg = STATUS_CONFIG[payment.status] || STATUS_CONFIG.created;

  return (
    <div
      className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onView(payment)}
    >
      {/* Left: number */}
      <div className="w-8 text-[12px] font-black text-slate-300 flex-shrink-0 text-center">
        {String((page - 1) * showEntries + index + 1).padStart(2, "0")}
      </div>

      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${cfg.bg} border ${cfg.border}`}
      >
        <svg
          className={`w-5 h-5 ${cfg.text}`}
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
      </div>

      {/* Middle: plan + date */}
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold text-slate-800 truncate">
          {snap.name || payment.plan?.name || "Plan"}
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
          <span>{fmtDate(payment.createdAt)}</span>
          {payment.listing?.businessName && (
            <>
              <span>·</span>
              <span className="text-blue-500 truncate max-w-[120px]">
                {payment.listing.businessName}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="flex-shrink-0 hidden sm:block">
        <StatusBadge status={payment.status} />
      </div>

      {/* Amount */}
      <div className="flex-shrink-0 text-right">
        <div className="text-[15px] font-black text-slate-900">
          {fmtAmount(payment.amount, payment.currency)}
        </div>
        <div className="text-[10px] text-slate-400 sm:hidden mt-0.5">
          <StatusBadge status={payment.status} />
        </div>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 text-slate-300 group-hover:text-blue-500 transition-colors">
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

// ── REUSABLE: PAGINATION ──────────────────────────────────────────────────────
export function Pagination({
  page,
  totalPages,
  totalCount,
  showEntries,
  setPage,
}) {
  const startEntry = (page - 1) * showEntries + 1;
  const endEntry = Math.min(page * showEntries, totalCount);

  return (
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
  );
}

// ── MAIN: USER PAYMENT HISTORY ────────────────────────────────────────────────
const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showEntries] = useState(10); // user doesn't need to change this
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  // Summary totals
  const [summary, setSummary] = useState({ total: 0, captured: 0, pending: 0 });

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await get_all_payments({ page, limit: showEntries });
      setPayments(res?.data?.payments || []);
      setTotalPages(res?.data?.pagination?.totalPages || 1);
      setTotalCount(res?.data?.pagination?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, showEntries]);

  const fetchSummary = useCallback(async () => {
    try {
      const [all, captured, pending] = await Promise.all([
        get_all_payments({ page: 1, limit: 1 }),
        get_all_payments({ page: 1, limit: 1, status: "captured" }),
        get_all_payments({ page: 1, limit: 1, status: "created" }),
      ]);
      setSummary({
        total: all?.data?.pagination?.total || 0,
        captured: captured?.data?.pagination?.total || 0,
        pending: pending?.data?.pagination?.total || 0,
      });
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchPayments, 350);
    return () => clearTimeout(t);
  }, [fetchPayments]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Compute total spent from current page (ideally backend returns this)
  const totalSpent = payments
    .filter((p) => p.status === "captured")
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <DashboardLayout>
      <div className="bg-gray-50 min-h-screen p-6">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-xl font-bold text-slate-800">
            Billing & Payments
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Your invoices and transaction history
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-7">
          {[
            {
              label: "Total Transactions",
              value: summary.total,
              sub: "all time",
              icon: (
                <svg
                  className="w-5 h-5 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              ),
              bg: "bg-white",
            },
            {
              label: "Successful",
              value: summary.captured,
              sub: "completed",
              icon: (
                <svg
                  className="w-5 h-5 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
              bg: "bg-emerald-50",
            },
            {
              label: "Pending",
              value: summary.pending,
              sub: "awaiting",
              icon: (
                <svg
                  className="w-5 h-5 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
              bg: "bg-amber-50",
            },
          ].map((c) => (
            <div
              key={c.label}
              className={`${c.bg} border border-slate-200 rounded-xl p-4 flex items-center gap-3`}
            >
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                {c.icon}
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
                  {c.label}
                </div>
                <div className="text-[20px] font-black text-slate-800 leading-tight">
                  {c.value}
                </div>
                <div className="text-[10px] text-slate-400">{c.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bills List */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-slate-600 uppercase tracking-widest">
            Recent Invoices
          </h2>
          <span className="text-[11px] text-slate-400">{totalCount} total</span>
        </div>

        {loading && (
          <div className="flex flex-col items-center py-16 gap-2 text-slate-400">
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
            <span className="text-sm">Loading your bills…</span>
          </div>
        )}

        {!loading && payments.length === 0 && (
          <div className="flex flex-col items-center py-20 gap-3 text-slate-300">
            <svg
              className="w-12 h-12"
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
            <span className="text-sm font-medium text-slate-400">
              No invoices yet
            </span>
            <span className="text-xs text-slate-400">
              Your payment history will appear here
            </span>
          </div>
        )}

        {!loading && payments.length > 0 && (
          <div className="space-y-2.5">
            {payments.map((p, idx) => (
              <BillCard
                key={p._id}
                payment={p}
                index={idx}
                page={page}
                showEntries={showEntries}
                onView={setSelectedPayment}
              />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          showEntries={showEntries}
          setPage={setPage}
        />

        {selectedPayment && (
          <InvoiceModal
            payment={selectedPayment}
            onClose={() => setSelectedPayment(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PaymentHistory;
