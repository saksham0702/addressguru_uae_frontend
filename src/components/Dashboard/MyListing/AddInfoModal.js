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
      const formattedFields = Object.entries(values || {}).map(
        ([fieldId, value]) => ({
          field_id: fieldId,
          value: Array.isArray(value)
            ? value.filter((v) => typeof v === "string" && v.trim() !== "")
            : value,
        }),
      );

      const payload = {
        category_id: listingData?.category?._id,
        additional_fields: formattedFields,
      };

      const res = await update_additional_fields(listingData._id, payload);

      if (res?.success) {
        // toast.success("Additional info saved successfully! 🎉");
        onClose();
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[920px] max-h-[90vh] flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Sidebar */}
        <div className="w-full md:w-[340px] bg-gradient-to-br from-orange-50 via-white to-orange-50/30 border-r border-orange-100/50">
          {/* Header */}
          <div className="p-6 border-b border-orange-100/50">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 flex-shrink-0">
                <Sparkles size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  Enhance Your Listing
                </h3>
                <p
                  className="text-xs text-gray-500 mt-1 truncate"
                  title={listingData?.businessName}
                >
                  {listingData?.businessName}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Progress Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Completion
                </span>
                <span className="text-sm font-bold text-orange-600">
                  {progressPct}%
                </span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Stats Chips */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                  <Sparkles size={12} />
                  +50 pts
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                  <TrendingUp size={12} />
                  3x visibility
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                  {filledCount}/{totalCount} fields
                </span>
              </div>
            </div>

            {/* Motivation Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-5 shadow-lg">
              <div className="absolute top-0 right-0 opacity-10">
                <Trophy size={100} className="text-white -rotate-12" />
              </div>

              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-orange-200" />
                  <p className="text-sm font-bold text-white">
                    Get Ahead of Competitors!
                  </p>
                </div>

                <p className="text-xs text-orange-50 leading-relaxed">
                  Complete listings get{" "}
                  <strong className="text-white">3x more views</strong> and
                  generate more leads. Stand out from the competition.
                </p>

                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-white px-3 py-2 rounded-lg shadow-md">
                  <TrendingUp size={14} className="text-green-600" />
                  Earn +50 Profile Points
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-gray-900">
                Business Details
              </h4>
              <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2.5 py-1 rounded-md">
                {filledCount} / {totalCount}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-10 h-10 border-3 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
                <p className="text-sm text-gray-500 mt-4 font-medium">
                  Loading fields...
                </p>
              </div>
            ) : additionalFields.length > 0 ? (
              <AdditionalInfo
                additionalFields={additionalFields}
                values={values}
                setValues={setValues}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Sparkles size={28} className="text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  No additional fields available
                </p>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Your category doesn&apos;t require extra information at this time.
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50/50">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-6 py-2.5 text-sm font-bold text-white rounded-lg flex items-center gap-2 transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg hover:shadow-orange-500/30"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Save & Earn Points
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInfoModal;
