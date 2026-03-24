import React, { useState } from "react";

// ── ICONS ─────────────────────────────────────────────────────────────────────
const MailIcon = () => (
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
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);
const BriefcaseIcon = () => (
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
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);
const DocumentIcon = () => (
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
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);
const ReceiptIcon = () => (
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
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);
const CheckCircleIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// ── PROPOSAL ACTIONS MODAL ────────────────────────────────────────────────────
const ProposalActions = ({ listing, onClose, onToast }) => {
  const [sent, setSent] = useState({}); // { portfolio: true, proposal: false, quotation: false }
  const [loading, setLoading] = useState({});
  const [activeTab, setActiveTab] = useState("portfolio");

  const ACTIONS = [
    {
      key: "portfolio",
      label: "Send Portfolio",
      icon: <BriefcaseIcon />,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      activeBg: "bg-purple-500",
      description:
        "Send your company portfolio showcasing past work and achievements.",
      subject: `Portfolio – AddressGuru for ${listing.businessName}`,
      body: `Hi ${listing.contactPersonName},\n\nPlease find attached our portfolio highlighting our work and capabilities.\n\nWe'd love to discuss how we can help ${listing.businessName} grow.\n\nBest regards,\nAddressGuru Team`,
    },
    {
      key: "proposal",
      label: "Send Proposal",
      icon: <DocumentIcon />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      activeBg: "bg-blue-500",
      description:
        "Send a detailed business proposal tailored to this listing.",
      subject: `Business Proposal – AddressGuru for ${listing.businessName}`,
      body: `Hi ${listing.contactPersonName},\n\nThank you for your interest. Please find our detailed proposal for ${listing.businessName}.\n\nWe have outlined our services, pricing, and how we can add value to your business.\n\nLooking forward to hearing from you.\n\nBest regards,\nAddressGuru Team`,
    },
    {
      key: "quotation",
      label: "Send Quotation",
      icon: <ReceiptIcon />,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      activeBg: "bg-green-500",
      description: "Send a price quotation for the selected services.",
      subject: `Quotation – AddressGuru Services for ${listing.businessName}`,
      body: `Hi ${listing.contactPersonName},\n\nPlease find attached the quotation for our services as discussed.\n\nThis quote is valid for 30 days. Feel free to reach out for any clarifications.\n\nBest regards,\nAddressGuru Team`,
    },
  ];

  const active = ACTIONS.find((a) => a.key === activeTab);

  async function handleSend(key) {
    setLoading((prev) => ({ ...prev, [key]: true }));
    // Simulate API call — replace with your actual send API
    await new Promise((r) => setTimeout(r, 1200));
    setSent((prev) => ({
      ...prev,
      [key]: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
    setLoading((prev) => ({ ...prev, [key]: false }));
    onToast(
      `${ACTIONS.find((a) => a.key === key)?.label} sent successfully!`,
      "success",
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ animation: "modalIn 0.2s ease", maxHeight: "90vh" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
              <MailIcon />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Proposal Mail
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {listing.businessName}
                <span className="mx-1.5 text-slate-200">·</span>
                <span className="text-orange-500 font-medium">
                  {listing.email}
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

        {/* ── Action Tabs ── */}
        <div className="flex gap-2 px-6 pt-4 pb-0">
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              onClick={() => setActiveTab(a.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all
                ${
                  activeTab === a.key
                    ? `${a.bg} ${a.color} ${a.border}`
                    : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                }`}
            >
              {a.icon}
              {a.label}
              {sent[a.key] && (
                <span className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center text-[9px] font-bold ml-1">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Active Panel ── */}
        {active && (
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <p className="text-xs text-slate-400 mb-4">{active.description}</p>

            {/* To */}
            <div className="mb-3">
              <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-1.5">
                To
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-medium text-slate-700">
                  {listing.contactPersonName}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">{listing.email}</span>
              </div>
            </div>

            {/* Subject */}
            <div className="mb-3">
              <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-1.5">
                Subject
              </label>
              <input
                defaultValue={active.subject}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-orange-400 transition-colors bg-white"
              />
            </div>

            {/* Body */}
            <div className="mb-5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-1.5">
                Message
              </label>
              <textarea
                defaultValue={active.body}
                rows={7}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-orange-400 transition-colors resize-none bg-white"
              />
            </div>

            {/* Sent stamp */}
            {sent[active.key] && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-xl mb-4 text-green-600 text-xs font-medium">
                <CheckCircleIcon />
                Sent on {sent[active.key]}
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={() => handleSend(active.key)}
              disabled={!!loading[active.key]}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
                ${
                  loading[active.key]
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : sent[active.key]
                      ? "bg-green-500 text-white hover:bg-green-600 shadow-sm"
                      : "bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
                }`}
            >
              {loading[active.key] ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                  Sending…
                </>
              ) : sent[active.key] ? (
                <>
                  <CheckCircleIcon /> Resend {active.label}
                </>
              ) : (
                <>
                  {active.icon} {active.label}
                </>
              )}
            </button>
          </div>
        )}

        {/* ── All Sent Summary ── */}
        {Object.keys(sent).length > 0 && (
          <div className="px-6 pb-4">
            <div className="border-t border-slate-100 pt-4">
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
                Sent History
              </p>
              <div className="flex flex-col gap-1.5">
                {ACTIONS.filter((a) => sent[a.key]).map((a) => (
                  <div
                    key={a.key}
                    className={`flex items-center gap-2 px-3 py-1.5 ${a.bg} border ${a.border} rounded-lg text-xs ${a.color} font-medium`}
                  >
                    {a.icon}
                    <span>{a.label}</span>
                    <span className="ml-auto text-[10px] opacity-70">
                      {sent[a.key]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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

export default ProposalActions;
