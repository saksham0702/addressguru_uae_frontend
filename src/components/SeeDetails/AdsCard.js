import React from "react";

const AdsCard = () => {
  return (
    <div className="w-full border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-4 flex items-center justify-between hover:shadow-md transition">
      {/* Left Content */}
      <div className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wide text-gray-400">
          Sponsored
        </span>
        <h3 className="text-lg font-semibold text-gray-800">Ads Banner Here</h3>
        <p className="text-sm text-gray-500">
          Promote your business and reach more customers.
        </p>
      </div>

      {/* Right CTA */}
      <button className="bg-[#FF6E04] text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-600 transition">
        Learn More
      </button>
    </div>
  );
};

export default AdsCard;
