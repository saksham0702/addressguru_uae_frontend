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
  //     await logoutUser(); // call backend logout

  //     localStorage.removeItem("token"); // remove token
  //     router.push("/login"); // redirect
  //   } catch (error) {
  //     console.error("Logout failed:", error);

  //     // fallback logout
  //     localStorage.removeItem("token");
  //     router.push("/login");
  //   }
  // };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm px-6 py-6 flex flex-col">
      {/* ================= Logo Section ================= */}
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 p-6 shadow-md">
        <div className="w-28 md:w-36">
          <img
            src="/assets/admin/logo.png"
            alt="AddressGuru UAE Logo"
            className="w-full object-contain drop-shadow-sm"
          />
        </div>

        <Link
          href="https://addressguru.ae"
          target="_blank"
          className="w-full text-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow hover:bg-gray-100 transition-all duration-200"
        >
          Visit Website →
        </Link>
      </div>

      {/* ================= Navigation ================= */}
      <div className="flex flex-col flex-grow mt-8 space-y-3">
        <NavLinks />

        <div className="flex-grow"></div>

        {/* ================= Logout ================= */}
        {/* <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center md:justify-start gap-3 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition-all duration-200 shadow-sm"
        >
          <PowerIcon className="w-5 h-5" />
          <span className="hidden md:block">Sign Out</span>
        </button> */}
      </div>
    </aside>
  );
}
