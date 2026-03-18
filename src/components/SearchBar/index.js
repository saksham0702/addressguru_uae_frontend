import React, { useState } from "react";
import Typewriter from "typewriter-effect";
import CityDropdown from "../CityDropdown";

const SearchBar = ({ data, isOpen, setIsOpen, value, setValue, onSearch }) => {
  const placeholders = [
    "What are you looking for?",
    "Restaurants Near Me",
    "Hotels in UAE",
  ];

  const [isFocused, setIsFocused] = useState(false);

  const showTypewriter = !isFocused && !value;

  return (
    <div className="w-[530px] h-[50px] rounded-r-full rounded-l-xs relative bg-white flex items-center px-5 shadow-md">
      {/* City Dropdown */}
      <CityDropdown isOpen={isOpen} setIsOpen={setIsOpen} data={data} />

      <span className="h-full bg-gray-200 w-0.5 mx-4"></span>

      {/* Search Field */}
      <div className="relative flex-1">
        {/* Typing Animation Placeholder */}
        {showTypewriter && (
          <div className="absolute top-1/2 -translate-y-1/2 left-0 text-gray-500 font-semibold pointer-events-none select-none">
            <Typewriter
              options={{
                strings: placeholders,
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 10,
                pauseFor: 2000,
              }}
            />
          </div>
        )}

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          className="w-full h-full bg-transparent outline-none text-gray-800 font-semibold"
        />
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center absolute right-1">
        {/* Mic Icon */}
        <svg
          className="relative right-1.5"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
        >
          {/* mic paths */}
        </svg>

        {/* Search Icon (CLICK TRIGGER) */}
        <button onClick={onSearch}>
          <svg
            className="relative right-1 cursor-pointer"
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
          >
            <rect width="38" height="38" rx="19" fill="#FF6E04" />
            <path
              d="M28 28L23.75 23.7425M26.105 18.0526C26.105 20.1883 25.2566 22.2365 23.7465 23.7467C22.2363 25.2569 20.1881 26.1053 18.0524 26.1053C15.9167 26.1053 13.8685 25.2569 12.3583 23.7467C10.8482 22.2365 10 20.1883 10 18.0526C10 15.9169 10.8482 13.8687 12.3583 12.3586C13.8685 10.8484 15.9167 10 18.0524 10C20.1881 10 22.2363 10.8484 23.7465 12.3586C25.2566 13.8687 26.105 15.9169 26.105 18.0526Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
