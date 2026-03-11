"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { searchData } from "@/api/search";

const MobileSearchBar = () => {
  const [slug, setSlug] = useState("");
  const { city } = useAuth();
  const router = useRouter();

  const handleSearch = async () => {
    if (!slug?.trim() || !city) return;

    try {
      const res = await searchData(slug, city);

      if (!res || res.status === false || !res.category) {
        console.warn("Invalid search response", res);
        return;
      }

      const categorySlug = res.category.toLowerCase().replace(/\s+/g, "-");
      const citySlug = city.toLowerCase().replace(/\s+/g, "-");

      router.push(`/${categorySlug}/${citySlug}`);
    } catch (error) {
      console.error("Search API failed:", error);
    }
  };

  return (
    <div className="bg-white md:hidden fixed z-30 w-full px-3 pb-1.5">
      <div className="border border-gray-300 shadow-sm rounded-md h-10 w-full  flex items-center justify-between px-1.5">
        {/* INPUT */}
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="What are you looking for?"
          className="text-xs font-semibold text-gray-600 w-full outline-none px-2"
        />

        {/* SEARCH BUTTON */}
        <button onClick={handleSearch} className="ml-2">
          <svg
            width="29"
            height="29"
            viewBox="0 0 29 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="29" height="29" rx="4" fill="#FF6E04" />
            <path
              d="M21.8424 21.8424L18.3754 18.3692M20.2967 13.7275C20.2967 15.4697 19.6046 17.1406 18.3726 18.3726C17.1406 19.6046 15.4697 20.2967 13.7275 20.2967C11.9852 20.2967 10.3143 19.6046 9.08229 18.3726C7.85032 17.1406 7.1582 15.4697 7.1582 13.7275C7.1582 11.9852 7.85032 10.3143 9.08229 9.08229C10.3143 7.85032 11.9852 7.1582 13.7275 7.1582C15.4697 7.1582 17.1406 7.85032 18.3726 9.08229C19.6046 10.3143 20.2967 11.9852 20.2967 13.7275Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MobileSearchBar;
