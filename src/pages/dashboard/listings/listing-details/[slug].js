import { get_listing_data } from "@/api/listing-form";
import { get_my_leads } from "@/api/uae-dashboard";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import DashboardOverview from "@/components/Dashboard/DashboardOverview";
import Graph from "@/components/Dashboard/Graph";
import BusinessHeaderSection from "@/components/Dashboard/MyListing/BusinessHeaderSection";
import QuickEdit from "@/components/Dashboard/MyListing/QuickEdit";
import RecentLeads from "@/components/Dashboard/RecentLeads";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";

const ListingDetails = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [leadsData, setLeadsData] = useState([]);

  const getListings = useCallback(
    async (slug) => {
      try {
        const res = await get_listing_data(slug);
        console.log("single listing data", res?.data?.data);
        setData(res?.data?.data);
        if (res?.data?.data?._id) {
          const res2 = await get_my_leads(res?.data?.data?._id);
          console.log("my leads", res2?.result);
          if (res2?.success) {
            setLeadsData(res2?.result);
          }
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
      }
    },
    [slug],
  );

  useEffect(() => {
    if (slug) {
      getListings(slug);
    }
  }, [slug]);

  // const statsData = [
  //   {
  //     title: "TOTAL VIEWS",
  //     value: data?.statistics?.totalViews || 0,
  //     changeType: "positive",
  //     subtitle: "Since last week",
  //     bgColor: "#FBF0ED",
  //     icon: <Eye size={18} />,
  //   },
  //   {
  //     title: "TOTAL WHATSAP",
  //     value: data?.statistics?.totalCalls || 0,
  //     changeType: "positive",
  //     subtitle: "Since last week",
  //     bgColor: "#E8F7F4",
  //     icon: <Phone size={18} />,
  //   },
  //   {
  //     title: "TOTAL LEADS",
  //     value: data?.statistics?.totalLeads || 0,
  //     changeType: "neutral",
  //     subtitle: "Since last week",
  //     bgColor: "#FEF7DE",
  //     icon: <UserPlus size={18} />,
  //   },
  //   {
  //     title: "TOTAL REVIEWS",
  //     value: data?.statistics?.totalReviews || 0,
  //     changeType: "neutral",
  //     subtitle: "Since last week",
  //     bgColor: "#D8E7FC",
  //     icon: <Star size={18} />,
  //   },
  //   {
  //     title: "WEBSITE VISIT",
  //     value: data?.statistics?.totalWebsiteVisits || 0,
  //     changeType: "neutral",
  //     subtitle: "Since last week",
  //     bgColor: "#FBE7F4",
  //     icon: <Globe size={18} />,
  //   },
  // ];

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen flex flex-col">
        {/* Fixed Header Section */}
        <section className="sticky top-[-25px] z-50 w-full bg-white border-b border-gray-100    pb-3 mb-4">
          <div className="w-full mx-auto">
            <BusinessHeaderSection data={data} />
          </div>
        </section>

        {/* Main Content Section */}
        <section className="flex-1 w-full  mx-auto px-2 md:px-0 py-4">
          <div className="w-full space-y-3">

            {/* Dashboard Overview */}
            <div className="bg-white rounded-xl p-4">
              <DashboardOverview data={data} />
            </div>

            {/* Graph */}
            <div className="w-full">
              <Graph stats={data?.statistics} />
            </div>

            {/* Recent Leads */}
            <div>
              <RecentLeads queries={leadsData} />
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ListingDetails;

{
  /* customer slider */
}
// <div className="w-full bg-[#E8F4FF] h-auto md:flex justify-between p-5 md:py-8 md:px-10">
//   <div className=" md:w-[20rem] space-y-3">
//     <span className="">
//       <svg
//         width="100"
//         height="100"
//         viewBox="0 0 119 119"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           d="M75.8711 118.779V72.486C75.8711 26.7258 90.2518 2.5638 119 0V24.839C108.614 29.2083 103.423 38.9174 103.423 53.9706H119V118.779H75.8711Z"
//           fill="#FF6E04"
//         />
//         <path
//           d="M0 118.779V72.486C0 26.7258 14.3808 2.5638 43.1287 0V24.839C32.7426 29.2083 27.5473 38.9174 27.5473 53.9706H43.1287V118.779H0Z"
//           fill="#FF6E04"
//         />
//       </svg>
//     </span>
//     <h4 className="md:text-2xl max-md:text-xl  text-[#323232]  mt-4 tracking-widest font-extrabold">
//       Our Customer Success Stories
//     </h4>
//     <p className=" font-[500] w-[] ">
//       <strong className="font-bold text-lg text-orange-500">
//         {" "}
//         45,000+
//       </strong>{" "}
//       businesses trusts AddressGuru UAE to bring them closer to their
//       customers & grow their reach..
//     </p>

//     <button className="text-[11px] font-[500] bg-orange-500 px-3 py-2 rounded-sm  text-white uppercase cursor-pointer">
//       see more stories
//     </button>
//     <h5 className="text-xl font-[1000] text-orange-500">
//       {" "}
//       Hurry, be one of them!
//     </h5>
//   </div>
//   {/* right slider section */}
//   <div className=" relative 2xl:left-50 max-md:px-10 scale-85">
//     <ReviewSlider />
//   </div>
// </div>
