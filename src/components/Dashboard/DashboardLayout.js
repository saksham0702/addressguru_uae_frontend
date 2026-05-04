import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";
import PostAdsPop from "./Popups/PostAdsPop";
import Image from "next/image";
import { useState } from "react";

// Fixed dimensions
const SIDEBAR_W = 240; // ✅ CHANGED from 160 to 240
const NAVBAR_H = 70;
const RIGHT_BANNER_W = 220;

const DashboardLayout = ({ children }) => {
  const [postAdd, setPostAdd] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      
      {/* FIXED SIDEBAR - Left */}
      <aside className="fixed left-0 top-0 h-screen w-60 z-40 bg-white border-r border-gray-200">
        {/* ✅ CHANGED w-40 to w-60 */}
        <DashboardSidebar />
      </aside>

      {/* MAIN CONTENT AREA - Shifted right by sidebar width */}
      <div
        className="flex-1 ml-60"
        style={{ width: `calc(100% - ${SIDEBAR_W}px)` }}
      >
        {/* ✅ CHANGED ml-40 to ml-60 */}

        {/* FIXED NAVBAR - Top */}
        <header
          className="fixed top-0 z-30 bg-white border-b border-gray-200"
          style={{
            left: SIDEBAR_W,
            width: `calc(100% - ${SIDEBAR_W}px)`,
            height: NAVBAR_H,
          }}
        >
          <DashboardNavbar setPostAdd={setPostAdd} />
        </header>

        {/* CONTENT WRAPPER - Below navbar */}
        <div
          className="flex gap-6 px-6"
          style={{
            marginTop: NAVBAR_H,
            height: `calc(100vh - ${NAVBAR_H}px)`,
            overflow: "hidden",
          }}
        >
          {/* SCROLLABLE MAIN CONTENT */}
          <main
            className="flex-1 py-6  hide-scroll overflow-y-auto"
            style={{
              width: `calc(100% - ${RIGHT_BANNER_W}px - 24px)`,
            }}
          >
            {children}
          </main>

          {/* FIXED RIGHT BANNER */}
          <aside
            className="flex-shrink-0 pt-6 hidden xl:block"
            style={{ width: RIGHT_BANNER_W }}
          >
            <div
              className="sticky top-6"
              style={{ height: `calc(100vh - ${NAVBAR_H}px - 120px)` }}
            >
              <Image
                src="/assets/ads-banner-dashboard.jpeg"
                alt="ads"
                width={200}
                height={800}
                className="w-full h-full "
                style={{
                  width: `${RIGHT_BANNER_W}px`,
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* POST ADS POPUP */}
      {postAdd && <PostAdsPop postAdd={postAdd} setPostAdd={setPostAdd} />}
    </div>
  );
};

export default DashboardLayout;
