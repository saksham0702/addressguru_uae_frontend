import BreadCrumbs from "@/components/BreadCrumbs";
import React, { useEffect, useRef, useState } from "react";
import TitleAndLogo from "@/components/SeeDetails/TitleAndLogo";
import SliderCard from "@/components/SeeDetails/SliderCard";
import QuickInformation from "@/components/SeeDetails/QuickInformation";
import GetMoreInfo from "@/components/SeeDetails/GetMoreInfo";
import UserInformation from "@/components/SeeDetails/UserInformation";
import RecentCustomerReviewCard from "@/components/BusinessListingComponents/RecentCustomerReviewCard";
import TitleAndLogoMobile from "@/components/SeeDetails/TitleAndLogoMobile";
import { track_event } from "@/api/listingStats";
import { Share } from "@/components/SeeDetails/Popups/Share";
import { Claim } from "@/components/SeeDetails/Popups/Claim";
import RateUs from "@/components/SeeDetails/Popups/RateUs";
import Report from "@/components/SeeDetails/Popups/Report";
import { useRouter } from "next/router";
import ThanksPop from "@/components/SeeDetails/Popups/ThanksPop";
import LandingPageSkeleton from "@/components/BusinessListingComponents/LandingPageSkeleton";
import Head from "next/head";
import { useAuth } from "@/context/AuthContext";
import { APP_URL } from "@/services/constants";
import RejectReasonModal from "@/components/admin/business/rejectreasonModal";
import {
  get_listing_data,
  approve_listing,
  reject_listing,
} from "@/api/listing-form";
import Link from "next/link";
import LandingPage from "@/components/HeadersMobile/LandingPage";
import FullWidthGallery from "@/components/SeeDetails/FullWidthGallery";
import RoomsSection from "@/components/SeeDetails/RoomsSection";

export async function getServerSideProps(context) {
  const { slug } = context.params;
  try {
    const result = await get_listing_data(slug);
    if (!result?.data?.data) return { notFound: true };
    return { props: { initialData: result.data.data } };
  } catch (err) {
    console.error("SSR listing fetch error:", err);
    return { notFound: true };
  }
}

// ── Status config ──
const STATUS_CONFIG = {
  approved: {
    label: "Approved",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-600",
    dot: "bg-red-500",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-600",
    dot: "bg-amber-400",
  },
};

const SeeDetails = ({ initialData }) => {
  const [data, setData] = useState(initialData ?? null);
  const [loading, setLoading] = useState(!initialData);
  const [activePop, setActivePop] = useState(null);
  const [thanksPop, setThanksPop] = useState(false);
  const [type, setType] = useState(null);
  const [enquirePop, setEnquirePop] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [rejectModalData, setRejectModalData] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [toast, setToast] = useState(null);
  const API_URL = "https://addressguru.ae";

  const router = useRouter();
  const { slug, preview } = router.query;
  const { city, user } = useAuth();
  const serverCity = city;

  const isAdmin = user?.data?.roles?.[0] == 1;
  const status = data?.status || "pending";
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const handleApprove = async () => {
    try {
      setLoadingAction(true);
      await approve_listing(data?._id);
      setData((prev) => ({ ...prev, status: "approved" }));
      setConfirmAction(null);
      showToast("Listing approved successfully", "success");
    } catch (err) {
      showToast("Failed to approve listing", "error");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRejectSubmit = async ({ listingId, reason }) => {
    try {
      setLoadingAction(true);
      await reject_listing(listingId, {
        status: "rejected",
        rejectionReason: reason,
      });
      setData((prev) => ({ ...prev, status: "rejected" }));
      setRejectModalData(null);
      showToast("Listing rejected successfully", "success");
    } catch (err) {
      showToast("Failed to reject listing", "error");
    } finally {
      setLoadingAction(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (data) return;
    if (!slug) return;
    const fetchListing = async () => {
      setLoading(true);
      try {
        const result = await get_listing_data(slug);
        if (result) setData(result?.data?.data);
        else router.push("/404");
      } catch (err) {
        console.error("Listing fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [slug]);

  const viewTracked = useRef(false);
  useEffect(() => {
    if (!data?.slug || viewTracked.current) return;
    viewTracked.current = true;
    track_event("business", data?.slug, "view").catch(console.log("view"));
  }, [data?.slug]);

  const handleWebsiteClick = async (slug) => {
    track_event("business", slug, "website_visit").catch(console.log("website_visit"));
  };
  const handleClick = async (slug) => {
    track_event("business", slug, "call").catch(console.log("call"));
  };
  const handlePop = (name) => setActivePop(name);
  const closePopup = () => setActivePop(null);

  if (loading || !data) return <LandingPageSkeleton />;

  const isSliderFull =
    data?.category?.name === "Hotel" || data?.category?.name === "Yoga Studio";

  return (
    <>
      <Head>
        <title>
          {data?.seo?.title} | {serverCity} | AddressGuru
        </title>
        <meta
          name="description"
          content={data?.seo?.description?.substring(0, 160)}
        />
        <meta property="og:title" content={data?.business_name} />
        <meta
          property="og:description"
          content={data?.ad_description?.substring(0, 160)}
        />
        <meta property="og:image" content={data?.images?.[0]} />
        <meta property="og:url" content={`${API_URL}/${data?.slug}`} />
        <meta property="og:type" content="business.business" />
        <meta name="twitter:title" content={data?.business_name} />
        <meta
          name="twitter:description"
          content={data?.ad_description?.substring(0, 160)}
        />
        <meta name="twitter:image" content={data?.images?.[0]} />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Canonical — full absolute URL required by Google */}
        <link rel="canonical" href={`https://addressguru.ae/${data?.slug}`} />

        {/* Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: data?.business_name || data?.businessName,
              description: data?.ad_description || data?.description,
              image: data?.images,
              address: {
                "@type": "PostalAddress",
                streetAddress: data?.business_address || data?.businessAddress,
                addressLocality: data?.city || "Dubai",
                addressCountry: "AE",
              },
              url: `https://addressguru.ae/${data?.slug}`,
              aggregateRating:
                data?.ratings?.length > 0
                  ? {
                      "@type": "AggregateRating",
                      ratingValue: data?.ratings[0]?.rating ?? 4,
                      reviewCount: data?.ratings?.length,
                    }
                  : undefined,
              openingHours: data?.workingHours,
              telephone: data?.phone,
              priceRange: "$$",
            }),
          }}
        />
      </Head>

      <div className="md:hidden">
        <LandingPage />
      </div>
      <div className="md:hidden my-1.5 max-w-xs ml-[4%]">
        <BreadCrumbs
          slug={data?.category?.slug}
          city={serverCity}
          name={data?.slug}
          type={true}
        />
      </div>

      {/* POPUPS */}
      {activePop && (
        <div
          className="fixed min-h-screen w-full bg-black/60 backdrop-blur-sm left-0 p-3 flex z-50 items-center justify-center top-0"
          onClick={closePopup}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {activePop === "share" && <Share onClose={closePopup} />}
            {activePop === "claim" && (
              <Claim
                id={data?._id}
                slug={data?.slug}
                type="listing"
                setType={setType}
                setThanksPop={setThanksPop}
                onClose={closePopup}
              />
            )}
            {activePop === "rateus" && (
              <RateUs
                id={data?._id}
                slug={data?.slug}
                type="listing"
                setType={setType}
                setThanksPop={setThanksPop}
                onClose={closePopup}
              />
            )}
            {activePop === "report" && (
              <Report
                id={data?._id}
                slug={data?.slug}
                type="listing"
                setType={setType}
                setThanksPop={setThanksPop}
                onClose={closePopup}
              />
            )}
          </div>
        </div>
      )}

      {/* FIXED RIGHT ADMIN PANEL  (always visible for admin / preview)*/}
      {(isAdmin || preview === "true") && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[9999] flex flex-col items-end gap-2 pr-0 max-md:hidden">
          {/* ── Action icon strip ── */}
          <div className="flex flex-col items-center gap-1 mr-1">
            {/* Edit */}
            <Link
              href={`/dashboard/listing-forms?category=${data?.category?._id}&categoryName=${encodeURIComponent(data?.businessName)}&name=${encodeURIComponent(data?.slug)}`}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-300 transition"
              title="Edit"
              style={{ pointerEvents: "auto" }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path
                  d="M11 2L14 5L5 14H2V11L11 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            {/* Back */}
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition"
              title="Back"
              style={{ pointerEvents: "auto" }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 3L5 8L10 13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Approve — only if not already approved */}
            {isAdmin && status !== "approved" && (
              <button
                onClick={() => setConfirmAction("approve")}
                className="w-9 h-9 rounded-full bg-white border border-green-200 shadow flex items-center justify-center text-green-600 hover:bg-green-50 transition"
                title="Approve"
                style={{ pointerEvents: "auto" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 8L6 12L14 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            {/* Reject — only if not already rejected */}
            {isAdmin && status !== "rejected" && (
              <button
                onClick={() => setRejectModalData(data)}
                className="w-9 h-9 rounded-full bg-white border border-red-200 shadow flex items-center justify-center text-red-500 hover:bg-red-50 transition"
                title="Reject"
                style={{ pointerEvents: "auto" }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* ── Info card ── */}
          <div className="bg-[#f0f0f0] border border-gray-200 shadow-lg rounded-l-xl w-56 overflow-hidden">
            {/* Status bar */}
            <div
              className={`flex items-center gap-2 px-3 py-2 border-b border-gray-200 ${statusCfg.bg}`}
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${statusCfg.dot}`}
              />
              <span
                className={`text-xs font-bold uppercase tracking-wide ${statusCfg.text}`}
              >
                {statusCfg.label}
              </span>
            </div>

            {/* Contact rows */}
            <div className="px-3 py-3 flex flex-col gap-2.5">
              {data?.mobileNumber && (
                <div className="flex items-center gap-2 text-[12.5px] text-gray-700">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="flex-shrink-0 text-gray-400"
                  >
                    <path
                      d="M3 2h3l1.5 3.5-1.75 1.05A9.07 9.07 0 0 0 9.45 9.25L10.5 7.5 14 9v3c0 1.1-1 2-2 1.93C5.6 13.4 2.6 10.4 2.07 4 2 3 2.9 2 4 2z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="truncate">
                    {data?.countryCode} {data?.mobileNumber}
                  </span>
                </div>
              )}
              {data?.alternateMobileNumber && (
                <div className="flex items-center gap-2 text-[12.5px] text-gray-700">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="flex-shrink-0 text-gray-400"
                  >
                    <path
                      d="M3 2h3l1.5 3.5-1.75 1.05A9.07 9.07 0 0 0 9.45 9.25L10.5 7.5 14 9v3c0 1.1-1 2-2 1.93C5.6 13.4 2.6 10.4 2.07 4 2 3 2.9 2 4 2z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="truncate">
                    {data?.altCountryCode} {data?.alternateMobileNumber}
                  </span>
                </div>
              )}
              {data?.email && (
                <div className="flex items-center gap-2 text-[12.5px] text-gray-700">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="flex-shrink-0 text-gray-400"
                  >
                    <path
                      d="M2 4h12v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4zm0 0l6 5 6-5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="truncate">{data?.email}</span>
                </div>
              )}
              {data?.websiteLink && (
                <div className="flex items-center gap-2 text-[12.5px] text-[#2563eb]">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="flex-shrink-0"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <path
                      d="M8 2c-1.5 2-2 3.5-2 6s.5 4 2 6M8 2c1.5 2 2 3.5 2 6s-.5 4-2 6M2 8h12"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                  </svg>
                  <a
                    href={data?.websiteLink}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              {data?.category?.name && (
                <div className="flex items-center gap-2 text-[12.5px] text-gray-700">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="flex-shrink-0 text-gray-400"
                  >
                    <path
                      d="M2 4a1 1 0 0 1 1-1h2l1 2H3a1 1 0 0 1-1-1zM2 4v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H7L6 3H3a1 1 0 0 0-1 1z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="truncate">{data?.category?.name}</span>
                </div>
              )}
              {data?.contactPersonName && (
                <div className="flex items-center gap-2 text-[12.5px] text-gray-700">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="flex-shrink-0 text-gray-400"
                  >
                    <circle
                      cx="8"
                      cy="5"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <path
                      d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="truncate">{data?.contactPersonName}</span>
                </div>
              )}
            </div>

            {/* Views */}
            <div className="px-3 pb-3">
              <div className="inline-flex items-center gap-1.5 bg-[#e8a020] text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
                    stroke="white"
                    strokeWidth="1.4"
                  />
                  <circle cx="8" cy="8" r="2" fill="white" />
                </svg>
                Views &nbsp;
                <span className="bg-white text-[#e8a020] rounded px-1 font-bold text-[11px]">
                  {data?.views ?? 0}
                </span>
              </div>
            </div>

            {/* Transfer Ownership */}
            {isAdmin && (
              <div className="px-3 pb-3">
                <button className="w-full bg-[#e8363a] hover:bg-red-600 text-white text-xs font-semibold py-2 rounded-md transition">
                  Transfer Ownership
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div
        className={`h-auto flex flex-col items-center w-full bg-[#F8F7F7] md:mt-2 ${preview === "true" ? "pointer-events-none opacity-90" : ""}`}
      >
        <div className="flex flex-col md:w-[80%] max-w-[98%] relative bg-white md:px-5 px-2 md:pb-7">
          <div className="max-md:hidden my-3">
            <BreadCrumbs
              slug={data?.category?.slug}
              city={serverCity}
              name={data?.slug}
              type={true}
            />
          </div>

          <div className="max-md:hidden md:w-[64.5%]">
            <TitleAndLogo
              handlePop={handlePop}
              name={data?.businessName}
              address={data?.businessAddress}
              data={data}
              logo={data?.logo}
              ratings={data?.ratings}
              handleClick={handleClick}
              openingHours={data?.workingHours}
              enquirePop={enquirePop}
              setEnquirePop={setEnquirePop}
            />
          </div>

          {/* FULL WIDTH HERO (Desktop + Special Category) */}
          {isSliderFull && !isMobile && (
            <div className="w-full mt-1 px-2 md:px-0 mb-4">
              <FullWidthGallery images={data?.images} />
            </div>
          )}

          {/* SLIDER (Mobile OR Normal Categories) */}
          {(isMobile || !isSliderFull) && (
            <div className={`${!isMobile ? "md:w-[64.5%]" : "w-full"}`}>
              <SliderCard slider={false} images={data?.images} />
            </div>
          )}
          {/* <SliderCard slider={false} images={data?.images} /> */}

          <div className="flex w-full justify-between max-md:flex-col md:mt-4">
            {/* LEFT */}

            <div className="md:w-[64.5%]">
              {/* <SliderCard slider={false} images={data?.images} /> */}

              <div className="md:hidden mx-auto  w-full">
                <TitleAndLogoMobile
                  data={data}
                  openingHours={data?.workingHours}
                  handlePop={handlePop}
                  onClose={closePopup}
                  enquirePop={enquirePop}
                  setEnquirePop={setEnquirePop}
                  handleClick={handleClick}
                />
              </div>
              {/* ABOUT */}
              <div className="mt-5 md:pl-2 px-1">
                <span className="flex gap-3 items-center">
                  <h3 className="font-semibold whitespace-nowrap uppercase md:text-xl">
                    About Us
                  </h3>
                  <span className="h-[1px] w-full bg-gray-200"></span>
                </span>
                <p className="md:text-[16px] text-[16px] mt-2 md:font-normal">
                  {data?.description}
                </p>
              </div>

              {/* COURSES */}
              {data?.courses && data.courses.length > 0 && (
                <div className="max-w-4xl mt-5 md:pl-2 px-1">
                  <span className="flex gap-3 items-center">
                    <h2 className="font-semibold uppercase md:text-xl">
                      COURSES
                    </h2>
                    <span className="h-[1px] w-full bg-gray-200"></span>
                  </span>
                  <p className="md:text-[13.5px] text-[15px] mt-2 mb-4 md:font-[500]">
                    {data?.businessAddress} provides the following courses:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data?.courses?.map((course, index) => (
                      <div key={index} className="flex items-end space-x-2">
                        {course?.iconSvg ? (
                          <div
                            className="icon-wrapper"
                            dangerouslySetInnerHTML={{
                              __html: course?.iconSvg,
                            }}
                          />
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <circle cx="10" cy="10" r="10" fill="#FFE9D9" />
                            <path
                              d="M17.15 5.32c-.46-.43-1.21-.43-1.68 0L7.9 12.34 4.53 9.22c-.47-.43-1.22-.43-1.69 0-.46.43-.46 1.13 0 1.56L7.06 14.7c.23.21.53.33.84.33s.61-.12.84-.33l8.42-7.8c.47-.43.47-1.13 0-1.56z"
                              fill="#FF6E04"
                            />
                          </svg>
                        )}
                        <span className="md:text-[13.5px] text-[15px] font-semibold">
                          {course.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FACILITIES */}
              {data?.facilities && data.facilities.length > 0 && (
                <div className="max-w-4xl mt-5 md:pl-2 px-1">
                  <span className="flex gap-3 items-center">
                    <h2 className="font-semibold uppercase md:text-xl">
                      FACILITIES
                    </h2>
                    <span className="h-[1px] w-full bg-gray-200"></span>
                  </span>
                  <p className="md:text-[13.5px] text-[15px] mt-2 mb-4 md:font-[500]">
                    {data?.businessName} provides the following facilities:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data?.facilities?.map((facility, index) => (
                      <div key={index} className="flex items-end space-x-2">
                        {facility?.iconSvg ? (
                          <div
                            className="icon-wrapper"
                            dangerouslySetInnerHTML={{
                              __html: facility?.iconSvg,
                            }}
                          />
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <circle cx="10" cy="10" r="10" fill="#FFE9D9" />
                            <path
                              d="M17.15 5.32c-.46-.43-1.21-.43-1.68 0L7.9 12.34 4.53 9.22c-.47-.43-1.22-.43-1.69 0-.46.43-.46 1.13 0 1.56L7.06 14.7c.23.21.53.33.84.33s.61-.12.84-.33l8.42-7.8c.47-.43.47-1.13 0-1.56z"
                              fill="#FF6E04"
                            />
                          </svg>
                        )}
                        <span className="md:text-[13.5px] text-[15px] font-semibold">
                          {facility?.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SERVICES */}
              {data?.services && data.services.length > 0 && (
                <div className="max-w-4xl mt-5 md:pl-2 px-1">
                  <span className="flex gap-3 items-center">
                    <h2 className="font-semibold uppercase md:text-xl">
                      SERVICES
                    </h2>
                    <span className="h-[1px] w-full bg-gray-200"></span>
                  </span>
                  <p className="md:text-[13.5px] text-[15px] mt-2 mb-4 md:font-[500]">
                    {data?.businessName} provides the following services:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data?.services?.map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <circle cx="10" cy="10" r="10" fill="#FFE9D9" />
                          <path
                            d="M17.15 5.32c-.46-.43-1.21-.43-1.68 0L7.9 12.34 4.53 9.22c-.47-.43-1.22-.43-1.69 0-.46.43-.46 1.13 0 1.56L7.06 14.7c.23.21.53.33.84.33s.61-.12.84-.33l8.42-7.8c.47-.43.47-1.13 0-1.56z"
                            fill="#FF6E04"
                          />
                        </svg>
                        <span className="md:text-[13.5px] text-[15px] font-semibold">
                          {service.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PAYMENT METHODS */}
              {data?.paymentModes && data.paymentModes.length > 0 && (
                <div className="max-w-5xl mt-5 md:pl-2 px-1">
                  <span className="flex gap-3 items-center">
                    <h2 className="font-semibold uppercase whitespace-nowrap md:text-xl">
                      Payment Modes
                    </h2>
                    <span className="h-[1px] w-full bg-gray-200"></span>
                  </span>
                  <p className="md:text-[13.5px] text-[15px] mt-2 mb-4 md:font-[500]">
                    {data?.businessName} accepts the following payment methods:
                  </p>
                  <div className="flex flex-col gap-4">
                    {data?.paymentModes?.map((payment, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {payment?.iconSvg ? (
                          <div
                            className="icon-wrapper"
                            dangerouslySetInnerHTML={{
                              __html: payment?.iconSvg,
                            }}
                          />
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <circle cx="10" cy="10" r="10" fill="#FFE9D9" />
                            <path
                              d="M17.15 5.32c-.46-.43-1.21-.43-1.68 0L7.9 12.34 4.53 9.22c-.47-.43-1.22-.43-1.69 0-.46.43-.46 1.13 0 1.56L7.06 14.7c.23.21.53.33.84.33s.61-.12.84-.33l8.42-7.8c.47-.43.47-1.13 0-1.56z"
                              fill="#FF6E04"
                            />
                          </svg>
                        )}
                        <span className="md:text-[13.5px] text-[15px] font-semibold">
                          {payment?.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* OVERVIEW */}
              <div className="max-w-5xl mt-5 md:pl-2 px-1">
                <span className="flex gap-3 items-center">
                  <h3 className="font-semibold uppercase md:text-xl">
                    Overview
                  </h3>
                  <span className="h-[1px] w-full bg-gray-200"></span>
                </span>
                <div className="md:text-[13.5px] text-[15px] md:font-[500] flex flex-col gap-5 mt-2 max-w-4xl">
                  <p>
                    {`${data?.businessName} is located at ${data?.businessAddress}, ${serverCity}.`}
                    {data?.facilities && data.facilities.length > 0 && (
                      <span>
                        {" Their facilities include: "}
                        {data?.facilities?.name?.join(", ")}.
                        
                      </span>
                    )}
                  </p>
                  <p>
                    Scroll to the top for more details about{" "}
                    {data?.businessName}.
                  </p>
                  <p>
                    Found this listing helpful? Tell {data?.businessName} you
                    discovered them on{" "}
                    <strong className="text-[#FF6E04]">AddressGuru UAE</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div
              className={`md:w-[34%] ${isSliderFull ? "" : "md:absolute md:top-49 md:right-0"} max-md:hidden h-auto mb-10 flex flex-col gap-5`}
            >
              <QuickInformation
                id={data?.id}
                businesshours={data?.workingHours}
                price={data?.additionalFields?.[2]}
                category={data?.category}
                link={data?.websiteLink}
                handlePop={handlePop}
                handleWebsiteClick={handleWebsiteClick}
              />
              {/* booking sections */}
              {data?.category?.name === "Yoga Studio" && (
                <RoomsSection
                  category="Yoga Studio"
                  data={{
                    startingFrom: 1200,
                    daysNights: "3 Days | 2 Nights",
                    batchSize: 30,
                    language: "Hindi & English",
                    availableDates: ["Sat, 12 July", "Sun, 13 July"],
                    rooms: [
                      {
                        name: "Shared room",
                        price: 1200,
                        roomType: "Shared",
                        capacity: 30,
                      },
                      {
                        name: "Private room",
                        price: 2000,
                        roomType: "Private",
                        capacity: 10,
                      },
                    ],
                  }}
                />
              )}

              {data?.category?.name === "Hotel" && (
                <RoomsSection
                  category="hotel"
                  data={{
                    startingFrom: 3500,
                    checkIn: "12:00 PM",
                    checkOut: "11:00 AM",
                    availableDates: ["Sat, 12 July", "Sun, 13 July"],
                    rooms: [
                      {
                        name: "Standard room",
                        price: 3500,
                        roomType: "Standard",
                        capacity: 2,
                      },
                      {
                        name: "Luxury suite",
                        price: 8900,
                        roomType: "Luxury",
                        capacity: 4,
                      },
                    ],
                  }}
                />
              )}
              {data?.category?.name === "Hostel" && (
                <RoomsSection
                  category="hostel"
                  data={{
                    startingFrom: 600,
                    checkIn: "2:00 PM",
                    checkOut: "10:00 AM",
                    availableDates: ["Sat, 12 July", "Sun, 13 July"],
                    rooms: [
                      {
                        name: "6-bed dorm",
                        price: 600,
                        roomType: "Shared",
                        capacity: 6,
                      },
                      {
                        name: "Private room",
                        price: 1800,
                        roomType: "Private",
                        capacity: 2,
                      },
                    ],
                  }}
                />
              )}

              {!data?.category?.name === "Hotel" ||
                !data?.category?.name === "Hostel" ||
                (!data?.category?.name === "Yoga Studio" && (
                  <div className="w-full h-[30rem] mb-7">
                    <GetMoreInfo
                      name={data?.businessName}
                      type="listing"
                      id={data?.id}
                      setType={setType}
                      setThanksPop={setThanksPop}
                    />
                  </div>
                ))}
              <UserInformation />
            </div>
          </div>
          {/* sections */}
          <section className="md:hidden mt-10">
            {data?.category?.name === "Yoga Studio" && (
              <RoomsSection
                category="Yoga Studio"
                data={{
                  startingFrom: 1200,
                  daysNights: "3 Days | 2 Nights",
                  batchSize: 30,
                  language: "Hindi & English",
                  availableDates: ["Sat, 12 July", "Sun, 13 July"],
                  rooms: [
                    {
                      name: "Shared room",
                      price: 1200,
                      roomType: "Shared",
                      capacity: 30,
                    },
                    {
                      name: "Private room",
                      price: 2000,
                      roomType: "Private",
                      capacity: 10,
                    },
                  ],
                }}
              />
            )}

            {data?.category?.name === "Hotel" && (
              <RoomsSection
                category="hotel"
                data={{
                  startingFrom: 3500,
                  checkIn: "12:00 PM",
                  checkOut: "11:00 AM",
                  availableDates: ["Sat, 12 July", "Sun, 13 July"],
                  rooms: [
                    {
                      name: "Standard room",
                      price: 3500,
                      roomType: "Standard",
                      capacity: 2,
                    },
                    {
                      name: "Luxury suite",
                      price: 8900,
                      roomType: "Luxury",
                      capacity: 4,
                    },
                  ],
                }}
              />
            )}
            {data?.category?.name === "Hostel" && (
              <RoomsSection
                category="hostel"
                data={{
                  startingFrom: 600,
                  checkIn: "2:00 PM",
                  checkOut: "10:00 AM",
                  availableDates: ["Sat, 12 July", "Sun, 13 July"],
                  rooms: [
                    {
                      name: "6-bed dorm",
                      price: 600,
                      roomType: "Shared",
                      capacity: 6,
                    },
                    {
                      name: "Private room",
                      price: 1800,
                      roomType: "Private",
                      capacity: 2,
                    },
                  ],
                }}
              />
            )}
          </section>

          {/* MOBILE USER INFO */}
          <div className="md:hidden mt-10">
            <UserInformation />
          </div>

          {/* REVIEWS */}
          {data?.ratings && data.ratings.length > 0 && (
            <div className="h-70 w-full space-y-2 my-5">
              <div className="flex w-full items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Recent Customer Reviews
                </h2>
              </div>
              <div className="py-2 md:pl-4 flex md:justify-between overflow-x-scroll hide-scroll w-full gap-5">
                {data?.ratings?.map((item, index) => (
                  <RecentCustomerReviewCard key={index} data={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ENQUIRE POPUP */}
      {enquirePop && (
        <div
          className="inset-0 flex items-center fixed justify-center backdrop-blur-xs z-50 py-20 px-5"
          onClick={() => setEnquirePop(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <GetMoreInfo
              isPop={true}
              type="listing"
              name={data?.businessName}
              id={data?._id}
              slug={data?.slug}
              setEnquirePop={setEnquirePop}
            />
          </div>
        </div>
      )}

      {/* CONFIRM APPROVE MODAL */}
      {confirmAction === "approve" && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setConfirmAction(null)}
        >
          <div
            className="bg-white rounded-xl border border-gray-200 p-6 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 8L6 12L14 4"
                  stroke="#16a34a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
              Approve this listing?
            </h3>
            <p className="text-[13px] text-gray-500 mb-5">
              This will make the listing live and visible to the public.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={loadingAction}
                className="px-4 py-1.5 text-sm rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition flex items-center gap-1.5"
              >
                {loadingAction && (
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />
                    <path
                      d="M22 12a10 10 0 00-10-10"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-75"
                    />
                  </svg>
                )}
                Yes, approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT REASON MODAL */}
      {rejectModalData && (
        <RejectReasonModal
          listing={rejectModalData}
          onClose={() => setRejectModalData(null)}
          onSubmit={handleRejectSubmit}
        />
      )}

      {/* TOAST */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[10002] flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-2xl border
            ${toast.type === "error" ? "bg-red-50 border-red-200 text-red-600" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}
          style={{ animation: "slideUp 0.2s ease" }}
        >
          <span>{toast.type === "error" ? "✕" : "✓"}</span>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(8px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>

      {thanksPop && (
        <ThanksPop onClose={() => setThanksPop(false)} type={type} />
      )}
    </>
  );
};

export default SeeDetails;
