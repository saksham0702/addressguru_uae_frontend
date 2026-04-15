"use client";
import React from "react";

const InfoListSection = ({ title = "Top Listings", items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="w-full mt-6 bg-white rounded-lg p-4 md:p-6 shadow-sm">
      {/* Section Title */}
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
        {title}
      </h2>

      {/* List */}
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border-b last:border-none border-gray-400 pb-4 last:pb-0"
          >
            {/* Title */}
            <h3 className="text-sm md:text-base font-semibold text-gray-900">
              {index + 1}. {item.title}
            </h3>

            {/* Description */}
            {item.description && (
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                {item.description}
              </p>
            )}

            {/* Address */}
            {item.address && (
              <p className="text-xs text-gray-500 mt-2">
                📍 {item.address}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default InfoListSection;