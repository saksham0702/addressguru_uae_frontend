import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Image from "next/image";

const DashboardNavbar = ({ setPostAdd, user }) => {
  const [logPop, setLogPop] = useState(false);
  const router = useRouter();
  const { setToken } = useAuth();

  const handleLogout = () => {
    router.push("/");
    setToken(null);
    localStorage.removeItem("authToken");
  };

  return (
    <nav className="bg-white h-[70px] px-6 flex items-center justify-between fixed top-0 right-0 w-[82.5%] shadow-sm rounded-bl-xl z-50 max-md:hidden">
      {/* 🔶 Logo */}
      <div
        onClick={() => router.push("/")}
        className="cursor-pointer flex items-center"
      >
        {/* Replace src with your logo */}
        <Image
          src="/assets/addressguru_logo.png"
          alt="logo"
          width={500}
          height={500}
          className="h-10 w-40 object-contain"
        />
      </div>

      {/* 🔶 Right Section */}
      <div className="flex items-center gap-6">
        {/* Post Ads Button */}
        <button
          onClick={() => setPostAdd(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-md shadow-sm hover:shadow-md hover:scale-105 transition duration-300"
        >
          Post Your Ads +
        </button>

        {/* Profile Section */}
        <div className="relative flex items-center cursor-pointer">
          {/* Avatar */}
          <div
            onClick={() => setLogPop(!logPop)}
            className="w-9 h-9 text-orange-500 border border-orange-500 hover:scale-105 transition-all duration-300 rounded-full flex items-center justify-center font-semibold shadow-sm hover:shadow-md"
          >
            {user?.data?.name?.slice(0, 1)}
          </div>

          {/* Dropdown */}
          {logPop && (
            <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-lg border border-orange-200 py-4 flex flex-col items-center gap-3 animate-fadeIn">
              {/* User Info */}
              <div className="flex flex-col items-center gap-1">
                <p className="text-gray-800 font-semibold text-sm">
                  Welcome&nbsp;{user?.data?.name}
                </p>
              </div>

              {/* Divider */}
              <div className="w-[80%] h-[1px] bg-gray-200"></div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-[80%] py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
