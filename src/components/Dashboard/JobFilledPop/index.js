import React from "react";
// import { Check} from 'lucide-react';
import { FaCheck, FaEye } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

export default function JobFilledPop({
  jobId,
  onGoToDashboard,
  onPreviewJob,
}) {

  const handleDashboard = () => {
    if (onGoToDashboard) {
      onGoToDashboard();
    } else {
      // Default navigation to /dashboard
      window.location.href = "/dashboard";
    }
  };

  const handlePreview = () => {
    if (onPreviewJob) {
      onPreviewJob();
    } else {
      // Default navigation using the router pattern you specified
      window.location.href = `/jobs-listings/job-details/${jobId}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden ">
        {/* Header with orange gradient */}
        <div className="bg-orange-500 p-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheck className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Submission Successful!
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Thank you for listing your job with{" "}
            <span className="text-orange-500 font-bold">AddressGuru</span>!
          </h3>

          <div className="text-left text-gray-700 mb-6 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-orange-500 font-bold mt-1">•</span>
              <span>Your job listing has been submitted successfully</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-orange-500 font-bold mt-1">•</span>
              <span>Our admin team is reviewing your submission</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-orange-500 font-bold mt-1">•</span>
              <span>
                You&apos;ll receive a notification once it&apos;s approved and live
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-orange-500 font-bold mt-1">•</span>
              <span>Review process typically takes 24-48 hours</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDashboard}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center text-sm justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <MdDashboard size={20} />
              Go to Dashboard
            </button>

            <button
              onClick={handlePreview}
              className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-3 px-4 rounded-lg transition-colors text-sm duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <FaEye size={20} />
              Preview Listing
            </button>
          </div>
    
        </div>
      </div>
    </div>
  );
}
