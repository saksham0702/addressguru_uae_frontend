"use client";
import React from "react";
import Link from "next/link";

const InfoListSection = ({ title, items = [] }) => {
  if (!items || items.length === 0) return null;
  console.log(title);

  return (
    <section className="w-full bg-white rounded-lg ">
      {/* Title */}
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
        {title}
      </h2>

      {/* List */}
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border-b last:border-none border-gray-100 pb-3"
          >
            {/* Clickable Title */}
            <h3 className="text-sm md:text-base font-medium">
              <Link
               target="_blank"
                href={`/${item.slug}`} // 👈 IMPORTANT (pass slug)
                className="text-gray-900 hover:text-blue-600 transition-colors"
              >
                {index + 1}. {item.title}
              </Link>
            </h3>

            {/* Short Description (2 lines max) */}
            {item.description && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
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