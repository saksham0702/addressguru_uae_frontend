import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import Header from "@/layout/header";
import MobileFooter from "@/components/MobileFooter";
import BusinessCard from "@/components/BusinessListingComponents/BusinessCard";
import BusinessCardSkeleton from "@/components/BusinessListingComponents/BusinessCardSkeleton";

const API = "https://addressguru.ae/api";

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;

  const [listings, setListings] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchResults = async (query, page = 1, append = false) => {
    if (!query) return;
    try {
      page === 1 ? setIsLoading(true) : setIsLoadingMore(true);

      const res = await axios.get(
        `${API}/search?q=${encodeURIComponent(query)}&page=${page}&limit=10`,
      );

      const data = res?.data;
      const results = data?.results || [];
      const pagination = {
        total: data?.total,
        totalPages: data?.totalPages,
        hasMore: data?.hasNextPage,
        nextPage: page + 1,
      };

      if (append) {
        setListings((prev) => [...prev, ...results]);
      } else {
        setListings(results);
        setCurrentPage(1);
      }
      setPageData(pagination);
    } catch (err) {
      console.error("Search failed:", err);
      if (!append) setListings([]);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!router.isReady || !q) return;
    fetchResults(q, 1, false);
  }, [q, router.isReady]);

  const handleLoadMore = async () => {
    if (!pageData?.hasMore || isLoadingMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await fetchResults(q, nextPage, true);
  };

  return (
    <>
      <section className="md:hidden">
        <Header />
      </section>

      <Head>
        <title>
          {q ? `Search results for "${q}"` : "Search"} | AddressGuru
        </title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="h-auto flex flex-col max-md:mt-1.5 items-center justify-center bg-[#F8F7F7]">
        <div className="flex flex-col min-md:w-[80%] max-md:min-w-full bg-white md:px-3 mx-auto md:pb-20 pr-2">
          {/* Search query heading */}
          <div className="mt-4 max-md:ml-2.5">
            <p className="text-sm text-gray-500">
              {pageData?.total
                ? `${pageData.total} results for`
                : isLoading
                  ? "Searching for"
                  : "Results for"}{" "}
              <span className="font-semibold text-gray-800">{q} </span>
            </p>
          </div>

          <div className="flex w-full gap-4 items-start mt-3">
            <div className="flex flex-col gap-2 w-full max-md:mb-32">
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
                            d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        No results found
                      </h2>
                      <p className="text-sm text-gray-500 mb-7 leading-relaxed">
                        We couldn&apos;t find any listings for{" "}
                        <span className="font-medium text-gray-700">{q}</span>.
                        Try a different search term.
                      </p>
                      <button
                        onClick={() => router.back()}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
                      >
                        Go back
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {listings.map((item, index) => (
                      <div
                        key={item._id || index}
                        className="w-full md:mb-4 mb-1"
                      >
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

              {pageData?.hasMore && (
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
          </div>
        </div>
      </div>

      <MobileFooter />
    </>
  );
}
