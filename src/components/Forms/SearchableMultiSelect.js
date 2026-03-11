import axios from "axios";
import { FaCross, FaXRay } from "react-icons/fa";

const { useState, useEffect } = require("react");

export const SearchableMultiSelect = ({ item, value, onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch skills when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      fetchSkills(debouncedSearchTerm);
    } else {
      setSkills([]);
    }
  }, [debouncedSearchTerm]);

  const fetchSkills = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.apilayer.com/skills?q=${query}`,
        {
          headers: {
            apikey: "lTEsmrbZZqpFYHz7ASNJg7nyouG0Lbve",
          },
        }
      );
      setSkills(response.data || []);
    } catch (err) {
      console.error("Error fetching skills:", err);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillSelect = (skill) => {
    if (!value.includes(skill)) {
      onChange([...value, skill]);
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleSkillRemove = (skillToRemove) => {
    onChange(value.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="relative">
      {/* Selected Skills Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleSkillRemove(skill)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                X
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Type to search skills..."
          className="border border-gray-200 w-full font-[500] rounded-lg p-2 pr-10"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-center text-gray-500">Loading...</div>
          ) : skills.length > 0 ? (
            skills.map((skill, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSkillSelect(skill)}
                className={`w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                  value.includes(skill) ? "bg-blue-50 text-blue-700" : ""
                }`}
                disabled={value.includes(skill)}
              >
                {skill}
                {value.includes(skill) && (
                  <span className="float-right text-blue-600">✓</span>
                )}
              </button>
            ))
          ) : searchTerm.trim() ? (
            <div className="p-3 text-center text-gray-500">No skills found</div>
          ) : (
            <div className="p-3 text-center text-gray-500">
              Start typing to search skills
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
