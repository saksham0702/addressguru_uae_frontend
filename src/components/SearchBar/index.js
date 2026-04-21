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
    <div className="w-full max-w-[600px] h-[52px] rounded-r-full bg-white flex items-center shadow-md border border-gray-200 overflow-hidden">
      {/* LEFT: City Dropdown */}
      <div className=" flex items-center border-r border-gray-200 min-w-[140px]">
        <CityDropdown isOpen={isOpen} setIsOpen={setIsOpen} data={data} />
      </div>

      {/* CENTER: Search Input */}
      <div className="flex-1 relative px-4">
        {/* Typewriter */}
        {showTypewriter && (
          <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 text-[14px] font-medium pointer-events-none">
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
            if (e.key === "Enter") onSearch();
          }}
          className="w-full bg-transparent outline-none text-gray-800 text-[14px] font-medium"
        />
      </div>

      {/* RIGHT: Icons */}
      <div className="flex items-center gap-2 pr-2">
        {/* Mic */}
        <button className="p-2 rounded-full hover:bg-gray-100 transition">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            {/* mic paths */}
          </svg>
        </button>

        {/* Search */}
        <button
          onClick={onSearch}
          className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-[#FF6E04] hover:bg-[#ff5a00] transition"
        >
          <svg width="20" height="20" viewBox="0 0 38 38" fill="none">
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
