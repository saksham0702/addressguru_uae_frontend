"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { fetchSearchSuggestions } from "@/api/search";
import { useSearchHandler } from "@/hooks/useSearchHandler";
import { FiSearch, FiX } from "react-icons/fi";

const MobileSearchBar = () => {
  const [slug, setSlug] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();
  const { handleSearch, handleSuggestionClick: processSuggestion } = useSearchHandler();

  // Debounced fetch
  useEffect(() => {
    if (!slug || slug.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchSearchSuggestions(slug)
        .then((data) => {
          setSuggestions(data?.suggestions || []);
          setShowDropdown(true);
        })
        .catch(() => {});
    }, 300);

    return () => clearTimeout(timer);
  }, [slug]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on route change
  useEffect(() => {
    const handleRouteChange = () => setShowDropdown(false);
    router.events?.on("routeChangeStart", handleRouteChange);
    return () => router.events?.off("routeChangeStart", handleRouteChange);
  }, [router]);

  const onSearch = (query) => {
    setShowDropdown(false);
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion) => {
    setShowDropdown(false);
    setSlug(suggestion.label);
    processSuggestion(suggestion);
  };

  return (
    <div
      ref={containerRef}
      className="bg-white md:hidden fixed z-30 w-full px-3 pb-2 pt-1 shadow-sm"
    >
      <div className="border border-gray-200 shadow-sm rounded-lg h-11 w-full flex items-center bg-gray-50 px-3 transition-all focus-within:border-orange-400 focus-within:bg-white">
        <FiSearch className="text-gray-400 mr-2" size={16} />
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch(slug);
          }}
          placeholder="What are you looking for?"
          className="text-[13px] font-medium text-gray-700 w-full outline-none bg-transparent"
        />
        {slug && (
          <button 
            onClick={() => setSlug("")}
            className="p-1.5 ml-1 text-gray-400 hover:text-gray-600"
          >
            <FiX size={14} />
          </button>
        )}
        <button 
          onClick={() => onSearch(slug)} 
          className="ml-2 bg-orange-500 text-white p-2 rounded-md active:scale-95 transition-all"
        >
          <FiSearch size={14} />
        </button>
      </div>

      {/* Mobile Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-3 right-3 top-[calc(100%+4px)] bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-[350px] overflow-y-auto">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(s)}
              className="w-full px-4 py-3 text-left border-b border-gray-50 last:border-0 hover:bg-orange-50 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-[13.5px] font-semibold text-gray-800 truncate">
                  {s.label}
                </span>
                {s.sublabel && (
                  <span className="text-[11px] text-gray-400 truncate mt-0.5">
                    {s.sublabel}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileSearchBar;
