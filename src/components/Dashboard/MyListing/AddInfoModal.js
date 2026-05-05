import React, { useState, useEffect } from "react";
import { X, Sparkles, Award, TrendingUp, Trophy } from "lucide-react";
import { getBusinessFeatures } from "@/api/uaeAdminCategories";
import { update_additional_fields } from "@/api/listing-form";
import AdditionalInfo from "@/components/Forms/FormSections/AdditionalInfo";
// import toast from "react-hot-toast";

const AddInfoModal = ({ isOpen, onClose, listingData }) => {
  const [additionalFields, setAdditionalFields] = useState([]);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && listingData?.category?._id) {
      fetchFields();
    }
  }, [isOpen, listingData]);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const res = await getBusinessFeatures(listingData.category._id);
      if (res?.additionalFields) {
        setAdditionalFields(res.additionalFields);
      }
      if (listingData?.additionalFields) {
        setValues(listingData.additionalFields);
      }
    } catch (error) {
      console.error("Error fetching additional fields:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Format the values mapping into the required array format
      const formattedFields = Object.entries(values || {}).map(([fieldId, value]) => ({
        field_id: fieldId,
        value: Array.isArray(value)
          ? value.filter((v) => typeof v === "string" && v.trim() !== "")
          : value,
      }));

      const payload = {
        category_id: listingData?.category?._id,
        additional_fields: formattedFields,
      };

      const res = await update_additional_fields(listingData._id, payload);

      if (res?.success) {
        // toast.success("Additional info saved successfully! 🎉");
        onClose();
        // Optional: Call a refresh function if passed from parent to update the UI
      } else {
        // toast.error(res?.message || "Failed to save additional info");
      }
    } catch (error) {
      console.error("Save additional info error:", error);
      // toast.error("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filledCount = Object.values(values).filter((v) =>
    Array.isArray(v) ? v.length > 0 : !!v,
  ).length;

  const totalCount = additionalFields.length || 1;
  const progressPct = Math.min(
    100,
    Math.round((filledCount / totalCount) * 100),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[900px] max-h-[90vh] flex flex-col md:flex-row bg-white rounded-[20px] shadow-[0_32px_80px_rgba(0,0,0,0.22),0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Information & Gamification */}
        <div className="w-full md:w-[350px] flex flex-col bg-white border-r border-gray-100 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start gap-3 px-5 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-[#FF6B2B] to-[#FF9558] flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-black leading-tight">
                  Enhance Your Listing
                </p>
                <p className="text-[12px] text-gray-400 mt-0.5 line-clamp-1" title={listingData?.businessName}>
                  {listingData?.businessName}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 flex-1 space-y-5">
            {/* Progress */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  Profile Completion
                </span>
                <span className="text-[12px] font-semibold text-[#FF6B2B]">
                  {progressPct}%
                </span>
              </div>

              <div className="h-[5px] bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6B2B] to-[#FF9558] rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  {
                    label: "+50 pts available",
                    style: "bg-orange-50 text-orange-700 border border-orange-200",
                  },
                  {
                    label: "3x more visibility",
                    style: "bg-blue-50 text-blue-700 border border-blue-200",
                  },
                  {
                    label: `${additionalFields.length} fields`,
                    style: "bg-gray-100 text-gray-600 border border-gray-200",
                  },
                ].map(({ label, style }) => (
                  <span
                    key={label}
                    className={`text-[11px] font-medium px-3 py-1 rounded-full flex items-center gap-1 ${style}`}
                  >
                    <span className="w-[5px] h-[5px] rounded-full bg-current" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Banner */}
            <div className="relative overflow-hidden rounded-xl border border-orange-200 bg-gradient-to-br p-4">
              <div className="absolute -bottom-4 -right-4 opacity-10">
                <Trophy size={120} className="text-orange-500" />
              </div>

              <div className="relative z-10">
                <p className="flex items-center gap-1.5 text-md font-semibold text-orange-500 mb-2">
                  <Award size={16} className="text-orange-600" />
                  Get Ahead of Competitors!
                </p>

                <p className="text-md text-gray-500 mb-3 leading-relaxed">
                  Listings with complete information receive up to{" "}
                  <strong>3x more views and leads</strong>. Help customers find what they need.
                </p>

                <span className="inline-flex items-center gap-1 text-md font-semibold text-orange-700 bg-white/80 border border-orange-200/60 shadow-sm px-3 py-1.5 rounded-lg">
                  <TrendingUp size={14} className="text-green-600" />
                  +50 Profile Points
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Fields & Actions */}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          {/* Top Bar with Close Button (Mobile visible, Desktop flex-end) */}
          <div className="flex justify-between md:justify-end items-center px-5 py-3 border-b border-gray-200/50 bg-white shadow-sm z-10">
            <p className="text-[13px] font-semibold text-gray-800 md:hidden">Business Details</p>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[15px] font-bold text-gray-800">Additional Fields</h4>
              <span className="text-[11px] font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded-md">
                {filledCount} / {totalCount} Filled
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
                  <p className="text-xs text-gray-500">Loading fields...</p>
                </div>
              ) : additionalFields.length > 0 ? (
                <AdditionalInfo
                  additionalFields={additionalFields}
                  values={values}
                  setValues={setValues}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Sparkles size={24} className="text-gray-300 mb-2" />
                  <p className="text-gray-500 text-sm font-medium">No additional fields available</p>
                  <p className="text-gray-400 text-xs mt-1">Your category does not require extra information.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end items-center px-6 py-4 border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-[13px] font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className={`px-6 py-2.5 text-[13px] font-bold text-white rounded-xl flex items-center gap-2 shadow-sm transition-all ${
                  loading
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#FF6B2B] to-[#FF8C50] hover:shadow-orange-200 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                <Sparkles size={14} />
                Save & Earn Points
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInfoModal;
