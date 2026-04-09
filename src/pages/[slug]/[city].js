"use client";
import { useAuth } from "@/context/AuthContext";
import BusinessCardSkeleton from "@/components/BusinessListingComponents/BusinessCardSkeleton";
import BreadCrumbs from "@/components/BreadCrumbs";
import BusinessCard from "@/components/BusinessListingComponents/BusinessCard";
import RightBusinessCard from "@/components/BusinessListingComponents/RightBusinessCard";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Head from "next/head";
import { APP_URL, BASE_URL } from "@/services/constants";
import FilterBar from "@/components/BusinessListingComponents/FilterBar";
import Header from "@/layout/header";
import MobileFooter from "@/components/MobileFooter";
import axios from "axios";

const SearchResults = () => {
  const router = useRouter();
  const { city: globalCity } = useAuth();
  const { slug } = router.query;

  const cityName =
    typeof globalCity === "string" ? globalCity : globalCity?.name || "";

  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [dynamicFilters, setDynamicFilters] = useState({
    facilities: [],
    services: [],
    courses: [],
    paymentModes: [],
  });
  const [filters, setFilters] = useState({
    sort_by: null,
    ag_verified: false,
    facilities_id: [],
    services_id: [],
    courses_id: [],
    payment_mode_id: [],
    search: "",
  });

  const hasFetchedFilters = useRef(false);

  const hasActiveFilters =
    filters.sort_by !== null ||
    filters.ag_verified !== false ||
    filters.facilities_id.length > 0 ||
    filters.services_id.length > 0 ||
    filters.courses_id.length > 0 ||
    filters.payment_mode_id.length > 0 ||
    filters.search.length > 0;

  const handleReset = () => {
    setSearchInput("");
    setFilters({
      sort_by: null,
      ag_verified: false,
      facilities_id: [],
      services_id: [],
      courses_id: [],
      payment_mode_id: [],
      search: "",
    });
  };

  // ── BUILD QUERY PARAMS from filters ──
  const buildQueryParams = (extraPage = 1) => {
    const params = new URLSearchParams();
    params.set("page", extraPage);
    params.set("limit", "10");

    if (filters.sort_by) params.set("sort_by", filters.sort_by);
    if (filters.ag_verified) params.set("ag_verified", "true");
    if (filters.search?.trim()) params.set("search", filters.search.trim());
    if (filters.facilities_id.length > 0)
      params.set("facilities_id", filters.facilities_id.join(","));
    if (filters.services_id.length > 0)
      params.set("services_id", filters.services_id.join(","));
    if (filters.courses_id.length > 0)
      params.set("courses_id", filters.courses_id.join(","));
    if (filters.payment_mode_id.length > 0)
      params.set("payment_mode_id", filters.payment_mode_id.join(","));

    return params.toString();
  };

  // Debounce search — waits 500ms after user stops typing then fires API
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── FETCH CATEGORY FEATURES ──
  useEffect(() => {
    if (!router.isReady || !slug || hasFetchedFilters.current) return;
    hasFetchedFilters.current = true;

    const fetchCategoryFeatures = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/business-listing/features/${slug}`,
        );
        const data = res?.data?.data;
        setDynamicFilters({
          facilities:
            data?.features?.facilities?.map((f) => ({
              id: f._id,
              name: f.name,
            })) || [],
          services:
            data?.features?.services?.map((s) => ({
              id: s._id,
              name: s.name,
            })) || [],
          courses:
            data?.features?.courses?.map((c) => ({
              id: c._id,
              name: c.name,
            })) || [],
          paymentModes:
            data?.payment_modes?.map((p) => ({ id: p._id, name: p.name })) ||
            [],
        });
      } catch (err) {
        console.error("categoryFeatures error:", err);
      }
    };

    fetchCategoryFeatures();
  }, [router.isReady, slug]);

  // ── REDIRECT WHEN GLOBAL CITY CHANGES ──
  useEffect(() => {
    if (!router.isReady || !slug || !cityName) return;
    const newCitySlug = cityName.toLowerCase().replace(/\s+/g, "-");
    const categorySlug = slug.toLowerCase().replace(/\s+/g, "-");
    const expectedPath = `/${categorySlug}/${newCitySlug}`;
    if (router.asPath.split("?")[0] !== expectedPath) {
      router.replace({ pathname: expectedPath });
    }
  }, [cityName, router.isReady, slug]);

  // ── FETCH LISTINGS ──
  useEffect(() => {
    if (!router.isReady || !slug || !cityName) return;

    const citySlug = cityName
      .toLowerCase()
      .replace(/\(.*\)/, "")
      .replace(/\s+/g, "-");

    const fetchListings = async () => {
      try {
        setIsLoading(true);
        setError(false);
        setListings([]);
        setPageData(null);

        const query = buildQueryParams(1);
        const res = await axios.get(
          `http://localhost:5001/business-listing/get-listing-by-category-and-city/${slug}/${citySlug}?${query}`,
        );

        const data = res?.data?.data;
        setListings(data?.listings || []);
        setPageData(data?.pagination || null);
      } catch (err) {
        console.error("Listings fetch error:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [router.isReady, slug, cityName, filters]);

  // ── LOAD MORE ──
  const handleLoadMore = async () => {
    if (!pageData?.hasMore || isLoadingMore) return;

    const citySlug = cityName
      .toLowerCase()
      .replace(/\(.*\)/, "")
      .replace(/\s+/g, "-");

    try {
      setIsLoadingMore(true);
      const query = buildQueryParams(pageData.nextPage);
      const res = await axios.get(
        `http://localhost:5001/business-listing/get-listing-by-category-and-city/${slug}/${citySlug}?${query}`,
      );
      const data = res?.data?.data;
      if (data?.listings?.length) {
        setListings((prev) => [...prev, ...data.listings]);
        setPageData(data.pagination);
      }
    } catch (err) {
      console.error("Load more failed:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const canonicalSlug = slug || "";
  const canonicalCity = cityName || "";

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load listings</p>
          <button
            onClick={() => router.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="md:hidden">
        <Header />
      </section>

      <Head>
        <title>{`Top ${canonicalSlug} in ${canonicalCity} | Best ${canonicalSlug} Listings`}</title>
        <meta
          name="description"
          content={`Find the best ${canonicalSlug} in ${canonicalCity}. Browse verified business listings, reviews, contact information, and more.`}
        />
        <meta
          name="keywords"
          content={`${canonicalSlug}, best ${canonicalSlug} in ${canonicalCity}, top ${canonicalSlug}, ${canonicalCity} business listings`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`${APP_URL}/${canonicalSlug.toLowerCase().replace(/\s+/g, "-")}/${canonicalCity.toLowerCase().replace(/\s+/g, "-")}`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Top ${canonicalSlug} in ${canonicalCity} | Business Listings`}
        />
        <meta
          property="og:description"
          content={`Looking for the best ${canonicalSlug} in ${canonicalCity}? Visit our platform to explore verified listings and choose the right one.`}
        />
        <meta
          property="og:url"
          content={`${APP_URL}/${canonicalSlug.toLowerCase().replace(/\s+/g, "-")}/${canonicalCity.toLowerCase().replace(/\s+/g, "-")}`}
        />
        <meta property="og:site_name" content="Your Website Name" />
        <meta
          property="og:image"
          content={`${APP_URL}/seo/default-og-image.jpg`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Top ${canonicalSlug} in ${canonicalCity} | Business Listings`}
        />
        <meta
          name="twitter:description"
          content={`Checkout the top ${canonicalSlug} available in ${canonicalCity}. Explore business listings, ratings, and contact details.`}
        />
        <meta
          name="twitter:image"
          content={`${APP_URL}/seo/default-og-image.jpg`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: `Top ${canonicalSlug} in ${canonicalCity}`,
              url: `${APP_URL}/${canonicalSlug}/${canonicalCity}`,
              numberOfItems: listings?.length || 0,
              itemListElement: listings?.map((item, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: item?.name,
                url: `${APP_URL}/listing/${item?.slug}`,
              })),
            }),
          }}
        />
      </Head>

      <div className="h-auto flex flex-col max-md:mt-1.5 items-center overflow-hidden justify-center bg-[#F8F7F7]">
        <div className="flex flex-col min-md:w-[80%] max-md:min-w-full bg-white md:px-3 mx-auto md:pb-20 pr-2">
          <div className="mt-6 max-md:ml-2.5 md:mb-2">
            <BreadCrumbs
              slug={canonicalSlug}
              city={canonicalCity}
              length={pageData?.total}
              name="business listings"
            />
          </div>

          <h1 className="font-bold text-xl mt-2 capitalize max-md:hidden mb-3">
            Top {listings?.[0]?.category?.name || canonicalSlug} in{" "}
            {canonicalCity}
          </h1>

          <FilterBar
            hasActiveFilters={hasActiveFilters}
            handleReset={handleReset}
            dynamicFilters={dynamicFilters}
            filters={filters}
            searchInput={searchInput}
            onSearchChange={(val) => setSearchInput(val)}
            onFilterChange={(updatedFilters) =>
              setFilters((prev) => ({ ...prev, ...updatedFilters }))
            }
          />

          <div className="flex w-full gap-4">
            <div className="flex flex-col my-2 md:my-4 gap-2 w-full max-md:mb-32">
              <div className="bg-white w-full rounded-lg pl-2">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <BusinessCardSkeleton key={i} />
                  ))
                ) : listings.length === 0 ? (
                  <div className="flex justify-center items-center">
                    <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 w-full bg-white text-center px-4">
                      <div className="w-40 h-40 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-20 w-20 text-orange-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75h.008v.008H9.75V9.75zm4.5 0h.008v.008h-.008V9.75zm-4.5 4.5h.008v.008H9.75v-.008zm4.5 0h.008v.008h-.008v-.008zM3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        No Listings Found
                      </h2>
                      <p className="text-gray-500 max-w-md mb-6">
                        We couldn&apos;t find any listings matching your search.
                        Try adjusting your filters or check back later.
                      </p>
                      <Link
                        href="/"
                        className="bg-orange-500 hover:bg-orange-600 capitalize text-white px-6 py-2 rounded-lg shadow transition-all"
                      >
                        Go to Home
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {listings.map((item, index) => (
                      <BusinessCard key={item._id || index} data={item} />
                    ))}
                    {isLoadingMore &&
                      Array.from({ length: 2 }).map((_, i) => (
                        <BusinessCardSkeleton key={`more-${i}`} />
                      ))}
                  </>
                )}
              </div>

              {pageData?.hasMore && (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="text-orange-500 max-md:ml-3 capitalize border border-orange-500 px-1.5 py-1 max-w-25 md:mx-auto rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {isLoadingMore ? "Loading..." : "Load more"}
                </button>
              )}
            </div>

            <div className="mt-4 max-md:hidden">
              <RightBusinessCard name={canonicalSlug} />
            </div>
          </div>
        </div>
      </div>

      <MobileFooter />
    </>
  );
};

export default SearchResults;
