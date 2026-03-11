// import React, { useState } from "react";
// import FilterItem from "../BusinessListingComponents/FilterItem";
// import Image from "next/image";

// const Filters = ({ filters , selectedFilters , setSelectedFilters }) => {
//   console.log("filters", filters)
//   return (
//     <div className="border border-[#F5F5F5] rounded-xl  ">
//       {/* filter heading */}
//       <span className="bg-[#F5F5F5] flex gap-2 rounded-t-lg px-3 py-2 items-center">
//         <svg
//           width="16"
//           height="14"
//           viewBox="0 0 16 14"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M13.4668 12.622C13.1323 12.622 12.7979 12.6263 12.4638 12.6194C12.3516 12.6173 12.2977 12.6501 12.251 12.7584C11.8872 13.6 11.0172 14.0928 10.1035 13.9854C9.21963 13.8814 8.48292 13.1891 8.31849 12.3078C8.12471 11.2677 8.74576 10.2557 9.76989 9.94321C10.7578 9.64197 11.8367 10.1396 12.2493 11.0964C12.2989 11.2116 12.3555 11.2418 12.4737 11.2405C13.153 11.2349 13.8328 11.2345 14.5121 11.2397C14.8651 11.2423 15.1353 11.4874 15.1892 11.837C15.238 12.1525 15.0498 12.471 14.7387 12.5737C14.6338 12.6082 14.5168 12.6181 14.4055 12.6203C14.0922 12.6259 13.7793 12.622 13.4668 12.622Z"
//             fill="#5B5B5B"
//           />
//           <path
//             d="M1.70395 7.78055C1.37509 7.78055 1.04579 7.78357 0.716929 7.77969C0.301318 7.77451 -0.00553482 7.47499 7.57042e-05 7.08528C0.00525465 6.69945 0.306497 6.40813 0.714771 6.40554C1.38372 6.40166 2.05267 6.40166 2.72118 6.40684C2.839 6.4077 2.8977 6.37749 2.94776 6.26183C3.33575 5.36587 4.30465 4.86567 5.25498 5.06031C6.21309 5.25625 6.91052 6.10646 6.91527 7.08312C6.91958 8.06108 6.23985 8.90395 5.27268 9.11931C4.33399 9.32863 3.35129 8.83274 2.95596 7.93937C2.90115 7.81551 2.83943 7.77365 2.70737 7.77753C2.37333 7.78703 2.03842 7.78098 1.70395 7.78055Z"
//             fill="#5B5B5B"
//           />
//           <path
//             d="M11.0558 2.2462C11.0661 1.09518 11.9897 0.178933 13.1312 0.188428C14.2874 0.197922 15.2123 1.13229 15.1972 2.27641C15.1821 3.41837 14.2456 4.34022 13.1088 4.33159C11.9694 4.32296 11.0454 3.38427 11.0558 2.2462Z"
//             fill="#5B5B5B"
//           />
//           <path
//             d="M4.83226 2.94769C3.46286 2.94769 2.09303 2.94898 0.723626 2.94682C0.242847 2.94639 -0.0808376 2.55107 0.0205835 2.09834C0.0822993 1.8217 0.311899 1.61497 0.608826 1.57311C0.667089 1.56491 0.727079 1.56404 0.786205 1.56404C3.48746 1.56361 6.18871 1.56361 8.88997 1.56404C9.26458 1.56404 9.52482 1.72804 9.63013 2.02583C9.78938 2.47813 9.4631 2.94164 8.97369 2.94639C8.36991 2.952 7.76613 2.94812 7.16192 2.94812C6.38508 2.94769 5.60867 2.94769 4.83226 2.94769Z"
//             fill="#5B5B5B"
//           />
//           <path
//             d="M3.45544 12.622C2.55474 12.622 1.65403 12.6233 0.752894 12.6216C0.351957 12.6207 0.0740202 12.3989 0.0118728 12.0385C-0.0567483 11.641 0.238883 11.2664 0.644136 11.2401C0.724841 11.2349 0.805978 11.2379 0.886684 11.2379C2.64494 11.2379 4.40362 11.2375 6.16188 11.2384C6.53131 11.2384 6.81011 11.4421 6.8852 11.7627C6.99223 12.2189 6.66639 12.6181 6.17396 12.6211C5.44027 12.6259 4.70702 12.6224 3.97334 12.6224C3.80071 12.622 3.62807 12.622 3.45544 12.622Z"
//             fill="#5B5B5B"
//           />
//           <path
//             d="M11.7595 6.40487C12.671 6.40487 13.5825 6.40098 14.494 6.40659C14.9649 6.40961 15.2786 6.81012 15.175 7.25724C15.109 7.54122 14.8583 7.75571 14.5657 7.77686C14.5225 7.77988 14.4793 7.78074 14.4362 7.78074C12.6399 7.78074 10.8441 7.78117 9.04792 7.78074C8.64439 7.78074 8.37249 7.57488 8.30517 7.22444C8.22489 6.80839 8.52053 6.4217 8.94434 6.40918C9.34873 6.39753 9.75311 6.40487 10.1579 6.40487C10.6918 6.40444 11.2257 6.40487 11.7595 6.40487Z"
//             fill="#5B5B5B"
//           />
//         </svg>
//         <h2 className="text-sm font-semibold text-[#5B5B5B] ">Filters</h2>
//       </span>

//       <div className="h-auto p-2 uppercase text-md mt-2 ">
//         {/* searchbar */}

//         <div className="flex items-center w-[95%] h-7 text-[11px]  bg-gray-100 pl-4 py-2  rounded-full ">
//           <input
//             type="text"
//             placeholder="Search Marketplace"
//             className="flex-grow bg-transparent outline-none font-[500] max-w-35 pr-1 placeholder-gray-400"
//           />
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="2"
//             stroke="#f97316" // Tailwind's orange-500
//             className="relative  h-3.5 cursor-pointer"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
//             />
//           </svg>
//         </div>

//         <div className="  flex flex-col gap-2 mt-3">
//           {/* sort */}
//           <FilterItem label="sort By" hasDropdown={true} />
//           {/* location */}
//           <div className="font-[500] text-sm pl-2">
//             <p className="font-semibold">location</p>
//             <span className="capitalize">
//               <FilterItem label="Dehradun,India" hasDropdown={true} />
//             </span>
//             <span className="flex gap-2 py-2 items-center">
//               <input
//                 type="range"
//                 className="h-[1px] bg-orange-500 cursor-pointer ml-2 t w-[65%]"
//               />
//             </span>
//           </div>
//           {/* price min and max */}
//           <div className="font-[500] text-sm pl-2">
//             <p className="font-semibold">price</p>
//             <div className="flex items-center pl-1 gap-2 mt-3">
//               <input
//                 placeholder="MIN"
//                 type="text"
//                 className="bg-gray-200 border-none w-18 text-center  py-[5px] rounded-sm"
//               />

//               <p className="text-xs lowercase">to</p>
//               <input
//                 placeholder="MAX"
//                 type="text"
//                 className="bg-gray-200 border-none w-18 text-center  py-[5px] rounded-sm"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Categories section */}
//         <div className=" mt-7 pl-2">
//           <aside className="w-full  bg-white ">
//             <h2 className="text-sm font-semibold mb-3 uppercase">Categories</h2>
//             <ul className="">
//               {filters?.categories?.map(({ label, icon, active, name }) => (
//                 <li
//                   key={label}
//                   className={`flex items-center gap-2 py-2 pl-1 font-medium rounded-md text-[11px]  cursor-pointer transition ${
//                     active
//                       ? "bg-[#FFECDE] text-[#FF6E04]"
//                       : " hover:bg-orange-100"
//                   }`}
//                 >
//                   {/* <Image
//                     src={`/assets/Filter-icons/${icon}`}
//                     alt={label}
//                     width={500}
//                     height={500}
//                     className="w-5 h-5 "
//                   /> */}
//                   {name}
//                 </li>
//               ))}
//             </ul>
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Filters;

import React, { useState } from "react";

const Filters = ({ filters, selectedFilters, setSelectedFilters }) => {
  // Local state for temporary selections before applying
  const [tempCategories, setTempCategories] = useState([]);
  const [tempCities, setTempCities] = useState([]);
  const [showAllCities, setShowAllCities] = useState(false);

  // Handle category selection
  const handleCategoryToggle = (categoryId) => {
    setTempCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Handle city selection
  const handleCityToggle = (cityId) => {
    setTempCities((prev) => {
      if (prev.includes(cityId)) {
        return prev.filter((id) => id !== cityId);
      } else {
        return [...prev, cityId];
      }
    });
  };

  // Apply category filters
  const handleApplyCategories = () => {
    setSelectedFilters((prev) => ({
      ...prev,
      categories: tempCategories,
    }));
  };

  // Clear category filters
  const handleClearCategories = () => {
    setTempCategories([]);
    setSelectedFilters((prev) => ({
      ...prev,
      categories: [],
    }));
  };

  // Apply city filters
  const handleApplyCities = () => {
    setSelectedFilters((prev) => ({
      ...prev,
      cities: tempCities,
    }));
  };

  // Clear city filters
  const handleClearCities = () => {
    setTempCities([]);
    setSelectedFilters((prev) => ({
      ...prev,
      cities: [],
    }));
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setTempCategories([]);
    setTempCities([]);
    setSelectedFilters({
      categories: [],
      cities: [],
    });
  };

  // Get cities to display (sorted with selected ones first)
  const getCitiesToDisplay = () => {
    if (!filters?.cities) return [];

    const sortedCities = [...filters.cities].sort((a, b) => {
      const aSelected =
        tempCities.includes(a.id) || selectedFilters?.cities?.includes(a.id);
      const bSelected =
        tempCities.includes(b.id) || selectedFilters?.cities?.includes(b.id);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });

    return showAllCities ? sortedCities : sortedCities.slice(0, 10);
  };

  const hasAnyFilters =
    selectedFilters?.categories?.length > 0 ||
    selectedFilters?.cities?.length > 0;

  return (
    <div className="border border-[#F5F5F5] rounded-xl">
      {/* Filter heading */}
      <div className="bg-[#F5F5F5] flex justify-between items-center rounded-t-lg px-3 py-2">
        <span className="flex gap-2 items-center">
          <svg
            width="16"
            height="14"
            viewBox="0 0 16 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.4668 12.622C13.1323 12.622 12.7979 12.6263 12.4638 12.6194C12.3516 12.6173 12.2977 12.6501 12.251 12.7584C11.8872 13.6 11.0172 14.0928 10.1035 13.9854C9.21963 13.8814 8.48292 13.1891 8.31849 12.3078C8.12471 11.2677 8.74576 10.2557 9.76989 9.94321C10.7578 9.64197 11.8367 10.1396 12.2493 11.0964C12.2989 11.2116 12.3555 11.2418 12.4737 11.2405C13.153 11.2349 13.8328 11.2345 14.5121 11.2397C14.8651 11.2423 15.1353 11.4874 15.1892 11.837C15.238 12.1525 15.0498 12.471 14.7387 12.5737C14.6338 12.6082 14.5168 12.6181 14.4055 12.6203C14.0922 12.6259 13.7793 12.622 13.4668 12.622Z"
              fill="#5B5B5B"
            />
            <path
              d="M1.70395 7.78055C1.37509 7.78055 1.04579 7.78357 0.716929 7.77969C0.301318 7.77451 -0.00553482 7.47499 7.57042e-05 7.08528C0.00525465 6.69945 0.306497 6.40813 0.714771 6.40554C1.38372 6.40166 2.05267 6.40166 2.72118 6.40684C2.839 6.4077 2.8977 6.37749 2.94776 6.26183C3.33575 5.36587 4.30465 4.86567 5.25498 5.06031C6.21309 5.25625 6.91052 6.10646 6.91527 7.08312C6.91958 8.06108 6.23985 8.90395 5.27268 9.11931C4.33399 9.32863 3.35129 8.83274 2.95596 7.93937C2.90115 7.81551 2.83943 7.77365 2.70737 7.77753C2.37333 7.78703 2.03842 7.78098 1.70395 7.78055Z"
              fill="#5B5B5B"
            />
            <path
              d="M11.0558 2.2462C11.0661 1.09518 11.9897 0.178933 13.1312 0.188428C14.2874 0.197922 15.2123 1.13229 15.1972 2.27641C15.1821 3.41837 14.2456 4.34022 13.1088 4.33159C11.9694 4.32296 11.0454 3.38427 11.0558 2.2462Z"
              fill="#5B5B5B"
            />
            <path
              d="M4.83226 2.94769C3.46286 2.94769 2.09303 2.94898 0.723626 2.94682C0.242847 2.94639 -0.0808376 2.55107 0.0205835 2.09834C0.0822993 1.8217 0.311899 1.61497 0.608826 1.57311C0.667089 1.56491 0.727079 1.56404 0.786205 1.56404C3.48746 1.56361 6.18871 1.56361 8.88997 1.56404C9.26458 1.56404 9.52482 1.72804 9.63013 2.02583C9.78938 2.47813 9.4631 2.94164 8.97369 2.94639C8.36991 2.952 7.76613 2.94812 7.16192 2.94812C6.38508 2.94769 5.60867 2.94769 4.83226 2.94769Z"
              fill="#5B5B5B"
            />
            <path
              d="M3.45544 12.622C2.55474 12.622 1.65403 12.6233 0.752894 12.6216C0.351957 12.6207 0.0740202 12.3989 0.0118728 12.0385C-0.0567483 11.641 0.238883 11.2664 0.644136 11.2401C0.724841 11.2349 0.805978 11.2379 0.886684 11.2379C2.64494 11.2379 4.40362 11.2375 6.16188 11.2384C6.53131 11.2384 6.81011 11.4421 6.8852 11.7627C6.99223 12.2189 6.66639 12.6181 6.17396 12.6211C5.44027 12.6259 4.70702 12.6224 3.97334 12.6224C3.80071 12.622 3.62807 12.622 3.45544 12.622Z"
              fill="#5B5B5B"
            />
            <path
              d="M11.7595 6.40487C12.671 6.40487 13.5825 6.40098 14.494 6.40659C14.9649 6.40961 15.2786 6.81012 15.175 7.25724C15.109 7.54122 14.8583 7.75571 14.5657 7.77686C14.5225 7.77988 14.4793 7.78074 14.4362 7.78074C12.6399 7.78074 10.8441 7.78117 9.04792 7.78074C8.64439 7.78074 8.37249 7.57488 8.30517 7.22444C8.22489 6.80839 8.52053 6.4217 8.94434 6.40918C9.34873 6.39753 9.75311 6.40487 10.1579 6.40487C10.6918 6.40444 11.2257 6.40487 11.7595 6.40487Z"
              fill="#5B5B5B"
            />
          </svg>
          <h2 className="text-sm font-semibold text-[#5B5B5B]">Filters</h2>
        </span>

        {hasAnyFilters && (
          <button
            onClick={handleClearAllFilters}
            className="text-xs text-orange-500 font-medium hover:text-orange-600 transition"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="h-auto p-2 uppercase text-md mt-2">
        {/* Searchbar */}
        <div className="flex items-center w-[95%] h-7 text-[11px] bg-gray-100 pl-4 py-2 rounded-full">
          <input
            type="text"
            placeholder="Search Marketplace"
            className="flex-grow bg-transparent outline-none font-[500] max-w-35 pr-1 placeholder-gray-400"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="#f97316"
            className="relative h-3.5 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
            />
          </svg>
        </div>

        {/* Categories Section */}
        <div className="mt-6 pl-2">
          <h2 className="text-sm font-semibold mb-3">Categories</h2>
          <div className="space-y-1">
            {filters?.categories?.map((category) => {
              const isSelected =
                tempCities.length === 0
                  ? tempCategories.includes(category.id) ||
                    selectedFilters?.categories?.includes(category.id)
                  : tempCategories.includes(category.id);

              return (
                <label
                  key={category.id}
                  className={`flex items-center gap-2 py-1.5 pl-2 font-medium rounded-md text-[11px] cursor-pointer transition ${
                    isSelected
                      ? "bg-[#FFECDE] text-[#FF6E04]"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
                  />
                  <span>{category.name}</span>
                </label>
              );
            })}
          </div>

          {/* Category Action Buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleApplyCategories}
              disabled={tempCategories.length === 0}
              className={`flex-1 py-1.5 text-xs font-medium rounded border transition ${
                tempCategories.length === 0
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-orange-500 text-orange-500 hover:bg-orange-50"
              }`}
            >
              Apply
            </button>
            <button
              onClick={handleClearCategories}
              disabled={
                tempCategories.length === 0 &&
                (!selectedFilters?.categories ||
                  selectedFilters.categories.length === 0)
              }
              className={`flex-1 py-1.5 text-xs font-medium rounded border transition ${
                tempCategories.length === 0 &&
                (!selectedFilters?.categories ||
                  selectedFilters.categories.length === 0)
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-gray-400 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Cities Section */}
        <div className="mt-6 pl-2">
          <h2 className="text-sm font-semibold mb-3">Cities</h2>
          <div className="space-y-1">
            {getCitiesToDisplay().map((city) => {
              const isSelected =
                tempCategories.length === 0
                  ? tempCities.includes(city.id) ||
                    selectedFilters?.cities?.includes(city.id)
                  : tempCities.includes(city.id);

              return (
                <label
                  key={city.id}
                  className={`flex items-center gap-2 py-2 pl-2 font-medium rounded-md text-[11px] cursor-pointer transition ${
                    isSelected
                      ? "bg-[#FFECDE] text-[#FF6E04]"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCityToggle(city.id)}
                    className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
                  />
                  <span>{city.city}</span>
                </label>
              );
            })}
          </div>

          {/* See More/Less Button */}
          {filters?.cities?.length > 10 && (
            <button
              onClick={() => setShowAllCities(!showAllCities)}
              className="text-xs text-orange-500 font-medium mt-2 hover:text-orange-600 transition"
            >
              {showAllCities
                ? "See Less"
                : `See More (${filters.cities.length - 10} more)`}
            </button>
          )}

          {/* City Action Buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleApplyCities}
              disabled={tempCities.length === 0}
              className={`flex-1 py-1.5 text-xs font-medium rounded border transition ${
                tempCities.length === 0
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-orange-500 text-orange-500 hover:bg-orange-50"
              }`}
            >
              Apply
            </button>
            <button
              onClick={handleClearCities}
              disabled={
                tempCities.length === 0 &&
                (!selectedFilters?.cities ||
                  selectedFilters.cities.length === 0)
              }
              className={`flex-1 py-1.5 text-xs font-medium rounded border transition ${
                tempCities.length === 0 &&
                (!selectedFilters?.cities ||
                  selectedFilters.cities.length === 0)
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-gray-400 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
