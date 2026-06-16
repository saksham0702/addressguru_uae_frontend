import React, { useState } from "react";
import { create_plan, update_plan } from "@/api/plans";

const PlanForm = ({ plan, onClose, refresh, defaultPlanType }) => {
  const [form, setForm] = useState({
    name: plan?.name || "",
    slug: plan?.slug || "",
    price: plan?.price || 0,
    currency: plan?.currency || "AED",
    planType: plan?.planType || defaultPlanType || "business",
    billingCycle: plan?.billingCycle || "year",
    tagline: plan?.tagline || "",
    ctaLabel: plan?.ctaLabel || "Get Started",
    features: plan?.features || [],
    limits: {
      descriptionWords: plan?.limits?.descriptionWords || 100,
      businessImages: plan?.limits?.businessImages || 0,
    },
    flags: {
      websiteLinkAllowed: plan?.flags?.websiteLinkAllowed || false,
      imagesGalleryAllowed: plan?.flags?.imagesGalleryAllowed || false,
      videoLinkAllowed: plan?.flags?.videoLinkAllowed || false,
      socialMediaLinks: plan?.flags?.socialMediaLinks || false,
      seoOptimised: plan?.flags?.seoOptimised || false,
      verifiedBadge: plan?.flags?.verifiedBadge || false,
      highlightBadge: plan?.flags?.highlightBadge || false,
      priorityListing: plan?.flags?.priorityListing || false,
      topOfSearchResults: plan?.flags?.topOfSearchResults || false,
      featuredInMainCities: plan?.flags?.featuredInMainCities || false,
      leadEnquiryForm: plan?.flags?.leadEnquiryForm || false,
      performanceInsights: plan?.flags?.performanceInsights || false,
      monthlyOptimisation: plan?.flags?.monthlyOptimisation || false,
      dedicatedSupport: plan?.flags?.dedicatedSupport || false,
    },
    planCode: plan?.planCode || "",
    durationInDays: plan?.durationInDays || 0,
    isActive: plan?.isActive ?? true,
    isHighlighted: plan?.isHighlighted || false,
    displayOrder: plan?.displayOrder || 1,
  });

  const [featureInput, setFeatureInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setForm(prev => {
      const updated = { ...prev, [name]: newValue };
      // Auto-generate slug from name
      if (name === "name") {
        updated.slug = value.toLowerCase().trim().replace(/\s+/g, "-");
        // Auto-generate planCode if empty
        if (!prev.planCode) {
          updated.planCode = value.toUpperCase().trim().replace(/\s+/g, "_");
        }
      }
      return updated;
    });
  };

  const handleLimitChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      limits: { ...form.limits, [name]: parseInt(value) || 0 },
    });
  };

  const handleFlagChange = (e) => {
    const { name, checked } = e.target;
    setForm({
      ...form,
      flags: { ...form.flags, [name]: checked },
    });
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const removeFeature = (index) => {
    setForm({
      ...form,
      features: form.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (plan) {
        await update_plan(plan._id, form);
      } else {
        await create_plan(form);
      }
      refresh();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {plan ? "Edit Plan" : "Create New Plan"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Name *
                </label>
                <input
                  name="name"
                  required
                  placeholder="e.g., Premium Plan"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <input
                  name="slug"
                  required
                  placeholder="e.g., premium"
                  value={form.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Type *
                </label>
                <select
                  name="planType"
                  value={form.planType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="business">Business</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="property">Property</option>
                  <option value="job">Job</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  name="price"
                  type="number"
                  required
                  min="0"
                  placeholder="0"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="AED">AED</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Cycle *
                </label>
                <select
                  name="billingCycle"
                  value={form.billingCycle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="year">Yearly</option>
                  <option value="month">Monthly</option>
                  <option value="one_time">One Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CTA Label
                </label>
                <input
                  name="ctaLabel"
                  placeholder="Get Started"
                  value={form.ctaLabel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Code *
                </label>
                <input
                  name="planCode"
                  required
                  placeholder="e.g., BUSINESS_PREMIUM"
                  value={form.planCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (Days)
                </label>
                <input
                  name="durationInDays"
                  type="number"
                  min="0"
                  placeholder="e.g., 365"
                  value={form.durationInDays}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagline
              </label>
              <input
                name="tagline"
                placeholder="Best for small businesses"
                value={form.tagline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Features
            </h3>
            <div className="flex gap-2">
              <input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addFeature())
                }
                placeholder="Add a feature"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {form.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg"
                >
                  <span className="flex-1 text-gray-700">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Limits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Limits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description Words
                </label>
                <input
                  name="descriptionWords"
                  type="number"
                  min="0"
                  value={form.limits.descriptionWords}
                  onChange={handleLimitChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Images
                </label>
                <input
                  name="businessImages"
                  type="number"
                  min="0"
                  value={form.limits.businessImages}
                  onChange={handleLimitChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Feature Flags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Feature Flags
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(form.flags).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name={key}
                    checked={value}
                    onChange={handleFlagChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  name="displayOrder"
                  type="number"
                  min="1"
                  value={form.displayOrder}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isHighlighted"
                  checked={form.isHighlighted}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Highlighted</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : plan ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanForm;
