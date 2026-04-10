import { get_categories, get_subCategories } from "@/api/Categories";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const BusinessListingCategories = ({ categories }) => {
  const [currentView, setCurrentView] = useState("categories"); // 'categories' or 'subcategories'
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSubCategories = async (categoryId, categoryName) => {
    setLoading(true);
    try {
      const res = await get_subCategories(categoryId);
      console.log("sub categories :", res);

      // Normalize to array regardless of response shape
      const subCatsArray = Array.isArray(res)
        ? res
        : res?.data
          ? res.data
          : res?.subCategories
            ? res.subCategories
            : [];

      if (subCatsArray.length > 0) {
        setSubCategories(subCatsArray); // Always an array now
        setCurrentView("subcategories");
      } else {
        window.location.href = `/dashboard/listing-forms?category=${categoryId}&categoryName=${encodeURIComponent(categoryName)}`;
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      window.location.href = `/dashboard/listing-forms?category=${categoryId}&categoryName=${encodeURIComponent(categoryName)}`;
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    console.log("category data ", category);
    setSelectedCategory(category);
    fetchSubCategories(category._id, category.slug);
  };

  const handleBackToCategories = () => {
    setCurrentView("categories");
    setSubCategories([]);
    setSelectedCategory(null);
    setSearchQuery("");
  };

  // Filter categories based on search query
  const filteredCategories = categories?.filter((category) =>
    category?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filter subcategories based on search query
  const filteredSubCategories = subCategories?.filter((subCategory) =>
    subCategory?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderCategories = () => (
    <>
      <div className="flex justify-between items-center  px-5 gap-3 w-full">
        <h5 className="font-semibold text-[#323232]">Choose Your Category</h5>

        {/* Search Bar */}
        <div className="relative my-3.5">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <section className="p-5 grid 2xl:grid-cols-4 md:grid-cols-3 gap-4">
        {filteredCategories?.length > 0 ? (
          filteredCategories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category)}
              className="cursor-pointer"
            >
              <div className="flex items-center bg-white justify-between gap-2 xl:gap-5 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100 hover:border-gray-200">
                <div
                  className="flex-shrink-0 w-8 h-8 xl:scale-130 flex items-center justify-center"
                  dangerouslySetInnerHTML={{
                    __html: category?.iconSvg
                      ?.replace(/width="[^"]*"/g, 'width="25"')
                      .replace(/height="[^"]*"/g, 'height="25"'),
                  }}
                />
                <span className="text-gray-800 font-medium max-md:text-[13px] text-sm md:text-base">
                  {category?.name}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No categories found matching &quot;{searchQuery}&quot;
          </div>
        )}
      </section>
    </>
  );

  const renderSubCategories = () => (
    <>
      <div className="flex flex-col px-5 gap-3 w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToCategories}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
          >
            ← Back to Categories
          </button>

          <h5 className="font-semibold text-[#323232]">
            Choose Subcategory for {selectedCategory?.name}
          </h5>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search subcategories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="p-5 grid 2xl:grid-cols-4 md:grid-cols-3 gap-4">
        {filteredSubCategories?.length > 0 ? (
          filteredSubCategories.map((subCategory, index) => (
            <Link
              key={index}
              href={{
                pathname: "/dashboard/listing-forms",
                query: {
                  category: selectedCategory?._id,
                  categoryName: selectedCategory?.slug,
                  subCategory: subCategory?._id,
                  subCategoryName: subCategory?.slug,
                },
              }}
            >
              <div className="flex items-center bg-white justify-between gap-2 xl:gap-5 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100 hover:border-gray-200">
                <div
                  className="flex-shrink-0 w-8 h-8 xl:scale-130 flex items-center justify-center"
                  dangerouslySetInnerHTML={{
                    __html: subCategory?.svg_code
                      ?.replace(/width="[^"]*"/g, 'width="25"')
                      .replace(/height="[^"]*"/g, 'height="25"'),
                  }}
                />
                <span className="text-gray-800 font-medium max-md:text-[13px] text-sm md:text-base">
                  {subCategory?.name}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No subcategories found matching &quot;{searchQuery}&quot;{" "}
          </div>
        )}
      </section>
    </>
  );

  const renderLoading = () => (
    <>
      <div className="flex px-5 justify-between items-center w-full">
        <h5 className="font-semibold text-[#323232]">Loading...</h5>
      </div>
      <section className="p-5 flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </section>
    </>
  );

  return (
    <>
      {loading && renderLoading()}
      {!loading && currentView === "categories" && renderCategories()}
      {!loading && currentView === "subcategories" && renderSubCategories()}
    </>
  );
};

export default BusinessListingCategories;
