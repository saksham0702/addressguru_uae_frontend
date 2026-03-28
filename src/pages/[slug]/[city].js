import { get_listing_by_slug } from "@/api/showlistings";
import { useAuth } from "@/context/AuthContext";
import BusinessCardSkeleton from "@/components/BusinessListingComponents/BusinessCardSkeleton";
import BreadCrumbs from "@/components/BreadCrumbs";
import BusinessCard from "@/components/BusinessListingComponents/BusinessCard";
import RightBusinessCard from "@/components/BusinessListingComponents/RightBusinessCard";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { APP_URL } from "@/services/constants";
import Listings from "@/components/HeadersMobile/Listings";
import FilterBar from "@/components/BusinessListingComponents/FilterBar";
import { get_listing_filters } from "@/api/listingfilters";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import MobileFooter from "@/components/MobileFooter";
import {
  get_all_listings,
  get_approved_listings,
  get_listings_by_category_and_city,
} from "@/api/listing-form";
import { getListingsByCategoryAndCity } from "@/api/uaeAdminCategories";

const SearchResults = () => {
  const router = useRouter();

  const { city: globalCity } = useAuth(); // USE ONLY GLOBAL CITY
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [filters, setFilters] = useState({
    sort_by: null, // newest | oldest | popular
    ag_verified: false, // true | false
    facilities_id: [],
    services_id: [],
    payment_mode_id: [],
  });
  const [dynamicFilters, setDynamicFilters] = useState({
    facilitis: null,
    service: null,
    paymentMode: null,
  });

  const { slug } = router.query; // KEEP slug and id from URL but NOT city

  const hasActiveFilters =
    filters.sort_by !== null ||
    filters.ag_verified !== false ||
    filters.facilities_id.length > 0 ||
    filters.services_id.length > 0 ||
    filters.payment_mode_id.length > 0;

  const handleReset = () => {
    setFilters({
      sort_by: null,
      ag_verified: false,
      facilities_id: [],
      services_id: [],
      payment_mode_id: [],
    });
  };

  // -------------------------
  //   GET FILTERS
  // -------------------------

  const getFilters = async (slug) => {
    try {
      const response = await get_listing_filters(slug);
      setDynamicFilters({ ...dynamicFilters, ...response });
      return response;
    } catch (error) {
      console.log("getFilters", error);
      return error;
    }
  };

  useEffect(() => {
    if (!router.isReady || !slug) return;

    getFilters(slug);
  }, [slug]);

  // -------------------------
  //   REDIRECT WHEN CITY CHANGES
  // -------------------------
  useEffect(() => {
    if (!router.isReady || !slug || !globalCity) return;

    const newCitySlug = globalCity.toLowerCase().replace(/\s+/g, "-");
    const categorySlug = slug.toLowerCase().replace(/\s+/g, "-");

    const expectedPath = `/${categorySlug}/${newCitySlug}`;

    if (router.pathname !== expectedPath) {
      router.replace({
        pathname: expectedPath,
      });
    }
  }, [globalCity, router.isReady, slug]);

  // -------------------------
  //  API CALL (ONLY GLOBAL CITY)
  // -------------------------
  useEffect(() => {
    if (!router.isReady || !globalCity) return;

    const fetchListings = async () => {
      try {
        setIsLoading(true);
        setError(false);
        setListings([]); // 🔥 reset
        setPageData(null); // 🔥 reset pagination

        const citySlugRaw = router.asPath.split("/")[2];

        const city_slug = citySlugRaw
          ?.toLowerCase()
          .replace(/\(.*\)/, "")
          .replace(/\s+/g, "-");

        const res = await getListingsByCategoryAndCity(slug, city_slug);
        console.log("get all listings response", res);

        // if (!res || res.status != true) {
        //   router.push("/404");
        //   return;
        // }

        setListings(res || []);
        setPageData(res);
      } catch (err) {
        console.log("Error fetching listings:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [router.isReady, slug, globalCity, filters]);

  const handleLoadMore = async () => {
    if (!pageData?.has_more || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const res = await get_listing_by_slug(
        slug,
        globalCity,
        pageData.next_page,
        filters, // 🔥 PASS FILTERS
      );
      if (res?.result?.length) {
        setListings((prev) => [...prev, ...res.result]); // ✅ APPEND
        setPageData(res); // update pagination data
      }
    } catch (err) {
      console.error("Load more failed:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // -------------------------
  //       ERROR UI
  // -------------------------
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
        {/* ===== META BASIC ===== */}
        <title>{`Top ${slug} in ${globalCity} | Best ${slug} Listings`}</title>
        <meta
          name="description"
          content={`Find the best ${slug} in ${globalCity}. Browse verified business listings, reviews, contact information, and more.`}
        />
        <meta
          name="keywords"
          content={`${slug}, best ${slug} in ${globalCity}, top ${slug}, ${globalCity} business listings`}
        />

        {/* ===== CANONICAL ===== */}
        <link
          rel="canonical"
          href={`${APP_URL}/${slug
            ?.toLowerCase()
            .replace(/\s+/g, "-")}/${globalCity
            ?.toLowerCase()
            .replace(/\s+/g, "-")}`}
        />

        {/* ===== OPEN GRAPH (FACEBOOK / WHATSAPP) ===== */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Top ${slug} in ${globalCity} | Business Listings`}
        />
        <meta
          property="og:description"
          content={`Looking for the best ${slug} in ${globalCity}? Visit our platform to explore verified listings and choose the right one.`}
        />
        <meta
          property="og:url"
          content={`${APP_URL}/${slug
            ?.toLowerCase()
            .replace(/\s+/g, "-")}/${globalCity
            ?.toLowerCase()
            .replace(/\s+/g, "-")}`}
        />
        <meta property="og:site_name" content="Your Website Name" />
        <meta
          property="og:image"
          content={`${APP_URL}/seo/default-og-image.jpg`}
        />

        {/* ===== TWITTER CARDS ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Top ${slug} in ${globalCity} | Business Listings`}
        />
        <meta
          name="twitter:description"
          content={`Checkout the top ${slug} available in ${globalCity}. Explore business listings, ratings, and contact details.`}
        />
        <meta
          name="twitter:image"
          content={`${APP_URL}/seo/default-og-image.jpg`}
        />

        {/* ===== STRUCTURED DATA (JSON-LD) ===== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: `Top ${slug} in ${globalCity}`,
              url: `${APP_URL}/${slug}/${globalCity}`,
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

      {/* <Listings /> */}
      <div className="h-auto flex flex-col max-md:mt-1.5 items-center overflow-hidden justify-center bg-[#F8F7F7]">
        <div className="flex flex-col min-md:w-[80%] max-md:min-w-full bg-white md:px-3 mx-auto  md:pb-20 pr-2">
          {/* Always visible */}
          <div className="mt-6 max-md:ml-2.5 md:mb-2">
            <BreadCrumbs
              slug={slug}
              city={globalCity}
              length={pageData?.total}
              name={"business listings"}
            />
          </div>

          <h1 className="font-bold text-xl mt-2 capitalize max-md:hidden mb-3">
            Top {slug} in {globalCity}
          </h1>

          <FilterBar
            hasActiveFilters={hasActiveFilters}
            handleReset={handleReset}
            dynamicFilters={dynamicFilters}
            filters={filters}
            onFilterChange={(updatedFilters) => {
              setFilters((prev) => ({
                ...prev,
                ...updatedFilters,
              }));
            }}
          />

          <div className="flex w-full gap-4">
            {/* LEFT SIDE LISTINGS */}
            <div className="flex flex-col my-2 md:my-4 gap-2 w-full max-md:mb-32">
              <div className="bg-white w-full  rounded-lg pl-2 ">
                {/* SKELETON ONLY INSIDE LIST AREA */}
                {isLoading ? (
                  <>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <BusinessCardSkeleton key={i} />
                    ))}
                  </>
                ) : listings?.length === 0 ? (
                  <div className="min-md:w-[80%] mx-auto max-md:min-w-full flex justify-center items-center">
                    <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 w-full bg-white text-center px-4">
                      <div className="relative mb-6">
                        <div className="w-40 h-40 bg-orange-100 rounded-full flex items-center justify-center">
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
                        go to home
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* EXISTING LISTINGS */}
                    {listings?.map((item, index) => (
                      <BusinessCard key={item.id || index} data={item} />
                    ))}

                    {/* 👇 LOAD MORE SKELETONS (PUT HERE) */}
                    {isLoadingMore &&
                      Array.from({ length: 2 }).map((_, i) => (
                        <BusinessCardSkeleton key={`more-${i}`} />
                      ))}
                  </>
                )}
              </div>
              {pageData?.has_more && (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className=" text-orange-500 max-md:ml-3 capitalize border border-orange-500 px-1.5 py-1 max-w-25 md:mx-auto rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {isLoadingMore ? "Loading..." : "Load more"}
                </button>
              )}
            </div>

            {/* RIGHT BUSINESS CARD ALWAYS VISIBLE */}
            <div className="mt-4 max-md:hidden">
              <RightBusinessCard name={slug} />
            </div>
          </div>
        </div>
      </div>
      <MobileFooter />
    </>
  );
};

export default SearchResults;
