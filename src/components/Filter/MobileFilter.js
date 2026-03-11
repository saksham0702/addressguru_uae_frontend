import { useState } from "react";
import { X, ChevronDown } from "lucide-react";

export default function MobileFilter({ onClose }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);
  const [agVerified, setAgVerified] = useState(false);
  const [quickResponse, setQuickResponse] = useState(false);
  const [topRated, setTopRated] = useState(false);

  const categories = ["Education", "Health", "Technology", "Science"];
  const sortOptions = ["Newest", "Oldest"];
  const genderOptions = ["Male", "Female", "Other"];
  const managerOptions = ["Admin", "User", "Team Lead", "Manager"];

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const applyFilters = () => {
    setIsOpen(false);
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedSort(null);
    setSelectedGender(null);
    setSelectedManager(null);
    setAgVerified(false);
    setQuickResponse(false);
    setTopRated(false);
  };

  return (
    <div className="min-h-screen absolute bg-gray-50 p-4">
      <div className="fixed inset-0 bg-black/40 z-50">
        <div className="absolute inset-0" onClick={onClose} />

        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Categories */}
            <div>
              <button
                onClick={() => toggleDropdown("categories")}
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                  selectedCategory
                    ? "border-2 border-orange-500 text-orange-500 bg-orange-50"
                    : "border border-gray-200 text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg width="17" height="17" viewBox="0 0 19 19" fill="none">
                    <path
                      d="M6.86719 11.1083C7.41937 11.1083 7.8671 11.5561 7.86719 12.1083V17.9755C7.86717 18.5277 7.41941 18.9754 6.86719 18.9755H1C0.447773 18.9754 1.98582e-05 18.5277 0 17.9755V12.1083C8.85806e-05 11.5561 0.447816 11.1083 1 11.1083H6.86719ZM14.5547 11.1083C16.7271 11.1083 18.4882 12.8695 18.4883 15.0419C18.4883 17.2143 16.7271 18.9755 14.5547 18.9755C12.3824 18.9753 10.6211 17.2142 10.6211 15.0419C10.6211 12.8696 12.3824 11.1084 14.5547 11.1083ZM8.30566 0.460817C8.69899 -0.153916 9.59791 -0.153946 9.99121 0.460817L14.1465 6.95886C14.5722 7.62449 14.0938 8.49793 13.3037 8.49793H4.99316C4.20306 8.49793 3.72471 7.62449 4.15039 6.95886L8.30566 0.460817Z"
                      fill={selectedCategory ? "#FF6E04" : "#6B7280"}
                    />
                  </svg>
                  <span>{selectedCategory || "Categories"}</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    openDropdown === "categories" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown === "categories" && (
                <div className="mt-2 space-y-1.5 pl-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-4 py-2 rounded-lg text-sm text-left ${
                        selectedCategory === cat
                          ? "bg-orange-50 text-orange-500"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort By */}
            <div>
              <button
                onClick={() => toggleDropdown("sort")}
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                  selectedSort
                    ? "border-2 border-orange-500 text-orange-500 bg-orange-50"
                    : "border border-gray-200 text-gray-700"
                }`}
              >
                <span>
                  {selectedSort ? `Sort by: ${selectedSort}` : "Sort by"}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    openDropdown === "sort" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown === "sort" && (
                <div className="mt-2 space-y-1.5 pl-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedSort(option);
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-4 py-2 rounded-lg text-sm text-left ${
                        selectedSort === option
                          ? "bg-orange-50 text-orange-500"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Gender Status */}
            <div>
              <button
                onClick={() => toggleDropdown("gender")}
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                  selectedGender
                    ? "border-2 border-orange-500 text-orange-500 bg-orange-50"
                    : "border border-gray-200 text-gray-700"
                }`}
              >
                <span>
                  {selectedGender
                    ? `Gender: ${selectedGender}`
                    : "Gender Status"}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    openDropdown === "gender" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown === "gender" && (
                <div className="mt-2 space-y-1.5 pl-2">
                  {genderOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedGender(option);
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-4 py-2 rounded-lg text-sm text-left ${
                        selectedGender === option
                          ? "bg-orange-50 text-orange-500"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Managed By */}
            <div>
              <button
                onClick={() => toggleDropdown("manager")}
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                  selectedManager
                    ? "border-2 border-orange-500 text-orange-500 bg-orange-50"
                    : "border border-gray-200 text-gray-700"
                }`}
              >
                <span>
                  {selectedManager
                    ? `Managed by: ${selectedManager}`
                    : "Managed by"}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    openDropdown === "manager" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown === "manager" && (
                <div className="mt-2 space-y-1.5 pl-2">
                  {managerOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedManager(option);
                        setOpenDropdown(null);
                      }}
                      className={`w-full px-4 py-2 rounded-lg text-sm text-left ${
                        selectedManager === option
                          ? "bg-orange-50 text-orange-500"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AG Verified */}
            <button
              onClick={() => setAgVerified(!agVerified)}
              className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 justify-center ${
                agVerified
                  ? "border-2 border-orange-500 text-orange-500 bg-orange-50"
                  : "border border-gray-200 text-gray-700"
              }`}
            >
              <svg width="16" height="14" viewBox="0 0 19 14" fill="none">
                <path
                  d="M18.3796 1.15416C17.8276 0.605505 16.9313 0.605851 16.3786 1.15416L7.3727 10.0943L3.36998 6.12096C2.81727 5.57231 1.92134 5.57231 1.36863 6.12096C0.815925 6.66961 0.815925 7.55897 1.36863 8.10762L6.37182 13.0741C6.648 13.3482 7.01014 13.4857 7.37232 13.4857C7.73449 13.4857 8.09698 13.3486 8.37316 13.0741L18.3796 3.14078C18.9323 2.59251 18.9323 1.70277 18.3796 1.15416Z"
                  fill={agVerified ? "#FF6E04" : "#6B7280"}
                />
              </svg>
              AG Verified
            </button>

            {/* Quick Response */}
            <button
              onClick={() => setQuickResponse(!quickResponse)}
              className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 justify-center ${
                quickResponse
                  ? "border-2 border-orange-500 text-orange-500 bg-orange-50"
                  : "border border-gray-200 text-gray-700"
              }`}
            >
              <svg width="20" height="18" viewBox="0 0 27 23" fill="none">
                <path
                  d="M11.1494 13.2955C11.1671 11.6887 12.6157 10.5629 14.2262 10.9035C14.3472 10.9295 14.4979 10.9221 14.6086 10.8709C18.1153 9.26039 21.6182 7.64244 25.122 6.02635C25.2141 5.98355 25.3063 5.94168 25.4012 5.90353C25.6635 5.79747 25.8887 5.86074 26.0254 6.07566C26.1473 6.26732 26.1157 6.5241 25.9138 6.69437C25.6942 6.87951 25.4542 7.04047 25.2207 7.20794C22.2295 9.35994 19.2364 11.5101 16.2489 13.6658C16.1503 13.7374 16.0647 13.8621 16.0284 13.9793C15.6804 15.1126 14.6914 15.8336 13.5284 15.7862C12.3654 15.7396 11.4369 14.9395 11.2006 13.7728C11.168 13.6183 11.1652 13.4555 11.1494 13.2955Z"
                  fill={quickResponse ? "#FF6E04" : "#6B7280"}
                />
              </svg>
              Quick Response
            </button>

            {/* Top Rated */}
            <button
              onClick={() => setTopRated(!topRated)}
              className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 justify-center ${
                topRated
                  ? "border-2 border-orange-500 text-orange-500 bg-orange-50"
                  : "border border-gray-200 text-gray-700"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
                <path
                  d="M2.01072 7.1024C2.12961 7.1024 2.24803 7.1024 2.36691 7.1024C4.3637 7.10517 6.36049 7.10701 8.35775 7.11345C8.45985 7.11391 8.49994 7.07709 8.52885 6.98872C8.81324 6.10965 9.09949 5.23104 9.38668 4.35289C9.70371 3.38362 10.0221 2.4148 10.3396 1.44598C10.3858 1.3056 10.4305 1.16523 10.4846 1C10.5135 1.04234 10.5322 1.06029 10.5392 1.08192C10.893 2.16028 11.2469 3.23864 11.5989 4.31746C11.8879 5.20297 12.176 6.08894 12.4614 6.9763C12.4949 7.08031 12.5471 7.11437 12.659 7.11391C14.722 7.10747 16.785 7.10563 18.848 7.10333C18.896 7.10333 18.9441 7.10793 19 7.13738C18.8802 7.22437 18.7608 7.31228 18.6401 7.39834L10.6198 13.3074C10.5336 13.2453 10.4776 13.2333 10.3802 13.3038L5.35021 16.9319C5.3199 16.954 5.2868 16.9728 5.23086 16.9807C5.26722 16.8638 5.30219 16.7464 5.34042 16.6304L7.20714 10.9956C7.23464 10.9151 7.22345 10.8741 7.15352 10.8244L2.13474 7.2414C2.08858 7.20826 2.04476 7.17236 2 7.13784C2.00373 7.12588 2.00746 7.11391 2.01072 7.1024Z"
                  fill={topRated ? "#FF6E04" : "#6B7280"}
                />
              </svg>
              Top Rated
            </button>
          </div>

          <div className="border-t p-4 flex gap-3">
            <button
              onClick={resetFilters}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 px-4 py-3 border-2 border-orange-500 bg-orange-500 text-white rounded-lg font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
