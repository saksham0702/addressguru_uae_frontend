"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const COOKIE_NAME = "cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasConsent = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIE_NAME}=`));
    if (!hasConsent) setVisible(true);
  }, []);

  const setCookie = (value) => {
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=31536000`;
  };

  const handleAccept = () => {
    setCookie("accepted");
    setVisible(false);
  };
  const handleDecline = () => {
    setCookie("declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 w-[95%] md:w-[480px] z-50">
      <div className="flex items-center gap-5 px-6 py-5 rounded-2xl bg-white border border-gray-200 shadow-lg">
        {/* Icon */}
        <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-orange-50 border border-orange-200">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f97316"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
            <path d="M8.5 8.5v.01" />
            <path d="M16 15.5v.01" />
            <path d="M12 12v.01" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            We value your privacy
          </p>
          <p className="text-[13px] text-gray-500 leading-relaxed m-0">
            We use cookies to improve your experience, analyze traffic, and show
            relevant listings.{" "}
            <Link
              href="/privacy-policy"
              className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
            >
              Learn more
            </Link>
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleDecline}
              className="px-5 py-2 text-[13px] font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2 text-[13px] font-medium text-white bg-orange-500 border border-orange-600 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
