import { maskEmail, maskPhone } from "@/utils/maskContact";
import BusinessHours from "./BusinessHours";
import { Check, CircleCheck } from "lucide-react";
import { useState } from "react";
const CategoryIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="3"
      width="8"
      height="8"
      rx="1.5"
      stroke="#333"
      strokeWidth="2"
    />
    <rect
      x="13"
      y="3"
      width="8"
      height="8"
      rx="1.5"
      stroke="#333"
      strokeWidth="2"
    />
    <rect
      x="3"
      y="13"
      width="8"
      height="8"
      rx="1.5"
      stroke="#333"
      strokeWidth="2"
    />
    <rect
      x="13"
      y="13"
      width="8"
      height="8"
      rx="1.5"
      stroke="#333"
      strokeWidth="2"
    />
  </svg>
);
const formatFieldValue = (field) => {
  if (!field?.value) return "";

  if (field.type === "price") {
    return `${field.value.currency} ${field.value.amount}`;
  }

  if (Array.isArray(field.value)) {
    return field.value
      .map((item) =>
        typeof item === "object" ? item.name || item.label || item.value : item,
      )
      .join(", ");
  }

  return String(field.value);
};

const QuickInformation = ({
  handlePop,
  category,
  businesshours,
  job,
  link,
  extraFields,
  handleWebsiteClick,
  id,
  positions,
  onContactClick,
}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const categoryName = job ? category?.name : category?.name;
  const allFields = [
    ...(extraFields?.quickinfo || []),
    ...(extraFields?.logo || []),
    ...(extraFields?.description || []),
    ...(extraFields?.additional || []),
  ].filter((field) => {
    const val = field?.value;
    if (val === null || val === undefined || val === "") return false;
    if (typeof val === "string" && val.trim() === "") return false;
    if (field?.type === "price" && (val?.amount === "" || val?.amount == null))
      return false;
    return true;
  });

  return (
    <div className="w-full max-md:hidden mb-3 rounded-t-lg">
      {/* Header */}
      <div className="bg-[#323232] text-white text-center rounded-t-lg py-2 font-semibold">
        Quick Information
      </div>

      {/* Info Body */}
      <div className="bg-[#EEEEEE] relative p-4 text-sm space-y-1 border-b">
        {/* Category */}
        {categoryName && (
          <p className="flex items-center gap-2">
            <CategoryIcon />
            <span className="font-medium text-[16px] text-black">
              Category:
            </span>
            <span className="font-medium text-[16px] text-orange-600">
              {categoryName}
            </span>
          </p>
        )}

        {/* Business Hours */}
        {!job && businesshours && (
          <BusinessHours openingHours={businesshours} mobile="" />
        )}

        {job && (
          <p className="flex items-center gap-2">
            <CategoryIcon />
            <span className="font-medium text-[16px] text-black">
              Total Positions:
            </span>
            <span className="font-medium text-[16px] text-orange-600">
              {positions}
            </span>
          </p>
        )}

        {allFields.map((field, index) => {
          const value = formatFieldValue(field);
          const isLong = value?.length > 20;

          return (
            <div key={index} className="flex items-center gap-2">
              <CircleCheck size={18} />
              <div className="flex flex-1 gap-1">
                {/* Label */}
                <span className="font-medium text-[16px] text-black whitespace-nowrap">
                  {field?.label}:
                </span>
                {/* 🔥 IMPORTANT: group wrapper */}
                <div className="relative group max-w-[180px]">
                  {/* Truncated text */}
                  {Array.isArray(field?.value) ? (
                    <div className="relative group">
                      <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-600 whitespace-nowrap">
                        {typeof field.value[0] === "object"
                          ? field.value[0]?.name ||
                            field.value[0]?.label ||
                            field.value[0]?.value
                          : field.value[0]}

                        {field.value.length > 1 &&
                          ` +${field.value.length - 1}`}
                      </span>

                      {field.value.length > 1 && (
                        <div className="absolute left-0 top-full mt-1 hidden group-hover:flex flex-wrap gap-1 z-50 bg-white border border-gray-300 shadow-lg rounded p-2 max-w-[280px]">
                          {field.value.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-600"
                            >
                              {typeof item === "object"
                                ? item.name || item.label || item.value
                                : item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span
                      className={`block truncate font-medium text-[16px] text-orange-600`}
                    >
                      {field?.label?.toLowerCase()?.includes("phone") ||
                      field?.label?.toLowerCase()?.includes("mobile")
                        ? maskPhone(value)
                        : field?.label?.toLowerCase()?.includes("email")
                          ? maskEmail(value)
                          : value}
                    </span>
                  )}
                  {/* ✅ Hover popup ONLY if long - positioned BELOW */}
                  {!Array.isArray(field?.value) &&
                    (field?.label?.toLowerCase()?.includes("phone") ||
                    field?.label?.toLowerCase()?.includes("mobile")
                      ? maskPhone(value)
                      : field?.label?.toLowerCase()?.includes("email")
                        ? maskEmail(value)
                        : value
                    )?.length > 20 && (
                      <div className="absolute left-0 top-full hidden group-hover:block z-50 bg-white border border-gray-300 shadow-lg rounded px-3 py-2 text-[14px] text-orange-600 whitespace-normal break-words max-w-[280px]">
                        {field?.label?.toLowerCase()?.includes("phone") ||
                        field?.label?.toLowerCase()?.includes("mobile")
                          ? maskPhone(value)
                          : field?.label?.toLowerCase()?.includes("email")
                            ? maskEmail(value)
                            : value}
                      </div>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center bg-white p-1 max-md:p-3 border border-t-0 border-gray-200 rounded-b-lg">
        {link && (
          <button
            onClick={() => handleWebsiteClick(link)}
            className="bg-white border border-[#EEEEEE] text-[#838383] px-2 py-1 text-sm rounded hover:border-orange-300 hover:text-orange-500 transition-colors"
          >
            Visit Website
          </button>
        )}
        <span
          onClick={() => handlePop("report")}
          className="font-medium text-red-600 px-2 py-1 text-sm cursor-pointer rounded"
        >
          Report
        </span>
        {!job && (
          <span
            onClick={() => handlePop("claim")}
            className="font-medium bg-gray-100 text-gray-600 px-2 py-1 text-sm rounded cursor-pointer"
          >
            Claim this Business
          </span>
        )}
      </div>
    </div>
  );
};

export default QuickInformation;
