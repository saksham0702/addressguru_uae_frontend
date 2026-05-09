"use client";
import React, { useState } from "react";
const SeoContent = ({ seoContent }) => {
  const [openIndex, setOpenIndex] = useState(null);

  if (!seoContent) return null;

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const cleanHtml = (html) => {
    if (!html) return "";

    return (
      html
        // remove inline font-size (this was breaking layout)
        .replace(/font-size:[^;"]+;?/gi, "")
        // remove random inline styles but KEEP structure
        .replace(/style="[^"]*"/gi, "")
    );
  };

  return (
    <section className="w-full bg-white rounded-lg p-4 md:p-6 space-y-6">
      {/* CITY CONTENT */}
      {seoContent.city_content && (
        <div
          className="seo-content"
          dangerouslySetInnerHTML={{
            __html: cleanHtml(seoContent.city_content),
          }}
        />
      )}
      {/* SEO CONTENT */}
      {seoContent.seo_content && (
        <div
          className="seo-content"
          dangerouslySetInnerHTML={{
            __html: cleanHtml(seoContent.seo_content),
          }}
        />
      )}

      {/* PRICING CONTENT */}
      {seoContent.pricing_content && (
        <div
          className="seo-content"
          dangerouslySetInnerHTML={{
            __html: cleanHtml(seoContent.pricing_content),
          }}
        />
      )}

      {/* FAQ */}
      {seoContent.faq_content?.length > 0 && (
        <div className="seo-content max-w-4xl">
          <h2 className="text-lg font-semibold mb-4 text-black">FAQs</h2>

          <div>
            {seoContent.faq_content.map((faq, i) => {
              const isOpen = openIndex === i;

              return (
                <div key={i} className="border-b border-gray-200 py-3">
                  {/* QUESTION */}
                  <button
                    onClick={() => toggleFAQ(i)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="text-sm font-medium text-black">
                      {faq.question}
                    </span>

                    <span className="text-lg text-black">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {/* ANSWER */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] mt-2" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default SeoContent;
