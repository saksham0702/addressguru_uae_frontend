"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { API_URL } from "@/services/constants";
import axios from "axios";
import Link from "next/link";
import UserLogin from "@/components/UserLogin/UserLogin";
import { useAuth } from "@/context/AuthContext";
import MobileCities from "@/components/MobileCities";
import Login from "@/components/UserLogin/Login";
import { searchData } from "@/api/search";
import { useRouter } from "next/router";

const Header = () => {
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const [open, setOpen] = useState(false); // animation state
  const [showSidebar, setShowSidebar] = useState(false); // mounting control
  const [showLogin, setShowLogin] = useState(false);
  const sidebarRef = useRef(null);
  const pathname = usePathname();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showCitiesPop, setShowCitiesPop] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const { city } = useAuth();
  const router = useRouter();

  // const [currentCity, setCurrentCity] = useState(null);

  const [loginPop, setLoginPop] = useState(false);
  const handleSearch = async () => {
    if (!slug?.trim()) return;

    try {
      const res = await searchData(slug, city);

      if (!res || res.status === false || !res.category) {
        console.warn("Invalid search response", res);
        return;
      }

      const categorySlug = res.category.toLowerCase().replace(/\s+/g, "-");

      const citySlug = city.toLowerCase().replace(/\s+/g, "-");

      // ✅ THIS creates /hotel/singapore
      router.push(`/${categorySlug}/${citySlug}`);
    } catch (error) {
      console.error("Search API failed:", error);
    }
  };

  const handleLoginClick = () => {
    setLoginPop(true);
    setShowLogin(true);
    // Close sidebar when login is clicked
    if (showSidebar) {
      handleCloseSidebar();
    }
  };

  const handleCities = () => {
    setShowCitiesPop(!showCitiesPop);
  };

  const handleClose = () => {
    setLoginPop(false);
    setShowSidebar(false);
    setOpen(false);
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(`${API_URL}/cities`);
        setCities(res.data);
      } catch (err) {
        console.error("Client-side error:", err);
        setError(err);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (pathname !== "/") return setShowSearchBar(true);
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 180) {
        setShowSearchBar(true);
      } else {
        setShowSearchBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const logos = [
    { title: "to let", img: "/assets/toLet.png", link: "/properties" },
    { title: "jobs", img: "/assets/jobs.png", link: "/jobs" },
    {
      title: "marketplace",
      img: "/assets/marketPlace.png",
      link: "/marketplace",
    },
  ];

  const handlePostAd = () => {
    if (token && token.trim()) {
      // Logged in → Go to post ad page
      router.push("/dashboard"); // change if your route is different
    } else {
      // Not logged in → Open login modal
      setShowLogin(true);
    }
  };

  const handleOpenSidebar = () => {
    setShowSidebar(true);
    setTimeout(() => setOpen(true), 10);
  };

  const handleCloseSidebar = () => {
    setOpen(false);
    setTimeout(() => setShowSidebar(false), 30);
  };

  // Close sidebar when pathname changes
  useEffect(() => {
    if (open) {
      handleCloseSidebar();
    }
  }, [pathname]);

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        open
      ) {
        handleCloseSidebar();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 180) {
        setShowSearchBar(true);
      } else {
        setShowSearchBar(false);
      }
    };

    if (pathname === "/") {
      handleScroll();
      window.addEventListener("scroll", handleScroll);
    } else {
      setShowSearchBar(true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return (
    <>
      <div
        className={`h-[70px] ${"2xl:left-[10%] 2xl:right-[10%] 2xl:w-[80%]  "} z-50 bg-white  flex items-center relative justify-between w-full  md:px-7 pl-4 shadow-sm max-md:shadow-none`}
      >
        {/* Sidebar with Slide Effect */}
        {showSidebar && (
          <div
            ref={sidebarRef}
            className={`absolute left-0 top-[70px] z-10 transition-transform duration-600  ease-in-out transform ${
              open ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <Sidebar
              handleLoginClick={handleLoginClick}
              onClose={handleCloseSidebar}
            />
          </div>
        )}

        {/* Left Section */}
        <div className="flex items-center gap-6">
          {open ? (
            <svg
              onClick={handleCloseSidebar}
              className="h-[20px] cursor-pointer w-[23.33px] text-orange-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <Image
              onClick={handleOpenSidebar}
              src="/assets/navLogo.png"
              alt="nav logo"
              height={500}
              width={500}
              className="h-[16px] cursor-pointer w-[23.33px]"
            />
          )}
          <Link href="/">
            <Image
              src="/assets/addressguru_logo.png"
              alt="nav logo"
              height={500}
              width={500}
              className="h-[40px] w-[150px] max-md:hidden"
            />
          </Link>
        </div>

        <Link href="/">
          <Image
            src="/assets/addressguru_logo.png"
            alt="nav logo"
            height={500}
            width={500}
            className="w-28 scale-110 md:hidden"
          />
        </Link>
        {/* <div className="md:hidden scale-75 w-28 whitespace-nowrap mr-1 mt-1 ml-2 ">
          <CityDropdown data={cities} />
        </div> */}

        <div
          onClick={handleCities}
          className="md:hidden w-28 flex gap-1 items-center pr-1.5  mr-1 mt-1 ml-2 "
        >
          <button className="text-[13px] font-semibold truncate w-26  text-right text-orange-500">
            {city}
          </button>
          <svg
            width="10"
            height="5"
            viewBox="0 0 10 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.58926 4.7908C5.26384 5.06973 4.73618 5.06973 4.41076 4.7908L0.244076 1.21937C-0.0813585 0.940418 -0.0813585 0.488159 0.244076 0.209208C0.569518 -0.069736 1.09715 -0.069736 1.42259 0.209208L5.00001 3.27558L8.57743 0.209208C8.90285 -0.069736 9.43052 -0.069736 9.75594 0.209208C10.0814 0.488159 10.0814 0.940418 9.75594 1.21937L5.58926 4.7908Z"
              fill="#FF6E04"
            />
          </svg>
        </div>

        {showSearchBar && (
          <div className="absolute left-[220px] max-xl:mr-5 2xl:left-[240px] top-[9px] max-md:hidden min-[1600px]:scale-75 z-50 border-2 border-gray-200 rounded-r-full scale-70">
            <SearchBar
              value={slug}
              setValue={setSlug}
              onSearch={handleSearch}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              data={cities}
            />
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center  max-md:hidden gap-10">
          <div className="flex gap-5 lg:gap-3 xl:gap-5">
            {logos.map((item, index) => (
              <Link
                href={item?.link}
                key={index}
                className="
        flex flex-col items-center gap-1 w-12 text-xs

        lg:w-10 lg:gap-0.5 lg:text-[10px]
        xl:w-12 xl:gap-1 xl:text-xs
      "
              >
                <Image
                  src={item.img}
                  alt={item.title}
                  height={100}
                  width={100}
                  className="
          h-[20px] w-[25px]

          lg:h-[16px] lg:w-[20px]
          xl:h-[20px] xl:w-[25px]
        "
                />

                <p className="capitalize font-semibold text-[#4B4B4B]">
                  {item.title}
                </p>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-5 lg:gap-3 xl:gap-5 font-bold">
            <button
              onClick={handlePostAd}
              className="
      border-2 max-md:hidden border-[#EE7630] text-[#EE7630]
      px-3 py-1.5 rounded-lg capitalize

      lg:px-2 lg:py-1 lg:text-sm
      xl:px-3 xl:py-1.5 xl:text-base
    "
            >
              post free ads +
            </button>

            {token && token.trim() ? (
              <Link
                href="/dashboard"
                className="
        font-semibold text-white bg-orange-600 rounded-lg

        px-3 py-2 text-[15px]
        lg:px-2 lg:py-1.5 lg:text-sm
        xl:px-3 xl:py-2 xl:text-[15px]
      "
              >
                Dashboard
              </Link>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="
        uppercase cursor-pointer bg-[#0040FF] text-white rounded-xl

        px-4 py-2
        lg:px-3 lg:py-1.5 lg:text-sm
        xl:px-4 xl:py-2 xl:text-base
      "
              >
                Login
              </button>
            )}
          </div>
        </div>

        {showLogin && <UserLogin setShowLogin={setShowLogin} />}
        {/* {showCitiesPop && <MobileCities />} */}
        <MobileCities
          cities={cities}
          showCities={showCitiesPop}
          setShowCities={setShowCitiesPop}
        />
      </div>
      {loginPop && (
        <div className="h-screen w-full top-0 flex  md:hidden fixed inset-0 z-50 bg-white">
          <div className="mt-2 relative w-full pl-2  ">
            {/* Close icon */}
            <button
              onClick={handleClose}
              className="absolute right-3 border rounded-full border-orange-500 p-1
               top-2 z-50 text-[#FF6E04]"
              aria-label="Close"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Login component */}
            <Login />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
