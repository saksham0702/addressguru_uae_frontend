import React, { useEffect } from "react";
import { useRouter } from "next/router";

const SuccessModal = ({
  open,
  onClose,
  title = "Success",
  message,
  redirectTo,
  autoRedirect = false,
  autoRedirectTime = 3000,
}) => {
  const router = useRouter();

  // Auto redirect (optional)
  useEffect(() => {
    if (open && autoRedirect && redirectTo) {
      const timer = setTimeout(() => {
        router.push(redirectTo);
      }, autoRedirectTime);

      return () => clearTimeout(timer);
    }
  }, [open, autoRedirect, redirectTo]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-6 relative animate-fadeIn border border-orange-100">
        {/* Close Button */}
        <button
          onClick={() => {
            onClose?.();
            if (redirectTo) router.push(redirectTo);
          }}
          className="absolute top-3 right-3 text-gray-400 hover:text-[#FF6E04] text-lg transition"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-orange-100">
            <svg
              className="w-8 h-8 text-[#FF6E04]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>

          {/* Message */}
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>

          {/* CTA Button */}
          {redirectTo && (
            <button
              onClick={() => router.push(redirectTo)}
              className="mt-5 px-5 py-2.5 bg-[#FF6E04] hover:bg-[#E55A03] text-white text-sm font-medium rounded-lg transition"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
