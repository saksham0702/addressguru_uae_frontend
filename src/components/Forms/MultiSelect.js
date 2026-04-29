import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

export const MultiSelectDropDown = ({
  options = [],
  placeholder = "Select options",
  onChange,
  value = [], // array of selected values
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const dropdownRef = useRef();

  // ✅ Sync edit mode
  useEffect(() => {
    if (value && options.length) {
      const selectedOptions = options.filter((opt) =>
        value.includes(opt.value),
      );
      setSelected(selectedOptions);
    }
  }, [value, options]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (option) => {
    let updated;

    if (selected.find((item) => item.value === option.value)) {
      updated = selected.filter((item) => item.value !== option.value);
    } else {
      updated = [...selected, option];
    }

    setSelected(updated);

    if (onChange) {
      onChange(updated.map((item) => item.value)); // send only values to backend
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex justify-between items-center w-full px-4 py-2 bg-white border border-gray-200 cursor-pointer rounded-lg shadow-sm text-left text-gray-800 hover:border-orange-600 focus:outline-none"
      >
        <span className="truncate">
          {selected.length > 0
            ? selected.map((s) => s.label).join(", ")
            : placeholder}
        </span>

        <FaChevronDown
          className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.length > 0 ? (
            options.map((option) => {
              const isSelected = selected.some(
                (item) => item.value === option.value,
              );

              return (
                <div
                  key={option.value}
                  onClick={() => handleToggle(option)}
                  className={`flex items-center justify-between px-4 py-2 cursor-pointer text-sm font-semibold hover:bg-orange-100 ${
                    isSelected ? "bg-orange-50 text-orange-600" : ""
                  }`}
                >
                  {option.label}

                  {isSelected && (
                    <span className="text-orange-500 text-xs">✔</span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="px-4 py-2 text-gray-500">No options</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropDown;
