import React, { useState, useEffect } from "react";

const MobileMarketplaceFilter = ({
  filters,
  selectedFilters,
  setSelectedFilters,
  hasActiveFilters,
  handleReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState("categories"); // default open
  const [showAllCities, setShowAllCities] = useState(false);

  // Temp state — only committed on Apply
  const [tempCategories, setTempCategories] = useState([]);
  const [tempCities, setTempCities] = useState([]);

  // Sync temp state from real filters when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTempCategories(selectedFilters?.categories || []);
      setTempCities(selectedFilters?.cities || []);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const activeCount = [
    selectedFilters?.categories?.length > 0,
    selectedFilters?.cities?.length > 0,
  ].filter(Boolean).length;

  const handleCategoryToggle = (id) => {
    setTempCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleCityToggle = (id) => {
    setTempCities((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleApply = () => {
    setSelectedFilters({
      categories: tempCategories,
      cities: tempCities,
    });
    setIsOpen(false);
  };

  const handleClearAll = () => {
    setTempCategories([]);
    setTempCities([]);
    handleReset();
    setIsOpen(false);
  };

  const citiesToShow = () => {
    if (!filters?.cities) return [];
    const sorted = [...filters.cities].sort((a, b) => {
      const aSelected = tempCities.includes(a.id);
      const bSelected = tempCities.includes(b.id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
    return showAllCities ? sorted : sorted.slice(0, 10);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 active:bg-gray-50 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 16 14" fill="none">
          <path
            d="M13.4668 12.622C13.1323 12.622 12.7979 12.6263 12.4638 12.6194C12.3516 12.6173 12.2977 12.6501 12.251 12.7584C11.8872 13.6 11.0172 14.0928 10.1035 13.9854C9.21963 13.8814 8.48292 13.1891 8.31849 12.3078C8.12471 11.2677 8.74576 10.2557 9.76989 9.94321C10.7578 9.64197 11.8367 10.1396 12.2493 11.0964C12.2989 11.2116 12.3555 11.2418 12.4737 11.2405C13.153 11.2349 13.8328 11.2345 14.5121 11.2397C14.8651 11.2423 15.1353 11.4874 15.1892 11.837C15.238 12.1525 15.0498 12.471 14.7387 12.5737C14.6338 12.6082 14.5168 12.6181 14.4055 12.6203C14.0922 12.6259 13.7793 12.622 13.4668 12.622Z"
            fill="#5B5B5B"
          />
          <path
            d="M1.70395 7.78055C1.37509 7.78055 1.04579 7.78357 0.716929 7.77969C0.301318 7.77451 -0.00553482 7.47499 7.57042e-05 7.08528C0.00525465 6.69945 0.306497 6.40813 0.714771 6.40554C1.38372 6.40166 2.05267 6.40166 2.72118 6.40684C2.839 6.4077 2.8977 6.37749 2.94776 6.26183C3.33575 5.36587 4.30465 4.86567 5.25498 5.06031C6.21309 5.25625 6.91052 6.10646 6.91527 7.08312C6.91958 8.06108 6.23985 8.90395 5.27268 9.11931C4.33399 9.32863 3.35129 8.83274 2.95596 7.93937C2.90115 7.81551 2.83943 7.77365 2.70737 7.77753C2.37333 7.78703 2.03842 7.78098 1.70395 7.78055Z"
            fill="#5B5B5B"
          />
          <path
            d="M11.0558 2.2462C11.0661 1.09518 11.9897 0.178933 13.1312 0.188428C14.2874 0.197922 15.2123 1.13229 15.1972 2.27641C15.1821 3.41837 14.2456 4.34022 13.1088 4.33159C11.9694 4.32296 11.0454 3.38427 11.0558 2.2462Z"
            fill="#5B5B5B"
          />
          <path
            d="M4.83226 2.94769C3.46286 2.94769 2.09303 2.94898 0.723626 2.94682C0.242847 2.94639 -0.0808376 2.55107 0.0205835 2.09834C0.0822993 1.8217 0.311899 1.61497 0.608826 1.57311C0.667089 1.56491 0.727079 1.56404 0.786205 1.56404C3.48746 1.56361 6.18871 1.56361 8.88997 1.56404C9.26458 1.56404 9.52482 1.72804 9.63013 2.02583C9.78938 2.47813 9.4631 2.94164 8.97369 2.94639C8.36991 2.952 7.76613 2.94812 7.16192 2.94812C6.38508 2.94769 5.60867 2.94769 4.83226 2.94769Z"
            fill="#5B5B5B"
          />
          <path
            d="M3.45544 12.622C2.55474 12.622 1.65403 12.6233 0.752894 12.6216C0.351957 12.6207 0.0740202 12.3989 0.0118728 12.0385C-0.0567483 11.641 0.238883 11.2664 0.644136 11.2401C0.724841 11.2349 0.805978 11.2379 0.886684 11.2379C2.64494 11.2379 4.40362 11.2375 6.16188 11.2384C6.53131 11.2384 6.81011 11.4421 6.8852 11.7627C6.99223 12.2189 6.66639 12.6181 6.17396 12.6211C5.44027 12.6259 4.70702 12.6224 3.97334 12.6224C3.80071 12.622 3.62807 12.622 3.45544 12.622Z"
            fill="#5B5B5B"
          />
          <path
            d="M11.7595 6.40487C12.671 6.40487 13.5825 6.40098 14.494 6.40659C14.9649 6.40961 15.2786 6.81012 15.175 7.25724C15.109 7.54122 14.8583 7.75571 14.5657 7.77686C14.5225 7.77988 14.4793 7.78074 14.4362 7.78074C12.6399 7.78074 10.8441 7.78117 9.04792 7.78074C8.64439 7.78074 8.37249 7.57488 8.30517 7.22444C8.22489 6.80839 8.52053 6.4217 8.94434 6.40918C9.34873 6.39753 9.75311 6.40487 10.1579 6.40487C10.6918 6.40444 11.2257 6.40487 11.7595 6.40487Z"
            fill="#5B5B5B"
          />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "88vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Filters</h3>
          <div className="flex items-center gap-3">
            {(tempCategories.length > 0 ||
              tempCities.length > 0 ||
              hasActiveFilters) && (
              <button
                onClick={handleClearAll}
                className="text-sm font-semibold text-orange-500"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          className="overflow-y-auto px-4 py-3 space-y-2"
          style={{ maxHeight: "calc(88vh - 140px)" }}
        >
          {/* Categories Accordion */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-white"
              onClick={() =>
                setOpenAccordion(
                  openAccordion === "categories" ? null : "categories",
                )
              }
            >
              <span className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                Categories
                {tempCategories.length > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {tempCategories.length}
                  </span>
                )}
              </span>
              <svg
                className={`transition-transform duration-200 text-gray-500 ${openAccordion === "categories" ? "rotate-180" : ""}`}
                width="11"
                height="7"
                viewBox="0 0 11 7"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.69199 6.10485C5.36025 6.46029 4.82233 6.46029 4.49059 6.10485L0.242958 1.55382C-0.0887985 1.19836 -0.0887985 0.622054 0.242958 0.266591C0.574723 -0.0888635 1.11261 -0.0888635 1.44437 0.266591L5.09129 4.17403L8.73822 0.266591C9.06996 -0.0888635 9.60788 -0.0888635 9.93962 0.266591C10.2714 0.622054 10.2714 1.19836 9.93962 1.55382L5.69199 6.10485Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            {openAccordion === "categories" && (
              <div className="bg-gray-50 border-t border-gray-100 px-4 py-3 space-y-1">
                {filters?.categories?.map((category) => {
                  const isSelected = tempCategories.includes(category.id);
                  return (
                    <label
                      key={category.id}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 bg-white"
                      }`}
                      onClick={() => handleCategoryToggle(category.id)}
                    >
                      <span
                        className={`font-semibold text-sm ${isSelected ? "text-orange-600" : "text-gray-700"}`}
                      >
                        {category.name}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          isSelected
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 12 9"
                            fill="none"
                          >
                            <path
                              d="M1 4.5L4.5 8L11 1"
                              stroke="white"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </label>
                  );
                })}
                {tempCategories.length > 0 && (
                  <button
                    onClick={() => setTempCategories([])}
                    className="text-xs text-gray-500 mt-1 hover:text-orange-500 transition-colors"
                  >
                    Clear categories
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Cities Accordion */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-white"
              onClick={() =>
                setOpenAccordion(openAccordion === "cities" ? null : "cities")
              }
            >
              <span className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                Cities
                {tempCities.length > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {tempCities.length}
                  </span>
                )}
              </span>
              <svg
                className={`transition-transform duration-200 text-gray-500 ${openAccordion === "cities" ? "rotate-180" : ""}`}
                width="11"
                height="7"
                viewBox="0 0 11 7"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.69199 6.10485C5.36025 6.46029 4.82233 6.46029 4.49059 6.10485L0.242958 1.55382C-0.0887985 1.19836 -0.0887985 0.622054 0.242958 0.266591C0.574723 -0.0888635 1.11261 -0.0888635 1.44437 0.266591L5.09129 4.17403L8.73822 0.266591C9.06996 -0.0888635 9.60788 -0.0888635 9.93962 0.266591C10.2714 0.622054 10.2714 1.19836 9.93962 1.55382L5.69199 6.10485Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            {openAccordion === "cities" && (
              <div className="bg-gray-50 border-t border-gray-100 px-4 py-3 space-y-1">
                {citiesToShow().map((city) => {
                  const isSelected = tempCities.includes(city.id);
                  return (
                    <label
                      key={city.id}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 bg-white"
                      }`}
                      onClick={() => handleCityToggle(city.id)}
                    >
                      <span
                        className={`font-semibold text-sm ${isSelected ? "text-orange-600" : "text-gray-700"}`}
                      >
                        {city.city}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          isSelected
                            ? "border-orange-500 bg-orange-500"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 12 9"
                            fill="none"
                          >
                            <path
                              d="M1 4.5L4.5 8L11 1"
                              stroke="white"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </label>
                  );
                })}

                {filters?.cities?.length > 10 && (
                  <button
                    onClick={() => setShowAllCities(!showAllCities)}
                    className="text-xs text-orange-500 font-medium mt-1 hover:text-orange-600 transition"
                  >
                    {showAllCities
                      ? "See Less"
                      : `See More (${filters.cities.length - 10} more)`}
                  </button>
                )}

                {tempCities.length > 0 && (
                  <button
                    onClick={() => setTempCities([])}
                    className="block text-xs text-gray-500 mt-1 hover:text-orange-500 transition-colors"
                  >
                    Clear cities
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Apply Button */}
        <div className="px-4 py-4 border-t border-gray-100 bg-white">
          <button
            onClick={handleApply}
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors text-sm"
          >
            Apply Filters
            {(tempCategories.length > 0 || tempCities.length > 0) && (
              <span className="ml-1 opacity-80">
                ({tempCategories.length + tempCities.length} selected)
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileMarketplaceFilter;
