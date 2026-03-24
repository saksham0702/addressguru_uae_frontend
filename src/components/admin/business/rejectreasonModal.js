import React, { useState, useEffect, useRef } from "react";

const REASONS = [
  "Listing Information is not correct",
  "Photos are inappropriate",
  "Title is incorrect",
  "Video link is not correct",
  "Listing category is incorrect",
  "Others",
];

const RejectReasonModal = ({ listing, onClose, onConfirm, onSubmit }) => {
  const [selected, setSelected] = useState(new Set());
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function toggleReason(r) {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(r) ? n.delete(r) : n.add(r);
      return n;
    });
  }

  async function handleSubmit() {
    if (selected.size === 0) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400)); // simulate async
    onSubmit({
      listingId: listing?._id,
      reason: [...selected].join(", "), // or pick first
    });
    setSubmitting(false);
    onClose();
  }

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(15,23,42,0.45)",
        backdropFilter: "blur(2px)",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
        style={{ animation: "slideUp 0.2s ease" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Listing Reject Reason
              </h2>
              {listing?.businessName && (
                <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate max-w-[260px]">
                  {listing.businessName}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <svg
              className="w-4 h-4"
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
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5">
          {/* Reason Checkboxes */}
          <div className="space-y-3">
            {REASONS.map((reason) => {
              const checked = selected.has(reason);
              return (
                <label
                  key={reason}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg border cursor-pointer transition-all select-none
                    ${
                      checked
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                >
                  {/* Custom checkbox */}
                  <div
                    className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors
                      ${checked ? "bg-red-500 border-red-500" : "border-slate-300 bg-white"}`}
                    style={{ width: 17, height: 17 }}
                  >
                    {checked && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleReason(reason)}
                    className="sr-only"
                  />
                  <span
                    className={`text-sm font-medium ${checked ? "text-red-700" : "text-slate-700"}`}
                  >
                    {reason}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-5 border-t border-slate-100" />

          {/* Optional Note */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Reason{" "}
              <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add additional notes about the rejection…"
              rows={3}
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-colors"
            />
          </div>

          {/* Validation hint */}
          {selected.size === 0 && (
            <p className="text-[11px] text-amber-600 font-medium mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              Please select at least one reason to proceed.
            </p>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-semibold border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200 transition-colors shadow-sm"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            disabled={selected.size === 0 || submitting}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-red-500 hover:bg-red-600 active:bg-red-700 text-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <svg
                  className="w-3.5 h-3.5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Submitting…
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default RejectReasonModal;
