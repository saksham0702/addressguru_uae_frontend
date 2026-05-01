import { useState } from "react";
import { Loader2, AlertTriangle, X } from "lucide-react";

// ─── Confirmation Modal ──────────────────────────────────────────────────────
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  listingName,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState("");
  const isDelete = action === "delete";
  const confirmWord = isDelete ? "delete" : "unpublish";
  const isMatch = inputValue.toLowerCase().trim() === confirmWord;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center gap-3 ${
            isDelete
              ? "bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200"
              : "bg-gradient-to-r from-yellow-50 to-amber-100 border-b border-yellow-200"
          }`}
        >
          <div
            className={`p-2 rounded-full ${
              isDelete ? "bg-red-100" : "bg-yellow-100"
            }`}
          >
            <AlertTriangle
              size={22}
              className={isDelete ? "text-red-600" : "text-yellow-600"}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">
              {isDelete ? "Delete Listing" : "Unpublish Listing"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              This action{" "}
              {isDelete ? "cannot be undone" : "will hide your listing"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/60 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-gray-700 mb-1">
            You are about to{" "}
            <strong className={isDelete ? "text-red-600" : "text-yellow-600"}>
              {confirmWord}
            </strong>{" "}
            the listing:
          </p>
          <p className="text-sm font-semibold text-gray-900 mb-4 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            {listingName}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            To confirm, type{" "}
            <strong
              className={`font-bold ${isDelete ? "text-red-600" : "text-yellow-600"}`}
            >
              {confirmWord}
            </strong>{" "}
            below:
          </p>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Type "${confirmWord}" to confirm`}
            className={`w-full px-4 py-2.5 border-2 rounded-lg text-sm font-medium focus:outline-none transition-colors ${
              inputValue.length > 0 && !isMatch
                ? "border-red-300 focus:border-red-400 bg-red-50"
                : isMatch
                  ? isDelete
                    ? "border-red-400 focus:border-red-500 bg-red-50"
                    : "border-yellow-400 focus:border-yellow-500 bg-yellow-50"
                  : "border-gray-300 focus:border-gray-400"
            }`}
            disabled={isLoading}
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (isMatch) onConfirm(),setInputValue("");
            }}
            disabled={!isMatch || isLoading}
            className={`px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
              isMatch && !isLoading
                ? isDelete
                  ? "bg-red-600 hover:bg-red-700 shadow-sm"
                  : "bg-yellow-600 hover:bg-yellow-700 shadow-sm"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading
              ? isDelete
                ? "Deleting..."
                : "Unpublishing..."
              : isDelete
                ? "Delete Listing"
                : "Unpublish Listing"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
