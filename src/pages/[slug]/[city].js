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
import FilterBar from "@/components/BusinessListingComponents/FilterBar";
import Header from "@/layout/header";
import MobileFooter from "@/components/MobileFooter";
import axios from "axios";
import Login from "@/components/UserLogin/Login";

const SearchResults = () => {
  const APP_URL = "https://addressguru.ae";
  const router = useRouter();
  const { city: globalCity } = useAuth();
  const { slug } = router.query;
  const [loginPop, setLoginPop] = useState(false);

  const cityName =
    typeof globalCity === "string" ? globalCity : globalCity?.name || "";

  const handleClose = () => setLoginPop(false);

  // ── API data (last fetched from server) ──
  const [apiListings, setApiListings] = useState([]);

  // ── Local filter overrides (null = show API data as-is) ──
  const [localFilters, setLocalFilters] = useState(null);

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

  // filters = what was last sent to the API
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

  // ── activeFilters: what FilterBar sees (local overrides take priority) ──
  const activeFilters = localFilters ?? filters;

  const hasActiveFilters =
    activeFilters.sort_by !== null ||
    activeFilters.ag_verified !== false ||
    activeFilters.facilities_id.length > 0 ||
    activeFilters.services_id.length > 0 ||
    activeFilters.courses_id.length > 0 ||
    activeFilters.payment_mode_id.length > 0 ||
    activeFilters.search.length > 0;

  // ── LOCAL FILTER FUNCTION ──
  // Runs client-side on apiListings — no network request
  const applyLocalFilters = (data, f) => {
    let result = [...data];

    if (f.search?.trim()) {
      const q = f.search.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.businessName?.toLowerCase().includes(q) ||
          item.name?.toLowerCase().includes(q)
      );
    }

    if (f.ag_verified) {
      result = result.filter((item) => item.ag_verified === true);
    }

    if (f.facilities_id?.length > 0) {
      result = result.filter((item) =>
        f.facilities_id.some((id) => item.facilities_id?.includes(id))
      );
    }

    if (f.services_id?.length > 0) {
      result = result.filter((item) =>
        f.services_id.some((id) => item.services_id?.includes(id))
      );
    }

    if (f.courses_id?.length > 0) {
      result = result.filter((item) =>
        f.courses_id.some((id) => item.courses_id?.includes(id))
      );
    }

    if (f.payment_mode_id?.length > 0) {
      result = result.filter((item) =>
        f.payment_mode_id.some((id) => item.payment_mode_id?.includes(id))
      );
    }

    if (f.sort_by === "newest") {
      result = result.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (f.sort_by === "oldest") {
      result = result.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    }

    return result;
  };

  // ── What actually gets rendered ──
  const listings = localFilters
    ? applyLocalFilters(apiListings, localFilters)
    : apiListings;

  // ── onFilterChange → clears local overrides, updates filters → hits API ──
  const handleFilterChange = (updatedFilters) => {
    setLocalFilters(null);
    setFilters((prev) => ({ ...prev, ...updatedFilters }));
  };

  // ── onFilterRemove → local only, no API ──
  const handleFilterRemove = (patch) => {
    setLocalFilters((prev) => ({
      ...(prev ?? filters),
      ...patch,
    }));
  };

  // ── handleReset → full reset, clears local overrides, hits API ──
  const handleReset = () => {
    setLocalFilters(null);
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

  // ── BUILD QUERY PARAMS from filters (API filters, not local) ──
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

  // ── Debounce search — waits 500ms then fires API ──
  useEffect(() => {
    const timer = setTimeout(() => {
      // Search input goes through API path (not local)
      setLocalFilters(null);
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
          `https://addressguru.ae/api/business-listing/features/${slug}`
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

  // ── FETCH LISTINGS → stores into apiListings, clears localFilters ──
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
        setApiListings([]);
        setLocalFilters(null); // clear local overrides whenever a fresh API call runs
        setPageData(null);

        const query = buildQueryParams(1);
        const res = await axios.get(
          `https://addressguru.ae/api/business-listing/get-listing-by-category-and-city/${slug}/${citySlug}?${query}`
        );

        const data = res?.data?.data;
        setApiListings(data?.listings || []);
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
        `https://addressguru.ae/api/business-listing/get-listing-by-category-and-city/${slug}/${citySlug}?${query}`
      );
      const data = res?.data?.data;
      if (data?.listings?.length) {
        setApiListings((prev) => [...prev, ...data.listings]);
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

  const seoTitle = listings[0]?.category?.seo?.title || null;
  const seoDescription = listings[0]?.category?.seo?.description || null;
  const seoOgImage = listings[0]?.category?.seo?.ogImage || null;

  const pageTitle =
    seoTitle ??
    `Top ${canonicalSlug} in ${canonicalCity} | Best ${canonicalSlug} Listings`;

  const pageDescription =
    seoDescription ??
    `Find the best ${canonicalSlug} in ${canonicalCity}. Browse verified business listings, reviews, contact information, and more.`;

  const pageKeywords = `${canonicalSlug}, best ${canonicalSlug} in ${canonicalCity}, top ${canonicalSlug}, ${canonicalCity} business listings`;

  const canonicalUrl = `${APP_URL}/${canonicalSlug
    .toLowerCase()
    .replace(/\s+/g, "-")}/${canonicalCity.toLowerCase().replace(/\s+/g, "-")}`;

  const rawOgImage = seoOgImage ?? "/seo/default-og-image.jpg";
  const absoluteOgImage = rawOgImage.startsWith("http")
    ? rawOgImage
    : `${APP_URL}${rawOgImage.startsWith("/") ? "" : "/"}${rawOgImage}`;

  const ogDescription =
    seoDescription ??
    `Looking for the best ${canonicalSlug} in ${canonicalCity}? Explore verified listings and find the right one.`;

  const twitterDescription =
    seoDescription ??
    `Checkout the top ${canonicalSlug} in ${canonicalCity}. Explore business listings, ratings, and contact details.`;

  return (
    <>
      <section className="md:hidden">
        <Header />
      </section>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="AddressGuru" />
        <meta property="og:image" content={absoluteOgImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={pageTitle} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={twitterDescription} />
        <meta name="twitter:image" content={absoluteOgImage} />
        <meta name="twitter:image:alt" content={pageTitle} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: pageTitle,
              url: canonicalUrl,
              numberOfItems: pageData?.total ?? listings.length,
              itemListElement: listings.map((item, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: item?.businessName ?? item?.name,
                url: `${APP_URL}/listing/${item?.slug}`,
              })),
            }),
          }}
        />
      </Head>

      <div className="h-auto flex flex-col max-md:mt-1.5 items-center overflow-hidden justify-center bg-[#F8F7F7]">
        <div className="flex flex-col min-md:w-[80%] max-md:min-w-full bg-white md:px-3 mx-auto md:pb-20 pr-2">
          {/* ads space */}
          <section className="h-[100px] md:w-[900px] border mt-2 mx-auto rounded-lg">
            <div className="h-full w-full text-lg tect-center flex justify-center items-center">
              <img
                src="/assets/ads-city-slug.jpeg"
                alt="ad1"
                className="h-full w-full"
              />
            </div>
          </section>

          <div className="mt-5 max-md:ml-2.5 md:mb-2">
            <BreadCrumbs
              slug={canonicalSlug}
              city={canonicalCity}
              length={pageData?.total}
              name="business listings"
            />
          </div>

          <h1 className="font-bold text-xl mt-2 capitalize max-md:hidden mb-3">
            Top {apiListings?.[0]?.category?.name || canonicalSlug} in{" "}
            {canonicalCity}
          </h1>

          <FilterBar
            hasActiveFilters={hasActiveFilters}
            handleReset={handleReset}
            dynamicFilters={dynamicFilters}
            filters={activeFilters}
            searchInput={searchInput}
            onSearchChange={(val) => setSearchInput(val)}
            onFilterChange={handleFilterChange}
            onFilterRemove={handleFilterRemove}
          />

          <div className="flex w-full gap-4">
            <div className="flex flex-col my-2 md:my-4 gap-2 w-full max-md:mb-32">
              <div className="bg-white w-full rounded-lg pl-2">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <BusinessCardSkeleton key={i} />
                  ))
                ) : listings.length === 0 ? (
                  <div className="flex justify-center items-center py-12 px-4">
                    <div className="flex flex-col items-center text-center max-w-md w-full">
                      {/* Icon */}
                      <div className="w-22 h-22 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center mb-6 p-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-orange-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                          />
                        </svg>
                      </div>

                      {/* City badge */}
                      <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-1 mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 text-orange-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                          />
                        </svg>
                        <span className="text-xs font-medium text-orange-600">
                          {globalCity}
                        </span>
                      </div>

                      {/* Heading */}
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Be the first to list your business here!
                      </h2>

                      {/* Description */}
                      <p className="text-sm text-gray-500 mb-1 leading-relaxed">
                        No listings yet in{" "}
                        <span className="font-medium text-gray-700">
                          {globalCity}
                        </span>{" "}
                        under{" "}
                        <span className="font-medium text-gray-700">
                          {slug}
                        </span>
                        .
                      </p>
                      <p className="text-sm text-gray-500 mb-7 leading-relaxed">
                        Get ahead of the competition — add your business and
                        start reaching local customers today.
                      </p>

                      {/* Buttons */}
                      <div className="flex flex-col gap-2.5 w-full max-w-xs">
                        <button
                          onClick={() => setLoginPop(true)}
                          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                          Post your ad
                        </button>
                      </div>

                      {/* Trust line */}
                      <p className="text-xs text-gray-400 mt-5">
                        Free to list &nbsp;·&nbsp; Reach local buyers
                        &nbsp;·&nbsp; Takes under 2 minutes
                      </p>
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

              {/* Only show Load More when no local overrides are active */}
              {!localFilters && pageData?.hasMore && (
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

      {loginPop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50">
          <div className="h-[60vh] w-xl m-auto top-0 flex fixed inset-0 z-50 rounded-xl bg-white">
            <div className="mt-2 relative w-full pl-2">
              <button
                onClick={handleClose}
                className="absolute right-3 border rounded-full border-orange-500 p-1 top-2 z-50 text-[#FF6E04]"
                aria-label="Close"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <Login setShowLogin={true} />
            </div>
          </div>
        </div>
      )}

      <MobileFooter />
    </>
  );
};

export default SearchResults;