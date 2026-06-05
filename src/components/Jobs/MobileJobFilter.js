import React, { useState, useEffect } from "react";
import { X, Filter, ChevronRight, Check } from "lucide-react";
import { get_job_categories, get_languages } from "@/api/uae-job-listing";
import { getCities } from "@/api/uaeadminCities";

const experienceOptions = [
  { id: "0-1", name: "Fresher (0-1 yr)" }, { id: "1-3", name: "1-3 years" }, { id: "3-5", name: "3-5 years" }, { id: "5-10", name: "5-10 years" }, { id: "10+", name: "10+ years" },
];

const salaryOptions = [
  { id: "0-3000", name: "AED 0 - 3,000" }, { id: "3000-7000", name: "AED 3000 - 7,000" }, { id: "7000-15000", name: "AED 7,000 - 15,000" }, { id: "25000+", name: "AED 25,000+" },
];

const workModes = [{ id: "remote", name: "Remote" }, { id: "on-site", name: "On-site" }, { id: "hybrid", name: "Hybrid" }];
const genders = [{ id: "male", name: "Male" }, { id: "female", name: "Female" }, { id: "any", name: "Any" }];

const emptyFilters = {
  workMode: [], experience: [], salary: [], location: [], sector: [], jobType: [], category: [], language: [], gender: []
};

const MobileJobFilter = ({ jobFilters, onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("workMode");
  const [tempFilters, setTempFilters] = useState(emptyFilters);
  const [options, setOptions] = useState({ categories: [], languages: [], cities: [] });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetchOptions();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const fetchOptions = async () => {
    try {
      const [cats, langs, cityData] = await Promise.all([
        get_job_categories(), get_languages(), getCities()
      ]);
      setOptions({ categories: cats || [], languages: langs || [], cities: cityData?.data || [] });
    } catch (e) { console.log(e); }
  };

  const SECTIONS = [
    { key: "workMode", title: "Work Mode", static: workModes },
    { key: "category", title: "Category", data: options.categories, labelKey: "name", idKey: "_id" },
    { key: "sector", title: "Sector", data: jobFilters?.industries || [], labelKey: "name", idKey: "id" },
    { key: "language", title: "Language", data: options.languages, labelKey: "name", idKey: "value" },
    { key: "location", title: "Location", data: options.cities, labelKey: "name", idKey: "_id" },
    { key: "experience", title: "Experience", static: experienceOptions },
    { key: "salary", title: "Salary", static: salaryOptions },
    { key: "gender", title: "Gender", static: genders },
  ];

  const totalActive = Object.values(tempFilters).flat().length;

  const handleToggle = (category, id) => {
    setTempFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(id) ? prev[category].filter(v => v !== id) : [...prev[category], id]
    }));
  };

  const activeSectionData = SECTIONS.find(s => s.key === activeSection);
  const activeSectionItems = activeSectionData?.static || activeSectionData?.data || [];

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all">
        <Filter className="w-3.5 h-3.5 text-[#FF6E04]" strokeWidth={3} />
        Filter results
        {totalActive > 0 && <span className="bg-orange-500 w-4 h-4 rounded-full flex items-center justify-center text-[9px]">{totalActive}</span>}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 flex-shrink-0">
            <h2 className="text-sm font-black text-gray-900 tracking-tight uppercase">Advanced Filters</h2>
            <button onClick={() => setIsOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400"><X className="w-5 h-5" /></button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-[35%] bg-gray-50/50 overflow-y-auto border-r border-gray-50">
              {SECTIONS.map((section) => (
                <button key={section.key} onClick={() => setActiveSection(section.key)} className={`w-full text-left px-4 py-5 flex flex-col gap-1 relative ${activeSection === section.key ? "bg-white" : ""}`}>
                  {activeSection === section.key && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF6E04]" />}
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${activeSection === section.key ? "text-[#FF6E04]" : "text-gray-400"}`}>{section.title}</span>
                  {tempFilters[section.key]?.length > 0 && <span className="text-[9px] font-bold text-gray-500 leading-none">{tempFilters[section.key].length} selected</span>}
                </button>
              ))}
            </div>

            <div className="flex-1 bg-white overflow-y-auto p-6">
              <div className="space-y-2">
                {activeSectionItems.map((item) => {
                  const id = item.id || item._id || item.value || item.city;
                  const label = item.name || item.type || item.city || "";
                  const isSelected = tempFilters[activeSection]?.includes(id);
                  return (
                    <button key={id} onClick={() => handleToggle(activeSection, id)} className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl border-2 transition-all ${isSelected ? "border-[#FF6E04] bg-orange-50/20" : "border-gray-50 bg-gray-50/20"}`}>
                      <span className={`text-xs font-bold ${isSelected ? "text-gray-900" : "text-gray-600"}`}>{label}</span>
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? "bg-[#FF6E04] border-[#FF6E04]" : "border-gray-200 bg-white"}`}>
                        {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="px-6 py-6 border-t border-gray-50 grid grid-cols-2 gap-4 bg-white">
            <button onClick={() => setTempFilters(emptyFilters)} className="py-4 border-2 border-gray-100 text-gray-400 font-bold rounded-2xl text-[10px] uppercase tracking-widest">RESET ALL</button>
            <button onClick={() => { onApplyFilters(tempFilters); setIsOpen(false); }} className="py-4 bg-[#FF6E04] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-orange-500/20">APPLY</button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileJobFilter;