import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";

export default function CityDropdown({ data, isOpen, setIsOpen }) {
  const { city, setCity } = useAuth();

  return (
    <div className="inline-block relative text-left z-[9999999]">
      <span
        className="text-[#FF6E04] font-bold flex gap-2 items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p> {city} </p>
        <svg
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          } relative top-0.5`}
          width="14"
          height="7"
          viewBox="0 0 14 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.98343 6.68574C7.54169 7.05908 6.8254 7.05908 6.38366 6.68574L0.727562 1.90552C0.2858 1.53215 0.2858 0.926819 0.727562 0.553454C1.16934 0.180099 1.88558 0.180099 2.32735 0.553454L7.18354 4.65768L12.0397 0.553454C12.4815 0.180099 13.1978 0.180099 13.6395 0.553454C14.0813 0.926819 14.0813 1.53215 13.6395 1.90552L7.98343 6.68574Z"
            fill="#FF6E04"
          />
        </svg>
      </span>

      {isOpen && (
        <div className="absolute mt-3.5 bg-white shadow-md max-md:right-[2px] border rounded text-black w-[200px] border-gray-200 hide-scroll max-h-[300px] overflow-y-auto z-50">
          {/* Header with Close Button */}
          <div className="px-4 py-2 text-xs text-gray-400 my-3 uppercase border-b border-gray-100 flex items-center justify-between">
            <span>Popular Locations</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close dropdown"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          {/* City List */}
          {data.map((item) => (
            <div
              key={item._id}
              onClick={() => {
                setCity(item.name);
                setIsOpen(false);
              }}
              className={`px-4 py-3 cursor-pointer font-normal hover:bg-gray-50 flex items-center gap-2 ${
                city === item.name
                  ? "bg-orange-50 text-[#FF6E04]"
                  : "text-gray-700"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="flex-shrink-0"
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  fill="currentColor"
                  opacity="0.6"
                />
              </svg>

              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
