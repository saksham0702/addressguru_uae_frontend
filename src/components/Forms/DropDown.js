import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const DropDown = ({
  cities,
  options = [cities],
  placeholder = "Select an option",
  onChange,
  value, // ✅ NEW (for edit mode)
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // ✅ EDIT MODE SYNC (THIS IS THE FIX)
  useEffect(() => {
    if (value) {
      setSelected(value);
    }
  }, [value]);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    if (onChange) onChange(option);
  };

  return (
    <div className="relative w-full">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex justify-between items-center w-full px-4 py-2 bg-white border border-gray-200 cursor-pointer rounded-lg shadow-sm text-left text-gray-800 hover:border-orange-600 focus:outline-none"
      >
        <span>{selected ? selected.label : placeholder}</span>
        <FaChevronDown
          className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border max-h-60 overflow-y-scroll border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {options.length > 0 ? (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-2 text-left cursor-pointer text-sm font-semibold hover:bg-orange-100 ${
                  selected?.value === option.value
                    ? "bg-orange-50 text-orange-600"
                    : ""
                }`}
              >
                {option.label}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No options</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropDown;
