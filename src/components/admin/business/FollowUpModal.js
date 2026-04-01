"use client";
import { createFollowupLog, getFollowupLogs } from "@/api/followup";
import { getFollowupConfig } from "@/api/followupconfig";
import { formatDateTime } from "@/helpers/helper";
import React, { useEffect, useState } from "react";

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
const FollowUpModal = ({
  listing,
  history,

  onClose,
  onSubmit,
}) => {
  const [selected, setSelected] = useState("");
  const [remark, setRemark] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [followupConfig, setFollowupConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [logs, setLogs] = useState([]);
  console.log(listing);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await getFollowupLogs(listing._id, token,"BusinessListing");

        setLogs(res.data || []);
        console.log("res of logs", res.data);
        // if you want to store locally instead of props:
        // setHistory(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (listing?._id) {
      fetchLogs();
    }
  }, [listing?._id]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const token = localStorage.getItem("token"); // or your auth method

        const res = await getFollowupConfig(token);

        // your response is { data: {...} }
        setFollowupConfig(res.data);
      } catch (err) {
        console.error("Failed to load followup config", err);
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchConfig();
  }, []);

  async function handleSubmit() {
    if (!selected) return;

    try {
      const token = localStorage.getItem("token");

      const selectedOption = followupConfig?.options?.find(
        (o) => o._id === selected,
      );

      const payload = {
        listingId: listing._id,
        activityOptionId: selectedOption?._id,
        remark: remark || "",
        nextFollowUpDate:
          date && time ? new Date(`${date}T${time}`).toISOString() : null,
      };

      const res = await createFollowupLog(payload, token,"BusinessListing");

      const resLogs = await getFollowupLogs(listing._id, token,"BusinessListing");
      setLogs(resLogs.data || []);

      // Optional: update UI
      onSubmit(listing._id, {
        reason: selectedOption?.label,
        remark,
        nextDate: date,
        nextTime: time,
        createdAt: new Date().toLocaleString(),
      });

      // Reset
      setSelected("");
      setRemark("");
      setDate("");
      setTime("");
    } catch (err) {
      console.error(err);
    }
  }

  const selectedOption = followupConfig?.options?.find(
    (o) => o._id === selected,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center  p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-xl w-full max-w-6xl h-[84vh] flex flex-col shadow-2xl overflow-hidden"
        style={{ animation: "modalIn 0.2s ease" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-400">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
              <PhoneIcon />
            </div>
            <div className="flex flex-col gap-1">
              {/* Title */}
              <h2 className="text-base font-semibold text-gray-800 leading-tight">
                {listing.businessName}
                <span className="ml-2 text-xs font-medium text-gray-800">
                  Follow Up
                </span>
              </h2>

              {/* Info Row */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-800">
                {/* Contact Person */}
                <span className="font-medium text-gray-800">
                  {listing?.contactPersonName || "—"}
                </span>

                {/* Divider */}
                <span className="text-gray-800">•</span>

                {/* Email */}
                <span className="text-orange-500 font-medium break-all">
                  {listing.email || "—"}
                </span>

                {/* Divider */}
                <span className="text-gray-800">•</span>

                {/* Phone */}
                <span className="text-orange-500 font-medium whitespace-nowrap">
                  {listing.countryCode} {listing.mobileNumber}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-slate-50 text-gray-800 hover:text-gray-800 hover:bg-slate-100 transition-colors flex items-center justify-center text-base"
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div
          className="flex flex-1 overflow-hidden divide-x divide-slate-100 min-h-0"
          style={{ gridTemplateColumns: "none" }}
        >
          {/* LEFT – Log Activity */}
          <div
            className="overflow-y-auto p-5 flex-shrink-0"
            style={{ width: "35%" }}
          >
            <p className="text-[10px] font-bold tracking-widest uppercase text-gray-800 mb-3">
              Log Activity
            </p>

            {/* Radio Options */}
            <div className="flex flex-col gap-0.5 mb-5">
              {followupConfig?.options
                ?.filter((opt) => opt.isActive)
                ?.map((opt) => (
                  <label
                    key={opt._id}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm
      ${
        selected === opt._id
          ? "bg-orange-50 border border-orange-200 text-orange-600 font-medium"
          : "border border-transparent text-gray-800 hover:bg-slate-50"
      }`}
                  >
                    <input
                      type="radio"
                      name="fu-activity"
                      value={opt._id}
                      checked={selected === opt._id}
                      onChange={() => setSelected(opt._id)}
                      className="accent-orange-500 w-3.5 h-3.5 flex-shrink-0"
                    />
                    {opt.label}
                  </label>
                ))}
            </div>

            {/* Remark */}
            {selectedOption?.hasRemark && (
              <div className="mb-4">
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-800 block mb-1.5">
                  Remark
                </label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder={
                    selectedOption?.remarkPlaceholder || "Add a remark…"
                  }
                  rows={3}
                  className="w-full border border-gray-500 rounded-lg px-3 py-2 text-sm text-gray-800 resize-none outline-none focus:border-orange-400 transition-colors placeholder-slate-300"
                />
              </div>
            )}

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-800 block mb-1.5">
                  Next Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-500 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-800 block mb-1.5">
                  Next Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border border-gray-500 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400 transition-colors"
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
                    : "bg-slate-100 text-gray-800 cursor-not-allowed"
                }`}
            >
              Submit Follow Up
            </button>
          </div>

          {/* RIGHT – Interaction History */}
          <div className="overflow-y-auto p-5 flex-1 max-h-[65vh]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-800">
                Interaction History
              </p>
              {history.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 text-[10px] font-bold border border-orange-100">
                  {history.length} log{history.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-800">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-sm">No follow-ups found.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-300 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-500">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-800 uppercase tracking-wider w-6">
                        #
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-800 uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-800 uppercase tracking-wider">
                        Remark
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-800 uppercase tracking-wider">
                        Next Date
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-800 uppercase tracking-wider">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs.map((h, i) => (
                      <tr
                        key={i}
                        className="bg-white hover:bg-slate-50/70 transition-colors"
                      >
                        {/* # */}
                        <td className="px-4 py-3 text-xs text-gray-800 font-medium">
                          {i + 1}
                        </td>

                        {/* Reason */}
                        <td className="px-4 py-3">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-500 border border-orange-100 whitespace-nowrap">
                            {h?.reason}
                          </span>
                        </td>

                        {/* Remark */}
                        <td className="px-4 py-3 text-xs text-gray-800 max-w-[220px]">
                          {h.remark ? (
                            <div className="group relative cursor-pointer">
                              {/* Truncated Text */}
                              <p className="truncate">{h.remark}</p>

                              {/* Hover Tooltip */}
                              <div className="absolute z-50 hidden group-hover:block left-0 top-full mt-1 w-72 rounded-lg border border-gray-500 bg-white p-3 text-xs text-gray-800 shadow-lg">
                                {h.remark}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-800 italic">N/A</span>
                          )}
                        </td>

                        {/* Next Date */}
                        <td className="px-4 py-3">
                          {h.nextFollowUpDate || h.nextTime ? (
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-800 whitespace-nowrap">
                              <span>📅</span>
                              <span className="font-medium">
                                {formatDateTime(h.nextFollowUpDate, h.nextTime)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-800 text-xs italic">
                              —
                            </span>
                          )}
                        </td>

                        {/* Created At */}
                        <td className="px-4 py-3 text-[11px] text-gray-800 whitespace-nowrap">
                          {h.createdAt ? formatDateTime(h.createdAt) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
