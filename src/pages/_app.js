"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Footer from "@/layout/footer";
import Header from "@/layout/header";
import Loader from "@/components/Loader";
import "@/styles/globals.css";
import MobileSearchBar from "@/components/MobileSearchBar";
import MobileFooter from "@/components/MobileFooter";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SideNav from "@/components/admin/sidebar/sidebar";
import AdminHeader from "@/components/admin/header";
import { ErrorProvider } from "@/context/ErrorContext";
import "react-quill/dist/quill.snow.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  /* ------------------ DESKTOP CHECK ------------------ */
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768); // Tailwind md
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ------------------ AUTH REDIRECT ------------------ */
  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (!token && router.pathname !== "/login") {
  //     router.replace("/login");
  //   }
  // }, [router]);

  /* ------------------ ROUTE FLAGS ------------------ */
  const isDashboard = router.pathname.startsWith("/dashboard");
  const isAdmin = router.pathname.startsWith("/admin");
  const islogin = router.pathname.startsWith("/login");
  const isSeeDetails = router.pathname.startsWith("/[slug]");
  const isSitemap = router.pathname.startsWith("/sitemap");
  const isCity = !!router.query.city && !!router.query.slug;

  const shouldShowHeader =
    !isAdmin &&
    !isDashboard &&
    !islogin &&
    (!isSeeDetails || (isSeeDetails && isDesktop)) &&
    !isSitemap;

  const shouldShowFooter = !isAdmin && !isSitemap && !isDashboard && !islogin;

  const shouldShowMobileFooter =
    !isAdmin && !isDashboard && !isSeeDetails && !isSitemap && !islogin;

  /* ------------------ LOADER ------------------ */
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <GoogleOAuthProvider clientId="477872652143-tciloohp49r48l80d7j6tqituovm9nu0.apps.googleusercontent.com">
      <AuthProvider>
        <ErrorProvider>
          <div className="flex justify-center">
            <div
              className={`w-full ${isAdmin ? "" : "max-w-[1750px]"} relative`}
            >
              {/* ---------------- HEADER ---------------- */}
              {shouldShowHeader && (
                <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
                  <div className="w-[1750px]">
                    <Header />
                    {!isSeeDetails && !isCity && <MobileSearchBar />}
                  </div>
                </div>
              )}
              {/* ---------------- LOADER ---------------- */}

              {loading && <Loader />}

              {/* ---------------- PAGE CONTENT ---------------- */}

              <div className={shouldShowHeader ? "" : ""}>
                {isAdmin ? (
                  <div className="flex h-screen overflow-hidden bg-gray-50">
                    {/* Sidebar */}
                    <SideNav />

                    {/* Right Side */}
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <AdminHeader />

                      {/* Scrollable Content */}
                      <main className="flex-1 overflow-y-auto  p-6">
                        <Component {...pageProps} />
                      </main>
                    </div>
                  </div>
                ) : (
                  <div
                    className={
                      shouldShowHeader ? "pt-[70px] max-md:pt-[105px]" : ""
                    }
                  >
                    <Component {...pageProps} />
                  </div>
                )}
              </div>

              {/* ---------------- FOOTER ---------------- */}
              {shouldShowMobileFooter && (
                <>
                  <MobileFooter />
                </>
              )}

              {shouldShowFooter && <Footer />}
            </div>
          </div>
        </ErrorProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
