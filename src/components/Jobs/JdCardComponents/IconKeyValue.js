import React from "react";

const IconKeyValue = ({ label, value, icon, bg }) => {
  const isArray = Array.isArray(value);

  return (
    <div className="flex items-center whitespace-nowrap md:space-x-2 space-x-1 text-xs ">
      {icon && <span className="text-gray-500">{icon}</span>}

      <span className="">
        {label && <span className="font-medium text-gray-500">{label}</span>}{" "}
        <span className="mr-1">:</span>
        {isArray
          ? value.map((v, i) => (
              <span
                key={i}
                className={`font-[500] ${
                  bg && "bg-gray-100 p-1  rounded-sm ml-1"
                }`}
              >
                {v}
              </span>
            ))
          : value && (
              <span className={`font-[500] ${bg && " p-1 rounded-sm ml-1"}`}>
                {value}
              </span>
            )}
      </span>
    </div>
  );
};

export default IconKeyValue;
