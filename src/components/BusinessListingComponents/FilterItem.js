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
  isRadio = false,
  isMultiple = false,
  radioOptions = [],
  multiOptions = [],
  selectedRadioId = null,
  selectedMultiIds = [],
}) => {
  const [tempSelectedId, setTempSelectedId] = useState(selectedRadioId);
  const [tempSelectedMultiIds, setTempSelectedMultiIds] =
    useState(selectedMultiIds);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setOpenIndex(null);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen, setOpenIndex]);

  const handleClick = () => {
    if (hasDropdown || isRadio || isMultiple) {
      if (isOpen) {
        setOpenIndex(null);
        setTempSelectedId(selectedRadioId);
        setTempSelectedMultiIds(selectedMultiIds || []);
      } else {
        setOpenIndex(index);
        setTempSelectedId(selectedRadioId);
        setTempSelectedMultiIds(selectedMultiIds || []);
      }
    } else {
      onSelect?.();
    }
  };

  const handleApply = () => {
    if (isRadio && tempSelectedId !== null) {
      const selectedOption = radioOptions.find(
        (opt) => opt.id === tempSelectedId
      );
      onSelect?.(selectedOption);
      setOpenIndex(null);
    } else if (isMultiple) {
      const selectedOptions = multiOptions.filter((opt) =>
        tempSelectedMultiIds.includes(opt.id)
      );
      onSelect?.(selectedOptions);
      setOpenIndex(null);
    }
  };

  const handleClearDropdown = () => {
    if (isMultiple) {
      setTempSelectedMultiIds([]);
      // Only fire API if something was previously committed
      if ((selectedMultiIds || []).length > 0) {
        onSelect?.([]);
      }
    } else if (isRadio) {
      setTempSelectedId(null);
      if (selectedRadioId !== null) {
        onSelect?.(null);
      }
    } else if (hasDropdown) {
      // Sort by — always had a value if active, so always call
      onSelect?.(null);
    }
    setOpenIndex(null);
  };

  // Dismiss active selection without opening dropdown
  const handleDismiss = (e) => {
    e.stopPropagation();
    if (label === "AG Verified") {
      onSelect?.();
      return;
    }
    if (isMultiple) {
      onSelect?.([]);
    } else if (isRadio || hasDropdown) {
      onSelect?.(null);
    }
  };

  const handleCheckboxChange = (optionId) => {
    setTempSelectedMultiIds((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const showChevron = hasDropdown || isRadio || isMultiple;

  return (
    <div className="relative z-50">
      <div
        onClick={handleClick}
        className={`flex items-center whitespace-nowrap gap-1.5 px-2.5 py-1.5 cursor-pointer rounded-md text-sm font-semibold transition-all duration-200 select-none
          ${
            active
              ? "bg-orange-50 text-orange-600 border border-orange-300 border-b-2 border-b-orange-500"
              : isOpen
              ? "bg-white border border-gray-300 border-b-2 border-b-orange-500 text-orange-500"
              : "bg-white border border-gray-300 hover:bg-gray-50 hover:border-b-2 hover:border-b-orange-300 text-gray-700"
          }
        `}
      >
        {icon && <span className="text-orange-500 flex-shrink-0">{icon}</span>}
        <span>{label}</span>

        {showChevron && !active && (
          <svg
            className={`relative top-[1px] flex-shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            width="11"
            height="7"
            viewBox="0 0 11 7"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.692 6.105a.88.88 0 01-1.201 0L.243 1.554C-.089 1.198-.089.622.243.267.575-.089 1.113-.089 1.444.267L5.09 4.174 8.738.267c.332-.356.87-.356 1.202 0 .331.355.331.931 0 1.287L5.692 6.105z"
              fill="currentColor"
            />
          </svg>
        )}

        {/* X dismiss button when active and dropdown is closed */}
        {active && !isOpen && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 ml-0.5 w-4 h-4 rounded-full bg-orange-200 hover:bg-orange-400 text-orange-700 hover:text-white flex items-center justify-center transition-colors"
            aria-label={`Clear ${label}`}
          >
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
              <path
                d="M1 1l8 8M9 1L1 9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Regular Dropdown */}
      {hasDropdown && !isRadio && !isMultiple && isOpen && dropdownItems.length > 0 && (
        <div className="animate-drop absolute top-full left-1/2 -translate-x-1/2 z-50 mt-2 w-44 bg-white shadow-lg rounded-md border border-gray-100 text-sm overflow-hidden">
          {dropdownItems.map((item, idx) => (
            <div
              key={idx}
              className="px-3 py-2.5 hover:bg-orange-50 cursor-pointer font-semibold text-gray-700 hover:text-orange-600 transition-colors"
              onClick={() => {
                onSelect?.(item);
                setOpenIndex(null);
              }}
            >
              {item}
            </div>
          ))}
          <div className="border-t border-gray-100 px-3 py-2">
            <button
              onClick={handleClearDropdown}
              className="w-full text-xs text-gray-400 hover:text-red-500 font-semibold text-left transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Checkbox Dropdown (Multiple Select) */}
      {isMultiple && isOpen && multiOptions.length > 0 && (
        <div className="animate-drop absolute top-full left-1/2 -translate-x-1/2 z-50 mt-3  w-[880px] max-w-[calc(100vw-2rem)] bg-white shadow-xl rounded-lg border border-gray-100 text-sm">
          {/* Header */}
          <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
            {tempSelectedMultiIds.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold">
                  {tempSelectedMultiIds.length}
                </span>
                <span className="text-xs text-gray-400 font-medium">selected</span>
              </div>
            )}
          </div>

          {/* 4-column grid */}
          <div className="p-3 grid grid-cols-4 gap-2 max-h-50 overflow-y-auto">
            {multiOptions.map((option) => {
              const checked = tempSelectedMultiIds.includes(option.id);
              return (
                <label
                  key={option.id}
                  className={`flex items-center gap-2.5 cursor-pointer px-3 py-2.5 rounded-md border transition-all
                    ${
                      checked
                        ? "bg-orange-50 border-orange-300"
                        : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }
                  `}
                >
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxChange(option.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0
                        ${checked ? "border-orange-500 bg-orange-500" : "border-gray-300 bg-white"}
                      `}
                    >
                      {checked && (
                        <svg width="8" height="6" viewBox="0 0 12 9" fill="none">
                          <path
                            d="M1 4.5L4.5 8L11 1"
                            stroke="white"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span
                    className={`font-medium text-xs select-none leading-tight ${
                      checked ? "text-orange-700" : "text-gray-700"
                    }`}
                    title={option.label}
                  >
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Apply + Clear row */}
          <div className="border-t border-gray-100 px-4 py-3  mb-2 flex items-center justify-end gap-3">
            <button
              onClick={handleClearDropdown}
              className="h-9 px-5 border border-gray-300 hover:border-red-400 text-gray-500 hover:text-red-500 font-semibold rounded-md text-sm transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="h-9 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md text-sm transition-colors"
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