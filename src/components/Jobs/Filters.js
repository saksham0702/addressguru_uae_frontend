import React, { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

const JobFilters = ({ jobFilters, onApplyFilters }) => {
  const [expandedSections, setExpandedSections] = useState({
    workMode: true,
    experience: false,
    salary: false,
    location: false,
    industry: true,
    jobType: true,
  });

  const [filters, setFilters] = useState({
    workMode: [],
    experience: [],
    salary: [],
    location: [],
    industry: [],
    jobType: [],
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const currentFilters = prev[category];
      if (currentFilters.includes(value)) {
        return {
          ...prev,
          [category]: currentFilters.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [category]: [...currentFilters, value],
        };
      }
    });
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      workMode: [],
      experience: [],
      salary: [],
      location: [],
      industry: [],
      jobType: [],
    };
    setFilters(emptyFilters);
    // Also clear filters on the backend
    if (onApplyFilters) {
      onApplyFilters(emptyFilters);
    }
  };

  const getTotalActiveFilters = () => {
    return Object.values(filters).flat().length;
  };

  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
  };

  const clearCategoryFilter = (category) => {
    const newFilters = {
      ...filters,
      [category]: [],
    };
    setFilters(newFilters);
    // Auto-apply after clearing
    if (onApplyFilters) {
      onApplyFilters(newFilters);
    }
  };

  const FilterSection = ({ title, items, category, showCount = false }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showAll, setShowAll] = useState(false);

    if (!items || items.length === 0) return null;

    const filteredItems = items.filter((item) => {
      const label = item.name || item.type || item.city || "";
      return label.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const displayItems = showAll ? filteredItems : filteredItems.slice(0, 5);
    const hasActiveFilters = filters[category].length > 0;

    return (
      <div className="border-b border-gray-200 py-2">
        <button
          onClick={() => toggleSection(category)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold text-gray-900 text-sm">
            {title}
            {hasActiveFilters && (
              <span className="ml-2 text-sm text-orange-600 font-normal">
                ({filters[category].length})
              </span>
            )}
          </h3>
          {expandedSections[category] ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {expandedSections[category] && (
          <div className="mt-1 space-y-[1px]">
            {items.length > 5 && (
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            )}

            <div className="max-h-60 overflow-y-auto">
              {displayItems.map((item) => {
                const itemId = item.id;
                const itemLabel = item.name || item.type || item.city || "";

                // Skip null or empty values
                if (!itemLabel) return null;

                return (
                  <label
                    key={itemId || itemLabel}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters[category].includes(itemId)}
                      onChange={() => handleFilterChange(category, itemId)}
                      className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 flex-1">
                      {itemLabel}
                    </span>
                    {showCount && item.count && (
                      <span className="text-sm text-gray-500">
                        ({item.count})
                      </span>
                    )}
                  </label>
                );
              })}
            </div>

            {filteredItems.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-orange-600 text-sm font-semibold hover:text-orange-700 mt-2"
              >
                {showAll ? "Show Less" : `Show All (${filteredItems.length})`}
              </button>
            )}

            {/* Apply button - always visible, Clear button only when filters active */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleApplyFilters}
                className="flex-1 border border-orange-600 text-orange-600 text-sm py-1.5 rounded font-semibold hover:bg-orange-600 hover:text-white transition-colors"
              >
                Apply
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => clearCategoryFilter(category)}
                  className="flex-1 bg-gray-200 text-gray-700 text-sm py-1.5 rounded font-semibold hover:bg-gray-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

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

  // Helper function to get display name for active filters
  const getFilterDisplayName = (category, value) => {
    let item;
    switch (category) {
      case "workMode":
        item = jobFilters?.work_mode?.find((i) => i.id === value);
        return item?.name || value;
      case "jobType":
        item = jobFilters?.job_types?.find((i) => i.id === value);
        return item?.type || value;
      case "industry":
        item = jobFilters?.industries?.find((i) => i.id === value);
        return item?.name || value;
      case "location":
        item = jobFilters?.cities?.find((i) => i.city === value);
        return item?.city || value;
      case "experience":
        item = experienceOptions.find((i) => i.id === value);
        return item?.name || value;
      case "salary":
        item = salaryOptions.find((i) => i.id === value);
        return item?.name || value;
      default:
        return value;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">All Filters</h2>
          {getTotalActiveFilters() > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear All ({getTotalActiveFilters()})
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="p-4">
        <FilterSection
          title="Work Mode"
          items={jobFilters?.work_mode || []}
          category="workMode"
        />
        <FilterSection
          title="Job Type"
          items={jobFilters?.job_types || []}
          category="jobType"
        />
        <FilterSection
          title="Industry"
          items={jobFilters?.industries || []}
          category="industry"
        />
        <FilterSection
          title="Location"
          items={jobFilters?.cities?.filter((c) => c.city) || []}
          category="location"
        />
        <FilterSection
          title="Experience"
          items={experienceOptions}
          category="experience"
        />
        <FilterSection
          title="Salary (per month)"
          items={salaryOptions}
          category="salary"
        />
      </div>

      {/* Footer Actions */}
      {getTotalActiveFilters() > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={clearAllFilters}
            className="w-full bg-gray-200 text-gray-700 text-sm py-2.5 rounded font-semibold hover:bg-gray-300 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default JobFilters;
