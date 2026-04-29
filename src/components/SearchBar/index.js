import React, { useState } from "react";
import Typewriter from "typewriter-effect";
import CityDropdown from "../CityDropdown";
import { Search } from "lucide-react";

const SearchBar = ({ data, isOpen, setIsOpen, value, setValue, onSearch }) => {
  const placeholders = [
    "What are you looking for?",
    "Restaurants Near Me",
    "Hotels in UAE",
  ];

  const [isFocused, setIsFocused] = useState(false);

  const showTypewriter = !isFocused && !value;

  return (
    <div className="w-full max-w-[600px] h-[52px] rounded-r-full bg-white flex items-center  border border-gray-200 overflow-hidden">
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
        <Search className="text-white" size={24
          
        } />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
