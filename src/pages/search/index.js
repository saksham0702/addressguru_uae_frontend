import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Header from "@/layout/header";
import MobileFooter from "@/components/MobileFooter";
import BusinessCard from "@/components/BusinessListingComponents/BusinessCard";
import BusinessCardSkeleton from "@/components/BusinessListingComponents/BusinessCardSkeleton";
import { resolveSearch } from "@/api/search";
import {
  FiSearch,
  FiMapPin,
  FiGrid,
  FiBriefcase,
  FiTool,
  FiBook,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";

// ─── Intent label/icon map ────────────────────────────────────────────────────
const INTENT_META = {
  business_list: {
    label: "Matching businesses",
    icon: FiBriefcase,
    color: "#0EA5E9",
  },
  service_match: {
    label: "Listings with this service",
    icon: FiTool,
    color: "#10B981",
  },
  course_match: {
    label: "Listings with this course",
    icon: FiBook,
    color: "#F59E0B",
  },
  keyword_search: {
    label: "Search results",
    icon: FiSearch,
    color: "#6B7280",
  },
};

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;

  const [listings, setListings] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [intent, setIntent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasRedirected, setHasRedirected] = useState(false);
  const redirectAttempted = useRef(false);

  const fetchResults = async (query, page = 1, append = false) => {
    if (!query) return;

    try {
      page === 1 ? setIsLoading(true) : setIsLoadingMore(true);

      const data = await resolveSearch(query, page, 10);

      // ── Redirect intents — only on first load ─────────────────────────
      if (page === 1 && !redirectAttempted.current) {
        redirectAttempted.current = true;

        if (
          data.intent === "category_city" ||
          data.intent === "category" ||
          data.intent === "exact_business"
        ) {
          setHasRedirected(true);
          router.replace(data.redirectUrl);
          return;
        }
      }

      // ── Show listings for these intents ──────────────────────────────
      const results = data?.listings || [];
      const pagination = {
        total: data?.total || 0,
        totalPages: data?.totalPages || 0,
        hasMore: data?.hasNextPage || false,
      };

      setIntent(data?.intent || "keyword_search");

      if (append) {
        setListings((prev) => [...prev, ...results]);
      } else {
        setListings(results);
        setCurrentPage(1);
      }
      setPageData(pagination);
    } catch (err) {
      console.error("Search failed:", err);
      if (!append) {
        setListings([]);
        setIntent("keyword_search");
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!router.isReady || !q) return;
    // Reset state on new query
    redirectAttempted.current = false;
    setHasRedirected(false);
    setListings([]);
    setPageData(null);
    setIntent(null);
    fetchResults(q, 1, false);
  }, [q, router.isReady]);

  const handleLoadMore = async () => {
    if (!pageData?.hasMore || isLoadingMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await fetchResults(q, nextPage, true);
  };

  // While redirecting, show a brief spinner so there's no flash
  if (hasRedirected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F7]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-[#FF6E04] rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Redirecting…</p>
        </div>
      </div>
    );
  }

  const intentMeta = INTENT_META[intent] || INTENT_META.keyword_search;
  const IntentIcon = intentMeta.icon;

  // ── Matched services/courses badge shown on each card ──────────────────────
  const renderMatchBadge = (item) => {
    if (intent === "service_match" && item.matchedServices?.length) {
      return (
        <div className="flex flex-wrap gap-1 mt-1">
          {item.matchedServices.slice(0, 3).map((s, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100"
            >
              <FiTool className="inline mr-0.5" size={9} />
              {s}
            </span>
          ))}
        </div>
      );
    }
    if (intent === "course_match" && item.matchedCourses?.length) {
      return (
        <div className="flex flex-wrap gap-1 mt-1">
          {item.matchedCourses.slice(0, 3).map((c, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100"
            >
              <FiBook className="inline mr-0.5" size={9} />
              {c}
            </span>
          ))}
        </div>
      );
    }
    return null;
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

      <div className="min-h-screen flex flex-col bg-[#F8F7F7]">
        <div className="flex flex-col w-full max-w-4xl mx-auto bg-white md:px-4 pb-20 max-md:pb-32">
          {/* ── Header bar ────────────────────────────────────────────────── */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {/* Intent badge */}
              {intent && !isLoading && (
                <span
                  className="flex-shrink-0 flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full"
                  style={{
                    background: `${intentMeta.color}18`,
                    color: intentMeta.color,
                  }}
                >
                  <IntentIcon size={10} />
                  {intentMeta.label}
                </span>
              )}

              {/* Query + count */}
              <p className="text-sm text-gray-500 truncate">
                {isLoading ? (
                  <span className="text-gray-400">Searching…</span>
                ) : pageData?.total ? (
                  <>
                    <span className="font-semibold text-gray-800">
                      {pageData.total}
                    </span>{" "}
                    result{pageData.total !== 1 ? "s" : ""} for{" "}
                    <span className="font-semibold text-gray-800">{q}</span>
                  </>
                ) : listings.length === 0 && !isLoading ? (
                  <>
                    No results for{" "}
                    <span className="font-semibold text-gray-800">{q}</span>
                  </>
                ) : null}
              </p>
            </div>

            {/* Back */}
            <button
              onClick={() => router.back()}
              className="flex-shrink-0 text-[12px] text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors"
            >
              ← Back
            </button>
          </div>

          {/* ── Results ───────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-2 mt-3 px-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <BusinessCardSkeleton key={i} />
              ))
            ) : listings.length === 0 ? (
              /* ── Empty state ─────────────────────────────────────────── */
              <div className="flex flex-col items-center text-center py-16 px-6">
                <div className="w-20 h-20 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center mb-5">
                  <FiSearch className="text-orange-400" size={32} />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  No results found
                </h2>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-xs">
                  We couldn&apos;t find any listings for{" "}
                  <span className="font-medium text-gray-700">{q}</span>. Try
                  a different search term.
                </p>
                <button
                  onClick={() => router.back()}
                  className="bg-[#FF6E04] hover:bg-[#e55e00] text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
                >
                  Go back
                </button>
              </div>
            ) : (
              <>
                {listings.map((item, index) => (
                  <div key={item._id || index} className="w-full">
                    {/* Match badge for service/course results */}
                    {renderMatchBadge(item) && (
                      <div className="px-2 pt-1">{renderMatchBadge(item)}</div>
                    )}
                    <BusinessCard data={item} />
                  </div>
                ))}

                {/* Load more skeletons */}
                {isLoadingMore &&
                  Array.from({ length: 2 }).map((_, i) => (
                    <BusinessCardSkeleton key={`more-${i}`} />
                  ))}
              </>
            )}
          </div>

          {/* ── Load more / end ───────────────────────────────────────────── */}
          {!isLoading && listings.length > 0 && (
            <div className="flex justify-center mt-6 px-4">
              {pageData?.hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="flex items-center gap-2 border border-[#FF6E04] text-[#FF6E04] hover:bg-orange-50 text-sm font-medium px-6 py-2 rounded-full transition-colors disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-orange-200 border-t-[#FF6E04] rounded-full animate-spin" />
                      Loading…
                    </>
                  ) : (
                    <>
                      Load more
                      <FiArrowRight size={14} />
                    </>
                  )}
                </button>
              ) : (
                <p className="text-sm text-gray-400">
                  All {pageData?.total} results shown
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <MobileFooter />
    </>
  );
}
