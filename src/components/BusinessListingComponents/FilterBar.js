import React, { useEffect, useRef, useState } from "react";
import FilterItem from "./FilterItem";
import MobileFilterDrawer from "./MobileFilterDrawer";

const FilterBar = ({
  filters,
  hasActiveFilters,
  onFilterChange,
  onSearchChange,
  searchInput,
  dynamicFilters,
  handleReset,
}) => {
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
            multiOptions: dynamicFilters.facilities.map((f) => ({
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
            multiOptions: dynamicFilters.services.map((s) => ({
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
            multiOptions: dynamicFilters.courses.map((c) => ({
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
            multiOptions: dynamicFilters.paymentModes.map((p) => ({
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

  const handleFilterSelect = (label, value = null) => {
    switch (label) {
      case "Sort by":
        onFilterChange({ sort_by: value?.toLowerCase() });
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

  return (
    <>
      <div className="flex items-center max-md:bg-gray-100 max-md:py-1 md:w-[920px] px-2 py-1 max-md:w-[90vh] max-md:max-w-[350px] max-md:ml-2 max-md:my-2 rounded-lg">
        {/* Filter icon */}
        {/* <svg className="max-md:hidden border border-gray-300" width="34" height="34" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="35" height="35" rx="6" fill="white"/>
          <path d="M28.5501 27.8051C28.0174 27.8051 27.4846 27.8119 26.9525 27.801C26.7738 27.7975 26.6879 27.8498 26.6136 28.0223C26.0341 29.3628 24.6482 30.1479 23.1929 29.9767C21.785 29.811 20.6116 28.7084 20.3497 27.3046C20.041 25.6479 21.0302 24.0358 22.6615 23.5381C24.2351 23.0583 25.9537 23.8509 26.6109 25.375C26.6899 25.5585 26.78 25.6066 26.9683 25.6046C28.0504 25.5956 29.1331 25.595 30.2151 25.6032C30.7775 25.6073 31.2078 25.9978 31.2937 26.5546C31.3714 27.0571 31.0717 27.5645 30.576 27.7281C30.409 27.7831 30.2227 27.7989 30.0453 27.8023C29.5463 27.8113 29.0479 27.8051 28.5501 27.8051Z" fill="#5B5B5B"/>
          <path d="M9.81472 20.0933C9.29089 20.0933 8.76638 20.0981 8.24255 20.0919C7.58054 20.0837 7.09177 19.6066 7.10071 18.9858C7.10896 18.3713 7.58879 17.9072 8.23911 17.9031C9.30464 17.8969 10.3702 17.8969 11.435 17.9052C11.6227 17.9065 11.7162 17.8584 11.7959 17.6742C12.4139 16.2471 13.9572 15.4503 15.471 15.7604C16.9971 16.0725 18.108 17.4267 18.1156 18.9824C18.1225 20.5401 17.0397 21.8827 15.4992 22.2257C14.004 22.5591 12.4387 21.7693 11.809 20.3463C11.7217 20.149 11.6234 20.0823 11.413 20.0885C10.8809 20.1036 10.3475 20.094 9.81472 20.0933Z" fill="#5B5B5B"/>
          <path d="M24.7116 11.2777C24.7281 9.44431 26.1992 7.98487 28.0175 7.99999C29.8591 8.01512 31.3323 9.50343 31.3082 11.3258C31.2842 13.1448 29.7924 14.6132 27.9817 14.5994C26.1669 14.5857 24.6951 13.0905 24.7116 11.2777Z" fill="#5B5B5B"/>
          <path d="M14.7999 12.3954C12.6187 12.3954 10.4367 12.3974 8.25547 12.394C7.48966 12.3933 6.97408 11.7636 7.13563 11.0425C7.23394 10.6018 7.59966 10.2726 8.07261 10.2059C8.16542 10.1928 8.26097 10.1914 8.35515 10.1914C12.6578 10.1907 16.9605 10.1907 21.2632 10.1914C21.8599 10.1914 22.2745 10.4527 22.4422 10.927C22.6959 11.6474 22.1762 12.3857 21.3966 12.3933C20.4349 12.4022 19.4731 12.3961 18.5107 12.3961C17.2733 12.3954 16.0366 12.3954 14.7999 12.3954Z" fill="#5B5B5B"/>
          <path d="M12.6069 27.805C11.1722 27.805 9.73747 27.8071 8.30209 27.8043C7.66346 27.803 7.22075 27.4496 7.12176 26.8756C7.01245 26.2425 7.48335 25.6458 8.12886 25.6038C8.25741 25.5956 8.38665 25.6004 8.5152 25.6004C11.3158 25.6004 14.1172 25.5997 16.9178 25.6011C17.5062 25.6011 17.9503 25.9256 18.0699 26.4363C18.2404 27.1629 17.7214 27.7988 16.937 27.8036C15.7684 27.8112 14.6004 27.8057 13.4318 27.8057C13.1568 27.805 12.8818 27.805 12.6069 27.805Z" fill="#5B5B5B"/>
          <path d="M25.8319 17.9018C27.2837 17.9018 28.7356 17.8956 30.1875 17.9046C30.9375 17.9094 31.4373 18.5473 31.2723 19.2595C31.1671 19.7119 30.7677 20.0535 30.3016 20.0872C30.2329 20.092 30.1641 20.0934 30.0954 20.0934C27.2342 20.0934 24.3738 20.0941 21.5127 20.0934C20.8699 20.0934 20.4368 19.7655 20.3296 19.2073C20.2017 18.5446 20.6726 17.9286 21.3477 17.9087C21.9918 17.8901 22.6359 17.9018 23.2808 17.9018C24.1311 17.9011 24.9815 17.9018 25.8319 17.9018Z" fill="#5B5B5B"/>
        </svg> */}

        <div
          ref={containerRef}
          className="flex items-center gap-3 max-md:hidden"
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
                pl-8 pr-7 py-1.5 text-sm bg-white rounded font-medium
                border border-gray-300
                outline-none
                w-40 focus:w-52
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

          {hasActiveFilters && (
            <button
              className="text-sm bg-white px-2 whitespace-nowrap border-gray-300 border rounded-sm font-semibold"
              onClick={handleReset}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Mobile filter trigger */}
      <div className="md:hidden flex ml-2 items-center gap-2">
        <MobileFilterDrawer
          filterItems={filterItems}
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          handleFilterSelect={handleFilterSelect}
          handleReset={handleReset}
          searchInput={searchInput} // ← add
          onSearchChange={onSearchChange} // ← add
        />
      </div>
    </>
  );
};

export default FilterBar;
