"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

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
    <header className="h-[60px] w-full flex items-center justify-between px-4 bg-white shadow-sm">
      {/* LEFT SVG */}
      <button onClick={handleLeftClick} className="p-1">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="#FF6E04"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* CENTER LOGO */}
      <Image
        src="/assets/addressguru_logo.png"
        alt="logo"
        width={120}
        height={40}
        className="object-contain"
      />

      {/* RIGHT SHARE BUTTON */}
      <button
        onClick={handleShare}
        className="text-sm font-semibold text-orange-600 border border-orange-500 px-3 py-1 rounded-lg"
      >
        Share
      </button>
    </header>
  );
};

export default Header;
