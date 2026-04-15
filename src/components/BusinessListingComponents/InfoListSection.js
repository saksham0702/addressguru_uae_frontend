"use client";
import React from "react";

const InfoListSection = ({ title = "Top Listings", items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="w-full mt-3 bg-white rounded-lg p-4 md:p-6">
      {/* Section Title */}
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
        {title}
      </h2>

      {/* List */}
      <div className="flex flex-col gap-4 p-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="border-b last:border-none border-gray-100 pb-4 last:pb-0"
          >
            <div className="flex gap-1 items-center">
            {/* Title */}
            <h3 className="text-sm md:text-base font-semibold text-gray-900">
              {index + 1}. {item.title}
            </h3>
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                {item.description}
              </p>
            )}

       
          </div>
        ))}
      </div>
    </section>
  );
};

export default InfoListSection;