import React from "react";
import { Check, X, Star, Zap, Shield } from "lucide-react";

// ─── Theme map keyed to plan.theme from API ───────────────────────────────────
const THEMES = {
  default: {
    header: "bg-gray-100",
    headerText: "text-gray-700",
    price: "text-gray-800",
    badge: "bg-gray-200 text-gray-600",
    btn: "bg-gray-700 hover:bg-gray-800 text-white",
    check: "text-gray-500",
    ring: "ring-gray-200",
    tagBg: "",
    tagText: "",
  },
  blue: {
    header: "bg-blue-700",
    headerText: "text-white",
    price: "text-blue-700",
    badge: "bg-blue-100 text-blue-700",
    btn: "bg-blue-700 hover:bg-blue-800 text-white",
    check: "text-blue-600",
    ring: "ring-blue-300",
    tagBg: "",
    tagText: "",
  },
  green: {
    header: "bg-green-700",
    headerText: "text-white",
    price: "text-green-700",
    badge: "bg-green-100 text-green-700",
    btn: "bg-green-600 hover:bg-green-700 text-white",
    check: "text-green-600",
    ring: "ring-2 ring-green-500",
    tagBg: "bg-green-500",
    tagText: "text-white",
  },
  gold: {
    header: "bg-amber-500",
    headerText: "text-white",
    price: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    btn: "bg-amber-500 hover:bg-amber-600 text-white",
    check: "text-amber-500",
    ring: "ring-amber-300",
    tagBg: "bg-amber-500",
    tagText: "text-white",
  },
};

// ─── Single Plan Card ─────────────────────────────────────────────────────────
const PlanCard = ({ plan, isSelected, onSelect }) => {
  const theme = THEMES[plan?.theme] ?? THEMES.default;
  const isFree = !plan?.price || parseFloat(plan?.price) === 0;
  const isHighlighted = plan?.isHighlighted;

  return (
    <div
      className={`
        relative flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white
        transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
        ${isHighlighted ? `shadow-lg ${theme.ring}` : "shadow-sm"}
        ${isSelected ? "ring-2 ring-offset-2 ring-blue-500" : ""}
      `}
    >
      {/* ── Tagline badge (Most Popular / Best Visibility) ── */}
      {plan?.tagline && (
        <div className={`absolute -top-0 inset-x-0 flex justify-center`}>
          <span
            className={`
              ${theme.tagBg} ${theme.tagText}
              text-[11px] font-semibold tracking-wide px-3 py-1 rounded-b-lg shadow-sm
            `}
          >
            {plan.tagline}
          </span>
        </div>
      )}

      {/* ── Header ── */}
      <div className={`${theme.header} ${theme.headerText} px-5 pt-8 pb-5`}>
        <h3 className="text-lg font-bold">{plan?.name}</h3>
      </div>

      {/* ── Price block ── */}
      <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
        {isFree ? (
          <p className={`text-2xl font-extrabold ${theme.price}`}>FREE</p>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold text-gray-500">AED</span>
            <span className={`text-4xl font-extrabold ${theme.price}`}>
              {parseInt(plan?.price)}
            </span>
            <span className="text-sm text-gray-400">
              /{plan?.billingCycle === "year" ? "Year" : plan?.billingCycle}
            </span>
          </div>
        )}
      </div>

      {/* ── Features list ── */}
      <ul className="flex flex-col gap-3 px-2 py-5 flex-1">
        {(plan?.features ?? []).map((feature, i) => (
          <li key={i} className="flex gap-1">
            <Check
              size={15}
              className={`mt-0.5 shrink-0 ${theme.check}`}
              strokeWidth={2.5}
            />
            <span className="text-sm text-gray-600 text-start leading-sung">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* ── CTA button ── */}
      <div className="px-5 pb-6 pt-2">
        <button
          onClick={() => onSelect?.(plan)}
          className={`
            w-full py-2.5 rounded-xl text-sm font-semibold
            transition-all duration-200 active:scale-95
            ${theme.btn}
          `}
        >
          {isSelected ? "Selected ✓" : (plan?.ctaLabel ?? "Get Started")}
        </button>
      </div>
    </div>
  );
};

// ─── Main PricingTable ────────────────────────────────────────────────────────
const PricingTable = ({
  plans = [],
  selectedPlanId,
  setSelectedPlanId,
  onSelect,
}) => {
  const handleSelect = (plan) => {
    setSelectedPlanId?.(plan?._id ?? plan?.id);
    onSelect?.();
  };

  if (!plans?.length) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
        No plans available
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6">
      {/* ── Section heading ── */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-800">Listing Plans</h2>
        <p className="text-sm text-gray-500 mt-1">
          Boost your business visibility in UAE
        </p>
      </div>

      {/* ── Cards grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <PlanCard
            key={plan?._id ?? plan?.id}
            plan={plan}
            isSelected={selectedPlanId === (plan?._id ?? plan?.id)}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingTable;
