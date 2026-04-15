"use client";
import React from "react";

const SeoContent = ({ seoContent }) => {
  if (!seoContent?.content) return null;

  return (
    <section className="w-full mt-3 bg-white rounded-lg p-4 md:p-6">
      <div
        className="seo-content"
        dangerouslySetInnerHTML={{ __html: seoContent.content }}
      />
    </section>
  );
};

export default SeoContent;