import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
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
    experience: false,
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
      // if (onApplyFilters) onApplyFilters(updated); // Removed automatic call
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
      <div
        className={`border-b border-gray-100 last:border-0 ${compact ? "py-2" : "py-3"}`}
      >
        <button
          onClick={() => toggleSection(category)}
          className="flex items-center justify-between w-full group"
        >
          <div className="flex items-center gap-2">
            <div
              className={`rounded-md transition-colors ${hasActiveFilters ? "bg-orange-50 text-orange-600" : "bg-gray-50 text-gray-400"}`}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
            <h3
              className={`font-bold tracking-tight text-[11px] uppercase ${hasActiveFilters ? "text-gray-900" : "text-gray-500"}`}
            >
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            {hasActiveFilters && (
              <span className="w-4 h-4 bg-[#FF6E04] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {filters[category].length}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-gray-300" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
            )}
          </div>
        </button>

        {isExpanded && (
          <div className="mt-2 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
            {items.length > 6 && (
              <input
                type="text"
                placeholder={`Search...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1.5 text-[10px] bg-gray-50 border border-gray-100 rounded-md focus:bg-white outline-none mb-1"
              />
            )}

            <div className="space-y-1">
              {displayItems.map((item) => {
                const id =
                  item[idKey] || item.id || item._id || item.city || item.value;
                const label =
                  item[labelKey] || item.type || item.city || item.name || "";
                const isSelected = filters[category]?.includes(id);

                return (
                  <label
                    key={id}
                    className={`flex items-center group cursor-pointer px-1.5 py-1.5 rounded-lg transition-all ${isSelected ? "bg-orange-50/30" : "hover:bg-gray-50/50"}`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${isSelected ? "bg-[#FF6E04] border-[#FF6E04]" : "border-gray-200 bg-white"}`}
                    >
                      {isSelected && (
                        <X className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isSelected}
                      onChange={() => handleFilterChange(category, id)}
                    />
                    <span
                      className={`ml-2 text-[12px] font-semibold tracking-tight ${isSelected ? "text-orange-700" : "text-gray-900"}`}
                    >
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>

            {filteredItems.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-[10px] font-black text-orange-400 hover:text-orange-500 flex items-center gap-1 mt-1 uppercase tracking-tighter"
              >
                {showAll ? "Show less" : `+ ${filteredItems.length - 5} more`}
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
    { id: "3000-7000", name: "AED 3000 - 7,000" },
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
      className={`bg-white rounded-3xl border border-gray-100  overflow-hidden ${compact ? "sticky top-20" : ""}`}
    >
      <div className="p-5 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#FF6E04]" /> ADVANCED SEARCH
          </h2>
        </div>
        {getTotalActiveFilters() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-[10px] font-normal text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded-md"
          >
            RESET
          </button>
        )}
      </div>

      <div className="p-3 pt-0 max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
        <FilterSection
          title="Work Mode"
          items={workModes}
          category="workMode"
          icon={Clock}
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
      </div>

      <div className="p-4 bg-white border-t border-gray-50">
        <button
          onClick={handleApply}
          className="w-full py-3 bg-[#FF6E04] hover:bg-[#e66304] text-white text-[11px] font-black rounded-md transition-all   uppercase tracking-wider"
        >
          Apply Filters
        </button>
      </div>

      <div className="p-3 bg-gray-50/50 border-t border-gray-50">
        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest text-center">
          Verified by AddressGuru UAE
        </p>
      </div>
    </div>
  );
};

export default JobFilters;
