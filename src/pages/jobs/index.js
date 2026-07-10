import { get_all_jobs_listings } from "@/api/listings";
import BreadCrumbs from "@/components/BreadCrumbs";
import HelpFull from "@/components/Helpfull";
import Filters from "@/components/Jobs/Filters";
import JobCard from "@/components/Jobs/JobCard";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { APP_URL } from "@/services/constants";
import SEOHead from "@/components/SEOHead";
import { get_job_filter } from "@/api/filter";
import MobileJobFilter from "@/components/Jobs/MobileJobFilter";
import Link from "next/link";
import { useRouter } from "next/router";
const SITE_URL = "https://addressguru.ae";

const JobsListings = () => {
  const router = useRouter();
  const { city: contextCity } = useAuth();
  const city = contextCity || "UAE";
  const [allJobs, setAllJobs] = useState([]);
  const [filtersData, setFiltersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, hasMore: false });
  const [activeFilters, setActiveFilters] = useState({});

  const canonicalUrl = `${SITE_URL}/jobs`;

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [jobsRes, filtersRes] = await Promise.all([
          get_all_jobs_listings({ page: 1, limit: 10 }),
          get_job_filter().catch(() => ({ filter: null })),
        ]);

        setAllJobs(jobsRes?.data?.jobs || []);
        setPagination({
          page: 1,
          hasMore: jobsRes?.data?.pagination?.hasMore || false,
          nextPage: jobsRes?.data?.pagination?.nextPage,
          total: jobsRes?.data?.pagination?.total,
        });
        setFiltersData(filtersRes?.filter || null);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchJobsWithFilters = async (
    filters,
    page = 1,
    isLoadMore = false,
  ) => {
    if (isLoadMore) setIsLoadingMore(true);
    else setLoading(true);

    try {
      const params = {
        page,
        limit: 10,
        workMode: filters.workMode?.join(","),
        sector: filters.sector?.join(","),
        jobType: filters.jobType?.join(","),
        location: filters.location?.join(","),
        category: filters.category?.join(","),
        subCategory: filters.subCategory?.join(","),
        language: filters.language?.join(","),
        gender: filters.gender?.join(","),
        locality: filters.locality?.join(","),
      };

      // Salary range handling
      if (filters.salary?.length) {
        const ranges = filters.salary.map((s) => {
          if (s.includes("+"))
            return { min: parseInt(s.replace("+", "")), max: 1000000 };
          const [min, max] = s.split("-").map(Number);
          return { min, max };
        });
        params.salaryMin = Math.min(...ranges.map((r) => r.min));
        params.salaryMax = Math.max(...ranges.map((r) => r.max));
      }

      const res = await get_all_jobs_listings(params);
      const newJobs = res?.data?.jobs || [];

      if (isLoadMore) {
        setAllJobs((prev) => [...prev, ...newJobs]);
      } else {
        setAllJobs(newJobs);
      }

      setPagination({
        page,
        hasMore: res?.data?.pagination?.hasMore || false,
        nextPage: res?.data?.pagination?.nextPage,
        total: res?.data?.pagination?.total,
      });
      setActiveFilters(filters);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      if (isLoadMore) setIsLoadingMore(false);
      else setLoading(false);
    }
  };

  const handleApplyFilters = (filters) => {
    fetchJobsWithFilters(filters, 1, false);
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && !isLoadingMore) {
      fetchJobsWithFilters(activeFilters, pagination.page + 1, true);
    }
  };

  // SEO Handling mirroring SearchResult.js logic
  const pageTitle = `Top Jobs in ${city} | Latest Openings & Vacancies`;
  const pageDescription = `Find the latest job openings in ${city}. Explore verified vacancies across ${filtersData?.industries?.length || "various"} sectors. Apply now on AddressGuru UAE.`;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Top Jobs in ${city}`,
    url: canonicalUrl,
    numberOfItems: allJobs.length,
    itemListElement: allJobs.map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "JobPosting",
        title: job?.title,
        url: `${SITE_URL}/jobs/${job?.slug}`,
        datePosted: job?.createdAt?.split("T")[0],
        description: job?.description?.substring(0, 200) + "...",
        hiringOrganization: {
          "@type": "Organization",
          name: job?.company?.name || "AddressGuru UAE",
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job?.location?.city?.name || city,
            addressCountry: "AE",
          },
        },
      },
    })),
  };

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
        ogImage={`https://addressguru.ae/assets/og/job.jpeg`}
        schema={itemListSchema}
      />

      <div className="flex flex-col items-center w-full h-full justify-center bg-[#F8F7F7]">
        <div className="md:w-[80%] w-full rounded-lg pb-1 md:pl-3 max-md:px-2">
          <div className="max-md:hidden mt-3">
            <BreadCrumbs
              slug={"jobs"}
              name={"Verified Jobs"}
              length={allJobs?.length}
            />
          </div>

          <div className="flex items-center max-md:my-3  md:mb-2 max-md:pt-4 justify-between">
            <h1 className="capitalize font-semibold max-md:text-lg text-2xl">
              top jobs in <span className="text-[#FF6E04]">{city}</span>
            </h1>

            <div className="md:hidden">
              <MobileJobFilter
                jobFilters={filtersData}
                onApplyFilters={handleApplyFilters}
              />
            </div>
          </div>

          {/* results bar - naukri style: count + sort */}
          {/* <div className="max-md:hidden flex items-center justify-between px-1 mt-2 mb-4 pb-3 border-b border-gray-100">
            <p className="text-[13px] text-gray-500 font-medium">
              Showing{" "}
              <span className="font-bold text-gray-800">{allJobs.length}</span>{" "}
              {pagination?.total ? `of ${pagination.total}` : ""} jobs in{" "}
              <span className="font-bold text-gray-800 capitalize">{city}</span>
            </p>
            <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-gray-600">
              Sort by:
              <span className="text-[#FF6E04]">Recommended</span>
            </div>
          </div> */}

          {/* main section */}
          <div className="flex justify-between w-full md:pr-3 gap-5 items-start">
            {/* filter section */}
            <div className="w-[23%] md:sticky max-md:hidden self-start top-20">
              <Filters
                jobFilters={filtersData}
                onApplyFilters={handleApplyFilters}
                compact={true}
              />
            </div>

            {/* main card section */}
            <div className="md:w-[55%] w-full flex flex-col gap-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6E04]"></div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                    Searching vacancies...
                  </p>
                </div>
              ) : allJobs.length > 0 ? (
                <>
                  <div className="flex flex-col gap-3">
                    {allJobs.map((item, index) => (
                      <JobCard key={item._id || index} data={item} />
                    ))}
                  </div>

                  {pagination.hasMore && (
                    <div className="py-8 flex justify-center">
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="px-8 py-2.5 border border-[#FF6E04] text-[#FF6E04] font-bold rounded-lg hover:bg-[#FF6E04] hover:text-white transition-all disabled:opacity-50"
                      >
                        {isLoadingMore ? "Loading more..." : "Load More Jobs"}
                      </button>
                    </div>
                  )}

                  <div className="mt-8 border-t border-gray-100 pt-8">
                    <HelpFull layout={"col"} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-gray-500 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center  mb-4">
                    <svg
                      className="w-8 h-8 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    No jobs found
                  </p>
                  <p className="text-sm mt-1">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              )}
            </div>

            {/* ads section */}
            <div className="flex flex-col gap-3 w-[24%] max-md:hidden sticky self-start top-20">
              <div className="w-full h-70 relative group transition-all">
                <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
                  <span className="flex items-center text-white font-bold gap-1 text-base">
                    Looking for <span className="font-black">Candidates?</span>
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent rounded-2xl overflow-hidden pointer-events-none" />
                <Image
                  src="/assets/jobsad1.png"
                  alt="looking for jobs"
                  height={500}
                  width={500}
                  className="h-full w-full rounded-2xl object-cover "
                />
              </div>

              <div className="w-full h-70 relative group transition-all">
                <div className="absolute bottom-5 right-5 z-10 flex flex-col items-end gap-2">
                  <span className="flex items-center text-white font-bold gap-1 text-base drop-shadow-md">
                    Looking for <span className="font-black">Jobs?</span>
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl overflow-hidden pointer-events-none" />
                <Image
                  src="/assets/jobsad2.png"
                  alt="looking for jobs"
                  height={500}
                  width={500}
                  className="h-full w-full rounded-2xl object-cover "
                />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 ">
                <h4 className="text-[12px] font-black text-gray-900 tracking-tight mb-2">
                  Job Seekers Tip
                </h4>
                <p className="text-[12px] text-gray-500 leading-relaxed font-medium">
                  Use advanced filters to find jobs matching your exact skills
                  and experience level in Dubai.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobsListings;
