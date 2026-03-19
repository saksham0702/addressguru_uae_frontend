import Image from "next/image";
import Banner1 from "@/components/Banner1";
import BannerLast from "@/components/BannerLast";
import Customers from "@/components/Customers";
import PopularCategory from "@/components/PopularCategory";
import PopularServices from "@/components/PopularServices";
import RecentBusinessCard from "@/components/RecentBusinessCard";
import RecentJobCard from "@/components/RecentJobCard";
import RecentListingCard from "@/components/RecentListingCard";
import HomeHeadingView from "@/components/HomeHeadingView";
import { get_categories } from "@/api/Categories";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL, APP_URL } from "@/services/constants";
import Loader from "@/components/Loader";
import { get_recent_listings } from "@/api/showlistings";
import Head from "next/head";
import { getAllCategories } from "@/api/uaeAdminCategories";
import { getCities } from "@/api/uaeadminCities";

export default function Home() {
  // api calls
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [recentListing, setRecentListing] = useState(null);
  const [recentJobs, setRecentJobs] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      console.log("this is scroll");
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();

      // console.log("response of category",data?.result)
      if (data.data) setCategories(data.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRecentListings = async () => {
      const data = await get_recent_listings("listing");
      console.log("i am recent listing data", data);
      setRecentListing(data);
    };
    const fetchRecentJobs = async () => {
      const jobData = await get_recent_listings("jobs");
      setRecentJobs(jobData);
      console.log("jobs data recent", jobData);
    };
    fetchRecentListings();
    fetchRecentJobs();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getCities();
        console.log("city res", res.data);

        setCities(res.data);
      } catch (err) {
        console.error("Client-side error:", err);
        setError(err);
      }
    };

    fetchCities();
  }, []);

  return (
    <>
      <Head>
        {/* ======= BASIC SEO ======= */}
        <title>Find Local Businesses, Services & Jobs | Addressguru SG</title>

        <meta
          name="description"
          content="Find top local businesses, nearby services, jobs, professionals, and shops. Browse categories, explore services, and discover the latest listings near you."
        />

        <meta
          name="keywords"
          content="local businesses, services near me, jobs near me, find services, business directory, nearby shops"
        />

        {/* ======= CANONICAL URL ======= */}
        <link rel="canonical" href={APP_URL} />

        {/* ======= OPEN GRAPH (Facebook/WhatsApp) ======= */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Find Local Businesses, Services & Jobs"
        />
        <meta
          property="og:description"
          content="Discover the best businesses, jobs, and services near you. Browse verified listings and explore categories with ease."
        />
        <meta property="og:url" content={APP_URL} />
        <meta
          property="og:image"
          content={`${APP_URL}/seo/default-home-og.jpg`}
        />
        <meta property="og:site_name" content="Your Website Name" />

        {/* ======= TWITTER CARDS ======= */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Find Local Businesses, Services & Jobs"
        />
        <meta
          name="twitter:description"
          content="Browse categories, services, businesses, and job listings near you."
        />
        <meta
          name="twitter:image"
          content={`${APP_URL}/seo/default-home-og.jpg`}
        />

        {/* ======= JSON-LD SCHEMA (SEO BOOST) ======= */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Your Website Name",
              url: APP_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: `${APP_URL}/search?query={search_term}`,
                "query-input": "required name=search_term",
              },
            }),
          }}
        />

        {/* ORGANIZATION SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Your Website Name",
              url: APP_URL,
              logo: `${APP_URL}/logo.png`,
              sameAs: [
                "https://facebook.com/yourpage",
                "https://instagram.com/yourpage",
                "https://www.linkedin.com/company/yourpage",
              ],
            }),
          }}
        />
      </Head>

      <div
        ref={dropdownRef}
        className=" h-auto flex flex-col items-center w-full justify-center  hide-scroll overflow-hidden  bg-[#F8F7F7] "
      >
        {/* <div className="max-md:hidden"> */}
        <Banner1 isOpen={isOpen} setIsOpen={setIsOpen} data={cities} />

        {/* </div> */}
        <div className="flex flex-col lg:w-[80%] bg-white max-md:w-full">
          {/* first banner  */}
          <div
            className="flex-col px-2
         text-xl font-semibold"
          >
            <h3 className="text-center max-md:text-left max-md:pl-2 max-md:text-lg w-full lg:my-6  max-md:mt-5 text-[#212121] ">
              Popular Categories
            </h3>
            {/* popular categories with icons  */}
            {/* {!categories?.result && <Loader />} */}
            <PopularCategory data={categories} />
            {/* <div className="relative bottom-2 max-md:hidden px-2">
            <PopularCategory />
          </div> */}

            {/* ads section for mobile */}
            <div className="w-full max-h-55 md:hidden p-2">
              <div className="border border-gray-100 w-full h-full flex items-center justify-center">
                <l
                  src="/assets/ads-img-small.png"
                  alt="adds"
                  height={500}
                  width={500}
                  className="object-contain h-full w-full"
                />
              </div>
            </div>
            {/* popular services section */}

            <h3 className=" mt-4 mb-3  text-[#212121] max-md:text-lg max-md:pl-2  pl-5">
              Popular Services
            </h3>
            <div className="">
              <PopularServices />
            </div>

            {/* recent Business section */}
            {recentListing && (
              <>
                <HomeHeadingView title={"Recent Business"} view={"view more"} />
                <div className="flex gap-3 pr-5 max-md:overflow-x-scroll hide-scroll max-md:pb-5  px-4">
                  {recentListing?.map((item, index) => (
                    <RecentBusinessCard key={index} data={item} />
                  ))}
                </div>
              </>
            )}

            {/* recent Listing section */}
            {recentJobs && (
              <>
                <HomeHeadingView title={"Recent Jobs"} view={"view more"} />
                <div className="flex gap-3 pr-5 max-md:overflow-x-scroll hide-scroll max-md:pb-5  px-4">
                  {recentJobs?.map((item, index) => (
                    <RecentJobCard key={index} img={1} data={item} />
                  ))}
                </div>
              </>
            )}

            {/* recent job section */}

            {/* <HomeHeadingView title={"Recent Jobs"} view={"view more"} />

          <div className="flex gap-3 px-4 pr-5 max-md:overflow-x-scroll max-md:pb-5 hide-scroll  ">
            <RecentJobCard img={1} />
            <RecentJobCard img={2} />
            <RecentJobCard img={1} />
            <RecentJobCard img={2} />
            <RecentJobCard img={1} />
            <RecentJobCard img={2} />
          </div> */}
          </div>
          {/* customer section */}

          <Customers />

          <BannerLast />
        </div>
      </div>
    </>
  );
}
