import React from "react";
import BusinessHours from "./BusinessHours";

const CategoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="#333" strokeWidth="2" />
    <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="#333" strokeWidth="2" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="#333" strokeWidth="2" />
    <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="#333" strokeWidth="2" />
  </svg>
);

const PriceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="14" rx="3" stroke="#333" strokeWidth="2" />
    <rect x="6" y="8" width="12" height="8" rx="1.5" stroke="#333" strokeWidth="1.2" />
    <line x1="9" y1="11" x2="15" y2="11" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="9" y1="13.5" x2="13" y2="13.5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const QuickInformation = ({
  handlePop,
  category,
  businesshours,
  job,
  link,
  price,
  handleWebsiteClick,
  id,
}) => {
  const categoryName = job ? category?.category_name : category?.name;

  return (
    <div className="w-full max-md:hidden rounded-t-lg">

      {/* Header */}
      <div className="bg-[#323232] text-white text-center rounded-t-lg py-2 font-semibold">
        Quick Information
      </div>

      {/* Info Body */}
      <div className="bg-[#EEEEEE] p-4 text-sm space-y-1 border-b">

        {/* Category */}
        {categoryName && (
          <p className="flex items-center gap-2">
            <CategoryIcon />
            <span className="font-semibold text-[16px] text-black">Category:</span>
            <span className="font-semibold text-[16px] text-orange-600">{categoryName}</span>
          </p>
        )}

        {/* Starting Price */}
        {price?.value?.amount && (
          <p className="flex items-center gap-2">
            <PriceIcon />
            <span className="font-semibold text-[16px] text-black">Starting Price:</span>
            <span className="font-semibold text-[16px]">
              {price.value.currency} {price.value.amount}
            </span>
          </p>
        )}

        {/* Business Hours */}
        {!job && businesshours && (
          <BusinessHours openingHours={businesshours} mobile="" />
        )}

      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center bg-white p-1 max-md:p-3 border border-t-0 border-gray-200 rounded-b-lg">

        {link && (
            <a
            href={link}
            target="_blank"
            rel="noreferrer"
            onClick={() => handleWebsiteClick(id, "website")}
            className="bg-white border border-[#EEEEEE] text-[#838383] px-2 py-1 text-sm rounded"
          >
            Visit Website
          </a>
        )}

        <span
          onClick={() => handlePop("report")}
          className="font-medium text-red-600 px-2 py-1 text-sm cursor-pointer rounded"
        >
          Report
        </span>

        <span
          onClick={() => handlePop("claim")}
          className="font-medium bg-gray-100 text-gray-600 px-2 py-1 text-sm rounded cursor-pointer"
        >
          Claim this Business
        </span>

      </div>
    </div>
  );
};

export default QuickInformation;