import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Check,
  Filter,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Layers,
  Globe,
  Grid,
} from "lucide-react";
import { get_job_categories, get_languages } from "@/api/uae-job-listing";
import { getCities } from "@/api/uaeadminCities";
import { getSubCategoriesByCategory } from "@/api/uaeAdminCategories";

const JobFilters = ({ jobFilters, onApplyFilters, compact = false }) => {
  const [expandedSections, setExpandedSections] = useState({
    workMode: true,
    experience: true,
    salary: false,
    location: false,
    sector: false,
    jobType: false,
    category: true,
    subCategory: false,
    language: false,
  });

  const [filters, setFilters] = useState({
    workMode: [],
    experience: [],
    salary: [],
    location: [],
    sector: [],
    jobType: [],
    category: [],
    subCategory: [],
    language: [],
    locality: [],
  });

  const [options, setOptions] = useState({
    categories: [],
    subCategories: [],
    languages: [],
    cities: [],
  });

  // Fetch options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [cats, langs, cityData] = await Promise.all([
          get_job_categories(),
          get_languages(),
          getCities(),
        ]);
        setOptions((prev) => ({
          ...prev,
          categories: cats || [],
          languages: langs || [],
          cities: cityData?.data || [],
        }));
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchOptions();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubs = async () => {
      if (filters.category.length === 1) {
        const selectedCat = options.categories.find(
          (c) => c._id === filters.category[0],
        );
        if (selectedCat?.slug) {
          const res = await getSubCategoriesByCategory(selectedCat.slug);
          setOptions((prev) => ({ ...prev, subCategories: res?.data || [] }));
        }
      } else {
        setOptions((prev) => ({ ...prev, subCategories: [] }));
      }
    };
    fetchSubs();
  }, [filters.category, options.categories]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterChange = (category, value) => {
    setFilters((prev) => {
      const currentFilters = prev[category];
      const isSelected = currentFilters.includes(value);
      const newFilters = isSelected
        ? currentFilters.filter((item) => item !== value)
        : [...currentFilters, value];

      const updated = { ...prev, [category]: newFilters };
      return updated;
    });
  };

  const handleApply = () => {
    if (onApplyFilters) onApplyFilters(filters);
  };

  const clearAllFilters = () => {
    const emptyFilters = Object.keys(filters).reduce(
      (acc, key) => ({ ...acc, [key]: [] }),
      {},
    );
    setFilters(emptyFilters);
    if (onApplyFilters) onApplyFilters(emptyFilters);
  };

  const getTotalActiveFilters = () => {
    return Object.values(filters).flat().length;
  };

  // ---- Naukri-style filter section ----
  const FilterSection = ({
    title,
    items,
    category,
    icon: Icon,
    labelKey = "name",
    idKey = "_id",
  }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showAll, setShowAll] = useState(false);

    if (!items || items.length === 0) return null;

    const filteredItems = items.filter((item) => {
      const label = item[labelKey] || item.type || item.city || "";
      return label.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const displayItems = showAll ? filteredItems : filteredItems.slice(0, 5);
    const hasActiveFilters = filters[category]?.length > 0;
    const isExpanded = expandedSections[category];

    return (
      <div className="border-b border-gray-100 last:border-0 py-4">
        <button
          onClick={() => toggleSection(category)}
          className="flex items-center justify-between w-full group"
        >
          <h3 className="font-bold text-[13px] text-gray-900 flex items-center gap-1.5">
            {title}
            {hasActiveFilters && (
              <span className="text-[#FF6E04] text-[13px] font-bold">
                ({filters[category].length})
              </span>
            )}
          </h3>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-2.5">
            {items.length > 6 && (
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2.5 py-1.5 text-[12px] bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-gray-300 outline-none mb-1"
              />
            )}

            <div className="space-y-2.5">
              {displayItems.map((item) => {
                const id =
                  item[idKey] || item.id || item._id || item.city || item.value;
                const label =
                  item[labelKey] || item.type || item.city || item.name || "";
                const count = item.count ?? item.total ?? null;
                const isSelected = filters[category]?.includes(id);

                return (
                  <label
                    key={id}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <span
                      className={`flex-shrink-0 w-[15px] h-[15px] rounded-[3px] border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-[#FF6E04] bg-white"
                          : "border-gray-300 bg-white group-hover:border-gray-400"
                      }`}
                    >
                      {isSelected && (
                        <Check
                          className="w-[11px] h-[11px] text-[#FF6E04]"
                          strokeWidth={3.5}
                        />
                      )}
                    </span>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isSelected}
                      onChange={() => handleFilterChange(category, id)}
                    />
                    <span
                      className={`text-[13px] leading-tight ${
                        isSelected
                          ? "font-bold text-gray-900"
                          : "font-normal text-gray-700"
                      }`}
                    >
                      {label}
                      {count != null && (
                        <span className="text-gray-400 font-normal">
                          {" "}
                          ({count})
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>

            {filteredItems.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-[12.5px] font-semibold text-[#1861BF] hover:underline pt-1"
              >
                {showAll ? "Show less" : "View More"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const experienceOptions = [
    { id: "0-1", name: "Fresher (0-1 yr)" },
    { id: "1-3", name: "1-3 years" },
    { id: "3-5", name: "3-5 years" },
    { id: "5-10", name: "5-10 years" },
    { id: "10+", name: "10+ years" },
  ];

  const salaryOptions = [
    { id: "0-3000", name: "AED 0 - 3,000" },
    { id: "3000-7000", name: "AED 3,000 - 7,000" },
    { id: "7000-15000", name: "AED 7,000 - 15,000" },
    { id: "25000+", name: "AED 25,000+" },
  ];

  const workModes = [
    { id: "remote", name: "Remote" },
    { id: "on-site", name: "On-site" },
    { id: "hybrid", name: "Hybrid" },
  ];

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${compact ? "sticky top-20" : ""}`}
    >
      <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#FF6E04]" /> All Filters
        </h2>
        {getTotalActiveFilters() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-[12px] font-semibold text-[#1861BF] hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="px-4 pb-1 max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
        <FilterSection
          title="Work Mode"
          items={workModes}
          category="workMode"
          icon={Clock}
        />
        <FilterSection
          title="Experience"
          items={experienceOptions}
          category="experience"
          icon={Briefcase}
        />
        <FilterSection
          title="Monthly Salary"
          items={salaryOptions}
          category="salary"
          icon={DollarSign}
        />
        <FilterSection
          title="Job Category"
          items={options.categories}
          category="category"
          icon={Grid}
          labelKey="name"
          idKey="_id"
        />
        {options.subCategories.length > 0 && (
          <FilterSection
            title="Sub Category"
            items={options.subCategories}
            category="subCategory"
            icon={Layers}
            labelKey="name"
            idKey="value"
          />
        )}
        <FilterSection
          title="Sector"
          items={jobFilters?.industries || []}
          category="sector"
          icon={Briefcase}
        />
        <FilterSection
          title="Language"
          items={options.languages}
          category="language"
          icon={Globe}
          labelKey="name"
          idKey="value"
        />
        <FilterSection
          title="Location"
          items={options.cities}
          category="location"
          icon={MapPin}
          labelKey="name"
          idKey="_id"
        />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <button
          onClick={handleApply}
          className="w-full py-2.5 bg-[#FF6E04] hover:bg-[#e66304] text-white text-[13px] font-bold rounded-md transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default JobFilters;
