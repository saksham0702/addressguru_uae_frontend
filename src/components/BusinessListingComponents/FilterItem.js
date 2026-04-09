import React, { useEffect, useState } from "react";

const FilterItem = ({
  label,
  icon,
  hasDropdown,
  dropdownItems = [],
  isOpen,
  index,
  setOpenIndex,
  onSelect,
  active = false,
  isRadio = false, // ✅ Single select with radio
  isMultiple = false, // ✅ NEW: Multiple select with checkboxes
  radioOptions = [], // For radio mode
  multiOptions = [], // ✅ NEW: For multiple mode - array of {id, label, value}
  selectedRadioId = null, // For radio mode
  selectedMultiIds = [], // ✅ NEW: For multiple mode - array of selected IDs
}) => {
  const [tempSelectedId, setTempSelectedId] = useState(selectedRadioId);
  const [tempSelectedMultiIds, setTempSelectedMultiIds] =
    useState(selectedMultiIds);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setOpenIndex(null);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen, setOpenIndex]);

  const handleClick = () => {
    if (hasDropdown || isRadio || isMultiple) {
      if (isOpen) {
        setOpenIndex(null);
        // Reset temp selections when closing without applying
        setTempSelectedId(selectedRadioId);
        setTempSelectedMultiIds(selectedMultiIds || []); // ✅ FIX: Handle null
      } else {
        setOpenIndex(index);
        // Sync temp selections with current selections when opening
        setTempSelectedId(selectedRadioId);
        setTempSelectedMultiIds(selectedMultiIds || []); // ✅ FIX: Handle null
      }
    } else {
      onSelect?.();
    }
  };

  const handleApply = () => {
    if (isRadio && tempSelectedId !== null) {
      const selectedOption = radioOptions.find(
        (opt) => opt.id === tempSelectedId,
      );
      onSelect?.(selectedOption);
      setOpenIndex(null);
    } else if (isMultiple) {
      const selectedOptions = multiOptions.filter((opt) =>
        tempSelectedMultiIds.includes(opt.id),
      );
      onSelect?.(selectedOptions);
      setOpenIndex(null);
    }
  };

  const handleCheckboxChange = (optionId) => {
    setTempSelectedMultiIds((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  return (
    <div className="relative">
      <div
        onClick={handleClick}
        className={`flex items-center whitespace-nowrap gap-1 px-2 py-1.5 cursor-pointer rounded text-sm font-semibold transition-all duration-200
    ${
      active
        ? "bg-orange-100 text-orange-600 border border-orange-300 border-b-2 border-b-orange-500"
        : isOpen
          ? "bg-white border border-gray-300 border-b-2 border-b-orange-500 text-orange-500"
          : "bg-white border border-gray-300 hover:bg-gray-50 hover:border-b-2 hover:border-b-orange-300"
    }
  `}
      >
        {icon && <span className="text-orange-500">{icon}</span>}
        <span>{label}</span>
        {(hasDropdown || isRadio || isMultiple) && (
          <svg
            className={`relative top-[1px] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            width="11"
            height="7"
            viewBox="0 0 11 7"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.69199 6.10485C5.36025 6.46029 4.82233 6.46029 4.49059 6.10485L0.242958 1.55382C-0.0887985 1.19836 -0.0887985 0.622054 0.242958 0.266591C0.574723 -0.0888635 1.11261 -0.0888635 1.44437 0.266591L5.09129 4.17403L8.73822 0.266591C9.06996 -0.0888635 9.60788 -0.0888635 9.93962 0.266591C10.2714 0.622054 10.2714 1.19836 9.93962 1.55382L5.69199 6.10485Z"
              fill="currentColor"
            />
          </svg>
        )}
      </div>

      {/* Regular Dropdown */}
      {hasDropdown &&
        !isRadio &&
        !isMultiple &&
        isOpen &&
        dropdownItems.length > 0 && (
          <div className="animate-drop absolute top-full left-0 z-50 mt-2 w-40 bg-white shadow-lg rounded border border-gray-100 text-sm">
            {" "}
            {dropdownItems.map((item, idx) => (
              <div
                key={idx}
                className="px-3 py-2 hover:bg-orange-50 cursor-pointer font-semibold"
                onClick={() => {
                  onSelect?.(item);
                  setOpenIndex(null);
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}

      {/* Checkbox Dropdown (Multiple Select) */}
      {isMultiple && isOpen && multiOptions.length > 0 && (
        <div className="animate-drop absolute top-full left-0 z-50 mt-3 w-76 bg-white shadow-lg rounded text-sm">
          {" "}
          <div className="p-2 space-y-1 max-h-64 z-50 overflow-y-auto">
            {multiOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-1.5 cursor-pointer hover:bg-orange-50 p-2 rounded transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={tempSelectedMultiIds.includes(option.id)}
                    onChange={() => handleCheckboxChange(option.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                      ${
                        tempSelectedMultiIds.includes(option.id)
                          ? "border-orange-500 bg-orange-500"
                          : "border-gray-300 bg-white"
                      }
                    `}
                  >
                    {tempSelectedMultiIds.includes(option.id) && (
                      <svg
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                        fill="none"
                        className="text-white"
                      >
                        <path
                          d="M1 4.5L4.5 8L11 1"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="font-semibold text-gray-950 text-sm select-none">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          <div className="border-t border-gray-200 p-3">
            <button
              onClick={handleApply}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterItem;
