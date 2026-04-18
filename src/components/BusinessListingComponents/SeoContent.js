"use client";
import React from "react";

const SeoContent = ({ seoContent, city }) => {
  if (!seoContent?.content) return null;

  const formatCity = city ? city.charAt(0).toUpperCase() + city.slice(1) : "";

  const processContent = (html) => {
    // ✅ Replace city
    let updated = html.replace(/\[city\]/gi, formatCity);

    // 🔥 REMOVE inline font-size (THIS FIXES YOUR ISSUE)
    updated = updated.replace(/font-size:[^;"]+;?/gi, "");

    // ✅ Process tables
    return updated.replace(/<table[\s\S]*?>[\s\S]*?<\/table>/gi, (table) => {
      let cleanTable = table
        .replace(/style="[^"]*"/gi, "")
        .replace(/border="[^"]*"/gi, "");

      const firstRowMatch = cleanTable.match(/<tr[\s\S]*?<\/tr>/i);
      let colCount = 0;

      if (firstRowMatch) {
        colCount = (firstRowMatch[0].match(/<t[hd]/gi) || []).length;
      }

      let className = "table-full";
      if (colCount <= 2) className = "table-small";
      else if (colCount <= 5) className = "table-medium";
      else if (colCount <= 10) className = "table-large";

      return `
        <div class="table-wrapper">
          ${cleanTable.replace("<table", `<table class="${className}"`)}
        </div>
      `;
    });
  };

  const parsedContent = processContent(seoContent.content);

  return (
    <section className="w-full  bg-white rounded-lg p-4 md:p-6">
      <div
        className="seo-content"
        dangerouslySetInnerHTML={{ __html: parsedContent }}
      />
    </section>
  );
};

export default SeoContent;
