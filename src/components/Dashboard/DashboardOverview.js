import React from "react";
import { Eye, Phone, UserPlus, Star, Globe } from "lucide-react";

const DashboardOverview = ({ data }) => {
  const statsData = [
    {
      title: "TOTAL VIEWS",
      value: data?.overview?.totalViews || data?.statistics?.totalViews || 0,
      subtitle: "Since last week",
      bgColor: "#FBF0ED",
      icon: <Eye size={18} />,
    },
    {
      title: "TOTAL CALLS",
      value: data?.overview?.totalCalls || data?.statistics?.totalCalls || 0,
      subtitle: "Since last week",
      bgColor: "#E8F7F4",
      icon: <Phone size={18} />,
    },
    {
      title: "TOTAL LEADS",
      value: data?.overview?.totalLeads || data?.statistics?.totalLeads || 0,
      subtitle: "Since last week",
      bgColor: "#FEF7DE",
      icon: <UserPlus size={18} />,
    },
    {
      title: "TOTAL REVIEWS",
      value: data?.overview?.totalReviews || data?.statistics?.totalReviews || 0,
      subtitle: "Since last week",
      bgColor: "#D8E7FC",
      icon: <Star size={18} />,
    },
    {
      title: "WEBSITE VISITS",
      value: data?.overview?.websiteVisits || data?.statistics?.totalWebsiteVisits || 0,
      subtitle: "Since last week",
      bgColor: "#FBE7F4",
      icon: <Globe size={18} />,
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-sm font-bold text-gray-900 tracking-wide">
          TOTAL OVERVIEW
        </h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {statsData.map((stat, index) => (
          <div
            key={index}
            style={{ backgroundColor: stat.bgColor }}
            className="rounded-xl p-3 flex flex-col justify-between h-[100px]"
          >
            {/* Top */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-tight text-gray-700">
                {stat.title}
              </span>

              <div className="bg-white/70 p-1.5 rounded-md shadow-sm">
                {stat.icon}
              </div>
            </div>

            {/* Value */}
            <div>
              <p className="text-lg font-extrabold text-gray-900 leading-none">
                {stat.value}
              </p>
              <p className="text-[9px] text-gray-600 mt-1">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;
