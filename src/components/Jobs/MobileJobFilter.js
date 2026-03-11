import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

const experienceOptions = [
  { id: "0-1", name: "Fresher (0-1 years)" },
  { id: "1-3", name: "1-3 years" },
  { id: "3-5", name: "3-5 years" },
  { id: "5-7", name: "5-7 years" },
  { id: "7-10", name: "7-10 years" },
  { id: "10+", name: "10+ years" },
];

const salaryOptions = [
  { id: "0-3000", name: "S$0 - S$3,000" },
  { id: "3000-5000", name: "S$3,000 - S$5,000" },
  { id: "5000-8000", name: "S$5,000 - S$8,000" },
  { id: "8000-12000", name: "S$8,000 - S$12,000" },
  { id: "12000-20000", name: "S$12,000 - S$20,000" },
  { id: "20000+", name: "S$20,000+" },
];

const SECTIONS = [
  { key: "workMode", title: "Work Mode", dataKey: "work_mode", labelKey: "name" },
  { key: "jobType", title: "Job Type", dataKey: "job_types", labelKey: "type" },
  { key: "industry", title: "Industry", dataKey: "industries", labelKey: "name" },
  { key: "location", title: "Location", dataKey: "cities", labelKey: "city" },
  { key: "experience", title: "Experience", static: experienceOptions },
  { key: "salary", title: "Salary (per month)", static: salaryOptions },
];

const emptyFilters = {
  workMode: [],
  experience: [],
  salary: [],
  location: [],
  industry: [],
  jobType: [],
};

const MobileJobFilter = ({ jobFilters, onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("workMode");
  const [tempFilters, setTempFilters] = useState(emptyFilters);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const totalActive = Object.values(tempFilters).flat().length;

  const getItems = (section) => {
    if (section.static) return section.static;
    const raw = jobFilters?.[section.dataKey] || [];
    if (section.key === "location") return raw.filter((c) => c.city);
    return raw;
  };

  const getLabel = (section, item) => {
    if (section.static) return item.name;
    return item[section.labelKey] || item.name || "";
  };

  const handleToggle = (category, id) => {
    setTempFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(id)
        ? prev[category].filter((v) => v !== id)
        : [...prev[category], id],
    }));
  };

  const handleClearSection = (category) => {
    setTempFilters((prev) => ({ ...prev, [category]: [] }));
  };

  const handleClearAll = () => {
    setTempFilters(emptyFilters);
  };

  const handleApply = () => {
    onApplyFilters?.(tempFilters);
    setIsOpen(false);
  };

  const activeSectionData = SECTIONS.find((s) => s.key === activeSection);
  const activeSectionItems = activeSectionData ? getItems(activeSectionData) : [];

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 active:bg-gray-50 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 16 14" fill="none">
          <path d="M13.4668 12.622C13.1323 12.622 12.7979 12.6263 12.4638 12.6194C12.3516 12.6173 12.2977 12.6501 12.251 12.7584C11.8872 13.6 11.0172 14.0928 10.1035 13.9854C9.21963 13.8814 8.48292 13.1891 8.31849 12.3078C8.12471 11.2677 8.74576 10.2557 9.76989 9.94321C10.7578 9.64197 11.8367 10.1396 12.2493 11.0964C12.2989 11.2116 12.3555 11.2418 12.4737 11.2405C13.153 11.2349 13.8328 11.2345 14.5121 11.2397C14.8651 11.2423 15.1353 11.4874 15.1892 11.837C15.238 12.1525 15.0498 12.471 14.7387 12.5737C14.6338 12.6082 14.5168 12.6181 14.4055 12.6203C14.0922 12.6259 13.7793 12.622 13.4668 12.622Z" fill="#5B5B5B"/>
          <path d="M1.70395 7.78055C1.37509 7.78055 1.04579 7.78357 0.716929 7.77969C0.301318 7.77451 -0.00553482 7.47499 7.57042e-05 7.08528C0.00525465 6.69945 0.306497 6.40813 0.714771 6.40554C1.38372 6.40166 2.05267 6.40166 2.72118 6.40684C2.839 6.4077 2.8977 6.37749 2.94776 6.26183C3.33575 5.36587 4.30465 4.86567 5.25498 5.06031C6.21309 5.25625 6.91052 6.10646 6.91527 7.08312C6.91958 8.06108 6.23985 8.90395 5.27268 9.11931C4.33399 9.32863 3.35129 8.83274 2.95596 7.93937C2.90115 7.81551 2.83943 7.77365 2.70737 7.77753C2.37333 7.78703 2.03842 7.78098 1.70395 7.78055Z" fill="#5B5B5B"/>
          <path d="M11.0558 2.2462C11.0661 1.09518 11.9897 0.178933 13.1312 0.188428C14.2874 0.197922 15.2123 1.13229 15.1972 2.27641C15.1821 3.41837 14.2456 4.34022 13.1088 4.33159C11.9694 4.32296 11.0454 3.38427 11.0558 2.2462Z" fill="#5B5B5B"/>
          <path d="M4.83226 2.94769C3.46286 2.94769 2.09303 2.94898 0.723626 2.94682C0.242847 2.94639 -0.0808376 2.55107 0.0205835 2.09834C0.0822993 1.8217 0.311899 1.61497 0.608826 1.57311C0.667089 1.56491 0.727079 1.56404 0.786205 1.56404C3.48746 1.56361 6.18871 1.56361 8.88997 1.56404C9.26458 1.56404 9.52482 1.72804 9.63013 2.02583C9.78938 2.47813 9.4631 2.94164 8.97369 2.94639C8.36991 2.952 7.76613 2.94812 7.16192 2.94812C6.38508 2.94769 5.60867 2.94769 4.83226 2.94769Z" fill="#5B5B5B"/>
          <path d="M3.45544 12.622C2.55474 12.622 1.65403 12.6233 0.752894 12.6216C0.351957 12.6207 0.0740202 12.3989 0.0118728 12.0385C-0.0567483 11.641 0.238883 11.2664 0.644136 11.2401C0.724841 11.2349 0.805978 11.2379 0.886684 11.2379C2.64494 11.2379 4.40362 11.2375 6.16188 11.2384C6.53131 11.2384 6.81011 11.4421 6.8852 11.7627C6.99223 12.2189 6.66639 12.6181 6.17396 12.6211C5.44027 12.6259 4.70702 12.6224 3.97334 12.6224C3.80071 12.622 3.62807 12.622 3.45544 12.622Z" fill="#5B5B5B"/>
          <path d="M11.7595 6.40487C12.671 6.40487 13.5825 6.40098 14.494 6.40659C14.9649 6.40961 15.2786 6.81012 15.175 7.25724C15.109 7.54122 14.8583 7.75571 14.5657 7.77686C14.5225 7.77988 14.4793 7.78074 14.4362 7.78074C12.6399 7.78074 10.8441 7.78117 9.04792 7.78074C8.64439 7.78074 8.37249 7.57488 8.30517 7.22444C8.22489 6.80839 8.52053 6.4217 8.94434 6.40918C9.34873 6.39753 9.75311 6.40487 10.1579 6.40487C10.6918 6.40444 11.2257 6.40487 11.7595 6.40487Z" fill="#5B5B5B"/>
        </svg>
        Filters
        {totalActive > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {totalActive}
          </span>
        )}
      </button>

      {/* Full Screen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
            <h2 className="text-base font-bold text-gray-900">All Filters</h2>
            <div className="flex items-center gap-3">
              {totalActive > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-sm font-semibold text-orange-500"
                >
                  Clear all ({totalActive})
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Two-panel body */}
          <div className="flex flex-1 overflow-hidden">

            {/* Left: Category tabs */}
            <div className="w-[30%] bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0">
              {SECTIONS.map((section) => {
                const count = tempFilters[section.key]?.length || 0;
                const isActive = activeSection === section.key;
                return (
                  <button
                    key={section.key}
                    onClick={() => setActiveSection(section.key)}
                    className={`w-full text-left px-3 py-4 text-sm font-semibold border-b border-gray-200 flex items-center justify-between transition-colors ${
                      isActive
                        ? "bg-white text-orange-500 border-l-2 border-l-orange-500"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="leading-tight">{section.title}</span>
                    {count > 0 && (
                      <span className="bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: Options for active section */}
            <div className="flex-1 overflow-y-auto bg-white">
              <div className="px-3 py-3">
                {/* Section header with clear */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {activeSectionData?.title}
                  </span>
                  {tempFilters[activeSection]?.length > 0 && (
                    <button
                      onClick={() => handleClearSection(activeSection)}
                      className="text-xs text-orange-500 font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-1">
                  {activeSectionItems.map((item) => {
                    const id = item.id;
                    const label = getLabel(activeSectionData, item);
                    if (!label) return null;
                    const isSelected = tempFilters[activeSection]?.includes(id);

                    return (
                      <label
                        key={id || label}
                        onClick={() => handleToggle(activeSection, id)}
                        className={`flex items-center justify-between px-3 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <span className={`text-sm font-semibold ${isSelected ? "text-orange-600" : "text-gray-700"}`}>
                          {label}
                        </span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected ? "border-orange-500 bg-orange-500" : "border-gray-300 bg-white"
                        }`}>
                          {isSelected && (
                            <svg width="10" height="8" viewBox="0 0 12 9" fill="none">
                              <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </label>
                    );
                  })}

                  {activeSectionItems.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8">No options available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200 bg-white flex-shrink-0">
            <button
              onClick={handleApply}
              className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors text-sm"
            >
              Apply Filters {totalActive > 0 && `(${totalActive} selected)`}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileJobFilter;