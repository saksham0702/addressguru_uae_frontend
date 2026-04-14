import React, { useState, useEffect } from "react";

/**
 * MobileFilterDrawer
 * Props mirror what your parent already has:
 *  - filterItems: same array you map over for desktop FilterItem
 *  - filters: your filters state object
 *  - hasActiveFilters: boolean
 *  - handleFilterSelect: (label, value) => void
 *  - handleReset: () => void
 */
const MobileFilterDrawer = ({
  filterItems = [],
  filters = {},
  hasActiveFilters = false,
  handleFilterSelect,
  searchInput = "",
  onSearchChange,
  handleReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  // Temp state mirrors desktop behaviour — apply on button press
  const [tempFilters, setTempFilters] = useState({});

  // Sync temp state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTempFilters({
        sort_by: filters?.sort_by || null,
        ag_verified: filters?.ag_verified || false,
        facilities_id: filters?.facilities_id || [],
        services_id: filters?.services_id || [],
        payment_mode_id: filters?.payment_mode_id || [],
      });
    }
  }, [isOpen]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const activeCount = [
    filters?.ag_verified,
    Boolean(filters?.sort_by),
    filters?.facilities_id?.length > 0,
    filters?.services_id?.length > 0,
    filters?.payment_mode_id?.length > 0,
  ].filter(Boolean).length;

  const handleApplyAll = () => {
    // Fire handleFilterSelect for each changed filter
    filterItems.forEach((item) => {
      if (item.label === "Sort by") {
        if (tempFilters.sort_by !== filters?.sort_by) {
          const opt = item.radioOptions?.find(
            (o) => o.id === tempFilters.sort_by,
          );
          if (opt) handleFilterSelect(item.label, opt);
        }
      } else if (item.label === "AG Verified") {
        if (tempFilters.ag_verified !== filters?.ag_verified) {
          handleFilterSelect(item.label, tempFilters.ag_verified);
        }
      } else if (item.label === "Facilities") {
        const selected = item.multiOptions?.filter((o) =>
          tempFilters.facilities_id.includes(o.id),
        );
        handleFilterSelect(item.label, selected || []);
      } else if (item.label === "Services") {
        const selected = item.multiOptions?.filter((o) =>
          tempFilters.services_id.includes(o.id),
        );
        handleFilterSelect(item.label, selected || []);
      } else if (item.label === "Payment Mode") {
        const selected = item.multiOptions?.filter((o) =>
          tempFilters.payment_mode_id.includes(o.id),
        );
        handleFilterSelect(item.label, selected || []);
      }
    });
    setIsOpen(false);
  };

  const handleTempToggleMulti = (key, id) => {
    setTempFilters((prev) => ({
      ...prev,
      [key]: prev[key]?.includes(id)
        ? prev[key].filter((i) => i !== id)
        : [...(prev[key] || []), id],
    }));
  };

  const getMultiKey = (label) => {
    if (label === "Facilities") return "facilities_id";
    if (label === "Services") return "services_id";
    if (label === "Payment Mode") return "payment_mode_id";
    return null;
  };

  const renderFilterContent = (item) => {
    // Toggle (AG Verified, Top Rated etc.)
    if (!item.hasDropdown && !item.isRadio && !item.isMultiple) {
      const isActive =
        item.label === "AG Verified" ? tempFilters.ag_verified : false;
      return (
        <button
          onClick={() => {
            setTempFilters((prev) => ({
              ...prev,
              ag_verified: !prev.ag_verified,
            }));
          }}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all font-medium text-xs ${
            isActive
              ? "border-orange-500 bg-orange-50 text-orange-600"
              : "border-gray-200 bg-white text-gray-700"
          }`}
        >
          <span className="flex items-center gap-2">
            {item.icon && <span className="text-orange-500">{item.icon}</span>}
            {item.label}
          </span>
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              isActive ? "border-orange-500 bg-orange-500" : "border-gray-300"
            }`}
          >
            {isActive && (
              <svg width="10" height="8" viewBox="0 0 12 9" fill="none">
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
        </button>
      );
    }

    // Radio (Sort by)
    if (item.isRadio && item.radioOptions?.length > 0) {
      return (
        <div className="space-y-2">
          {item.radioOptions.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                tempFilters.sort_by === opt.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white"
              }`}
              onClick={() =>
                setTempFilters((prev) => ({ ...prev, sort_by: opt.id }))
              }
            >
              <span
                className={`font-medium text-xs ${
                  tempFilters.sort_by === opt.id
                    ? "text-orange-600"
                    : "text-gray-700"
                }`}
              >
                {opt.label}
              </span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  tempFilters.sort_by === opt.id
                    ? "border-orange-500 bg-orange-500"
                    : "border-gray-300"
                }`}
              >
                {tempFilters.sort_by === opt.id && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </label>
          ))}
        </div>
      );
    }

    // Multiple (Facilities, Services, Payment Mode)
    if (item.isMultiple && item.multiOptions?.length > 0) {
      const key = getMultiKey(item.label);
      const selected = tempFilters[key] || [];
      return (
        <div className="space-y-2">
          {item.multiOptions.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                selected.includes(opt.id)
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white"
              }`}
              onClick={() => handleTempToggleMulti(key, opt.id)}
            >
              <span
                className={`font-medium text-xs ${
                  selected.includes(opt.id)
                    ? "text-orange-600"
                    : "text-gray-700"
                }`}
              >
                {opt.label}
              </span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected.includes(opt.id)
                    ? "border-orange-500 bg-orange-500"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selected.includes(opt.id) && (
                  <svg width="10" height="8" viewBox="0 0 12 9" fill="none">
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
          ))}
        </div>
      );
    }

    // Simple dropdown options
    if (item.hasDropdown && item.dropdownOptions?.length > 0) {
      return (
        <div className="space-y-2">
          {item.dropdownOptions.map((opt, i) => (
            <div
              key={i}
              onClick={() => {
                handleFilterSelect(item.label, opt);
                setIsOpen(false);
              }}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-medium text-xs cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-all"
            >
              {opt}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        {/* Filter icon SVG */}
        <svg
          width="23"
          height="21"
          viewBox="0 0 23 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.9888 18.456C19.4923 18.456 18.9958 18.4624 18.5 18.4521C18.3334 18.4489 18.2533 18.4976 18.1841 18.6584C17.6441 19.9076 16.3526 20.6392 14.9964 20.4797C13.6844 20.3253 12.5909 19.2978 12.3468 17.9896C12.0592 16.4457 12.981 14.9435 14.5012 14.4797C15.9676 14.0325 17.5691 14.7712 18.1816 16.1914C18.2552 16.3625 18.3392 16.4073 18.5147 16.4054C19.523 16.397 20.532 16.3964 21.5403 16.4041C22.0644 16.4079 22.4654 16.7718 22.5455 17.2907C22.6178 17.759 22.3385 18.2318 21.8767 18.3842C21.721 18.4355 21.5474 18.4502 21.3821 18.4534C20.917 18.4618 20.4526 18.456 19.9888 18.456Z"
            fill="#8C8C8C"
          />
          <path
            d="M2.52927 11.2697C2.04112 11.2697 1.55233 11.2742 1.06418 11.2684C0.447264 11.2608 -0.00821567 10.8162 0.000112372 10.2377C0.00779979 9.66497 0.454952 9.23255 1.06098 9.22871C2.05394 9.22294 3.04689 9.22294 4.03921 9.23063C4.2141 9.23191 4.30123 9.18707 4.37554 9.01538C4.95145 7.68546 6.38964 6.94298 7.80028 7.2319C9.22246 7.52274 10.2577 8.78476 10.2647 10.2345C10.2711 11.6861 9.26218 12.9372 7.82655 13.2569C6.4332 13.5676 4.97451 12.8315 4.38771 11.5055C4.30635 11.3216 4.21474 11.2595 4.01871 11.2652C3.52287 11.2793 3.02575 11.2704 2.52927 11.2697Z"
            fill="#8C8C8C"
          />
          <path
            d="M16.4115 3.05458C16.4269 1.34605 17.7978 -0.0139851 19.4922 0.000108551C21.2085 0.0142022 22.5813 1.40114 22.5589 3.09942C22.5365 4.7945 21.1463 6.16286 19.4589 6.15005C17.7677 6.13723 16.3961 4.74389 16.4115 3.05458Z"
            fill="#8C8C8C"
          />
          <path
            d="M7.17504 4.0963C5.14235 4.0963 3.10903 4.09822 1.07635 4.09501C0.3627 4.09437 -0.117764 3.50757 0.0327812 2.83556C0.12439 2.42492 0.465199 2.11807 0.905944 2.05593C0.992428 2.04375 1.08147 2.04247 1.16924 2.04247C5.17887 2.04183 9.1885 2.04183 13.1981 2.04247C13.7542 2.04247 14.1405 2.28591 14.2968 2.72793C14.5332 3.3993 14.0489 4.08733 13.3224 4.09437C12.4262 4.1027 11.53 4.09694 10.6331 4.09694C9.47998 4.0963 8.32751 4.0963 7.17504 4.0963Z"
            fill="#8C8C8C"
          />
          <path
            d="M5.13135 18.4571C3.79438 18.4571 2.4574 18.4591 1.11979 18.4565C0.524659 18.4552 0.1121 18.1259 0.0198513 17.591C-0.0820071 17.001 0.356816 16.4449 0.958357 16.4059C1.07815 16.3982 1.19859 16.4027 1.31838 16.4027C3.92826 16.4027 6.53878 16.402 9.14866 16.4033C9.69703 16.4033 10.1109 16.7057 10.2223 17.1817C10.3812 17.8588 9.89755 18.4514 9.1666 18.4558C8.07755 18.4629 6.98914 18.4578 5.90009 18.4578C5.64384 18.4571 5.38759 18.4571 5.13135 18.4571Z"
            fill="#8C8C8C"
          />
          <path
            d="M17.4559 9.22702C18.8089 9.22702 20.1619 9.22125 21.5149 9.22958C22.2138 9.23406 22.6795 9.82856 22.5258 10.4922C22.4277 10.9138 22.0555 11.2322 21.6212 11.2635C21.5571 11.268 21.4931 11.2693 21.429 11.2693C18.7628 11.2693 16.0972 11.2699 13.4309 11.2693C12.8319 11.2693 12.4283 10.9637 12.3284 10.4436C12.2092 9.826 12.6481 9.252 13.2772 9.23342C13.8774 9.21613 14.4777 9.22702 15.0786 9.22702C15.871 9.22638 16.6635 9.22702 17.4559 9.22702Z"
            fill="#8C8C8C"
          />
        </svg>
        Filters
        {/* Active filter count badge */}
        {activeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bottom Sheet Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "85vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Filters</h3>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={() => {
                  handleReset();
                  setIsOpen(false);
                }}
                className="text-xs font-medium text-orange-500"
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

        {/* Filter accordion list */}
        <div
          className="overflow-y-auto px-4 py-3 space-y-2"
          style={{ maxHeight: "calc(85vh - 140px)" }}
        >
          {/* Search input */}
          <div className="relative flex items-center">
            <svg
              className="absolute left-3 w-5 h-5 text-gray-400"
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
              placeholder="Search business..."
              className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs"
            />
            {searchInput.length > 0 && (
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
          {filterItems.map((item, index) => {
            const hasContent =
              item.hasDropdown ||
              item.isRadio ||
              item.isMultiple ||
              (!item.hasDropdown && !item.isRadio && !item.isMultiple);
            const isAccordionOpen = openAccordion === index;

            // Non-expandable toggle items (AG Verified, Top Rated)
            if (!item.hasDropdown && !item.isRadio && !item.isMultiple) {
              return <div key={index}>{renderFilterContent(item)}</div>;
            }

            // Expandable accordion for dropdown/radio/multi
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-4 py-3 bg-white"
                  onClick={() =>
                    setOpenAccordion(isAccordionOpen ? null : index)
                  }
                >
                  <span className="flex items-center gap-2 font-medium text-xs text-gray-800">
                    {item.icon && (
                      <span className="text-orange-500">{item.icon}</span>
                    )}
                    {item.label}
                    {/* show count badge inside accordion header if active */}
                    {((item.label === "Facilities" &&
                      tempFilters.facilities_id?.length > 0) ||
                      (item.label === "Services" &&
                        tempFilters.services_id?.length > 0) ||
                      (item.label === "Payment Mode" &&
                        tempFilters.payment_mode_id?.length > 0) ||
                      (item.label === "Sort by" && tempFilters.sort_by)) && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                    )}
                  </span>
                  <svg
                    className={`transition-transform duration-200 text-gray-500 ${isAccordionOpen ? "rotate-180" : ""}`}
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

                {isAccordionOpen && (
                  <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                    <div className="pt-3">{renderFilterContent(item)}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Apply button */}
        <div className="px-4 py-4 border-t border-gray-100 bg-white">
          <button
            onClick={handleApplyAll}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors text-xs"
          >
            Apply Filters {activeCount > 0 && `(${activeCount} active)`}
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileFilterDrawer;
