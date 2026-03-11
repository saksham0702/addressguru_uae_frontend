import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const MobileCities = ({ cities = [], showCities, setShowCities }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const { setCity } = useAuth();

  const handleCitySelect = (city) => {
    setCity(city); // ✅ Update globally
    setShowCities(false);
  };

  // Filter cities
  useEffect(() => {
    if (!cities?.length) return;
    const filtered = cities.filter((city) =>
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [cities, searchTerm]);

  // Escape key + scroll lock
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowCities(false);
      }
    };

    if (showCities) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showCities, setShowCities]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowCities(false);
    }
  };

  if (!showCities) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-xs z-50 h-screen flex justify-start"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white h-full max-md:w-full md:w-[85%] transform transition-transform duration-300 ease-in-out ${
          showCities ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b md:px-10 border-gray-100 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            {/* <h2 className="md:text-xl max-md:text-sm font-bold text-gray-800">
              Select City
            </h2> */}

            {/* Search */}
            <form className="relative flex-1 max-w-sm">
              <input
                placeholder="Search cities..."
                className="rounded-full w-full md:h-10 max-md:h-9 bg-transparent py-2 pl-4 pr-12 outline-none border-2 border-gray-200 text-sm hover:border-gray-300 focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-colors"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </form>

            {/* Close */}
            <button
              onClick={() => setShowCities(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cities */}
        <div className="p-4 md:p-6">
          {searchTerm && (
            <p className="text-gray-600 mb-4 text-sm">
              {filteredCities.length} cities found for `{searchTerm}`
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
            {filteredCities.map((city, index) => (
              <div
                key={index}
                onClick={() => handleCitySelect(city)}
                className="cursor-pointer max-w-60 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
              >
                <span className="text-gray-800 font-medium text-sm md:text-base">
                  {city}
                </span>
              </div>
            ))}
          </div>

          {/* No Results */}
          {searchTerm && filteredCities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No cities found</p>
              <p className="text-gray-400 text-sm">
                Try searching with another name
              </p>
            </div>
          )}

          {/* Empty State */}
          {!cities?.length && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No cities available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileCities;
