import BreadCrumbs from "@/components/BreadCrumbs";
import Filters from "@/components/MarketplaceAndToLet/Filter";
import RecentListingCard from "@/components/RecentListingCard";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HelpFull from "@/components/Helpfull";
import Link from "next/link";
import Head from "next/head";
// import { get_marketplace_listing } from "@/api/showlistings";
import { get_marketplace_filter } from "@/api/filter";
import { useAuth } from "@/context/AuthContext";
import MobileMarketplaceFilter from "@/components/MarketplaceAndToLet/MobileMarketplaceFilter";
import { get_all_marketplace, get_marketplace_category_info } from "@/api/uae-marketplace";
import Login from "@/components/UserLogin/Login";
import Image from "next/image";
import SEOHead from "@/components/SEOHead";

// ─── Skeleton Card (matches RecentListingCard dimensions) ───────────────────
const MarketplaceCardSkeleton = () => (
  <div className="md:w-[23.7%] min-w-[180px] md:h-[275px] 2xl:h-[350px] rounded-lg bg-gray-100 animate-pulse p-2 flex flex-col gap-2">
    <div className="w-full flex-1 bg-gray-200 rounded-md" />
    <div className="h-4 bg-gray-200 rounded w-3/4" />
    <div className="h-3 bg-gray-200 rounded w-1/2" />
  </div>
);

const Marketplace = ({ initialCity }) => {
  const router = useRouter();
  const slug = router?.query?.slug;

  // ── Data state ──────────────────────────────────────────────────────────────
  const [listings, setListings] = useState([]);
  const [pageData, setPageData] = useState(null); // holds has_more, next_page, total etc.
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const { city: contextCity } = useAuth();
  const city = initialCity || contextCity || "UAE";

  // ── Filter state ────────────────────────────────────────────────────────────
  const [marketplaceFilter, setMarketplaceFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    cities: [],
    sub_category_id: null,
    search: "",
  });

  const hasActiveFilters =
    selectedFilters.categories.length > 0 || 
    selectedFilters.cities.length > 0 || 
    selectedFilters.sub_category_id || 
    selectedFilters.search;

  const [loginPop, setLoginPop] = useState(false);
  const handleCloseLogin = () => setLoginPop(false);

  const handleReset = () => {
    setSelectedFilters({ categories: [], cities: [], sub_category_id: null, search: "" });
  };

  // ── Fetch sidebar filters (once) ────────────────────────────────────────────
  useEffect(() => {
    const getFilter = async () => {
      try {
        const res = await get_marketplace_filter();
        setMarketplaceFilter(res);
      } catch (err) {
        console.error("getFilter error", err);
      }
    };
    getFilter();
  }, []);

  // ── Fetch listings whenever selectedFilters change (reset to page 1) ────────
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        setError(false);
        setListings([]); // 🔥 reset list
        setPageData(null); // 🔥 reset pagination

        const params = {
          category_id: selectedFilters.categories[0], // assume single for now or adjust backend
          city_id: selectedFilters.cities[0],
          sub_category_id: selectedFilters.sub_category_id,
          search: selectedFilters.search,
          page: 1,
          limit: 20
        };
        const res = await get_all_marketplace(params);

        setListings(res?.data?.listings || []);
        console.log("market place respones :", res);

        setPageData(res); // store full response for pagination meta
      } catch (err) {
        console.error("fetchListings error", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [selectedFilters]);

  // ── Load more ────────────────────────────────────────────────────────────────
  const handleLoadMore = async () => {
    const nextPage = (pageData?.pagination?.page || 1) + 1;
    if (nextPage > (pageData?.pagination?.totalPages || 1) || isLoadingMore) return;

    try {
      setIsLoadingMore(true);

      const params = {
        category_id: selectedFilters.categories[0],
        city_id: selectedFilters.cities[0],
        sub_category_id: selectedFilters.sub_category_id,
        search: selectedFilters.search,
        page: nextPage,
        limit: 20
      };

      const res = await get_all_marketplace(params);

      if (res?.data?.listings?.length) {
        setListings((prev) => [...prev, ...res.data.listings]); // ✅ append
        setPageData(res); // update pagination meta
      }
    } catch (err) {
      console.error("loadMore error", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // ── Error UI ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load listings</p>
          <button
            onClick={() => {
              setError(false);
              setSelectedFilters({ categories: [], cities: [] });
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center w-full justify-center bg-[#F8F7F7]">
      {/* ── SEO Head ─────────────────────────────────────────────────────────── */}
      <SEOHead
        title={listings?.[0]?.category?.name ? `Best ${listings[0].category.name} in ${city} | Marketplace` : `Top Marketplace Listings in ${city} | Buy & Sell`}
        description={`Browse the best${listings?.[0]?.category?.name ? ` ${listings[0].category.name}` : ""} marketplace listings in ${city}. Find products to buy and sell on AddressGuru UAE.`}
        keywords={`marketplace UAE, buy sell UAE, second hand Dubai, online marketplace UAE, products for sale ${city}, AddressGuru marketplace${listings?.[0]?.category?.name ? `, ${listings[0].category.name}` : ""}`}
        canonical={`https://addressguru.ae/marketplace`}
        ogImage={listings?.[0]?.images?.[0] || "https://addressguru.ae/seo/default-marketplace-og.jpg"}
        schema={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Marketplace Listings in ${city}`,
          url: "https://addressguru.ae/marketplace",
          numberOfItems: pageData?.pagination?.total || listings?.length || 0,
          itemListElement: listings?.slice(0, 10).map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item?.title || item?.name,
            url: `https://addressguru.ae/marketplace/${item?.slug}`,
          })),
        }}
      />
      <div className="md:w-[80%] max-md:w-[96%] bg-white max-md:border border-gray-200 max-md:rounded-lg pb-10 md:px-3">
        <div className="flex items-center justify-between max-md:p-2 py-2 max-md:pt-3">
          <BreadCrumbs length={pageData?.pagination?.total || 0} slug={"marketplace "} />
        </div>

        <section className="flex items-center justify-between max-md:p-2 py-2 max-md:pt-3">
          <h1 className="capitalize font-semibold max-md:text-lg p-2  text-2xl">
            top products in {city}
          </h1>
          {/* mobile filter */}
          <div className="md:hidden">
            <MobileMarketplaceFilter
              filters={marketplaceFilter}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              hasActiveFilters={hasActiveFilters}
              handleReset={handleReset}
            />
          </div>
        </section>

        <div className="flex w-full md:gap-4 mt-2 relative min-h-screen pt-2">
          {/* ── Sticky Filter Sidebar ─────────────────────────────────────────── */}
          <div className="sticky top-24 h-fit max-md:hidden w-[23%] z-10 mx-1">
            <Filters
              filters={marketplaceFilter}
              selectedFilters={selectedFilters}
              setSelectedFilters={(updated) => {
                setSelectedFilters(updated); // triggers useEffect → resets to page 1
              }}
            />

            {/* Reset filters button */}
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="mt-2 text-sm text-orange-500 border border-orange-400 rounded px-3 py-1 hover:bg-orange-50 transition"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* ── Main Content Area ─────────────────────────────────────────────── */}
          <div className="md:w-[77%] max-md:w-full flex flex-col">
            {/* Cards grid */}
            <div className="flex lg:pl-3 md:gap-3 gap-2 flex-wrap max-md:justify-center">
              {/* LOADING STATE — skeletons */}
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <MarketplaceCardSkeleton key={i} />
                ))
              ) : /* EMPTY STATE */
              listings.length === 0 ? (
                <div className="flex justify-center items-center py-12 px-4 w-full">
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
                        {city}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      Be the first to post an ad here!
                    </h2>
                    <p className="text-sm text-gray-500 mb-1 leading-relaxed">
                      No products found in{" "}
                      <span className="font-medium text-gray-700">
                        {city}
                      </span>{" "}
                      {selectedFilters.categories.length > 0 && (
                        <>
                          matching your filters
                        </>
                      )}
                      .
                    </p>
                    <p className="text-sm text-gray-500 mb-7 leading-relaxed">
                      Get ahead of the competition — post your ad and
                      start reaching local buyers today.
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
                      Free to post &nbsp;·&nbsp; Reach local buyers
                      &nbsp;·&nbsp; Takes under 2 minutes
                    </p>
                  </div>
                </div>
              ) : (
                /* LISTINGS */
                <>
                  {listings.map((item, index) => (
                    <RecentListingCard
                      slugData={"marketplace"}
                      key={item?.id || index}
                      data={item}
                      img={slug === "properties" ? 1 : 1}
                      width={"23.7%"}
                    />
                  ))}

                  {/* Load more skeletons — appended below existing cards */}
                  {isLoadingMore &&
                    Array.from({ length: 2 }).map((_, i) => (
                      <MarketplaceCardSkeleton key={`more-${i}`} />
                    ))}
                </>
              )}

              {/* Best deals CTA card — always visible when slug matches */}
              {!isLoading && slug === "marketplace" && (
                <div className="md:h-[275px] md:w-[23.7%] min-w-[180px] p-2 rounded-lg 2xl:h-[350px] bg-[#DAECFD] flex items-center justify-center">
                  <div>
                    <p className="text-md font-[500]">
                      Looking For <strong>Buyer</strong>
                    </p>
                    <button className="bg-[#FF6E04] rounded-sm text-white font-semibold text-sm px-2 py-1">
                      Post Your Ads Today
                    </button>
                  </div>
                </div>
              )}

              {/* HelpFull banner — full width row */}
              {/* <div className="w-[97%]">
                <HelpFull layout={"row"} />
              </div> */}
            </div>

            {/* ── Load More Button ──────────────────────────────────────────── */}
            {pageData?.pagination?.page < pageData?.pagination?.totalPages && (
              <div className="flex justify-center mt-4 lg:pl-3">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="text-orange-500 capitalize border border-orange-500 px-4 py-1.5 rounded-md text-sm font-medium disabled:opacity-50 hover:bg-orange-50 transition"
                >
                  {isLoadingMore ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {loginPop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50 px-4">
          <div className="h-[65vh] w-full max-w-xl m-auto flex flex-col relative rounded-xl bg-white shadow-2xl">
              <button
                onClick={handleCloseLogin}
                className="absolute right-4 top-4 border rounded-full border-orange-500 p-1.5 z-[60] text-orange-500 hover:bg-orange-50 transition-colors"
                aria-label="Close"
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
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="flex-1 overflow-y-auto w-full pt-4">
                <Login setShowLogin={true} />
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;

export async function getServerSideProps(context) {
  // You could optionally fetch categories/brands here as well for better indexability
  return {
    props: {
      initialCity: "UAE", // Default for marketplace index if no specific city in query
    },
  };
}
