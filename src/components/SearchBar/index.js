"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Typewriter from "typewriter-effect";
import CityDropdown from "../CityDropdown";
import {
  FiSearch,
  FiMic,
  FiX,
  FiArrowRight,
  FiMapPin,
  FiGrid,
  FiBriefcase,
  FiBook,
} from "react-icons/fi";
import { fetchSearchSuggestions } from "@/api/search";
import { useSearchHandler } from "@/hooks/useSearchHandler";
import { useAuth } from "@/context/AuthContext";

const TYPE_META = {
  category_city: {
    icon: FiMapPin,
    color: "#FF6E04",
    bg: "#FFF3EC",
    hint: "Browse category",
  },
  category: {
    icon: FiGrid,
    color: "#7C3AED",
    bg: "#F3EEFF",
    hint: "Browse category",
  },
  business: {
    icon: FiBriefcase,
    color: "#0EA5E9",
    bg: "#E0F5FF",
    hint: "View listing",
  },
  service: {
    icon: FiArrowRight,
    color: "#10B981",
    bg: "#E6FAF5",
    hint: "Service",
  },
  course: {
    icon: FiBook,
    color: "#F59E0B",
    bg: "#FEF9EC",
    hint: "Course",
  },
};

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const SuggestionIcon = ({ s, meta }) => {
  const Icon = meta.icon;

  if (s.type === "business" && s.logo) {
    return (
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}/${s.logo}`}
        alt={s.label}
        className="flex-shrink-0 w-8 h-8 object-cover rounded-lg"
        onError={(e) => {
          e.currentTarget.outerHTML = `<span style="background:${meta.bg}" class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"></span>`;
        }}
      />
    );
  }

  return (
    <span
      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
      style={{ background: meta.bg }}
    >
      <Icon size={15} style={{ color: meta.color }} />
    </span>
  );
};

// pass selectedCity into SuggestionLabels
const SuggestionLabels = ({ s, selectedCity }) => (
  <div className="flex-1 min-w-0">
    <p className="text-[13.5px] font-semibold text-gray-800 truncate leading-tight">
      {s.type === "category" && selectedCity
        ? `${s.label} in ${selectedCity}`
        : s.label}
    </p>

    {s.type === "business" && (s.category || s.city) && (
      <p className="text-[11.5px] text-gray-400 truncate mt-0.5">
        {[s.category, s.city].filter(Boolean).join(" · ")}
      </p>
    )}

    {s.type === "category" && s.category?.description && (
      <p className="text-[11.5px] text-gray-400 truncate mt-0.5">
        {s.category.description}
      </p>
    )}

    {s.type === "category_city" && s.city && (
      <p className="text-[11px] text-[#FF6E04] font-medium mt-0.5 flex items-center gap-1">
        <FiMapPin size={10} />
        {s.city.name}
      </p>
    )}
  </div>
);

const SearchBar = ({
  data,
  isOpen,
  setIsOpen,
  value,
  setValue,
  variant = "banner",
}) => {
  const placeholders = [
    "What are you looking for?",
    "Restaurants in Dubai",
    "Hotels in Sharjah",
    "Gyms in Abu Dhabi",
    "Accountants in Ajman",
  ];

  const router = useRouter();
  const { handleSearch, handleSuggestionClick: processSuggestion } =
    useSearchHandler();
  const { city } = useAuth();
  console.log("city from auth", city);

  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  const debouncedValue = useDebounce(value, 300);
  const showTypewriter = !isFocused && !value;

  useEffect(() => {
    const handleScroll = () => {
      if (showDropdown) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showDropdown]);

  useEffect(() => {
    const handleRouteChange = () => {
      setShowDropdown(false);
      setIsFocused(false);
    };
    router.events?.on("routeChangeStart", handleRouteChange);
    return () => router.events?.off("routeChangeStart", handleRouteChange);
  }, [router]);

  useEffect(() => {
    if (!debouncedValue || debouncedValue.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetchSearchSuggestions(debouncedValue)
      .then((data) => {
        if (!controller.signal.aborted) {
          setSuggestions(data?.suggestions || []);
          setShowDropdown(true);
          setActiveIndex(-1);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [debouncedValue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showDropdown || !suggestions.length) {
      if (e.key === "Enter") handleSearch(value);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSuggestionClick(suggestions[activeIndex]);
      } else {
        handleSearch(value);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setShowDropdown(false);
    setValue(suggestion.label);

    if (suggestion.type === "category" && city) {
      processSuggestion({
        ...suggestion,
        redirectUrl: `${suggestion.redirectUrl}/${city.toLowerCase()}`,
      });
      return;
    }
    processSuggestion(suggestion);
  };

  const handleClear = () => {
    setValue("");
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const isHeader = variant === "header";

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isHeader ? "max-w-[500px]" : "max-w-[720px]"}`}
    >
      <div
        className={`
          w-full ${isHeader ? "h-[44px]" : "h-[54px]"}
          rounded-full bg-white flex items-center
          border transition-all duration-200
          ${
            isFocused || showDropdown
              ? "border-[#FF6E04] shadow-[0_0_0_3px_rgba(255,110,4,0.12)]"
              : "border-gray-200 shadow-sm"
          }
        `}
      >
        <div
          className={`
            flex items-center border-r border-gray-200
            ${isHeader ? "min-w-[120px]" : "min-w-[150px]"}
            h-full rounded-l-full overflow-hidden
          `}
        >
          <CityDropdown isOpen={isOpen} setIsOpen={setIsOpen} data={data} />
        </div>

        <div className="flex-1 relative px-4 h-full flex items-center">
          {showTypewriter && (
            <div
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ${
                isHeader ? "text-[13px]" : "text-[14px]"
              } font-medium pointer-events-none select-none`}
            >
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
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (suggestions.length) setShowDropdown(true);
            }}
            onKeyDown={handleKeyDown}
            className={`w-full bg-transparent outline-none text-gray-800 ${
              isHeader ? "text-[13px]" : "text-[14px]"
            } font-medium placeholder-transparent`}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex items-center gap-1 pr-2">
          {value && (
            <button
              onClick={handleClear}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
            >
              <FiX size={isHeader ? 14 : 16} />
            </button>
          )}
          {isLoading && (
            <div className="w-5 h-5 border-2 border-gray-200 border-t-[#FF6E04] rounded-full animate-spin mr-1" />
          )}
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition max-md:hidden">
            <FiMic size={isHeader ? 16 : 18} />
          </button>
          <button
            onClick={() => handleSearch(value)}
            className={`
              ${isHeader ? "w-[34px] h-[34px]" : "w-[38px] h-[38px]"}
              flex items-center justify-center rounded-full bg-[#FF6E04]
              hover:bg-[#e55e00] active:scale-95 transition-all
            `}
          >
            <FiSearch className="text-white" size={isHeader ? 16 : 18} />
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[9999] overflow-hidden"
        >
          <ul className="py-2 max-h-[420px] overflow-y-auto">
            {suggestions.map((s, idx) => {
              const meta = TYPE_META[s.type] || TYPE_META.business;
              const isActive = idx === activeIndex;

              return (
                <li key={idx}>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSuggestionClick(s);
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                      ${isActive ? "bg-orange-50" : "hover:bg-gray-50"}
                    `}
                  >
                    <SuggestionIcon s={s} meta={meta} />
                    <SuggestionLabels s={s} selectedCity={city} />{" "}
                    <span
                      className="flex-shrink-0 text-[10.5px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: meta.bg, color: meta.color }}
                    >
                      {meta.hint}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">
              ↑↓ navigate · Enter to search · Esc to close
            </span>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                handleSearch(value);
              }}
              className="text-[11px] text-[#FF6E04] font-semibold hover:underline flex items-center gap-1"
            >
              Search all <FiArrowRight size={11} />
            </button>
          </div>
        </div>
      )}

      {/* No results */}
      {showDropdown &&
        !isLoading &&
        suggestions.length === 0 &&
        value.trim().length >= 2 && (
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[9999]">
            <div className="px-4 py-6 text-center">
              <p className="text-[13px] text-gray-400">
                No suggestions for{" "}
                <span className="font-semibold text-gray-600">{value}</span>
              </p>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSearch(value);
                }}
                className="mt-2 text-[12px] text-[#FF6E04] font-semibold hover:underline"
              >
                Search anyway →
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default SearchBar;
