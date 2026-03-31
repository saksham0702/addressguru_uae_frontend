import React from "react";

const InputWithTitle = ({
  type = "text",
  title,
  value,
  onChange,
  isTextarea,
  rows,
  placeholder,
  minLength,
  maxLength,
  header,
  width,
  error,
  required,
}) => {
  return (
    <div className="flex flex-col w-full whitespace-nowrap gap-1">
      <label className="text-[#696969] 2xl:text-lg flex relative capitalize font-semibold">
        <span className="flex items-center gap-2">
          <p>{title}</p>
          {header ? (
            <span className=" text-[13px] font-semibold">({header})</span>
          ) : (
            (minLength || maxLength) && (
              <span className="ml-2 text-[13px] font-light">
                ({minLength && `Min: ${minLength} chars`}
                {minLength && maxLength && " | "}
                {maxLength && `Max: ${maxLength} chars`})
              </span>
            )
          )}
          {required && <span className="text-red-600">&#42;</span>}
        </span>
      </label>

      {isTextarea ? (
        <textarea
          className="border border-gray-200  w-full font-[500] rounded-lg p-2"
          rows={rows || 4}
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className={`border border-gray-200 ${
            width ? "w-[50%]" : "w-full"
          } font-[500] rounded-lg p-2`}
          minLength={minLength}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
        />
      )}
      {/* CHARACTER COUNTER */}
      {(maxLength || minLength) && (
        <p className="text-xs text-gray-500 text-right">
          {value?.length || 0}
          {maxLength && ` / ${maxLength}`}
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-500 z-50 text-sm font-normal">{error}</p>
      )}
    </div>
  );
};

export default InputWithTitle;
