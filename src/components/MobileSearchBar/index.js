"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { fetchSearchSuggestions } from "@/api/search";

const MobileSearchBar = () => {
  const [slug, setSlug] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { city } = useAuth();
  const router = useRouter();
  const containerRef = useRef(null);

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

  const handleSearch = (query) => {
    if (!query?.trim()) return;
    setShowDropdown(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setShowDropdown(false);
    setSlug(suggestion.label);
    router.push(suggestion.redirectUrl);
  };

  return (
    <div
      ref={containerRef}
      className="bg-white md:hidden fixed z-30 w-full px-3 pb-1.5"
    >
      <div className="border border-gray-300 shadow-sm rounded-md h-10 w-full flex items-center justify-between px-1.5">
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch(slug);
          }}
          placeholder="What are you looking for?"
          className="text-xs font-semibold text-gray-600 w-full outline-none px-2"
        />
        <button onClick={() => handleSearch(slug)} className="ml-2">
          <svg
            width="29"
            height="29"
            viewBox="0 0 29 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="29" height="29" rx="4" fill="#FF6E04" />
            <path
              d="M21.8424 21.8424L18.3754 18.3692M20.2967 13.7275C20.2967 15.4697 19.6046 17.1406 18.3726 18.3726C17.1406 19.6046 15.4697 20.2967 13.7275 20.2967C11.9852 20.2967 10.3143 19.6046 9.08229 18.3726C7.85032 17.1406 7.1582 15.4697 7.1582 13.7275C7.1582 11.9852 7.85032 10.3143 9.08229 9.08229C10.3143 7.85032 11.9852 7.1582 13.7275 7.1582C15.4697 7.1582 17.1406 7.85032 18.3726 9.08229C19.6046 10.3143 20.2967 11.9852 20.2967 13.7275Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-3 right-3 top-[calc(100%+4px)] bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[300px] overflow-y-auto">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(s)}
              className="w-full px-3 py-2.5 text-left border-b border-gray-100 last:border-0 hover:bg-orange-50 transition-colors"
            >
              <p className="text-sm font-semibold text-gray-800 truncate">
                {s.label}
              </p>
              {s.sublabel && (
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {s.sublabel}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileSearchBar;
