"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const router = useRouter();
  const [logPop, setLogPop] = useState(false);

  const handleLogout = () => {
    router.push("/");
    setToken(null);
    localStorage.removeItem("authToken");
  };

  const { user } = useAuth();

  const handleLeftClick = () => {
    console.log("Left SVG clicked");
    router.back(); // or any function you want
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Check this out",
        url: window.location.href,
      });
    } else {
      alert("Sharing not supported");
    }
  };

  return (
    <header className="h-[75px] w-full flex items-center justify-between px-4 bg-white shadow-sm">
      {/* LEFT SVG */}
      <button onClick={handleLeftClick} className="p-1">
        <Image
          src="/assets/navLogo.png"
          alt="nav logo"
          height={500}
          width={500}
          className="h-[16px] cursor-pointer w-[23.33px]"
        />
      </button>

      {/* CENTER LOGO */}
      <Image
        src="/assets/addressguru_logo.png"
        alt="logo"
        width={120}
        height={40}
        className="object-contain"
      />

      {/* Profile Menu */}
      <div className="flex flex-col items-center cursor-pointer relative hover:text-orange-500 transition-colors">
        <div
          onClick={() => setLogPop(!logPop)}
          className="w-6.5 h-6.5 bg-orange-500 z-50 rounded-full flex items-center justify-center mb-1"
        >
          <span className="text-white font-medium text-sm">
            {user?.user?.name?.slice(0, 1)}
          </span>
        </div>
        <span className="text-xs text-gray-700 font-medium">
          {user?.user?.name}
        </span>
        {logPop && (
          <div className=" w-28 py-3 bg-white shadow-xl absolute top-17 z-50 mr-10 rounded-lg flex flex-col items-center justify-center gap-1">
            <p className="text-black text-sm font-semibold">Welcome</p>
            <button
              className="px-4 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
