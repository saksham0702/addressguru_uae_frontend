"use client";
import CountCard from "@/components/Dashboard/CountCard";
import DashboardNavbar from "@/components/Dashboard/DashboardNavbar";
import DashboardOverview from "@/components/Dashboard/DashboardOverview";
import PostAdsPop from "@/components/Dashboard/Popups/PostAdsPop";
import RecentLeads from "@/components/Dashboard/RecentLeads";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/HeadersMobile/Dashboard";
import MyListings from "@/components/Dashboard/MyListings";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";

// import { get_dashboard_data } from "@/api/dashboard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import MyJobListings from "@/components/Dashboard/MyJobListings";
import MyMarketplaceListings from "@/components/Dashboard/MyMarketplace";
import MyPropertyListings from "@/components/Dashboard/MyProperties";
import {
  get_job_listings,
  get_marketplace_listings,
  get_property_listings,
  get_user_listings,
} from "@/api/uae-dashboard";
import { get_listing_stats } from "@/api/listingStats";

const Dashboard = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const API_URL = "https://addressguru.ae/api";
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [myListings, setMyListings] = useState(null);
  const [myJobs, setMyJobs] = useState(null);
  const [myProperties, setMyProperties] = useState(null);
  const [myMarketplace, setMyMarketplace] = useState(null);
  const [postAdd, setPostAdd] = useState(false);


  const token = localStorage.getItem("authToken");

  const getListingStats = async () => {
    const res = await get_listing_stats();
    if (res?.status) {
      setData(res?.data);
    }
  }
  useEffect(() => {
    if (loading) return;
    if (!user && !token) {
      router.replace("/");
    }
    getListingStats();
  }, [user, loading, router]);

  // const getDashboardData = async () => {
  //   const res = await get_dashboard_data();
  //   if (res?.success) {
  //     setData(res?.data);
  //   }
  // };
  const getUserListings = async (type) => {
    const listres = await get_user_listings();
    const jobres = await get_job_listings();
    const marketplaceres = await get_marketplace_listings();
    const propertyres = await get_property_listings();

    if (listres) setMyListings(listres?.listings);

    if (jobres) setMyJobs(jobres);

    if (marketplaceres) setMyMarketplace(marketplaceres);

    if (propertyres) setMyProperties(propertyres);
    // if (res?.data?.success && type === "marketplace")
    //   setMyMarketplace(res?.data?.data);
    // if (res?.data?.success && type === "property")
    //   setMyProperties(res?.data?.data);
  };

  useEffect(() => {
    if (!user) return;
    // getDashboardData();
    getUserListings("listing");
    getListingStats();
    // getUserListings("jobs");
    // getUserListings("property");
    // getUserListings("marketplace");
  }, [user]);

  if (loading || !user) return null;


  const countData = [
    { image: "/count-listing", title: "YOUR LISTING", count: data?.listingCounts?.business },
    { image: "/count-products", title: "PRODUCTS", count: data?.listingCounts?.products },
    { image: "/count-jobs", title: "JOBS", count: data?.listingCounts?.jobs },
    {
      image: "/count-properties",
      title: "PROPERTIES",
      count: data?.listingCounts?.properties,
    },
    { image: "/count-reviews", title: "REVIEWS", count: data?.overview?.totalReviews },
  ];

  const renderSection = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="md:w-[82.5%] mr-2">
            <section className="bg-[#D1E9FD] w-[98%] md:w-full mx-auto min-h-40 rounded-xl flex justify-between md:pl-10 px-2">
              <div className="py-5">
                <h6 className="md:text-2xl text-sm font-extrabold">
                  Grow Faster. Sell Smarter.
                </h6>
                <div className="max-md:flex gap-2 max-md:mt-2 items-center">
                  <p className="font-semibold max-md:font-bold max-md:text-[10px] whitespace-nowrap">
                    Select a Plan Now
                  </p>
                  <button className="bg-orange-500 text-[10px] whitespace-nowrap md:text-[15px] font-bold text-white px-3 md:px-7 md:mt-3 rounded-md py-1">
                    GET 50% OFF
                  </button>
                </div>
                <p className="text-orange-500 text-xs font-semibold mt-1.5">
                  Limited Period Offer!
                </p>
              </div>
              <div className="max-h-45 md:p-3 w-[40%] max-md:min-w-[40%] relative">
                <Image
                  src="/assets/dashboard/illustrator1.png"
                  alt="illustrator"
                  height={500}
                  width={500}
                  className="object-contain max-md:hidded h-full w-full"
                />
              </div>
            </section>

            <div className="flex gap-2 max-md:flex-wrap my-5">
              {countData.map((item, index) => (
                <CountCard key={index} data={item} />
              ))}
            </div>

            <div className="w-full bg-white z-30">
              <DashboardOverview data={data} />
            </div>

            <section className="my-5 space-y-5">
              <MyListings data={myListings} APP_URL={API_URL} />
              {/* <MyMarketplaceListings data={myMarketplace} />
              <MyPropertyListings data={myProperties} /> */}

              {/* <MyJobListings data={myJobs} /> */}
            </section>
          </div>
        );

      case "my-listings":
        return (
          <div className="md-max-w-[80%]">
            <section className="my-5 space-y-5">
              <MyListings data={myListings} APP_URL={API_URL} />
            </section>
          </div>
        );

      case "my-jobs":
        return (
          <div className="md-max-w-[80%] w-full max-w-[80%]">
            <section className="my-5 space-y-5">
              <MyJobListings data={myJobs} />
            </section>
          </div>
        );

      case "my-marketplace":
        return (
          <div className="md-max-w-[80%] w-full max-w-[80%]">
            <section className="my-5 space-y-5">
              <MyMarketplaceListings data={myMarketplace} />
            </section>
          </div>
        );

      case "my-property":
        return (
          <div className="md-max-w-[80%] w-full max-w-[80%]">
            <section className="my-5 space-y-5">
              <MyPropertyListings data={myProperties} />
            </section>
          </div>
        );

      default:
        return <MyListings />;
    }
  };

  return (
    <>
      <div className="w-full h-screen overflow-y-scroll hide-scroll relative flex justify-between overflow-x-hidden">
        <div className="w-[17%] h-full fixed top-0 left-0 z-10">
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <DashboardNavbar user={user} setPostAdd={setPostAdd} />
        <div className="md:hidden w-full">
          <Header />
        </div>
        <section className="h-full md:w-[82.5%] w-[99%] mx-auto [20000px]:w-full hide-scroll absolute flex top-21 right-0">
          {renderSection()}
          <div className="flex flex-col fixed right-0 h-full max-md:hidden pb-2 w-[12.5%] mr-2 gap-2">
            <div className="bg-red-100 w-full max-h-[43%] rounded-sm text-center">
              <Image
                src="/assets/dashboard/add.png"
                alt="ads"
                height={500}
                width={500}
                className="h-full"
              />
            </div>
            <div className="bg-red-100 w-full max-h-[43%] rounded-sm text-center">
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

      {postAdd && <PostAdsPop postAdd={postAdd} setPostAdd={setPostAdd} />}
    </>
  );
};

export default Dashboard;
