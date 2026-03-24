import React, { useState } from "react";

const ACTIVITY_OPTIONS = [
  "Call Back Later",
  "Call Me Tomorrow",
  "Payment Tomorrow",
  "Talk With My Partner",
  "Work With Other Company",
  "Not Interested",
  "Interested",
  "Wrong Information",
  "Not Pickup",
  "Other",
];

function nowStr() {
  const n = new Date();
  return (
    n.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " " +
    n.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
}

// ── PHONE ICON ────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
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
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

// ── FOLLOW UP MODAL ───────────────────────────────────────────────────────────
const FollowUpModal = ({ listing, history, onClose, onSubmit }) => {
  const [selected, setSelected] = useState("");
  const [remark, setRemark] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  function handleSubmit() {
    if (!selected) return;
    onSubmit(listing._id, {
      reason: selected,
      remark,
      nextDate: date,
      nextTime: time,
      createdAt: nowStr(),
    });
    setSelected("");
    setRemark("");
    setDate("");
    setTime("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center  p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        style={{ animation: "modalIn 0.2s ease" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
              <PhoneIcon />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Listing Follow Up
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {listing.businessName}
                <span className="mx-1.5 text-slate-200">·</span>
                <span className="text-orange-500 font-medium">
                  {listing.countryCode} {listing.mobileNumber}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center text-base"
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div
          className="flex flex-1 overflow-hidden divide-x divide-slate-100"
          style={{ gridTemplateColumns: "none" }}
        >
          {/* LEFT – Log Activity */}
          <div
            className="overflow-y-auto p-5 flex-shrink-0"
            style={{ width: "35%" }}
          >
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-3">
              Log Activity
            </p>

            {/* Radio Options */}
            <div className="flex flex-col gap-0.5 mb-5">
              {ACTIVITY_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm
                    ${
                      selected === opt
                        ? "bg-orange-50 border border-orange-200 text-orange-600 font-medium"
                        : "border border-transparent text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <input
                    type="radio"
                    name="fu-activity"
                    value={opt}
                    checked={selected === opt}
                    onChange={() => setSelected(opt)}
                    className="accent-orange-500 w-3.5 h-3.5 flex-shrink-0"
                  />
                  {opt}
                </label>
              ))}
            </div>

            {/* Remark */}
            <div className="mb-4">
              <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-1.5">
                Remark
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Add a remark…"
                rows={3}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 resize-none outline-none focus:border-orange-400 transition-colors placeholder-slate-300"
              />
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-1.5">
                  Next Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-orange-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-1.5">
                  Next Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-orange-400 transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selected}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all
                ${
                  selected
                    ? "bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
                }`}
            >
              Submit Follow Up
            </button>
          </div>

          {/* RIGHT – Interaction History */}
          <div className="overflow-y-auto p-5 flex-1">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                Interaction History
              </p>
              {history.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 text-[10px] font-bold border border-orange-100">
                  {history.length} log{history.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-300">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-sm">No follow-ups found.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-500 border border-orange-100">
                        {h.reason}
                      </span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap flex-shrink-0">
                        {h.createdAt}
                      </span>
                    </div>
                    {h.remark && (
                      <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                        {h.remark}
                      </p>
                    )}
                    {(h.nextDate || h.nextTime) && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-white border border-slate-100 rounded-lg px-2.5 py-1.5 w-fit">
                        <span>📅</span>
                        <span>
                          Next:{" "}
                          <span className="font-medium text-slate-700">
                            {h.nextDate}
                            {h.nextTime ? " · " + h.nextTime : ""}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { transform: translateY(12px) scale(0.98); opacity: 0; }
          to   { transform: translateY(0)    scale(1);    opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FollowUpModal;
