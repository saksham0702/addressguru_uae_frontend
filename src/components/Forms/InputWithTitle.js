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
      <label className="text-black 2xl:text-[16px]  font-medium text-sm flex relative capitalize">
        <span className="flex items-center gap-2">
          <p>{title}</p>
          {header ? (
            <span className=" text-[13px] font-normal">({header})</span>
          ) : (
            (minLength || maxLength) && (
              <span className="ml-2 text-[13px] font-normal">
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
          className="border border-gray-200 w-full font-medium rounded-lg p-2 text-sm placeholder:text-sm placeholder:font-normal"
          rows={rows || 4}
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          type={type === "number" ? "text" : type} // 👈 override only for number
          inputMode={type === "number" ? "numeric" : undefined}
          pattern={type === "number" ? "[0-9]*" : undefined}
          placeholder={placeholder}
          className={`border border-gray-200 ${
            width ? "w-[50%]" : "w-full"
          } font-medium rounded-lg p-2 text-sm placeholder:text-sm placeholder:font-normal`}
          minLength={minLength}
          maxLength={maxLength}
          value={value}
          onChange={(e) => {
            if (type === "number") {
              let val = e.target.value;
              val = val.replace(/[^0-9]/g, "");
              onChange({
                target: { value: val },
              });
            } else {
              onChange(e);
            }
          }}
          onKeyDown={(e) => {
            if (type === "number") {
              // ✅ allow only digits + control keys
              if (
                !/[0-9]/.test(e.key) &&
                ![
                  "Backspace",
                  "ArrowLeft",
                  "ArrowRight",
                  "Tab",
                  "Delete",
                ].includes(e.key)
              ) {
                e.preventDefault();
              }
            }
          }}
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
