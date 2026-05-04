"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { LayoutDashboard, Briefcase, Package, Home, List, User } from "lucide-react";

const DashboardSidebar = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [showLogoutPop, setShowLogoutPop] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ✅ MENU (clean + lucide icons)
  const menuItems = [
    {
      label: "Dashboard",
      link: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "Listings",
      link: "/dashboard/listings",
      icon: <List size={18} />,
    },
    {
      label: "Jobs",
      link: "/dashboard/jobs",
      icon: <Briefcase size={18} />,
    },
    {
      label: "Marketplace",
      link: "/dashboard/marketplace",
      icon: <Package size={18} />,
    },
    {
      label: "Properties",
      link: "/dashboard/properties",
      icon: <Home size={18} />,
    },
    {
      label: "My Profile",
      link: "/dashboard/my-profile",
      icon: <User size={18} />,
    },
  ];

  // ✅ NAVIGATION FIX
  const handleNavigation = (link) => {
    if (link === "/") {
      window.open("https://addressguru.ae", "_blank");
      return;
    }
    router.push(link);
  };

  return (
    <div className="w-60 h-screen flex flex-col fixed left-0 top-0 border-r border-gray-200 bg-white transition-all duration-300 z-40">
      {/* HEADER */}
      {/* <div className="p-2 flex justify-between items-center">
        <span className="font-bold text-lg">AG</span>
      </div> */}

      {/* USER */}
      <div className="p-2 text-center mt-5">
        <div className="w-12 h-12 bg-orange-500 rounded-full mx-auto flex items-center justify-center text-white font-bold">
          {user?.data?.name?.[0]}
        </div>
        {!isCollapsed && (
          <p className="text-sm mt-2 font-semibold">{user?.data?.name}</p>
        )}
      </div>

      {/* MENU */}
      <div className="flex-1 py-2">
        {menuItems.map((item, index) => {
          const isActive = router.pathname === item.link;

          return (
            <div
              key={index}
              onClick={() => handleNavigation(item.link)}
              className={`mb-1 cursor-pointer flex items-center gap-2 py-2 px-3 mx-2 rounded-lg transition-all
                ${
                  isActive
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-orange-100"
                }
              `}
            >
              <span>{item.icon}</span>

              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}

              {/* {isActive && !isCollapsed && (
                <div className="ml-auto w-1 h-5 bg-white rounded-full" />
              )} */}
            </div>
          );
        })}
      </div>

      {/* BOTTOM */}
      <div className=" border-t p-4 border-gray-200 flex flex-col items-center gap-4 ">
        <div className="h-22 w-[80%] mx-auto bg-[#FFF8F3] text-center flex flex-col items-center  justify-around p-3 border-orange-500 border-dashed border rounded-xl">
          <svg
            width="20"
            height="16"
            viewBox="0 0 20 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.87502 15.9821L0.375023 13.6821C0.268304 13.66 0.172551 13.6016 0.104146 13.5168C0.035741 13.432 -0.00106535 13.326 2.34826e-05 13.2171V0.482061C-0.000143304 0.406476 0.0175053 0.331916 0.0515382 0.264426C0.0855711 0.196936 0.13503 0.138416 0.195905 0.0936125C0.25678 0.0488086 0.327357 0.0189816 0.401913 0.00655018C0.476469 -0.00588125 0.552905 -0.000567203 0.625023 0.0220614L10 2.30006L19.375 0.0220614C19.4471 -0.000567203 19.5236 -0.00588125 19.5981 0.00655018C19.6727 0.0189816 19.7433 0.0488086 19.8041 0.0936125C19.865 0.138416 19.9145 0.196936 19.9485 0.264426C19.9825 0.331916 20.0002 0.406476 20 0.482061V13.2171C20.0002 13.3252 19.9631 13.4301 19.895 13.5141C19.8269 13.5981 19.7319 13.656 19.626 13.6781L10.126 15.9781C10.0854 15.9919 10.0429 15.9993 10 16.0001C9.95769 16.0004 9.91554 15.9944 9.87502 15.9821Z"
              fill="#FF6E04"
            />
            <line
              x1="10"
              y1="3.5"
              x2="10"
              y2="14.5"
              stroke="white"
              stroke-linecap="round"
            />
          </svg>
          <h4 className="font-semibold text-xs">Need Help</h4>
          <p className="text-[11px] font-medium  tracking-tighter">
            Check our FAQ documentation
          </p>
        </div>

        <span className="bg-[#FFF8F3] flex gap-2 items-center px-3 rounded-xl text-sm 2xl:text-md py-1.5">
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

          <p>Live Support</p>
        </span>
      </div>
    </div>
  );
};

export default DashboardSidebar;
