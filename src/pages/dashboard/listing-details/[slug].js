import { get_listing_data_single } from "@/api/showlistings";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import Graph from "@/components/Dashboard/Graph";
import BusinessHeaderSection from "@/components/Dashboard/MyListing/BusinessHeaderSection";
import QuickEdit from "@/components/Dashboard/MyListing/QuickEdit";
import RecentLeads from "@/components/Dashboard/RecentLeads";
import ReviewSlider from "@/components/Register/ReviewSlider";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

const leadsData = [
  {
    label: "69,524",
    color: "text-orange-500",
    description: "Previous week",
  },
  {
    label: "58,254",
    color: "text-blue-500",
    description: "Previous week",
  },
];

const ListingDetails = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const getListings = useCallback(
    async (slug) => {
      try {
        const res = await get_listing_data_single(slug);
        setData(res);
        console.log("response of single listing", res);
      } catch (err) {
        console.error("Error fetching listing:", err);
      }
    },
    [slug]
  );
  useEffect(() => {
    if (slug) {
      getListings(slug);
    }
  }, [slug, getListings]);

  const statsData = [
    {
      title: "TOTAL VIEWS",
      value: data?.view_count || 0,
      // change: "+2.1%",
      changeType: "positive",
      subtitle: "Since last week",
      bgColor: "#FBF0ED",
      icon: (
        <svg
          id="fi_3014621"
          enable-background="new 0 0 512 512"
          height={25}
          width={25}
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path d="m406 31h-120c-57.891 0-105 47.109-105 105 0 52.808 39.185 96.636 90 103.931v46.069c0 6.064 3.647 11.543 9.258 13.857 5.533 2.309 12.023 1.071 16.348-3.252l55.605-55.605h53.789c57.891 0 106-47.109 106-105s-48.109-105-106-105zm-120 119.998c-8.286 0-15-6.716-15-15s6.714-15 15-15c8.284 0 15 6.716 15 15s-6.716 15-15 15zm60 0c-8.286 0-15-6.716-15-15s6.714-15 15-15c8.284 0 15 6.716 15 15s-6.716 15-15 15zm60 0c-8.286 0-15-6.716-15-15s6.714-15 15-15c8.284 0 15 6.716 15 15s-6.716 15-15 15z"></path>
            <path d="m337 481c24.814 0 45-20.186 45-45v-60c0-6.46-4.131-12.188-10.254-14.224l-89.789-30c-4.395-1.479-9.199-.806-13.066 1.743l-38.174 25.444c-40.43-19.277-88.403-67.251-107.681-107.681l25.444-38.174c2.563-3.853 3.208-8.672 1.743-13.066l-30-89.789c-2.035-6.122-7.763-10.253-14.223-10.253h-61c-24.814 0-45 19.975-45 44.789 0 172.822 164.178 336.211 337 336.211z"></path>
          </g>
        </svg>
      ),
    },
    {
      title: "TOTAL WHATSAP",
      value: data?.whatshapp_count || 0,
      // change: "+6.1%",
      changeType: "positive",
      subtitle: "Since last week",
      bgColor: "#E8F7F4",
      icon: (
        <svg
          height={25}
          width={25}
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          id="fi_5405320"
        >
          <g id="_11_-_20" data-name="11 - 20">
            <g id="Research">
              <path d="m34 14a5.006 5.006 0 0 1 -5-5v-7h-17a5 5 0 0 0 -5 5v34a5 5 0 0 0 5 5h20a10 10 0 1 1 9-14.337v-17.663zm-20-3h11a1 1 0 0 1 0 2h-11a1 1 0 0 1 0-2zm5 28h-5a1 1 0 0 1 0-2h5a1 1 0 0 1 0 2zm-6-6a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2h-4a1 1 0 0 1 -1-1zm7-4h-6a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2zm14-5h-20a1 1 0 0 1 0-2h20a1 1 0 0 1 0 2zm0-5h-17a1 1 0 0 1 0-2h17a1 1 0 0 1 0 2z"></path>
              <path d="m40.414 11.414-8.828-8.828a1.988 1.988 0 0 0 -.586-.4v6.814a3 3 0 0 0 3 3h6.814a1.988 1.988 0 0 0 -.4-.586z"></path>
              <path d="m43.31 44.49-4.424-4.432a8.02 8.02 0 1 0 -2.828 2.828l4.432 4.424a1.994 1.994 0 1 0 2.82-2.82zm-16.31-8.49a5 5 0 1 1 5 5 5 5 0 0 1 -5-5z"></path>
            </g>
          </g>
        </svg>
      ),
    },
    {
      title: "TOTAL LEADS",
      value: data?.lead_count || 0,
      change: "",
      changeType: "neutral",
      subtitle: "Since last week",
      bgColor: "#FEF7DE",
      icon: (
        <svg
          id="fi_2195351"
          enable-background="new 0 0 512 512"
          viewBox="0 0 512 512"
          height={25}
          width={25}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m120.105 349.468-115.712 115.712c-5.858 5.858-5.858 15.355 0 21.213l21.213 21.214c2.813 2.813 6.628 4.393 10.607 4.393 3.978 0 7.793-1.58 10.607-4.393l115.712-115.712c-16.587-11.444-30.983-25.84-42.427-42.427z"></path>
          <path d="m479.747 411.206c-14.212 12.914-33.076 20.794-53.747 20.794-17.429 0-34.009-5.528-47.947-15.986-2.01-1.508-3.936-3.123-5.792-4.814-19.066 15.6-31.261 39.3-31.261 65.8v20c0 8.284 6.716 15 15 15h140c8.284 0 15-6.716 15-15v-20c0-26.496-12.191-50.193-31.253-65.794z"></path>
          <path d="m426 402c27.57 0 50-22.43 50-50s-22.43-50-50-50c-4.125 0-8.131.512-11.968 1.458-7.156 23.783-19.535 45.326-35.814 63.276 6.304 20.401 25.339 35.266 47.782 35.266z"></path>
          <path d="m480.747 109.206c-14.212 12.914-33.076 20.794-53.747 20.794-20.664 0-39.523-7.876-53.734-20.782-5.955 4.878-11.244 10.541-15.696 16.838 26.903 21.075 47.118 50.311 56.897 83.944h82.533c8.284 0 15-6.716 15-15v-20c0-26.496-12.191-50.193-31.253-65.794z"></path>
          <path d="m31.253 109.206c-19.062 15.6-31.253 39.298-31.253 65.794v20c0 8.284 6.716 15 15 15h82.533c9.779-33.634 29.993-62.869 56.897-83.944-4.452-6.297-9.741-11.96-15.696-16.838-14.211 12.906-33.07 20.782-53.734 20.782-20.67 0-39.534-7.88-53.747-20.794z"></path>
          <path d="m85 100c-27.57 0-50-22.43-50-50s22.431-50 50-50 50 22.43 50 50-22.43 50-50 50z"></path>
          <path d="m427 100c-27.57 0-50-22.43-50-50s22.43-50 50-50 50 22.43 50 50-22.43 50-50 50z"></path>
          <path d="m201.13 379.335c16.774 7.492 35.343 11.665 54.87 11.665s38.096-4.173 54.87-11.665v-25.616c-1.21-29.584-25.263-52.719-54.87-52.719s-53.66 23.135-54.87 52.718z"></path>
          <circle cx="256" cy="241" r="30"></circle>
          <path d="m256 121c-74.439 0-135 60.561-135 135 0 42.311 19.571 80.131 50.13 104.902v-7.473c0-.182.003-.364.01-.546.803-22.045 9.977-42.64 25.831-57.991 4.882-4.728 10.244-8.796 15.966-12.175-10.472-10.807-16.937-25.517-16.937-41.717 0-33.084 26.916-60 60-60s60 26.916 60 60c0 16.2-6.464 30.91-16.936 41.717 5.722 3.379 11.083 7.448 15.965 12.175 15.854 15.352 25.027 35.947 25.83 57.992.006.182.01.364.01.546v7.472c30.56-24.771 50.131-62.591 50.131-104.902 0-74.439-60.561-135-135-135z"></path>
        </svg>
      ),
    },
    {
      title: "TOTAL REVIEWS",
      value: data?.ratings?.length || 0,
      change: "",
      changeType: "neutral",
      subtitle: "Since last week",
      bgColor: "#D8E7FC",
      icon: (
        <svg
          id="fi_18168860"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          data-name="Layer 1"
          height={25}
          width={25}
        >
          <path
            d="m102.97 450.97v-109.23c0-6.86-5.6-12.46-12.46-12.46h-22.01c-6.86 0-12.46 5.6-12.46 12.46v109.23c0 6.84 5.62 12.48 12.46 12.48h22.01c6.86 0 12.46-5.63 12.46-12.48zm308.97-230.14 18.94 25.19c6.21 8.26 19.42 3.86 19.42-6.48v-183.67c0-17.83-14.54-32.37-32.37-32.37h-369.56c-17.83 0-32.37 14.55-32.37 32.37v119.67c0 17.83 14.55 32.37 32.37 32.37h337.7c10.51 0 19.56 4.52 25.88 12.92zm-176.84-157.47 11.59 35.91c.35 1.08 1.31 1.78 2.44 1.77l37.73-.07c2.48 0 3.52 3.18 1.51 4.64l-30.57 22.12c-.92.66-1.28 1.8-.93 2.87l11.73 35.86c.77 2.35-1.95 4.32-3.94 2.87l-30.48-22.24c-.91-.67-2.1-.67-3.02 0l-30.48 22.24c-2 1.46-4.71-.52-3.94-2.87l11.73-35.86c.35-1.08-.02-2.21-.93-2.87l-30.57-22.12c-2.01-1.45-.97-4.64 1.51-4.64l37.73.07c1.13 0 2.09-.7 2.44-1.77l11.59-35.91c.76-2.36 4.11-2.36 4.88 0zm139.73 0 11.59 35.91c.35 1.08 1.31 1.78 2.44 1.77l37.73-.07c2.48 0 3.52 3.18 1.51 4.64l-30.57 22.12c-.92.66-1.28 1.8-.93 2.87l11.73 35.86c.77 2.35-1.95 4.32-3.94 2.87l-30.48-22.24c-.91-.67-2.1-.67-3.02 0l-30.48 22.24c-2 1.46-4.71-.52-3.94-2.87l11.73-35.86c.35-1.08-.02-2.21-.93-2.87l-30.57-22.12c-2.01-1.45-.97-4.64 1.51-4.64l37.73.07c1.13 0 2.09-.7 2.44-1.77l11.59-35.91c.76-2.36 4.11-2.36 4.88 0zm-278.48 0 11.59 35.91c.35 1.08 1.31 1.78 2.44 1.77l37.73-.07c2.48 0 3.52 3.18 1.51 4.64l-30.57 22.12c-.92.66-1.28 1.8-.93 2.87l11.73 35.86c.77 2.35-1.95 4.32-3.94 2.87l-30.48-22.24c-.91-.67-2.1-.67-3.02 0l-30.48 22.24c-2 1.46-4.71-.52-3.94-2.87l11.73-35.86c.35-1.08-.02-2.21-.93-2.87l-30.57-22.12c-2.01-1.45-.97-4.64 1.51-4.64l37.73.07c1.13 0 2.09-.7 2.44-1.77l11.59-35.91c.76-2.36 4.11-2.36 4.88 0zm314.1 307.38c-43.26.65-79.18 33.09-85.31 74.87-1.23 8.37 2.2 16.2 9.19 20.97 23.13 15.8 57.23 21.92 76.12 21.92s52.99-6.12 76.12-21.92c6.99-4.77 10.42-12.6 9.19-20.97-6.13-41.78-42.05-74.21-85.31-74.87zm0-89.78c-22.26 0-40.3 18.04-40.3 40.3s18.04 40.3 40.3 40.3 40.3-18.04 40.3-40.3-18.04-40.3-40.3-40.3zm-221.82 48.54h74.91c7.13 0 12.99 5.86 12.99 12.99s-5.86 12.99-12.99 12.99h-8.25c-2.76 0-5 2.24-5 5s2.24 5 5 5c7.13 0 12.99 5.86 12.99 12.99s-5.85 12.99-12.99 12.99h-10.01c-2.76 0-5 2.24-5 5s2.24 5 5 5c7.13 0 12.99 5.85 12.99 12.99s-5.85 12.99-12.99 12.99h-9.13c-2.76 0-5 2.24-5 5s2.24 5 5 5c7.13 0 12.99 5.86 12.99 12.99s-5.85 12.99-12.99 12.99h-83.89c-14.5 0-31.18.39-39.29-14.04v-107.64c0-2.08-.28-4.09-.82-6 5.62-8.84 11.44-13.89 17.4-19.06 2.34-2.03 4.71-4.08 7.07-6.34 11.25-10.75 22.18-34.68 22.75-50.27.23-6.22 1.74-16.29 9.43-17.23 9.7-1.19 16.16 12.87 17.16 21.01 1.03 8.43-.64 14.43-2.23 20.14-2.71 9.72-5.22 18.74 2.13 35.15-2.57-.77-4.52-2.7-6-5.27-1.37-2.38-4.41-3.21-6.8-1.84-2.38 1.37-3.21 4.41-1.84 6.8 3.84 6.66 9.8 10.7 17.39 10.7z"
            fill-rule="evenodd"
          ></path>
        </svg>
      ),
    },
    {
      title: "WEBSITE VISIT",
      value: data?.website_count || 0,
      change: "",
      changeType: "neutral",
      subtitle: "Since last week",
      bgColor: "#FBE7F4",
      icon: (
        <svg
          id="fi_4620328"
          height={25}
          width={25}
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          data-name="Layer 1"
        >
          <path d="m27 5.9905a1 1 0 0 1 -.707-1.6975l3-3a1 1 0 0 1 1.414 1.414l-3 3a.9977.9977 0 0 1 -.707.2835z"></path>
          <path d="m29.9287 11h-1.9287a1 1 0 0 1 0-2h1.9287a1 1 0 0 1 0 2z"></path>
          <path d="m22 5a1 1 0 0 1 -1-1v-1.9287a1 1 0 0 1 2 0v1.9287a1 1 0 0 1 -1 1z"></path>
          <path d="m30 18.993a.9947.9947 0 0 1 -.707-.286l-3-3a1 1 0 0 1 1.414-1.414l3 3a1.0043 1.0043 0 0 1 -.707 1.7z"></path>
          <path d="m17 5.9941a.9939.9939 0 0 1 -.707-.2871l-3-3a1 1 0 0 1 1.414-1.414l3 3a1.0047 1.0047 0 0 1 -.707 1.7011z"></path>
          <path d="m23.3662 8.6343a2.1333 2.1333 0 0 0 -2.293-.49l-18.6855 7.1179a2.1559 2.1559 0 0 0 .1484 4.08l7.7061 2.312a.1551.1551 0 0 1 .1045.104l2.3115 7.7061a2.129 2.129 0 0 0 1.9863 1.5346 2.1654 2.1654 0 0 0 2.0938-1.3867l7.1181-18.686a2.13 2.13 0 0 0 -.4902-2.2919z"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="">
      <div className="w-full h-screen overflow-y-scroll hide-scroll  relative flex justify-between overflow-x-hidden">
        {/* header section  */}
        <section className="md:w-[68%] fixed md:left-[17.5%]  h-22 z-40 shadow-xs bg-white md:mx-auto rounded-b-2xl">
          <BusinessHeaderSection data={data} />
        </section>

        <section className="">
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </section>

        <section className="h-full md:w-[68%] max-md:left-[1%] max-md:w-[98%] mx-auto md:left-[17.5%] [20000px]:w-full hide-scroll absolute flex top-25 ">
          {/* for main dashboard data  */}
          <div className=" md:w-full space-y-2  ">
            <section className="bg-[#D1E9FD]  md:w-full   rounded-xl flex justify-between md:pl-10 px-2">
              <div className="py-5">
                <h6 className="md:text-2xl text-sm font-extrabold">
                  Grow Faster. Sell Smarter.
                </h6>
                <div className="max-md:flex gap-2 max-md:mt-2 items-center">
                  <p className="font-semibold max-md:font-bold max-md:text-[10px] whitespace-nowrap">
                    Select a Plan Now
                  </p>
                  <button className="bg-orange-500 text-[10px] whitespace-nowrap md:text-[15px] font-bold text-white px-3 md:px-7 md:mt-3 rounded-md py-1 ">
                    GET 50% OFF
                  </button>
                </div>
                <p className="text-orange-500 text-xs font-semibold mt-1.5">
                  Limited Period Offer!
                </p>
              </div>

              <div className=" max-h-45 md:p-3 w-[40%]  max-md:min-w-[40%] relative ">
                <Image
                  src="/assets/dashboard/slider-img/illustrator1.png"
                  alt="illustrator"
                  height={500}
                  width={500}
                  className="object-contain  max-md:hidded  h-full w-full"
                />
              </div>
            </section>
            {/* dashboard overview */}
            <section></section>
            {/* Header */}
            <div className="flex items-center justify-between px-2 mb-3">
              <h1 className=" font-bold max-md:text-base text-gray-900">
                OVERVIEW
              </h1>
              {/* <div className="flex items-center space-x-2 bg-orange-100 px-2 py-3 rounded-lg">
                <span className="  max-md:scale-90 rounded-sm">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 1.59039L10.9965 1.5904V0.531374C10.9965 0.23779 10.7727 0 10.4965 0C10.2203 0 9.9965 0.23779 9.9965 0.531374V1.59014H5.9965V0.531374C5.9965 0.23779 5.77275 0 5.4965 0C5.22025 0 4.9965 0.23779 4.9965 0.531374V1.59014H1C0.44775 1.59014 0 2.06598 0 2.65289V15.9373C0 16.5241 0.44775 17 1 17H15C15.5522 17 16 16.5241 16 15.9373V2.65289C16 2.06623 15.5522 1.59039 15 1.59039ZM15 15.9373H1V2.65289H4.9965V3.18825C4.9965 3.48181 5.22025 3.71962 5.4965 3.71962C5.77275 3.71962 5.9965 3.48181 5.9965 3.18825V2.65315H9.9965V3.18851C9.9965 3.4821 10.2203 3.71989 10.4965 3.71989C10.7727 3.71989 10.9965 3.4821 10.9965 3.18851V2.65315H15V15.9373ZM11.5 8.49826H12.5C12.776 8.49826 13 8.2602 13 7.96688V6.90413C13 6.61081 12.776 6.37276 12.5 6.37276H11.5C11.224 6.37276 11 6.61081 11 6.90413V7.96688C11 8.2602 11.224 8.49826 11.5 8.49826ZM11.5 12.749H12.5C12.776 12.749 13 12.5112 13 12.2176V11.1549C13 10.8615 12.776 10.6235 12.5 10.6235H11.5C11.224 10.6235 11 10.8615 11 11.1549V12.2176C11 12.5115 11.224 12.749 11.5 12.749ZM8.5 10.6235H7.5C7.224 10.6235 7 10.8615 7 11.1549V12.2176C7 12.5112 7.224 12.749 7.5 12.749H8.5C8.776 12.749 9 12.5112 9 12.2176V11.1549C9 10.8618 8.776 10.6235 8.5 10.6235ZM8.5 6.37276H7.5C7.224 6.37276 7 6.61081 7 6.90413V7.96688C7 8.2602 7.224 8.49826 7.5 8.49826H8.5C8.776 8.49826 9 8.2602 9 7.96688V6.90413C9 6.61055 8.776 6.37276 8.5 6.37276ZM4.5 6.37276H3.5C3.224 6.37276 3 6.61081 3 6.90413V7.96688C3 8.2602 3.224 8.49826 3.5 8.49826H4.5C4.776 8.49826 5 8.2602 5 7.96688V6.90413C5 6.61055 4.776 6.37276 4.5 6.37276ZM4.5 10.6235H3.5C3.224 10.6235 3 10.8615 3 11.1549V12.2176C3 12.5112 3.224 12.749 3.5 12.749H4.5C4.776 12.749 5 12.5112 5 12.2176V11.1549C5 10.8618 4.776 10.6235 4.5 10.6235Z"
                      fill="#FF6E04"
                    />
                  </svg>
                </span>
                <span className="text-xs font-semibold  ">WEEKLY</span>
                <span className=" rounded-sm">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 7 4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M3.91248 3.83264C3.68469 4.05579 3.31532 4.05579 3.08753 3.83264L0.170853 0.975495C-0.0569509 0.752335 -0.0569509 0.390527 0.170853 0.167366C0.398663 -0.0557888 0.768007 -0.0557888 0.995816 0.167366L3.50001 2.62047L6.0042 0.167366C6.232 -0.0557888 6.60136 -0.0557888 6.82916 0.167366C7.05695 0.390527 7.05695 0.752335 6.82916 0.975495L3.91248 3.83264Z"
                      fill="#070707"
                    />
                  </svg>
                </span>
              </div> */}
            </div>

            {/* small cards */}
            <div className="  ">
              <div className="  flex max-md:flex-wrap jmd:ustify-between gap-3">
                {statsData.map((stat, index) => (
                  <div
                    style={{ backgroundColor: stat.bgColor }}
                    key={index}
                    className={`  md:h-28 p-2 rounded-lg md:w-full  flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs max-md:tracking-tighter text-[10px] tracking-tighter whitespace-nowrap font-bold">
                          {stat.title}
                        </span>
                        <span className="max-md:scale-90">{stat.icon}</span>
                      </div>
                      <div className="mb-1">
                        <span className="text-xl font-[1000] text-gray-900">
                          {stat.value}
                        </span>
                        {stat.change && (
                          <span
                            className={`ml-2 text-xs px-2 max-md:px-[2px] font-bold max-md:text-[10px] py-0.5 rounded ${
                              stat.changeType === "positive"
                                ? "bg-green-500 text-white"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {stat.change}
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] tracking-tighter font-[500]">
                        {stat.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* graph */}
            <div className="">
              <div className=" rounded-lg border border-gray-200 shadow-lg px-2 h-full flex flex-col justify-between">
                <div>
                  {/* <div className="flex items-center  px-3 mt-2 justify-between mb-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Leads Analytics
                    </h2>
                    <span className="w-4 h-4 bg-red-500 rounded-sm"></span>
                  </div> */}

                  {/* Stats */}
                  {/* <div className=" flex gap-4 px-3">
                    {leadsData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1 justify-between mb-2"
                      >
                        <span className={` font-bold ${item.color}`}>
                          {item.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.description}
                        </span>
                      </div>
                    ))}
                  </div> */}
                  {/* <div className="w-full h-47">
                    <Graph />
                  </div> */}
                </div>
              </div>
            </div>

            {/* quick edit section */}
            {/* <QuickEdit data={data} /> */}

            {/* leads table */}
            <RecentLeads queries={data?.queries} />

            {/* customer slider */}
            {/* custom slider */}
            <div className="w-full bg-[#E8F4FF] h-auto md:flex justify-between p-5 md:py-8 md:px-10">
              {/* left section */}
              <div className=" md:w-[20rem] space-y-3">
                {/* qoute icon */}
                <span className="">
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 119 119"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M75.8711 118.779V72.486C75.8711 26.7258 90.2518 2.5638 119 0V24.839C108.614 29.2083 103.423 38.9174 103.423 53.9706H119V118.779H75.8711Z"
                      fill="#FF6E04"
                    />
                    <path
                      d="M0 118.779V72.486C0 26.7258 14.3808 2.5638 43.1287 0V24.839C32.7426 29.2083 27.5473 38.9174 27.5473 53.9706H43.1287V118.779H0Z"
                      fill="#FF6E04"
                    />
                  </svg>
                </span>
                <h4 className="md:text-2xl max-md:text-xl  text-[#323232]  mt-4 tracking-widest font-extrabold">
                  Our Customer Success Stories
                </h4>
                <p className=" font-[500] w-[] ">
                  <strong className="font-bold text-lg text-orange-500">
                    {" "}
                    45,000+
                  </strong>{" "}
                  businesses trusts Address Guru to bring them closer to their
                  customers & grow their reach..
                </p>

                <button className="text-[11px] font-[500] bg-orange-500 px-3 py-2 rounded-sm  text-white uppercase cursor-pointer">
                  see more stories
                </button>
                <h5 className="text-xl font-[1000] text-orange-500">
                  {" "}
                  Hurry, be one of them!
                </h5>
              </div>
              {/* right slider section */}
              <div className=" relative 2xl:left-50 max-md:px-10 scale-85">
                <ReviewSlider />
              </div>
            </div>
          </div>
        </section>

        {/* ads section */}
        <section className="fixed max-md:hidden right-0 w-[15%] h-screen p-3 ">
          <span className="flex items-center  shadow-xs gap-2 md:gap-3 text-sm font-[500]  md:py-2 rounded-lg bg-[#FFF8F3] p-3 md:px-7">
            <svg
              width="16"
              height="18"
              viewBox="0 0 16 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.70004 15.8204C6.6968 15.5069 6.80695 15.2028 7.0102 14.9641C7.21345 14.7255 7.4961 14.5683 7.8061 14.5215C8.11609 14.4747 8.43253 14.5416 8.69714 14.7097C8.96175 14.8778 9.15668 15.1359 9.24604 15.4364C10.1574 15.4448 11.049 15.1706 11.798 14.6514C12.2238 14.3415 12.5167 13.8821 12.618 13.3654H11.909C11.8108 13.3609 11.7179 13.3195 11.6489 13.2494C11.5799 13.1793 11.54 13.0857 11.537 12.9874V7.69841C11.5424 7.60102 11.5832 7.50895 11.6517 7.43952C11.7202 7.37009 11.8117 7.32809 11.909 7.32141H12.653V5.62141C12.6713 4.99929 12.5645 4.37983 12.339 3.79972C12.1136 3.2196 11.774 2.69063 11.3404 2.24413C10.9068 1.79763 10.388 1.44268 9.81475 1.20029C9.2415 0.957903 8.62543 0.833012 8.00304 0.833012C7.38065 0.833012 6.76459 0.957903 6.19134 1.20029C5.61809 1.44268 5.0993 1.79763 4.66571 2.24413C4.23211 2.69063 3.89252 3.2196 3.66705 3.79972C3.44157 4.37983 3.3348 4.99929 3.35304 5.62141V7.32141H4.09704C4.1952 7.32566 4.28811 7.36689 4.35711 7.43682C4.42612 7.50675 4.46611 7.60021 4.46904 7.69841V12.9874C4.46612 13.0857 4.42617 13.1793 4.35719 13.2494C4.2882 13.3195 4.19529 13.3609 4.09704 13.3654H2.23304C1.63655 13.3601 1.0665 13.1185 0.647897 12.6935C0.229296 12.2686 -0.003686 11.6949 4.41095e-05 11.0984V9.58741C-0.003686 8.9909 0.229296 8.41727 0.647897 7.99229C1.0665 7.56732 1.63655 7.32569 2.23304 7.32041H2.60004V5.62041C2.57034 4.89332 2.6879 4.16773 2.94567 3.48722C3.20343 2.80671 3.59607 2.18531 4.10002 1.66036C4.60397 1.13541 5.20882 0.717726 5.87824 0.432403C6.54766 0.147079 7.26785 0 7.99554 0C8.72324 0 9.44342 0.147079 10.1128 0.432403C10.7823 0.717726 11.3871 1.13541 11.8911 1.66036C12.395 2.18531 12.7877 2.80671 13.0454 3.48722C13.3032 4.16773 13.4207 4.89332 13.391 5.62041V7.32041H13.763C14.3601 7.3249 14.9311 7.56614 15.3505 7.99118C15.7699 8.41621 16.0035 8.9903 16 9.58741V11.0984C16.0035 11.6947 15.7704 12.2681 15.3518 12.6929C14.9333 13.1176 14.3634 13.3591 13.767 13.3644H13.367C13.2553 14.1155 12.8522 14.7923 12.245 15.2484C11.3703 15.8685 10.3232 16.1986 9.25104 16.1924C9.16535 16.4961 8.97213 16.7582 8.70741 16.93C8.44269 17.1017 8.12455 17.1713 7.81232 17.1257C7.50008 17.0802 7.21506 16.9227 7.01041 16.6825C6.80576 16.4423 6.69545 16.1359 6.70004 15.8204Z"
                fill="#FF6E04"
              />
            </svg>
            <p className="max-md:text-xs whitespace-nowrap">Live Support</p>
          </span>

          {/* for ads section */}
          <div className="flex flex-col fixed right-0 h-full max-md:hidden  pb-2 w-[12.5%] top-23 mr-2 gap-2">
            <div className="bg-red-100 w-full max-h-[42%] rounded-sm text-center">
              <Image
                src="/assets/dashboard/add.png"
                alt="ads"
                height={500}
                width={500}
                className="h-full"
              />
            </div>

            <div className="bg-red-100 w-full max-h-[42%] rounded-sm text-center">
              <Image
                src="/assets/dashboard/add.png"
                alt="ads"
                height={500}
                width={500}
                className="h-full"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ListingDetails;
