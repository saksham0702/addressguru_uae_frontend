import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const AllCategoryPop = ({ data, showAllCategory, setShowAllCategory }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const { city } = useAuth();

  // Filter categories based on search term
  useEffect(() => {
    if (!data) return;
    const filtered = data
      ?.filter(
        (category) =>
          category?.iconSvg &&
          category?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      ?.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      );

    setFilteredCategories(filtered);
  }, [data, searchTerm]);
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowAllCategory(false);
      }
    };
    if (showAllCategory) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showAllCategory, setShowAllCategory]);
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowAllCategory(false);
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality is handled by useEffect above
  };
  if (!showAllCategory) return null;
  return (
    <div
      className="fixed inset-0 backdrop-blur-xs z-50 flex justify-start"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white h-full max-md:w-full md:w-[85%] transform transition-transform duration-300 ease-in-out ${
          showAllCategory ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        {/* Header with search and close */}
        <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b md:px-10 border-gray-100 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="md:text-xl max-md:text-sm font-bold text-gray-800 whitespace-nowrap">
              All Categories
            </h2>

            {/* Smaller Search Bar */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
              <input
                placeholder="Search categories..."
                className="rounded-full w-full md:h-10 max-md:h-9 bg-transparent py-2 pl-4 pr-12 outline-none border-2 border-gray-200 text-sm hover:border-gray-300 focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-colors"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center h-6 w-6 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 19L14.7501 14.7425M17.1053 9.05263C17.1053 11.1883 16.2569 13.2365 14.7467 14.7467C13.2365 16.2569 11.1883 17.1053 9.05263 17.1053C6.91694 17.1053 4.86872 16.2569 3.35856 14.7467C1.8484 13.2365 1 11.1883 1 9.05263C1 6.91694 1.8484 4.86872 3.35856 3.35856C4.86872 1.8484 6.91694 1 9.05263 1C11.1883 1 13.2365 1.8484 14.7467 3.35856C16.2569 4.86872 17.1053 6.91694 17.1053 9.05263Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </form>

            <button
              onClick={() => setShowAllCategory(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="p-4 md:p-6">
          {searchTerm && (
            <p className="text-gray-600 mb-4 text-sm">
              {filteredCategories.length} categories found for `{searchTerm}`
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
            {filteredCategories?.map((category, index) => (
              <Link
                key={index}
                href={`/${category?.slug
                  ?.toLowerCase()
                  .replace(/\s+/g, "-")}/${city
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                onClick={() => setShowAllCategory(false)} // close popup
              >
                <div className="flex items-center justify-between max-w-60 gap-2 xl:gap-5 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 hover:shadow-sm border border-gray-100 hover:border-gray-200 cursor-pointer">
                  <span className="text-gray-800 font-medium max-md:text-[13px] text-sm md:text-base">
                    {category?.name}
                  </span>

                  <div
                    className="flex-shrink-0 w-8 h-8 xl:scale-130 flex items-center justify-center"
                    dangerouslySetInnerHTML={{
                      __html: category?.iconSvg
                        ?.replace(/width="[^"]*"/g, 'width="25"')
                        .replace(/height="[^"]*"/g, 'height="25"'),
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* No results message */}
          {searchTerm && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.09M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No categories found</p>
              <p className="text-gray-400 text-sm">
                Try searching with different keywords
              </p>
            </div>
          )}

          {/* Empty state when no data */}
          {!data ||
            (data.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No categories available</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AllCategoryPop;
