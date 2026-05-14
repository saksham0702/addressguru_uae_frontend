import React, { useState } from "react";
import { delete_plan } from "@/api/plans";

const PlanList = ({ plans, onEdit, refresh }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      await delete_plan(id);
      refresh();
    } catch (error) {
      console.error("Failed to delete plan:", error);
      alert("Failed to delete plan. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (plans.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No plans</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new plan.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan._id}
          className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border-2 ${
            plan.isHighlighted
              ? "border-orange-500 relative"
              : "border-gray-200"
          }`}
        >
          {/* Highlighted Badge */}
          {plan.isHighlighted && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                POPULAR
              </span>
            </div>
          )}

          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              {plan.tagline && (
                <p className="text-sm text-gray-500 mt-1">{plan.tagline}</p>
              )}
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.currency} {plan.price}
                </span>
                <span className="text-gray-500 ml-2">
                  / {plan.billingCycle}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  plan.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {plan.isActive ? (
                  <>
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Active
                  </>
                ) : (
                  "Inactive"
                )}
              </span>
            </div>

            {/* Features */}
            <div className="mb-6 border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Features:
              </h4>
              <ul className="space-y-2">
                {plan.features.slice(0, 5).map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm text-gray-600"
                  >
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
                {plan.features.length > 5 && (
                  <li className="text-sm text-gray-500 ml-7">
                    +{plan.features.length - 5} more features
                  </li>
                )}
              </ul>
            </div>

            {/* Limits */}
            <div className="mb-6 bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">
                Limits:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Description:</span>
                  <span className="font-medium text-gray-900 ml-1">
                    {plan.limits.descriptionWords} words
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Images:</span>
                  <span className="font-medium text-gray-900 ml-1">
                    {plan.limits.businessImages}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Flags */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {plan.flags.seoOptimised && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    SEO
                  </span>
                )}
                {plan.flags.verifiedBadge && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                    Verified
                  </span>
                )}
                {plan.flags.priorityListing && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-orange-100 text-orange-800">
                    Priority
                  </span>
                )}
                {plan.flags.dedicatedSupport && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                    Support
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(plan)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(plan._id, plan.name)}
                disabled={deletingId === plan._id}
                className="flex-1 px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-300 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === plan._id ? "Deleting..." : "Delete"}
              </button>
            </div>

            {/* Meta Info */}
            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 text-center">
              Order: {plan.displayOrder} • Slug: {plan.slug}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlanList;
