import BreadCrumbs from "@/components/BreadCrumbs";
import Filters from "@/components/MarketplaceAndToLet/Filter";
import RecentListingCard from "@/components/RecentListingCard";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HelpFull from "@/components/Helpfull";
import Link from "next/link";
import { get_marketplace_listing } from "@/api/showlistings";
import { get_marketplace_filter } from "@/api/filter";
import { useAuth } from "@/context/AuthContext";
import MobileMarketplaceFilter from "@/components/MarketplaceAndToLet/MobileMarketplaceFilter";

// ─── Skeleton Card (matches RecentListingCard dimensions) ───────────────────
const MarketplaceCardSkeleton = () => (
  <div className="md:w-[23.7%] min-w-[180px] md:h-[275px] 2xl:h-[350px] rounded-lg bg-gray-100 animate-pulse p-2 flex flex-col gap-2">
    <div className="w-full flex-1 bg-gray-200 rounded-md" />
    <div className="h-4 bg-gray-200 rounded w-3/4" />
    <div className="h-3 bg-gray-200 rounded w-1/2" />
  </div>
);

const Marketplace = () => {
  const router = useRouter();
  const slug = router?.query?.slug;

  // ── Data state ──────────────────────────────────────────────────────────────
  const [listings, setListings] = useState([]);
  const [pageData, setPageData] = useState(null); // holds has_more, next_page, total etc.
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const { city } = useAuth();

  // ── Filter state ────────────────────────────────────────────────────────────
  const [marketplaceFilter, setMarketplaceFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    cities: [],
  });

  const hasActiveFilters =
    selectedFilters.categories.length > 0 || selectedFilters.cities.length > 0;

  const handleReset = () => {
    setSelectedFilters({ categories: [], cities: [] });
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

        const res = await get_marketplace_listing(selectedFilters, 1);

        setListings(res?.result || []);
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
    if (!pageData?.has_more || isLoadingMore) return;

    try {
      setIsLoadingMore(true);

      const res = await get_marketplace_listing(
        selectedFilters,
        pageData.next_page, // use next_page from last API response
      );

      if (res?.result?.length) {
        setListings((prev) => [...prev, ...res.result]); // ✅ append
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
      <div className="md:w-[80%] max-md:w-[96%] bg-white max-md:border border-gray-200 max-md:rounded-lg pb-10 md:pl-3">
        <div className="flex items-center justify-between max-md:p-2 py-2 max-md:pt-3">
          <BreadCrumbs length={pageData?.total} slug={"marketplace "} />
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


        <div className="flex md:gap-1 mt-2 relative min-h-screen">
          {/* ── Sticky Filter Sidebar ─────────────────────────────────────────── */}
          <div className="mt-2 h-auto sticky max-md:hidden self-start top-20 w-[20%]">
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
          <div className="md:w-[80%] max-md:w-full flex flex-col">
            {/* Cards grid */}
            <div className="flex lg:pl-3 md:gap-3 gap-2 flex-wrap max-md:justify-center">
              {/* LOADING STATE — skeletons */}
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <MarketplaceCardSkeleton key={i} />
                ))
              ) : /* EMPTY STATE */
              listings.length === 0 ? (
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
                    We couldn&apos;t find any listings matching your search. Try
                    adjusting your filters or check back later.
                  </p>
                  <Link
                    href="/"
                    className="bg-orange-500 hover:bg-orange-600 capitalize text-white px-6 py-2 rounded-lg shadow transition-all"
                  >
                    Go to Home
                  </Link>
                </div>
              ) : (
                /* LISTINGS */
                <>
                  {listings.map((item, index) => (
                    <RecentListingCard
                      slugData={'marketplace'}
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
            {pageData?.has_more && (
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
    </div>
  );
};

export default Marketplace;

{
  /* {slug === "to-let" && (
                <div className="md:h-[275px] md:w-[23.7%] w-[240px] max-md:w-auto p-2 max-md:min-w-[175px] max-[350px]:w-[90%] max-md:h-[247px] rounded-lg 2xl:h-[350px] bg-[#DAECFD] flex items-center justify-center">
                  <div className=" mx-auto  ">
                    <p className="text-md max-md:text-sm font-[500]">
                      Looking For <strong>Buyer</strong>
                    </p>
                    <button className="bg-[#FF6E04] rounded-sm text-white font-semibold text-sm max-md:text-xs px-2 py-1">
                      Post Your Ads Today
                    </button>
                  </div>
                </div>
              )} */
}
