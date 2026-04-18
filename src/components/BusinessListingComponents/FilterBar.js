import React, { useEffect, useRef, useState } from "react";
import FilterItem from "./FilterItem";
import MobileFilterDrawer from "./MobileFilterDrawer";

const FilterBar = ({
  filters,
  hasActiveFilters,
  onFilterChange,
  onFilterRemove, // NEW: called for removals — local filter only, no API
  onSearchChange,
  searchInput,
  dynamicFilters,
  handleReset,
}) => {
  // Sorts any array of { id, name } objects alphabetically by name
  const sortByName = (arr) =>
    [...arr].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    );

  const filterItems = [
    {
      label: "Sort by",
      hasDropdown: true,
      dropdownOptions: ["Newest", "Oldest"],
    },
    ...(dynamicFilters?.facilities?.length > 0
      ? [
          {
            label: "Facilities",
            isMultiple: true,
            multiOptions: sortByName(dynamicFilters.facilities).map((f) => ({
              id: f.id,
              label: f.name,
              value: f.id,
            })),
          },
        ]
      : []),
    ...(dynamicFilters?.services?.length > 0
      ? [
          {
            label: "Services",
            isMultiple: true,
            multiOptions: sortByName(dynamicFilters.services).map((s) => ({
              id: s.id,
              label: s.name,
              value: s.id,
            })),
          },
        ]
      : []),
    ...(dynamicFilters?.courses?.length > 0
      ? [
          {
            label: "Courses",
            isMultiple: true,
            multiOptions: sortByName(dynamicFilters.courses).map((c) => ({
              id: c.id,
              label: c.name,
              value: c.id,
            })),
          },
        ]
      : []),
    ...(dynamicFilters?.paymentModes?.length > 0
      ? [
          {
            label: "Payment Mode",
            isMultiple: true,
            multiOptions: sortByName(dynamicFilters.paymentModes).map((p) => ({
              id: p.id,
              label: p.name,
              value: p.id,
            })),
          },
        ]
      : []),
    {
      label: "AG Verified",
      hasDropdown: false,
      icon: (
        <svg
          width="16"
          height="14"
          viewBox="0 0 19 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.3796 1.15416C17.8276 0.605505 16.9313 0.605851 16.3786 1.15416L7.3727 10.0943L3.36998 6.12096C2.81727 5.57231 1.92134 5.57231 1.36863 6.12096C0.815925 6.66961 0.815925 7.55897 1.36863 8.10762L6.37182 13.0741C6.648 13.3482 7.01014 13.4857 7.37232 13.4857C7.73449 13.4857 8.09698 13.3486 8.37316 13.0741L18.3796 3.14078C18.9323 2.59251 18.9323 1.70277 18.3796 1.15416Z"
            fill="#FF6E04"
          />
        </svg>
      ),
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const containerRef = useRef(null);

  // handleFilterSelect is called by FilterItem — only on APPLY actions → triggers API
  const handleFilterSelect = (label, value = null) => {
    
    switch (label) {
      case "Sort by":
        onFilterChange({ sort_by: value?.toLowerCase() || null });
        break;
      case "Facilities":
        onFilterChange({ facilities_id: value?.map((f) => f?.id) || [] });
        break;
      case "Services":
        onFilterChange({ services_id: value?.map((s) => s?.id) || [] });
        break;
      case "Courses":
        onFilterChange({ courses_id: value?.map((c) => c?.id) || [] });
        break;
      case "Payment Mode":
        onFilterChange({ payment_mode_id: value?.map((p) => p?.id) || [] });
        break;
      case "AG Verified":
        onFilterChange({ ag_verified: !filters.ag_verified });
        break;
      default:
        break;
    }
    setOpenIndex(null);
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setOpenIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Build active chips for horizontal display ──
  const activeChips = [];

  if (filters.search?.trim()) {
    activeChips.push({
      key: "search",
      label: `"${filters.search.trim()}"`,
      // Search removal → local only
      onRemove: () => onFilterRemove({ search: "" }),
    });
  }
  if (filters.sort_by) {
    const sorted =
      filters.sort_by.charAt(0).toUpperCase() + filters.sort_by.slice(1);
    activeChips.push({
      key: "sort_by",
      label: `Sort: ${sorted}`,
      // Sort removal → local only
      onRemove: () => onFilterRemove({ sort_by: null }),
    });
  }
  if (filters.ag_verified) {
    activeChips.push({
      key: "ag_verified",
      label: "AG Verified",
      // AG Verified removal → local only
      onRemove: () => onFilterRemove({ ag_verified: false }),
    });
  }

  const facilityMap = Object.fromEntries(
    (dynamicFilters?.facilities || []).map((f) => [f.id, f.name]),
  );
  (filters.facilities_id || []).forEach((id) => {
    activeChips.push({
      key: `facility-${id}`,
      label: facilityMap[id] || id,
      // Individual facility removal → local only
      onRemove: () =>
        onFilterRemove({
          facilities_id: filters.facilities_id.filter((x) => x !== id),
        }),
    });
  });

  const serviceMap = Object.fromEntries(
    (dynamicFilters?.services || []).map((s) => [s.id, s.name]),
  );
  (filters.services_id || []).forEach((id) => {
    activeChips.push({
      key: `service-${id}`,
      label: serviceMap[id] || id,
      // Individual service removal → local only
      onRemove: () =>
        onFilterRemove({
          services_id: filters.services_id.filter((x) => x !== id),
        }),
    });
  });

  const courseMap = Object.fromEntries(
    (dynamicFilters?.courses || []).map((c) => [c.id, c.name]),
  );
  (filters.courses_id || []).forEach((id) => {
    activeChips.push({
      key: `course-${id}`,
      label: courseMap[id] || id,
      // Individual course removal → local only
      onRemove: () =>
        onFilterRemove({
          courses_id: filters.courses_id.filter((x) => x !== id),
        }),
    });
  });

  const paymentMap = Object.fromEntries(
    (dynamicFilters?.paymentModes || []).map((p) => [p.id, p.name]),
  );
  (filters.payment_mode_id || []).forEach((id) => {
    activeChips.push({
      key: `payment-${id}`,
      label: paymentMap[id] || id,
      // Individual payment mode removal → local only
      onRemove: () =>
        onFilterRemove({
          payment_mode_id: filters.payment_mode_id.filter((x) => x !== id),
        }),
    });
  });

  return (
    <div className="w-full">
      {/* ── Backdrop blur overlay when any dropdown is open ── */}
      {openIndex !== null && (
        <div
          className="fixed inset-0 z-30 bg-black/20  mx-auto backdrop-blur-[2px]"
          onClick={() => setOpenIndex(null)}
        />
      )}

      {/* ── Desktop filter row ── */}
      <div className="flex items-center max-md:bg-gray-100 max-md:py-1 md:w-full px-2 py-1 max-md:w-[90vh] max-md:max-w-[350px] max-md:ml-2 max-md:my-2 rounded-lg">
        <div
          ref={containerRef}
          className="relative z-40 flex items-center gap-2.5 max-md:hidden flex-wrap"
        >
          {/* ── SEARCH INPUT ── */}
          <div className="relative flex items-center">
            <svg
              className="absolute left-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search listings..."
              className="
                pl-8 pr-7 py-1.5 text-sm bg-white rounded-md font-medium h-9
                border border-gray-300
                outline-none
                w-46 focus:w-52
                transition-all duration-300
                placeholder:text-gray-400
                focus:border-orange-400
                focus:border-b-[2px] focus:border-b-orange-500
              "
            />
            {searchInput && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* ── DIVIDER ── */}
          <div className="h-6 w-px bg-gray-200" />

          {/* ── FILTER ITEMS ── */}
          {filterItems.map((item, index) => (
            <FilterItem
              key={index}
              index={index}
              isOpen={openIndex === index}
              setOpenIndex={setOpenIndex}
              label={item.label}
              icon={item.icon}
              hasDropdown={item.hasDropdown}
              dropdownItems={item.dropdownOptions}
              isMultiple={item.isMultiple}
              multiOptions={item.multiOptions}
              selectedMultiIds={
                item.label === "Facilities"
                  ? filters?.facilities_id
                  : item.label === "Services"
                    ? filters?.services_id
                    : item.label === "Courses"
                      ? filters?.courses_id
                      : item.label === "Payment Mode"
                        ? filters?.payment_mode_id
                        : []
              }
              isRadio={item.isRadio}
              radioOptions={item.radioOptions}
              selectedRadioId={item.selectedRadioId}
              onSelect={(value) => handleFilterSelect(item.label, value)}
              active={
                item.label === "AG Verified"
                  ? filters?.ag_verified
                  : item.label === "Sort by"
                    ? Boolean(filters?.sort_by)
                    : item.label === "Facilities"
                      ? filters?.facilities_id?.length > 0
                      : item.label === "Services"
                        ? filters?.services_id?.length > 0
                        : item.label === "Courses"
                          ? filters?.courses_id?.length > 0
                          : item.label === "Payment Mode"
                            ? filters?.payment_mode_id?.length > 0
                            : false
              }
            />
          ))}
  


          {/* "Clear all" in the filter bar → calls handleReset → hits API */}
          {hasActiveFilters && (
            <>
              <div className="h-6 w-px bg-gray-200" />
              <button
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2.5 whitespace-nowrap border border-red-200 hover:border-red-300 rounded-md font-semibold transition-colors"
                onClick={handleReset}
              >
                {/* Dustbin Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 0h8l-1 12a2 2 0 01-2 2H9a2 2 0 01-2-2L6 7z"
                  />
                </svg>
                Clear all
              </button>
            </>
          )}
        </div>
      </div>
      

      {/* ── Active filter chips (horizontal) ── */}
      {activeChips.length > 0 && (
        <div className="max-md:hidden flex items-center gap-2 px-2 pt-2 pb-1 flex-wrap">
          <span className="text-xs text-gray-400 font-medium mr-0.5 flex-shrink-0">
            Active:
          </span>
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold rounded-full px-2.5 py-1 transition-all"
            >
              {chip.label}
              <button
                onClick={chip.onRemove}
                className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-orange-200 hover:bg-orange-400 text-orange-700 hover:text-white flex items-center justify-center transition-colors"
                aria-label={`Remove ${chip.label}`}
              >
                <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M1 1l8 8M9 1L1 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
          ))}
          {/* "Clear all" in chips row → local only, no API */}
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-red-500 font-semibold transition-colors ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Mobile filter trigger ── */}
      <div className="md:hidden flex ml-2 items-center gap-2">
        <MobileFilterDrawer
          filterItems={filterItems}
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          handleFilterSelect={handleFilterSelect}
          handleReset={handleReset}
          searchInput={searchInput}
          onSearchChange={onSearchChange}
        />
      </div>
    </div>
  );
};

export default FilterBar;
