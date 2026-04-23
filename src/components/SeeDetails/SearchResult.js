// components/SearchResults.jsx
// NOTE: No "use client" — that's App Router only. Pages Router doesn't use it.

import { useAuth } from "@/context/AuthContext";
import BusinessCardSkeleton from "@/components/BusinessListingComponents/BusinessCardSkeleton";
import BreadCrumbs from "@/components/BreadCrumbs";
import BusinessCard from "@/components/BusinessListingComponents/BusinessCard";
import RightBusinessCard from "@/components/BusinessListingComponents/RightBusinessCard";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import FilterBar from "@/components/BusinessListingComponents/FilterBar";
import Header from "@/layout/header";
import MobileFooter from "@/components/MobileFooter";
import axios from "axios";
import Login from "@/components/UserLogin/Login";
import InfoListSection from "@/components/BusinessListingComponents/InfoListSection";
import { get_seo_data } from "@/api/seoApi";
import SeoContent from "@/components/BusinessListingComponents/SeoContent";

const SearchResults = ({
  ssrListings = [],
  ssrPageData = null,
  ssrSeoContent = null,
  ssrFilters = null,
  ssrSlug = "",
  ssrCity = "",
}) => {
  const APP_URL = "https://addressguru.ae";
  const router = useRouter();
  const { city: globalCity, setCity } = useAuth();

  // ── SSR city is used immediately; context city takes over once loaded ──
  const cityName = globalCity || ssrCity;

  const { slug } = router.query;
  const canonicalSlug = slug || ssrSlug;
  const canonicalCity = cityName || ssrCity;

  const [loginPop, setLoginPop] = useState(false);
  const handleClose = () => setLoginPop(false);

  // ── Seed state from SSR data so first render is never empty ──
  const [apiListings, setApiListings] = useState(ssrListings);
  const [pageData, setPageData] = useState(ssrPageData);
  const [seoContent, setSeoContent] = useState(ssrSeoContent);

  // ── isLoading starts false because SSR already loaded page 1 ──
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [localFilters, setLocalFilters] = useState(null);
  const [dynamicFilters] = useState({
    facilities:
      ssrFilters?.facilities?.map((f) => ({ id: f._id, name: f.name })) || [],
    services:
      ssrFilters?.services?.map((s) => ({ id: s._id, name: s.name })) || [],
    courses:
      ssrFilters?.courses?.map((c) => ({ id: c._id, name: c.name })) || [],
    paymentModes:
      ssrFilters?.paymentModes?.map((p) => ({ id: p._id, name: p.name })) || [],
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
  useEffect(() => {
    setApiListings(ssrListings);
    setPageData(ssrPageData);
    setSeoContent(ssrSeoContent);
  }, [ssrListings, ssrPageData, ssrSeoContent]);

  const hasFetchedFilters = useRef(false);
  // ── Skip the very first client fetch since SSR already fetched page 1 ──
  const isFirstMount = useRef(true);

  // ── Sync URL city into context so rest of app stays in sync ──
  useEffect(() => {
    if (!ssrCity || !setCity) return;

    const formatted = ssrCity.charAt(0).toUpperCase() + ssrCity.slice(1);

    setCity(formatted); // ✅ always sync
  }, [ssrCity]);

  const matchIds = (itemArray = [], selectedIds = []) =>
    itemArray.some((entry) => {
      const id = typeof entry === "string" ? entry : entry?._id;
      return selectedIds.includes(id);
    });

  const activeFilters = localFilters ?? filters;

  const hasActiveFilters =
    activeFilters.sort_by !== null ||
    activeFilters.ag_verified !== false ||
    activeFilters.facilities_id.length > 0 ||
    activeFilters.services_id.length > 0 ||
    activeFilters.courses_id.length > 0 ||
    activeFilters.payment_mode_id.length > 0 ||
    activeFilters.search.length > 0;

  const applyLocalFilters = (data, f) => {
    let result = [...data];
    if (f.search?.trim()) {
      const q = f.search.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.businessName?.toLowerCase().includes(q) ||
          item.name?.toLowerCase().includes(q),
      );
    }
    if (f.ag_verified)
      result = result.filter((item) => item.isVerified === true);
    if (f.facilities_id?.length > 0)
      result = result.filter((item) =>
        matchIds(item.facilities, f.facilities_id),
      );
    if (f.services_id?.length > 0)
      result = result.filter((item) => matchIds(item.services, f.services_id));
    if (f.courses_id?.length > 0)
      result = result.filter((item) => matchIds(item.courses, f.courses_id));
    if (f.payment_mode_id?.length > 0)
      result = result.filter((item) =>
        matchIds(item.paymentModes, f.payment_mode_id),
      );
    if (f.sort_by === "newest")
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (f.sort_by === "oldest")
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return result;
  };

  const listings = localFilters
    ? applyLocalFilters(apiListings, localFilters)
    : apiListings;

  const handleFilterChange = (updatedFilters) => {
    setLocalFilters(null);
    setFilters((prev) => ({ ...prev, ...updatedFilters }));
  };

  const isFiltersEmpty = (f) =>
    f.sort_by === null &&
    f.ag_verified === false &&
    f.facilities_id.length === 0 &&
    f.services_id.length === 0 &&
    f.courses_id.length === 0 &&
    f.payment_mode_id.length === 0 &&
    f.search.length === 0;

  const handleFilterRemove = (patch) => {
    const merged = { ...(localFilters ?? filters), ...patch };
    if (isFiltersEmpty(merged)) handleReset();
    else setLocalFilters(merged);
  };

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

  // ── Debounce search ──
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalFilters(null);
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ── Redirect when global city changes ──
  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query.slug || !router.query.city) return;
    if (!cityName) return;

    const newCitySlug = cityName.toLowerCase().replace(/\s+/g, "-");
    const currentCity = router.query.city;

    // ✅ Only push if actually different
    if (currentCity !== newCitySlug) {
      router.push(`/${router.query.slug}/${newCitySlug}`);
    }
  }, [cityName, router.isReady]);

  // ── Load more ──
  const handleLoadMore = async () => {
    if (!pageData?.hasMore || isLoadingMore) return;

    try {
      setIsLoadingMore(true);

      const currentSlug = router.query.slug;
      const currentCity = router.query.city;

      const res = await axios.get(
        `https://addressguru.ae/api/business-listing/get-listing-by-category-and-city/${currentSlug}/${currentCity}?page=${pageData.nextPage}&limit=5`,
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

  // ── SEO values — built from SSR data so they are ALWAYS available on first render ──
  const seoTitle = ssrListings[0]?.category?.seo?.title || null;
  const seoDescription = ssrListings[0]?.category?.seo?.description || null;
  const seoOgImage = ssrListings[0]?.category?.seo?.ogImage || null;

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

  const rawOgImage = seoOgImage ?? "/home-og-image.jpg";
  const absoluteOgImage = rawOgImage.startsWith("http")
    ? rawOgImage
    : `https://addressguru.ae/api${rawOgImage.startsWith("/") ? "" : "/"}${rawOgImage}`;

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

      {/* 
        ✅ Because this component is rendered on the SERVER first via getServerSideProps,
        all these tags will be in the HTML that Google/crawlers and Ctrl+U see.
      */}
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
              numberOfItems: ssrPageData?.total ?? ssrListings.length,
              itemListElement: ssrListings.map((item, i) => ({
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
          <section className="h-[100px] md:w-[900px] border mt-2 mx-auto rounded-lg">
            <div className="h-full w-full text-lg tect-center flex justify-center items-center">
              <img
                src="/assets/ads-city-slug.jpeg"
                alt="ad1"
                className="h-full w-full"
              />
            </div>
          </section>

          <div className="mt-3 max-md:ml-2.5 ">
            <BreadCrumbs
              slug={canonicalSlug}
              city={canonicalCity}
              length={pageData?.total}
              name="business listings"
            />
          </div>

          <h1 className="font-semibold text-xl 2xl:text-2xl mt-2 capitalize max-md:hidden mb-3">
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

          <div className="flex w-full gap-4 items-start">
            <div className="flex flex-col my-2 md:my-4 gap-2 w-full max-md:mb-32">
              <div className="bg-white w-full rounded-lg pl-2">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <BusinessCardSkeleton key={i} />
                  ))
                ) : listings.length === 0 ? (
                  <div className="flex justify-center items-center py-12 px-4">
                    <div className="flex flex-col items-center text-center max-w-md w-full">
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
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Be the first to list your business here!
                      </h2>
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
                      <p className="text-xs text-gray-400 mt-5">
                        Free to list &nbsp;·&nbsp; Reach local buyers
                        &nbsp;·&nbsp; Takes under 2 minutes
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {listings.map((item, index) => (
                      <div key={item._id || index} className="w-full md:mb-4 mb-1">
                        <BusinessCard data={item} />
                      </div>
                    ))}
                    {isLoadingMore &&
                      Array.from({ length: 2 }).map((_, i) => (
                        <BusinessCardSkeleton key={`more-${i}`} />
                      ))}
                  </>
                )}
              </div>

              {!localFilters && pageData?.hasMore && (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="text-orange-500 max-md:ml-3 capitalize border border-orange-500 px-1.5 py-1 max-w-25 md:mx-auto rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {isLoadingMore ? "Loading..." : "Load more"}
                </button>
              )}
              {!pageData?.hasMore && listings.length > 0 && (
                <p className="text-center text-gray-500 mt-4">
                  No more results
                </p>
              )}
            </div>

            <div className="mt-4 max-md:hidden sticky  top-[200px]">
              <RightBusinessCard name={canonicalSlug} />
            </div>
          </div>

          <section className="max-md:hidden max-w-full overflow-hidden">
            <hr className="border-gray-200 " />
            <SeoContent
              categorySlug={slug}
              city={canonicalCity}
              seoContent={seoContent}
            />
            <InfoListSection
              title={`Top ${canonicalSlug} in ${canonicalCity}`}
              items={listings?.map((item) => ({
                title: item?.businessName || item?.name,
                description:
                  item?.description ||
                  item?.about ||
                  "No description available.",
                address: item?.address || item?.location || canonicalCity,
              }))}
            />
          </section>
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
