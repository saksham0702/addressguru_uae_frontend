import React from "react";
import { X, CheckCircle } from "lucide-react";

const ThanksPop = ({ type, onClose }) => {
  const messages = {
    claim: {
      title: "Business Claimed Successfully!",
      message: "Thank you for claiming your business on",
      highlight: "AddressGuru",
      description:
        "Your business listing is now under your control. You can now manage and update your business information.",
    },
    report: {
      title: "Report Submitted!",
      message: "Thank you for reporting an issue on",
      highlight: "AddressGuru",
      description:
        "We appreciate your help in keeping our information accurate. Our team will review your report shortly.",
    },
    rate: {
      title: "Rating Submitted!",
      message: "Thank you for rating this business on",
      highlight: "AddressGuru",
      description:
        "Your feedback helps others make informed decisions and helps businesses improve their services.",
    },
    enquiry: {
      title: "Enquiry Received!",
      message: "Thank you for your enquiry on",
      highlight: "AddressGuru",
      description:
        "We have received your message and will get back to you as soon as possible.",
    },
  };

  const content = messages[type] || messages.claim;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-[scale-in_0.3s_ease-out]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 rounded-full p-4">
            <CheckCircle size={48} className="text-orange-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {content.title}
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 mb-2">
          {content.message}{" "}
          <span className="text-orange-500 font-semibold">
            {content.highlight}
          </span>
          !
        </p>

        {/* Description */}
        <p className="text-center text-gray-500 text-sm mb-6">
          {content.description}
        </p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Continue
        </button>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ThanksPop;
