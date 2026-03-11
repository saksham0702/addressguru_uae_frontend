"use client";

import { useEffect, useState } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import { createOrUpdateSubCategory } from "@/api/uaeAdminCategories";

export default function AddSubCategoryModal({
  open,
  onClose,
  slug,
  onSuccess,
  editData,
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- Prefill for edit ---------- */
  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
    } else {
      setName("");
    }
    setError("");
  }, [editData, open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Sub category name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = editData
        ? {
          id: editData._id,
          name,
          parentId: editData.slug,
        }
        : {
          name,
          parentId: slug,
        };

      await createOrUpdateSubCategory(payload);

      setName("");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Subcategory submit error:", err);

      const message =
        err?.message ||
        err?.response?.data?.message ||
        "Failed to save subcategory";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-100 p-6 animate-in fade-in zoom-in-95 duration-200">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-5">
          {editData ? "Edit Sub Category" : "Add Sub Category"}
        </h3>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">
            Sub Category Name
          </label>

          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter sub category name"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading
              ? "Saving..."
              : editData
                ? "Update Sub Category"
                : "Create Sub Category"}
          </button>
        </div>
      </div>
    </div>
  );
}