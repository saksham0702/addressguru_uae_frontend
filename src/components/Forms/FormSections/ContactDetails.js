import React, { useEffect, useRef, useState } from "react";
import InputWithTitle from "../InputWithTitle";
import axios from "axios";
import { API_URL, COUNTRY_CODES } from "@/services/constants";
import { getCities } from "@/api/uaeadminCities";

const ContactDetails = ({
  contact,
  setContact,
  error,
  clearError,
  refs,
  business,
  setBusiness,
  islistingForm,
}) => {
  const [cities, setCities] = useState([]);
  const [cityOpen, setCityOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [altCountryOpen, setAltCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const filteredCountries = COUNTRY_CODES.filter((item) =>
    `${item.country} ${item.code}`
      .toLowerCase()
      .includes(countrySearch.toLowerCase()),
  );
  const cityRef = useRef(null);
  const countryRef = useRef(null);
  const altCountryRef = useRef(null);

  const [rawNumber, setRawNumber] = useState("");
  const [rawAltNumber, setRawAltNumber] = useState("");

  useEffect(() => {
    if (contact?.number) {
      setRawNumber(contact.number);
    }
    if (contact?.altNumber) {
      setRawAltNumber(contact.altNumber);
    }
  }, [contact]);

  /* ---------------- FETCH CITIES ---------------- */

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getCities();
        setCities(res?.data || []);
      } catch (err) {
        console.error("City fetch error:", err);
      }
    };
    fetchCities();
  }, []);

  /* ---------------- CLOSE DROPDOWNS ---------------- */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target))
        setCityOpen(false);

      if (countryRef.current && !countryRef.current.contains(e.target))
        setCountryOpen(false);

      if (altCountryRef.current && !altCountryRef.current.contains(e.target))
        setAltCountryOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- HANDLE CHANGE ---------------- */

  const handleChange = (field, value, errorKey) => {
    setContact((prev) => ({ ...prev, [field]: value }));
    if (clearError && errorKey) clearError(errorKey);
  };

  /* ---------------- CITY SELECT ---------------- */

  const handleCitySelect = (city) => {
    handleChange("cityId", city._id, "contactCity");
    setCityOpen(false);
  };

  /* ---------------- PHONE HANDLING ---------------- */

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

  /* ---------------- UI ---------------- */

  const selectedCity = cities.find((c) => c._id === contact?.cityId);

  return (
    <div className="bg-white  rounded-xl p-8 ">
      <h2 className="text-xl font-semibold text-gray-800 mb-8">
        Business Contact Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NAME */}
        <InputWithTitle
          title="Full Name"
          placeholder="Enter full name"
          value={contact?.name || ""}
          error={error?.contactName}
          onChange={(e) => handleChange("name", e.target.value, "contactName")}
        />

        {/* EMAIL */}

        <InputWithTitle
          title="Email Address"
          placeholder="Enter email address"
          value={contact?.email || ""}
          error={error?.contactEmail}
          onChange={(e) =>
            handleChange("email", e.target.value, "contactEmail")
          }
        />

        {/* MOBILE NUMBER */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Mobile Number *
          </label>

          <div className="flex">
            <div
              ref={countryRef}
              className="relative w-16 border border-gray-300 rounded-l-lg bg-gray-50"
            >
              <button
                onClick={() => setCountryOpen(!countryOpen)}
                className="w-full py-2 text-sm font-medium text-gray-700"
              >
                {contact?.countryCode || "+971"}
              </button>

              {countryOpen && (
                <div className="absolute z-50 bg-white border outline-none  border-gray-200 rounded-lg shadow-md w-64">
                  {/* 🔍 Search Input */}
                  <div className="p-2 border-b outline-none border-gray-200">
                    <input
                      type="text"
                      placeholder="Search country..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* 🌍 Country List */}
                  <div className="max-h-52 overflow-y-auto">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            handleChange("countryCode", item.code);
                            setCountryOpen(false);
                            setCountrySearch(""); // reset search
                          }}
                          className="px-4 py-2 cursor-pointer hover:bg-orange-50 flex gap-2"
                        >
                          <span>{item.flag}</span>
                          <span>{item.country}</span>
                          <span className="ml-auto">{item.code}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No country found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <input
              ref={refs?.number}
              type="tel"
              placeholder="Enter mobile number"
              value={rawNumber}
              onChange={handleNumberChange}
              className={`flex-1 border border-l-0 border-gray-300 rounded-r-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none ${
                error?.contactNumber ? "border-red-500" : ""
              }`}
            />
          </div>

          {error?.contactNumber && (
            <p className="text-xs text-red-500 mt-1">{error.contactNumber}</p>
          )}
        </div>

        {/* ALT NUMBER */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Alternate Number
          </label>

          <div className="flex">
            <div
              ref={altCountryRef}
              className="relative w-16 border border-gray-300 rounded-l-lg bg-gray-50"
            >
              <button
                onClick={() => setAltCountryOpen(!altCountryOpen)}
                className="w-full py-2 text-sm font-medium text-gray-700"
              >
                {contact?.altCountryCode || "+971"}
              </button>

              {altCountryOpen && (
                <div className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-md w-64 max-h-60 overflow-y-auto">
                  {COUNTRY_CODES.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        handleChange("altCountryCode", item.code);
                        setAltCountryOpen(false);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-orange-50 flex gap-2"
                    >
                      <span>{item.flag}</span>
                      <span>{item.country}</span>
                      <span className="ml-auto">{item.code}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              ref={refs?.altNumber}
              type="tel"
              placeholder="Enter alternate number"
              value={rawAltNumber}
              onChange={handleAltNumberChange}
              className="flex-1 border border-l-0 border-gray-300 rounded-r-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
        </div>

        {/* LOCALITY */}
        <InputWithTitle
          title="Locality / Landmark"
          placeholder="Enter locality"
          value={contact?.locality || ""}
          error={error?.contactLandmark}
          onChange={(e) =>
            handleChange("locality", e.target.value, "contactLandmark")
          }
        />

        {/* ADDRESS */}
        {!islistingForm && (
          <InputWithTitle
            title="Address"
            placeholder="Enter full address"
            value={contact?.address || ""}
            error={error?.contactAddress}
            onChange={(e) =>
              handleChange("address", e.target.value, "contactAddress")
            }
          />
        )}

        {/* CITY */}
        <div className="relative md:col-span-2" ref={cityRef}>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            City / Region *
          </label>

          <button
            onClick={() => setCityOpen(!cityOpen)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-left text-gray-700 hover:border-orange-400 focus:ring-2 focus:ring-orange-500"
          >
            {selectedCity?.name || "Select City"}
          </button>

          {error?.contactCity && (
            <p className="text-xs text-red-500 mt-1">{error.contactCity}</p>
          )}

          {cityOpen && (
            <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto">
              {cities.map((city) => (
                <div
                  key={city._id}
                  onClick={() => handleCitySelect(city)}
                  className={`px-4 py-2 cursor-pointer hover:bg-orange-50 ${
                    contact?.cityId === city._id
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : ""
                  }`}
                >
                  {city.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
