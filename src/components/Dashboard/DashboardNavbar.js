import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";

const DashboardNavbar = ({ setPostAdd }) => {
  const [logPop, setLogPop] = useState(false);
  const router = useRouter();
  const { user, setToken } = useAuth();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("authToken");
    router.push("/");
  };

  return (
    // NO fixed/absolute here — parent header in layout handles that
    <nav className="w-full h-full px-6 flex items-center justify-between bg-white">
      {/* Logo */}
      <div onClick={() => router.push("/")} className="cursor-pointer">
        <Image
          src="/assets/addressguru_logo.png"
          alt="logo"
          width={500}
          height={500}
          className="h-10 w-40 object-contain"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Post Ads — setPostAdd comes from layout via navbar props */}
        <button
          onClick={() => setPostAdd(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 
                     text-white text-sm font-semibold rounded-md shadow-sm 
                     hover:shadow-md hover:scale-105 transition duration-300"
        >
          Post Your Ads +
        </button>

        {/* Avatar + Dropdown */}
        <div className="relative">
          <div
            onClick={() => setLogPop(!logPop)}
            className="w-9 h-9 border border-orange-500 text-orange-500 rounded-full 
                       flex items-center justify-center font-semibold cursor-pointer
                       hover:scale-105 transition-all duration-300"
          >
            {user?.data?.name?.slice(0, 1)}
          </div>

          {logPop && (
            <div
              className="absolute right-0 top-12 w-52 bg-white rounded-xl 
                            shadow-lg border border-orange-200 py-4 flex flex-col 
                            items-center gap-3 z-50"
            >
              <p className="text-gray-800 font-semibold text-sm">
                Welcome {user?.data?.name}
              </p>
              <div className="w-[80%] h-px bg-gray-200" />
              <button
                onClick={handleLogout}
                className="w-[80%] py-1.5 bg-red-500 text-white rounded-md 
                           hover:bg-red-600 transition text-sm"
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
