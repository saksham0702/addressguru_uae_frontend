import React, { useState } from "react";

const Select = ({ heading, options }) => {
  const [selected, setSelected] = useState([]);

  const handleSelect = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((opt) => opt !== item) : [...prev, item]
    );
  };

  return (
    <>
      <span className="flex">
        <h3 className="2xl:text-lg font-semibold text-[#696969] ">{heading}</h3>
        <span className="text-red-600 ml-1 font-semibold">&#42;</span>
      </span>

      <div className="w-full h-44 border border-gray-300 grid grid-cols-2 gap-2 p-3 rounded-lg overflow-y-auto">
        {options?.map((item, index) => {
          const isSelected = selected.includes(item);
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(item)}
              className={`py-1 px-3 rounded-sm text-[15.5px]  text-start font-[500] transition-colors
                ${
                  isSelected
                    ? " bg-orange-400 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Optional: Display selected values */}
      {/* <div className="mt-3 text-sm text-gray-600">
        Selected: {selected.length > 0 ? selected.join(", ") : "None"}
      </div> */}
    </>
  );
};

export default Select;
