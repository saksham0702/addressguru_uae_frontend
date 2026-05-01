

import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import CountCard from "@/components/Dashboard/CountCard";
import DashboardOverview from "@/components/Dashboard/DashboardOverview";
import MyListings from "@/components/Dashboard/MyListings";
import Graph from "@/components/Dashboard/Graph";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import {
  get_user_listings,
  get_job_listings,
  get_marketplace_listings,
  get_property_listings,
} from "@/api/uae-dashboard";
import { get_listing_stats } from "@/api/listingStats";

const Dashboard = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const API_URL = "https://addressguru.ae/api";

  const [data, setData] = useState(null);
  const [myListings, setMyListings] = useState(null);

  // Auth guard
  useEffect(() => {
    if (loading) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!user && !token) router.replace("/");
  }, [user, loading, router]);

  // Stats
  useEffect(() => {
    get_listing_stats().then((res) => {
      if (res?.status) setData(res?.data);
    });
  }, []);

  // Listings (only what dashboard overview needs)
  const fetchListings = () => {
    get_user_listings().then((res) => {
      if (res) setMyListings(res?.listings);
    });
  };

  useEffect(() => {
    if (!user) return;
    fetchListings();
  }, [user]);

  if (loading || !user) return null;

  // CountCards — clicking navigates to dedicated pages
  const countData = [
    {
      route: "/dashboard/listings",
      image: "count-listings.png",
      title: "YOUR LISTING",
      count: data?.listingCounts?.business,
    },
    {
      route: "/dashboard/marketplace",
      image: "count-products.png",
      title: "PRODUCTS",
      count: data?.listingCounts?.products,
    },
    {
      route: "/dashboard/jobs",
      image: "count-jobs.png",
      title: "JOBS",
      count: data?.listingCounts?.jobs,
    },
    {
      route: "/dashboard/properties",
      image: "count-properties.png",
      title: "PROPERTIES",
      count: data?.listingCounts?.properties,
    },
    {
      route: null, // reviews stay on dashboard
      image: "count-reviews.png",
      title: "REVIEWS",
      count: data?.overview?.totalReviews,
    },
  ];

  return (
    <DashboardLayout>
      {/* BANNER */}
      <section className="bg-[#D1E9FD] w-full rounded-xl flex justify-between pl-8 pr-0 mb-6">
        <div className="py-6">
          <h6 className="text-2xl font-extrabold">
            Grow Faster. Sell Smarter.
          </h6>
          <p className="font-semibold mt-1">Select a Plan Now</p>
          <button className="bg-orange-500 text-sm font-bold text-white px-7 mt-3 rounded-md py-2">
            GET 50% OFF
          </button>
          <p className="text-orange-500 text-xs font-semibold mt-2">
            Limited Period Offer!
          </p>
        </div>
        <div className="w-[35%] max-h-40  mt-3">
          <Image
            src="/assets/illustrator.png"
            alt="illustrator"
            height={500}
            width={500}
            className="object-contain h-full w-full"
          />
        </div>
      </section>

      {/* COUNT CARDS */}
      <div className="flex gap-3 flex-wrap mb-6">
        {countData.map((item, index) => (
          <CountCard
            key={index}
            data={item}
            // navigate to dedicated page, skip if no route
            onClick={() => item.route && router.push(item.route)}
          />
        ))}
      </div>

      {/* GRAPH */}
      <div className="bg-white rounded-xl p-4 mb-6">
        <Graph stats={data?.overview} />
      </div>

      {/* OVERVIEW */}
      <div className="bg-white rounded-xl p-4 mb-6">
        <DashboardOverview data={data} />
      </div>

      {/* RECENT LISTINGS PREVIEW */}
      <div className="bg-white rounded-xl p-4 mb-6">
        <MyListings data={myListings} onRefresh={fetchListings} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
