import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQSection = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="mt-5 md:pl-2 px-1">
      <span className="flex gap-3 items-center mb-4">
        <h3 className="font-semibold whitespace-nowrap uppercase md:text-xl">
          Frequently Asked Questions
        </h3>
        <span className="h-[1px] w-full bg-gray-200" />
      </span>

      <div>
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-gray-200">
            <button
              onClick={() => toggle(i)}
              className="w-full py-3.5 flex items-center justify-between gap-4 text-left"
            >
              <span className="font-medium text-gray-800 text-sm md:text-base">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className="grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ gridTemplateRows: openIndex === i ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="text-sm md:text-base text-gray-500 leading-relaxed pb-3.5">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
