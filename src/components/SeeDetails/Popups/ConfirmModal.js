const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  type = "approve", // approve | reject | delete etc.
  title,
  description,
  confirmText = "Confirm",
}) => {
  if (!open) return null;

  /** Animated loading spinner for buttons */
  function SpinnerIcon() {
    return (
      <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          className="opacity-25"
        />
        <path
          d="M22 12a10 10 0 00-10-10"
          stroke="currentColor"
          strokeWidth="3"
          className="opacity-75"
        />
      </svg>
    );
  }

  const config = {
    approve: {
      bg: "bg-green-50",
      color: "#16a34a",
      icon: (
        <path
          d="M2 8L6 12L14 4"
          stroke="#16a34a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
    },
    reject: {
      bg: "bg-red-50",
      color: "#ef4444",
      icon: (
        <path
          d="M4 4L12 12M12 4L4 12"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ),
    },
  };

  const cfg = config[type] || config.approve;

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-gray-200 p-6 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`w-10 h-10 rounded-full ${cfg.bg} flex items-center justify-center mb-4`}
        >
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            {cfg.icon}
          </svg>
        </div>

        <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
          {title}
        </h3>

        <p className="text-[13px] text-gray-500 mb-5">{description}</p>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-1.5 text-sm rounded-lg font-medium text-white flex items-center gap-1.5 ${
              type === "approve"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading && <SpinnerIcon />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
