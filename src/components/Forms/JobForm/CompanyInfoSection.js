import React, { useEffect, useState, useRef } from "react";
import InputWithTitle from "@/components/Forms/InputWithTitle";
import DropDown from "@/components/Forms/DropDown";
import { getCityLocalities } from "@/api/uaeadminCities";
import { COUNTRY_CODES } from "@/services/constants";
import Image from "next/image";

const CompanyInfoSection = ({
  postJobData,
  setPostJobData,
  errors,
  clearError,
  refs,
  options,
  logoPreview,
  setLogoPreview,
  API_URL,
  getSelectedOption,
}) => {
  const { cityOptions } = options;
  const [localities, setLocalities] = useState([]);
  const [localityLoading, setLocalityLoading] = useState(false);
  const [localityOpen, setLocalityOpen] = useState(false);
  const [localitySearch, setLocalitySearch] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const localityRef = useRef(null);
  const countryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (localityRef.current && !localityRef.current.contains(e.target))
        setLocalityOpen(false);
      if (countryRef.current && !countryRef.current.contains(e.target))
        setCountryOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchLocalities = async () => {
      if (!postJobData.city) {
        setLocalities([]);
        return;
      }
      setLocalityLoading(true);
      try {
        const data = await getCityLocalities(postJobData.city);
        setLocalities(data || []);
      } catch (err) {
        console.error("Locality fetch error:", err);
      } finally {
        setLocalityLoading(false);
      }
    };
    fetchLocalities();
  }, [postJobData.city]);

  const handleInputChange = (key, value) => {
    setPostJobData((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (clearError) clearError(key);
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 12);
    handleInputChange("phone", digits);
  };

  const filteredCountries = COUNTRY_CODES.filter((item) =>
    `${item.country} ${item.code}`
      .toLowerCase()
      .includes(countrySearch.toLowerCase()),
  );

  const filteredLocalities = (localities || []).filter((loc) =>
    loc.name.toLowerCase().includes(localitySearch.toLowerCase()),
  );

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Company Logo */}
      <div className="col-span-2" ref={refs.companyLogoRef}>
        <label className="text-black font-medium">Company Logo</label>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                setPostJobData((prev) => ({ ...prev, companyLogo: file }));
                setLogoPreview(URL.createObjectURL(file));
                if (clearError) clearError("companyLogo");
              }}
              className="block w-full px-4 py-3 text-sm border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6E04]"
            />
          </div>
          <div className="relative w-50 h-30 rounded-xl border border-gray-200 bg-white shadow-md flex items-center justify-center overflow-hidden group">
            {logoPreview || postJobData.companyLogo ? (
              <>
                <Image
                  width={500}
                  height={500}
                  src={
                    logoPreview ||
                    (typeof postJobData.companyLogo === "string"
                      ? `${API_URL}/${postJobData.companyLogo}`
                      : "/placeholder.png")
                  }
                  alt="Company Logo"
                  className="w-full h-full object-cover p-3"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <span className="text-sm text-white font-medium">
                    Change Logo
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <span className="text-3xl">🏢</span>
                <span className="text-sm mt-2">Upload Logo</span>
              </div>
            )}
          </div>
        </div>
        {errors.companyLogo && (
          <p className="text-red-500 text-sm mt-1">{errors.companyLogo}</p>
        )}
      </div>

      {/* Company Name */}
      <div className="col-span-2" ref={refs.companyNameRef}>
        <InputWithTitle
          title="Company Name"
          placeholder="Enter company name"
          required
          value={postJobData.companyName || ""}
          onChange={(e) => handleInputChange("companyName", e.target.value)}
          error={errors.companyName}
        />
      </div>

      {/* Company Description */}
      <div className="col-span-2" ref={refs.companyDescriptionRef}>
        <InputWithTitle
          isTextarea
          title="Company Description"
          placeholder="Enter company description"
          value={postJobData.companyDescription || ""}
          onChange={(e) =>
            handleInputChange("companyDescription", e.target.value)
          }
          rows={3}
          minLength={200}
          maxLength={500}
          error={errors.companyDescription}
        />
      </div>

      {/* Company Website */}
      <div className="col-span-2" ref={refs.companyWebsiteRef}>
        <InputWithTitle
          title="Company Website"
          placeholder="Enter website"
          value={postJobData.companyWebsite || ""}
          onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
          error={errors.companyWebsite}
        />
      </div>

      {/* Contact Name */}
      <div className="col-span-1" ref={refs.nameRef}>
        <InputWithTitle
          title="Contact Name"
          placeholder="Enter contact person name"
          value={postJobData.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          error={errors.name}
        />
      </div>

      {/* Email */}
      <div className="col-span-1" ref={refs.emailRef}>
        <InputWithTitle
          title="Email"
          placeholder="Enter email"
          required
          value={postJobData.email || ""}
          onChange={(e) => handleInputChange("email", e.target.value)}
          error={errors.email}
        />
      </div>

      {/* Phone with Country Code */}
      <div className="col-span-1" ref={refs.phoneRef}>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Phone *
        </label>
        <div className="flex">
          <div
            ref={countryRef}
            className="relative w-20 border border-gray-300 rounded-l-lg bg-gray-50 flex items-center justify-center"
          >
            <button
              type="button"
              onClick={() => setCountryOpen(!countryOpen)}
              className="w-full py-2 text-sm font-medium text-gray-700 flex items-center justify-center gap-1"
            >
              {postJobData.countryCode || "+971"}
              <svg
                className="w-3 h-3"
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

            {countryOpen && (
              <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-md w-64 mt-1">
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {filteredCountries.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        handleInputChange("countryCode", item.code);
                        setCountryOpen(false);
                        setCountrySearch("");
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-orange-50 flex gap-2 text-sm"
                    >
                      <span className="w-6 text-center">{item.flag}</span>
                      <span className="truncate">{item.country}</span>
                      <span className="ml-auto text-gray-400">{item.code}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <input
            type="tel"
            placeholder="Enter phone number"
            value={postJobData.phone || ""}
            onChange={handlePhoneChange}
            className={`flex-1 border border-l-0 border-gray-300 rounded-r-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none text-sm ${
              errors.phone ? "border-red-500" : ""
            }`}
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      {/* City */}
      <div className="col-span-1" ref={refs.cityRef}>
        <label className="text-black font-medium block mb-1">City</label>
        <DropDown
          options={cityOptions || []}
          placeholder="Select city"
          value={getSelectedOption(cityOptions || [], postJobData.city)}
          onChange={(option) => {
            if (!option) return;
            handleInputChange("city", option.value);
            handleInputChange("locality", ""); // Reset locality when city changes
          }}
        />
        {errors.city && (
          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
        )}
      </div>

      {/* Locality */}
      <div className="col-span-1" ref={localityRef}>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Locality
        </label>
        <button
          type="button"
          disabled={!postJobData.city || localityLoading}
          onClick={() => setLocalityOpen(!localityOpen)}
          className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-left text-gray-700 text-sm hover:border-orange-400 focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
            errors.locality ? "border-red-500" : ""
          }`}
        >
          {localityLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              Loading...
            </span>
          ) : (
            postJobData.locality || "Select Locality"
          )}
        </button>
        {localityOpen && (
          <div className="absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-md flex flex-col">
            <div className="p-2 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search..."
                value={localitySearch}
                onChange={(e) => setLocalitySearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="overflow-y-auto max-h-48">
              {filteredLocalities.length > 0 ? (
                filteredLocalities.map((loc) => (
                  <div
                    key={loc._id}
                    onClick={() => {
                      handleInputChange("locality", loc.name);
                      setLocalityOpen(false);
                      setLocalitySearch("");
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-orange-50 text-sm ${
                      postJobData.locality === loc.name
                        ? "bg-orange-50 text-orange-600 font-medium"
                        : ""
                    }`}
                  >
                    {loc.name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-xs text-gray-500 text-center">
                  No results found
                </div>
              )}
            </div>
          </div>
        )}
        {errors.locality && (
          <p className="text-red-500 text-sm mt-1">{errors.locality}</p>
        )}
      </div>

      {/* Address */}
      <div className="col-span-2" ref={refs.addressRef}>
        <InputWithTitle
          isTextarea
          title="Address"
          placeholder="Enter address"
          value={postJobData.address || ""}
          onChange={(e) => handleInputChange("address", e.target.value)}
          error={errors.address}
        />
      </div>
    </div>
  );
};

export default CompanyInfoSection;
