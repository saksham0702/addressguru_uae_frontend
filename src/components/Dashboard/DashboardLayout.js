import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";
import Image from "next/image";
import { useState } from "react";

const SIDEBAR_W = 256;
const NAVBAR_H = 70;

const DashboardLayout = ({ children }) => {
  const [postAdd, setPostAdd] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── SIDEBAR: fixed, exact pixel width ── */}
      <aside
        style={{ width: SIDEBAR_W }}
        className="fixed left-0 top-0 h-full z-40 bg-white border-r border-gray-200 flex-shrink-0"
      >
        <DashboardSidebar />
      </aside>

      {/* ── RIGHT COLUMN: offset by sidebar width ── */}
      <div
        style={{ marginLeft: SIDEBAR_W }}
        className="flex flex-col flex-1 min-w-0"
      >
        {/* ── NAVBAR: fixed, starts after sidebar ── */}
        <header
          style={{ left: SIDEBAR_W, height: NAVBAR_H }}
          className="fixed top-0 right-0 z-30 bg-white border-b border-gray-200"
        >
          <DashboardNavbar setPostAdd={setPostAdd} />
        </header>

        {/* ── PAGE CONTENT + RIGHT ADS ── */}
        <div
          style={{ paddingTop: NAVBAR_H }}
          className="flex flex-1 gap-4 px-5 py-5 min-h-screen"
        >
          {/* Main scrollable content */}
          <main className="flex-1 min-w-0">{children}</main>

          {/* Ads column — sticky so it follows scroll */}
          <aside className="w-[220px] flex-shrink-0 hidden lg:block">
            <div className="sticky top-[90px]">
              <Image
                src="/assets/ads-banner-dashboard.jpeg"
                alt="ads"
                width={220}
                height={600}
                className="w-full h-auto rounded-xl"
              />
            </div>
          </aside>
        </div>
      </div>

      {/* PostAdsPop goes here if needed */}
    </div>
  );
};

export default DashboardLayout;
