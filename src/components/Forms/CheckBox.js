// ========== CheckBox.jsx (UPDATED) ==========
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";

const CheckBox = ({
  heading,
  options,
  onChange,
  error,
  selectedIds = [],
  errorRef,
  onErrorClear,
}) => {
  const [localSelectedIds, setLocalSelectedIds] = useState(selectedIds);


  useEffect(() => {
    setLocalSelectedIds(selectedIds);
  }, [selectedIds]);

  const handleCheckboxChange = (option) => {
    const optionId = option._id;

    setLocalSelectedIds((prev) => {
      let updated;

      if (prev.includes(optionId)) {
        updated = prev.filter((id) => id !== optionId);
      } else {
        updated = [...prev, optionId];
      }

      if (onChange) {
        onChange(updated);
      }

      if (onErrorClear && updated.length > 0) {
        onErrorClear();
      }

      return updated;
    });
  };

  return (
    <section ref={errorRef}>
      <span className="flex overflow-visible items-center">
        <h3 className="2xl:text-[16px] text-sm font-medium text-black">{heading}</h3>
        <span className="text-red-600 ml-1 font-semibold">&#42;</span>
        {error && (
          <p className="text-red-500 ml-2 text-sm mt-1 mb-1">{error}</p>
        )}
      </span>
      <div className="grid grid-cols-2 capitalize md:grid-cols-3 gap-1 mt-2">
        {options?.map((option, index) => (
          <label
            key={option?._id || index}
            className="flex gap-2 cursor-pointer p-1 rounded items-center transition-colors"
          >
            <span
              className={`flex items-center justify-center w-6 h-6 rounded-full border-2 cursor-pointer transition-all
                ${
                  localSelectedIds.includes(option._id)
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "border-orange-500 hover:border-orange-600"
                }
                ${error ? "border-red-500" : ""}
              `}
              onClick={() => handleCheckboxChange(option)}
            >
              {localSelectedIds.includes(option._id) && (
                <FaCheck size={16} strokeWidth={1} />
              )}
            </span>
            <span className="text-gray-900 text-sm font-medium select-none max-w-[180px] leading-tight capitalize">
              {option?.name || option?.title}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
};

export default CheckBox;
