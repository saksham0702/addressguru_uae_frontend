import React, { useState } from "react";

const CustomRadioGroup = ({ options = [], defaultValue, onChange }) => {
  const [selected, setSelected] = useState(defaultValue || options[0]);

  const handleChange = (value) => {
    setSelected(value);
    if (onChange) onChange(value); // send value back to parent
  };

  return (
    <div className="flex space-x-5 items-center text-sm">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center cursor-pointer space-x-2"
        >
          <input
            type="radio"
            name="custom-radio"
            value={option}
            checked={selected === option}
            onChange={() => handleChange(option)}
            className="sr-only"
          />
          <span
            className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
              selected === option
                ? "bg-orange-500 border-orange-500"
                : "border-orange-500"
            }`}
          >
            {selected === option && (
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
          <span className="font-medium text-black">{option.toUpperCase()}</span>
        </label>
      ))}
    </div>
  );
};

export default CustomRadioGroup;
