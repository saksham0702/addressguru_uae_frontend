"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, UserCircle, LogOut } from "lucide-react";
import { useRouter } from "next/router";
import { logoutUser } from "@/api/uaeadminlogin";

export default function AdminHeader() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-orange-100">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Brand */}
        {/* <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-600">Address</span>
          <span className="text-2xl font-bold text-gray-800">Guru</span>
        </div> */}
        <span className="hidden sm:inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600">
          Admin Panel
        </span>
        {/* Right Side */}
        <div className="flex items-center gap-6 relative" ref={dropdownRef}>
          {/* Profile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-orange-50 transition"
          >
            <UserCircle className="text-orange-500" size={26} />
            <span className="text-sm font-medium text-gray-700">
              AddressGuru
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-14 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 animate-fadeIn">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300" />
    </header>
  );
}
