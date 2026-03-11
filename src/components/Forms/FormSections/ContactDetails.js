import React, { useEffect, useRef, useState } from "react";
import InputWithTitle from "../InputWithTitle";
import axios from "axios";
import { API_URL } from "@/services/constants";
import { COUNTRY_CODES } from "@/services/constants";

const ContactDetails = ({ contact, setContact, error, clearError, refs }) => {
  const [cities, setCities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCountryCodeOpen, setIsCountryCodeOpen] = useState(false);
  const [isAltCountryCodeOpen, setIsAltCountryCodeOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [altCountrySearchTerm, setAltCountrySearchTerm] = useState("");

  const [rawNumber, setRawNumber] = useState(() => {
    if (contact?.number) {
      return contact?.number?.toString()?.replace(/^\+\d+\s*/, "");
    }
    return "";
  });
  const [rawAltNumber, setRawAltNumber] = useState(() => {
    if (contact?.altNumber) {
      return contact?.altNumber?.toString()?.replace(/^\+\d+\s*/, "");
    }
    return "";
  });

  // ── Sync rawNumber / rawAltNumber when contact prop is updated externally
  // (e.g. edit mode prefill runs after component already mounted)
  useEffect(() => {
    if (contact?.number !== undefined) {
      const digits = contact.number?.toString()?.replace(/^\+\d+\s*/, "") || "";
      setRawNumber(digits);
    }
  }, [contact?.number]);

  useEffect(() => {
    if (contact?.altNumber !== undefined) {
      const digits =
        contact.altNumber?.toString()?.replace(/^\+\d+\s*/, "") || "";
      setRawAltNumber(digits);
    }
  }, [contact?.altNumber]);

  const dropdownRef = useRef();
  const countryCodeRef = useRef();
  const altCountryCodeRef = useRef();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(`${API_URL}/cities`);
        setCities(res?.data || []);
      } catch (err) {
        console.error("Client-side error:", err);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
      if (
        countryCodeRef.current &&
        !countryCodeRef.current.contains(e.target)
      ) {
        setIsCountryCodeOpen(false);
        setCountrySearchTerm("");
      }
      if (
        altCountryCodeRef.current &&
        !altCountryCodeRef.current.contains(e.target)
      ) {
        setIsAltCountryCodeOpen(false);
        setAltCountrySearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (field, value, errorKey) => {
    setContact((prev) => ({ ...prev, [field]: value }));
    if (clearError && errorKey) clearError(errorKey);
  };

  const handleCitySelect = (cityName) => {
    handleChange("city", cityName, "contactCity");
    setIsOpen(false);
  };

  const handleNumberChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setRawNumber(digits);
    handleChange("number", digits, "contactNumber");
  };

  const handleAltNumberChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setRawAltNumber(digits);
    handleChange("altNumber", digits, "contactAltNumber");
  };

  const handleCountryCodeSelect = (code, field) => {
    console.log(code, field);
    handleChange(field, code);
    if (field === "countryCode") {
      setIsCountryCodeOpen(false);
      setCountrySearchTerm("");
    } else {
      setIsAltCountryCodeOpen(false);
      setAltCountrySearchTerm("");
    }
  };

  const getFilteredCountryCodes = (searchTerm) => {
    if (!searchTerm) return COUNTRY_CODES;
    const term = searchTerm.toLowerCase();
    return COUNTRY_CODES.filter(
      (item) =>
        item.country.toLowerCase().includes(term) || item.code.includes(term),
    );
  };

  return (
    <div className="pb-4 rounded-lg">
      <h1 className="text-md font-semibold text-2xl text-gray-700 mb-8">
        Business Contact Details
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Row 1: Full Name & Email */}
        <InputWithTitle
          title="Full Name"
          type="text"
          placeholder="Enter full name"
          value={contact?.name || ""}
          error={error?.contactName}
          onChange={(e) => handleChange("name", e.target.value, "contactName")}
        />
        <InputWithTitle
          title="Email"
          type="email"
          placeholder="Enter email"
          value={contact?.email || ""}
          error={error?.contactEmail}
          onChange={(e) =>
            handleChange("email", e.target.value, "contactEmail")
          }
        />

        {/* Row 2: Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number *
          </label>
          <div className="flex gap-2">
            <div className="relative w-17" ref={countryCodeRef}>
              <button
                type="button"
                onClick={() => setIsCountryCodeOpen(!isCountryCodeOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center justify-between"
              >
                <span>{contact?.countryCode || "+65"}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isCountryCodeOpen && (
                <div className="absolute z-50 mt-1 w-72 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                  <div className="p-2 border-b">
                    <input
                      type="text"
                      placeholder="Search country..."
                      value={countrySearchTerm}
                      onChange={(e) => setCountrySearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {getFilteredCountryCodes(countrySearchTerm).map(
                      (item, index) => (
                        <div
                          key={index}
                          onClick={() =>
                            handleCountryCodeSelect(item.code, "countryCode")
                          }
                          className={`px-4 py-2 cursor-pointer hover:bg-orange-100 transition-colors flex items-center gap-2 ${
                            contact?.countryCode === item.code
                              ? "bg-orange-50 text-orange-600 font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          <span className="text-xl">{item.flag}</span>
                          <span className="flex-1">{item.country}</span>
                          <span className="text-sm font-medium">
                            {item.code}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1">
              <input
                ref={refs?.number}
                type="tel"
                placeholder="Enter mobile number"
                value={rawNumber}
                onChange={handleNumberChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  error?.contactNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
          </div>
          {error?.contactNumber && (
            <p className="text-red-500 text-xs mt-1">{error.contactNumber}</p>
          )}
        </div>

        {/* Row 2: Alternate Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alternate Number
          </label>
          <div className="flex gap-2">
            <div className="relative w-17" ref={altCountryCodeRef}>
              <button
                type="button"
                onClick={() => setIsAltCountryCodeOpen(!isAltCountryCodeOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center justify-between"
              >
                <span>{contact?.altCountryCode || "+65"}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isAltCountryCodeOpen && (
                <div className="absolute z-50 mt-1 w-72 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                  <div className="p-2 border-b">
                    <input
                      type="text"
                      placeholder="Search country..."
                      value={altCountrySearchTerm}
                      onChange={(e) => setAltCountrySearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {getFilteredCountryCodes(altCountrySearchTerm).map(
                      (item, index) => (
                        <div
                          key={index}
                          onClick={() =>
                            handleCountryCodeSelect(item.code, "altCountryCode")
                          }
                          className={`px-4 py-2 cursor-pointer hover:bg-orange-100 transition-colors flex items-center gap-2 ${
                            contact?.altCountryCode === item.code
                              ? "bg-orange-50 text-orange-600 font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          <span className="text-xl">{item.flag}</span>
                          <span className="flex-1">{item.country}</span>
                          <span className="text-sm font-medium">
                            {item.code}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1">
              <input
                ref={refs?.altNumber}
                type="tel"
                placeholder="Enter alternate number"
                value={rawAltNumber}
                onChange={handleAltNumberChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  error?.contactAltNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
          </div>
          {error?.contactAltNumber && (
            <p className="text-red-500 text-xs mt-1">
              {error.contactAltNumber}
            </p>
          )}
        </div>

        {/* Row 3: Locality/Landmark & City */}
        <InputWithTitle
          title="Locality / Landmark"
          type="text"
          placeholder="Enter locality or landmark"
          value={contact?.landmark || ""}
          error={error?.contactLandmark}
          onChange={(e) =>
            handleChange("landmark", e.target.value, "contactLandmark")
          }
        />

        {/* City Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City / Region *
          </label>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full px-4 py-2 text-left border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              error?.contactCity ? "border-red-500" : "border-gray-300"
            } ${contact?.city ? "text-gray-900" : "text-gray-400"}`}
          >
            {contact?.city || "Select City"}
          </button>
          {error?.contactCity && (
            <p className="text-red-500 text-xs mt-1">{error.contactCity}</p>
          )}
          {isOpen && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {cities && cities.length > 0 ? (
                cities.map((cityName, index) => (
                  <div
                    key={index}
                    onClick={() => handleCitySelect(cityName)}
                    className={`px-4 py-2 cursor-pointer font-medium hover:bg-orange-100 transition-colors ${
                      contact?.city === cityName
                        ? "bg-orange-50 text-orange-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {cityName}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  No cities available
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
