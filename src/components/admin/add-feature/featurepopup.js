"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function FeatureModal({
  isOpen,
  onClose,
  type,
  singular,
  onSubmit,
  initialData, // 👈 important for edit mode
}) {
  const [name, setName] = useState("");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const isEditMode = !!initialData;

  /* ===============================
     Prefill when editing
  =============================== */
  useEffect(() => {
    if (isOpen) {
      setError("");

      if (initialData) {
        setName(initialData.name || "");
        setSvg(initialData.iconSvg || "");
      } else {
        setName("");
        setSvg("");
      }
    }
  }, [isOpen, initialData]);

  /* ===============================
     Submit Handler
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(`${singular} name is required`);
      return;
    }

    const payload =
      type === "facilities"
        ? { name: name.trim(), svg }
        : { name: name.trim() };

    try {
      setError("");

      await onSubmit(payload);

      onClose(); // only close if success
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        `Failed to save ${singular}`;

      setError(message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-6 relative">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <X size={18} />
              </button>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                {isEditMode ? `Edit ${singular}` : `Add ${singular}`}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <input
                    type="text"
                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder={`Enter ${singular} name`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* SVG (Only Facilities) */}
                {type === "facilities" && (
                  <div>
                    <label className="text-sm text-gray-600">SVG Icon</label>

                    <textarea
                      rows={3}
                      className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="<svg viewBox='0 0 24 24'>...</svg>"
                      value={svg}
                      onChange={(e) => setSvg(e.target.value)}
                    />

                    {/* Live Preview */}
                    {svg && (
                      <div className="mt-3 p-3 border border-gray-200 rounded-lg flex items-center gap-2 bg-gray-50">
                        <div
                          className="w-5 h-5 text-indigo-600 [&>svg]:w-5 [&>svg]:h-5"
                          dangerouslySetInnerHTML={{ __html: svg }}
                        />
                        <span className="text-xs text-gray-500">Preview</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium py-2 rounded-xl hover:opacity-90 transition"
                >
                  {isEditMode ? `Update ${singular}` : `Save ${singular}`}
                </button>
                {error && (
                  <p className="text-red-500 text-sm text-center mt-2">
                    {error}
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
