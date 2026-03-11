import React from "react";

const PricingTable = ({ plans, selectedPlanId, setSelectedPlanId }) => {
  // Helper function to get feature value for display
  const getFeatureDisplay = (plan, featureName) => {
    const feature = plan?.features?.find((f) => f?.name === featureName);
    if (!feature) return "❌";
    const { status, value } = feature.pivot;
    if (status === "enabled") return "✅";
    if (status === "disabled") return "❌";
    if (status === "value") return value || "❌";
    return "❌";
  };

  // Helper function to format price display
  const formatPrice = (plan) => {
    if (plan?.price === "0.00") return "₹0";
    return `₹${plan?.price}${plan?.duration ? `/${plan?.duration}` : ""}`;
  };

  // Check if plan is free
  const isFreePlan = (plan) => {
    return plan?.price === "0.00" || parseFloat(plan?.price) === 0;
  };

  // Handle plan selection
  const handlePlanSelect = (plan) => {
    if (isFreePlan(plan)) {
      setSelectedPlanId(plan?.id);
    }
  };

  // Get all unique features
  const allFeatures = plans?.[0]?.features || [];

  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-white text-center text-sm">
            <th className="bg-white px-4 py-3 text-base font-bold"></th>
            {plans?.map((plan, index) => (
              <th
                key={plan?.id}
                className={`px-4 py-3 text-lg font-semibold ${
                  index === 0
                    ? "bg-[linear-gradient(90deg,_#0876FE_0%,_#054798_100%)] rounded-tl-md"
                    : index === 1
                      ? "bg-[linear-gradient(90deg,_#E06C5E_0%,_#7A3B33_100%)]"
                      : "bg-[linear-gradient(90deg,_#00B5A1,_#004F46)] rounded-tr-md"
                }`}
              >
                {plan?.name?.toUpperCase()}
                <br />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center text-sm">
          {/* Price Row */}
          <tr className="border border-gray-200 rounded-md font-bold text-xl">
            <td className="text-left text-lg font-bold px-4 py-2 border border-gray-200">
              Features List
            </td>
            {plans?.map((plan) => (
              <td key={plan?.id} className="border border-gray-200 py-2">
                {plan?.discount_note && (
                  <div className="text-xs font-semibold ml-20">
                    {plan?.discount_note}
                  </div>
                )}
                <span className="text-lg">
                  {formatPrice(plan)}
                  {plan?.duration !== "Year" && plan?.duration && (
                    <span className="text-sm font-semibold">
                      {/* /{plan?.duration} */}
                    </span>
                  )}
                </span>
              </td>
            ))}
          </tr>
          {/* Feature Rows */}
          {allFeatures?.map((feature, index) => (
            <tr
              key={feature.id}
              className={index % 2 === 1 ? "bg-gray-50" : ""}
            >
              <td className="text-left px-4 py-2 border border-gray-200">
                {feature.name}
              </td>
              {plans?.map((plan) => (
                <td key={plan.id} className="py-2 border px-4 border-gray-200">
                  {getFeatureDisplay(plan, feature.name)}
                </td>
              ))}
            </tr>
          ))}
          {/* Action Buttons Row */}
          <tr>
            <td className=""></td>
            {plans?.map((plan) => {
              const isFree = isFreePlan(plan);
              const isSelected = selectedPlanId === plan?.id;

              return (
                <td key={plan.id} className="py-3 border border-gray-200">
                  <button
                    onClick={() => handlePlanSelect(plan)}
                    disabled={!isFree}
                    className={`mx-4 px-3 py-2 rounded font-semibold text-xs transition-all ${
                      isFree
                        ? isSelected
                          ? "bg-orange-500 text-white border-orange-500 border"
                          : "bg-white hover:bg-orange-500 text-orange-500 hover:text-white border-orange-500 border cursor-pointer"
                        : "bg-gray-200 text-gray-400 border-gray-300 border cursor-not-allowed opacity-60"
                    }`}
                  >
                    {isFree
                      ? isSelected
                        ? "SELECTED"
                        : "SELECT PLAN"
                      : "COMING SOON"}
                  </button>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;
