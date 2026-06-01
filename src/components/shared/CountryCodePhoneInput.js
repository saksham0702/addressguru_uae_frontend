import React, { useState, useEffect, useRef } from "react";
import { Phone } from "lucide-react";
import { COUNTRY_CODES } from "@/services/constants";

/**
 * Reusable country code phone input with searchable dropdown.
 *
 * Props:
 *   value        – phone number (digits only)
 *   onChange      – (e) => void
 *   countryCode   – e.g. "+971"
 *   setCountryCode – (code) => void
 *   error         – error message string (optional)
 *   placeholder   – input placeholder (default "Phone number")
 *   variant       – "bordered" | "admin" (default "bordered")
 */
const CountryCodePhoneInput = ({
  value,
  onChange,
  countryCode,
  setCountryCode,
  error,
  placeholder = "Phone number",
  variant = "bordered",
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const triggerRef = useRef(null);
  const [dropUp, setDropUp] = useState(false);

  const selected =
    COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  const filtered = COUNTRY_CODES.filter(
    (c) =>
      c.code.includes(searchQuery) ||
      (c.country || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Detect if dropdown should open upward
  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropUp(spaceBelow < 260);
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-focus search
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  // ── Admin variant ──
  if (variant === "admin") {
    return (
      <div className="w-full">
        <div
          className={`mt-1 flex items-center border rounded-lg h-11 focus-within:ring-2 focus-within:ring-[#FF6E04] ${
            error ? "border-red-400" : "border-gray-300"
          }`}
        >
          <Phone size={18} className="text-gray-400 ml-3 mr-2 flex-shrink-0" />

          {/* Country selector */}
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1 border-x border-gray-200 bg-gray-50 px-2 h-11 hover:bg-gray-100 transition-colors duration-150"
            >
              <span className="text-sm leading-none">{selected?.flag}</span>
              <span className="text-xs font-bold text-gray-700 tracking-tight">
                {countryCode}
              </span>
              <svg
                className={`w-2.5 h-2.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 10 6"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M1 1l4 4 4-4"
                />
              </svg>
            </button>

            {open && (
              <div
                className={`absolute left-0 z-[9999] w-60 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden
                  ${dropUp ? "bottom-full mb-1" : "top-full mt-1"}`}
              >
                <div className="p-2 border-b border-gray-100">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search country or code..."
                    className="w-full text-xs px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-orange-400 placeholder:text-gray-400 bg-gray-50"
                  />
                </div>
                <ul className="max-h-44 overflow-y-auto divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <li className="px-4 py-3 text-xs text-gray-400 text-center">
                      No results found
                    </li>
                  ) : (
                    filtered.map((c) => (
                      <li
                        key={c.code + (c.country || "")}
                        onClick={() => {
                          setCountryCode(c.code);
                          setOpen(false);
                          setSearchQuery("");
                        }}
                        className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-orange-50 transition-colors duration-100
                          ${c.code === countryCode ? "bg-orange-50" : ""}`}
                      >
                        <span className="text-base leading-none flex-shrink-0">
                          {c.flag}
                        </span>
                        <span
                          className={`flex-1 truncate text-xs ${c.code === countryCode ? "text-orange-600 font-semibold" : "text-gray-700"}`}
                        >
                          {c.country || c.code}
                        </span>
                        <span className="text-xs font-bold text-gray-400 flex-shrink-0">
                          {c.code}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>

          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full outline-none text-sm px-2"
          />
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  // ── Bordered variant (default) ──
  return (
    <div className="w-full">
      <div
        className={`flex items-center border rounded-lg bg-white text-sm transition-all duration-200 ${
          error
            ? "border-red-500"
            : "border-gray-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100"
        }`}
      >
        {/* Phone icon */}
        <span
          className={`pl-3 pr-2 flex-shrink-0 ${error ? "text-red-400" : "text-gray-400"}`}
        >
          <Phone size={16} />
        </span>

        {/* Country selector */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 border-x border-gray-200 bg-gray-50 px-2 py-2 hover:bg-gray-100 transition-colors duration-150"
          >
            <span className="text-sm leading-none">{selected?.flag}</span>
            <span className="text-xs font-bold text-gray-700 tracking-tight">
              {countryCode}
            </span>
            <svg
              className={`w-2.5 h-2.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 10 6"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M1 1l4 4 4-4"
              />
            </svg>
          </button>

          {open && (
            <div
              className={`absolute left-0 z-[9999] w-60 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden
                ${dropUp ? "bottom-full mb-1" : "top-full mt-1"}`}
            >
              <div className="p-2 border-b border-gray-100">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search country or code..."
                  className="w-full text-xs px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-orange-400 placeholder:text-gray-400 bg-gray-50"
                />
              </div>
              <ul className="max-h-44 overflow-y-auto divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <li className="px-4 py-3 text-xs text-gray-400 text-center">
                    No results found
                  </li>
                ) : (
                  filtered.map((c) => (
                    <li
                      key={c.code + (c.country || "")}
                      onClick={() => {
                        setCountryCode(c.code);
                        setOpen(false);
                        setSearchQuery("");
                      }}
                      className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-orange-50 transition-colors duration-100
                        ${c.code === countryCode ? "bg-orange-50" : ""}`}
                    >
                      <span className="text-base leading-none flex-shrink-0">
                        {c.flag}
                      </span>
                      <span
                        className={`flex-1 truncate text-xs ${c.code === countryCode ? "text-orange-600 font-semibold" : "text-gray-700"}`}
                      >
                        {c.country || c.code}
                      </span>
                      <span className="text-xs font-bold text-gray-400 flex-shrink-0">
                        {c.code}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Number input */}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 px-2 py-2 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default CountryCodePhoneInput;
