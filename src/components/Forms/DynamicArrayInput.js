import React from "react";

const DynamicArrayInput = ({ title, value = [], onChange, placeholder }) => {
  const handleAddItem = () => {
    onChange([...value, ""]);
  };

  const handleRemoveItem = (index) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const handleItemChange = (index, newValue) => {
    // If the array is empty and we're typing in the first field
    if (value.length === 0) {
      onChange([newValue]);
      return;
    }

    const updatedValue = value.map((item, i) =>
      i === index ? newValue : item
    );
    onChange(updatedValue);
  };

  // Always show at least one input, but handle empty array case properly
  const displayValue = value.length === 0 ? [""] : value;

  return (
    <div className="space-y-2">
      <label className="text-gray-500 font-semibold">
        {title}
        <span className="text-red-600 font-semibold ml-1">&#42;</span>
      </label>

      {displayValue.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Remove button - only show if more than one item */}
          {displayValue.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              title="Remove item"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      ))}

      {/* Add more button */}
      <button
        type="button"
        onClick={handleAddItem}
        className="flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
      >
        <div className="w-6 h-0.5 bg-orange-400"></div>
        <span>Add more</span>
      </button>
    </div>
  );
};

export default DynamicArrayInput;
