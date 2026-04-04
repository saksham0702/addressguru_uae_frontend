"use client";

import Link from "next/link";
import NavLinks from "./navlinks";
import { PowerIcon } from "lucide-react";
import { useRouter } from "next/router";
import { logoutUser } from "@/api/uaeadminlogin";

export default function SideNav() {
  const router = useRouter();

  // const handleLogout = async () => {
  //   try {
  //     await logoutUser();
  //     localStorage.removeItem("token");
  //     router.push("/login");
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //     localStorage.removeItem("token");
  //     router.push("/login");
  //   }
  // };

  return (
    <>
      {/* Scrollbar styles injected once */}
      <style>{`
        .sidenav-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidenav-scroll::-webkit-scrollbar-track {
          background: #fff5ed;
          border-radius: 999px;
        }
        .sidenav-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #f97316, #ea580c);
          border-radius: 999px;
        }
        .sidenav-scroll::-webkit-scrollbar-thumb:hover {
          background: #ea580c;
        }
      `}</style>

      <aside className="w-66 min-h-screen bg-white border-r border-gray-100 shadow-sm flex flex-col">
        {/* ===== Logo Section ===== */}
        <div className="flex-shrink-0 px-4 pt-4 pb-0">
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl  px-6 py-1 ">
            <Link
              className="w-36"
              href="https://addressguru.ae"
              target="_blank"
            >
              <img
                src="/assets/admin/logo.png"
                alt="AddressGuru UAE Logo"
                className="w-full object-contain drop-shadow-sm"
              />
            </Link>
          </div>

          {/* Professional orange accent line */}
          <div className="mt-3 mx-1 h-[2px] rounded-full bg-gradient-to-r from-orange-500 via-orange-300 to-transparent" />
        </div>

        {/* ===== Scrollable Nav Area ===== */}
        <div className="sidenav-scroll flex-1 overflow-y-auto px-3 py-4 space-y-1 bg-white">
          <NavLinks />
        </div>

        {/* ===== Footer / Logout ===== */}
        <div className="flex-shrink-0 px-3 pb-4 pt-2 border-t border-gray-100">
          {/* <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center md:justify-start gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
          >
            <PowerIcon className="w-4 h-4 flex-shrink-0" />
            <span className="hidden md:block">Sign Out</span>
          </button> */}
        </div>
      </aside>
    </>
  );
}
