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
import { get_rooms_by_listing } from "@/api/rooms";
import InfoSection from "@/components/SeeDetails/Popups/InfoSection";
import { APP_URL } from "@/services/constants";
import ConfirmModal from "@/components/SeeDetails/Popups/ConfirmModal";
import { generateFAQs } from "@/utils/generateFAQs";
import FAQSection from "@/components/SeeDetails/FAQSection";

// ─────────────────────────────────────────────────────────────
// SSR — fetch listing + rooms in parallel, never double-fetch
// ─────────────────────────────────────────────────────────────
export async function getServerSideProps(context) {
  const { slug } = context.params;

  try {
    // 1️⃣ First get listing
    const listingRes = await get_listing_data(slug);

    if (!listingRes?.data?.data) {
      return { notFound: true };
    }

    const listing = listingRes.data.data;

    // 2️⃣ Now use listing.id to fetch rooms
    let rooms = null;
    try {
      const roomsRes = await get_rooms_by_listing(listing._id); // ✅ use ID here
      rooms = roomsRes?.data ?? null;
    } catch (err) {
      console.log("Rooms fetch failed (non-blocking):", err);
    }

    // 3️⃣ SEO rule
    if (listing.status !== "approved") {
      context.res.setHeader("X-Robots-Tag", "noindex, nofollow");
    }

    return {
      props: {
        initialData: listing,
        initialRooms: rooms,
      },
    };
  } catch (err) {
    console.error("SSR listing fetch error:", err);
    return { notFound: true };
  }
}

// Status badge config
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

const IMG_URL = "https://addressguru.ae/api";

// Helpers

/** Compute average rating from ratings array */

function computeAvgRating(ratings) {
  if (!Array.isArray(ratings) || ratings.length === 0) return null;
  const sum = ratings.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  return (sum / ratings.length).toFixed(1);
}

/** Build opening-hours string array for Schema.org */
function buildOpeningHours(workingHours) {
  if (!workingHours) return undefined;
  // If already an array of strings, use directly
  if (Array.isArray(workingHours) && typeof workingHours[0] === "string") {
    return workingHours;
  }
  // If it's an object map { Monday: { open: "09:00", close: "18:00" }, ... }
  if (typeof workingHours === "object" && !Array.isArray(workingHours)) {
    const dayAbbr = {
      Monday: "Mo",
      Tuesday: "Tu",
      Wednesday: "We",
      Thursday: "Th",
      Friday: "Fr",
      Saturday: "Sa",
      Sunday: "Su",
    };
    return Object.entries(workingHours)
      .filter(([, v]) => v && v.open && v.close)
      .map(([day, v]) => `${dayAbbr[day] ?? day} ${v.open}-${v.close}`);
  }
  return undefined;
}

/** Format rooms data for RoomsSection component */
function formatRooms(rooms) {
  if (!rooms?.rooms?.length) return null;
  return {
    startingFrom: rooms.startingFrom,
    checkIn: rooms.checkIn,
    checkOut: rooms.checkOut,
    availableDates: [],
    rooms: rooms.rooms.map((room) => ({
      name: room.roomType,
      price: room.price,
      roomType: room.roomType,
      capacity: room.capacity,
      images: room.images ?? [],
    })),
  };
}

// Component
const SeeDetails = ({ initialData, initialRooms }) => {
  console.log("initial data", initialData);
  const router = useRouter();
  const { slug, preview } = router.query;
  const { city, user } = useAuth();
  const serverCity = city;
  // State
  const [data, setData] = useState(initialData ?? null);
  const [rooms, setRooms] = useState(initialRooms ?? null);
  // Only show skeleton if SSR gave us nothing (shouldn't happen, but safe)

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

  //  Derived values
  const isAdmin = user?.data?.roles?.[0] === 1;
  const status = data?.status ?? "pending";
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const isSliderFull =
    (data?.category?.name === "Hotel" ||
      data?.category?.name === "Yoga Studio") &&
    data?.images?.length >= 5;

  const formattedRoomsData = rooms ? formatRooms(rooms) : null;
  const formatAdditionalFields = (fields = []) => {
    const result = {
      logo: [],
      quickinfo: [],
      description: [],
      additional: [],
    };

    fields.forEach((item) => {
      const field = {
        label: item.field_label,
        value: item.value,
        type: item.field_type,
      };

      if (item?.field_id?.is_logo) {
        result.logo.push(field);
      } else if (item?.field_id?.is_quickinfo) {
        result.quickinfo.push(field);
      } else if (item?.field_id?.is_description) {
        result.description.push(field);
      } else {
        result.additional.push(field);
      }
    });

    return result;
  };

  const formattedFields = formatAdditionalFields(data?.additionalFields);

  // SEO computed values
  const avgRating = computeAvgRating(data?.ratings);
  const pageUrl = `https://addressguru.ae/${data?.slug ?? ""}`;
  // Generate FAQs
  const faqs = generateFAQs(data, serverCity);
  const pageTitle = `${data?.seo?.title || data?.businessName || ""} | ${serverCity} | AddressGuru`;
  const pageDesc = (
    data?.seo?.description ||
    data?.description ||
    data?.ad_description ||
    ""
  ).substring(0, 160);
  const ogImage = `${IMG_URL}/${data?.images?.[0]}` ?? "";
  const openingHoursSchema = buildOpeningHours(data?.workingHours);

  //  Toast helper
  function showToast(msg, toastType = "success") {
    setToast({ msg, type: toastType });
    setTimeout(() => setToast(null), 3000);
  }

  //  Responsive

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //  Client-side re-fetch ONLY on slug navigation change
  // (when Next.js shallow-routes without a full SSR round-trip)
  useEffect(() => {
    if (!slug || !data) return;
    setLoading(true);
    get_listing_data(slug)
      .then((listingRes) => {
        if (!listingRes?.data?.data) {
          router.push("/404");
          return;
        }
        const listing = listingRes.data.data;
        setData(listing);
        // fetch rooms AFTER listing
        return get_rooms_by_listing(listing?._id);
      })
      .then((roomsRes) => {
        if (roomsRes?.data) {
          setRooms(roomsRes.data);
        } else {
          setRooms(null);
        }
      })
      .catch((err) => {
        console.error("Client-side listing fetch error:", err);
        router.push("/404");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  //  View tracking (once per mount)
  const viewTracked = useRef(false);
  useEffect(() => {
    if (!data?.slug || viewTracked.current) return;
    viewTracked.current = true;
    track_event("business", data.slug, "view").catch(() => {});
  }, [data?.slug]);

  //  Event handlers
  const handleWebsiteClick = (listingSlug) =>
    track_event("business", listingSlug, "website_visit").catch(() => {});
  const handleClick = (listingSlug) =>
    track_event("business", listingSlug, "call").catch(() => {});
  const handlePop = (name) => setActivePop(name);
  const closePopup = () => setActivePop(null);

  //  Admin actions
  const handleApprove = async () => {
    try {
      setLoadingAction(true);
      await approve_listing(data?._id);
      setData((prev) => ({ ...prev, status: "approved" }));
      setConfirmAction(null);
      showToast("Listing approved successfully", "success");
    } catch {
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
    } catch {
      showToast("Failed to reject listing", "error");
    } finally {
      setLoadingAction(false);
    }
  };

  //  Guard
  if (loading || !data) return <LandingPageSkeleton />;

  //  Render
  return (
    <>
      {/*  SEO HEAD  */}
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />

        {/* Robots — noindex unapproved listings */}
        <meta
          name="robots"
          content={
            data.status === "approved" ? "index, follow" : "noindex, nofollow"
          }
        />

        {/* Open Graph */}
        <meta property="og:type" content="business.business" />
        <meta property="og:site_name" content="AddressGuru UAE" />
        <meta property="og:locale" content="en_AE" />
        <meta property="og:title" content={data.businessName ?? ""} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content={data.businessName ?? ""} />
        <meta property="og:url" content={pageUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.businessName ?? ""} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={data.businessName ?? ""} />

        {/* Canonical */}
        <link rel="canonical" href={pageUrl} />

        {/* JSON-LD — LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: data.businessName,
              description: data.description || data.ad_description,
              image: data.images,
              url: pageUrl,
              telephone: data.mobileNumber
                ? `${data.countryCode ?? ""}${data.mobileNumber}`.trim()
                : undefined,
              email: data.email || undefined,
              address: {
                "@type": "PostalAddress",
                streetAddress: data.businessAddress,
                addressLocality: serverCity || "Dubai",
                addressCountry: "AE",
              },
              geo:
                data.location?.lat && data.location?.lng
                  ? {
                      "@type": "GeoCoordinates",
                      latitude: data.location.lat,
                      longitude: data.location.lng,
                    }
                  : undefined,
              openingHours: openingHoursSchema,
              aggregateRating: avgRating
                ? {
                    "@type": "AggregateRating",
                    ratingValue: avgRating,
                    reviewCount: data.ratings.length,
                    bestRating: "5",
                    worstRating: "1",
                  }
                : undefined,
              review: data.ratings?.slice(0, 5).map((r) => ({
                "@type": "Review",
                author: { "@type": "Person", name: r.name || "Anonymous" },
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: r.rating,
                  bestRating: "5",
                },
                reviewBody: r.comment || undefined,
              })),
              priceRange: "$$",
            }),
          }}
        />
        {/* JSON-LD — FAQPage */}
        {faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                  },
                })),
              }),
            }}
          />
        )}
      </Head>

      {/* ── MOBILE HEADER ──────────────────────────────────── */}
      <div className="md:hidden">
        <LandingPage />
      </div>
      <div className="md:hidden my-1.5 max-w-xs ml-[4%]">
        <BreadCrumbs
          slug={data?.category?.name}
          city={data?.city?.name}
          name={data?.name}
          type={true}
        />
      </div>

      {/* ── POPUPS ─────────────────────────────────────────── */}
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

      {/* ── FIXED ADMIN PANEL (right edge, desktop only) ───── */}
      {(isAdmin || preview === "true") && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[9999] flex flex-col items-end gap-2 pr-0 max-md:hidden">
          {/* Action icon strip */}
          <div className="flex flex-col items-center gap-1 mr-1">
            {/* Edit */}
            <Link
              href={`/dashboard/listing-forms?category=${data?.category?._id}&categoryName=${encodeURIComponent(data?.businessName ?? "")}&name=${encodeURIComponent(data?.slug ?? "")}`}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-300 transition"
              title="Edit"
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

            {/* Approve */}
            {isAdmin && status !== "approved" && (
              <button
                onClick={() => setConfirmAction("approve")}
                className="w-9 h-9 rounded-full bg-white border border-green-200 shadow flex items-center justify-center text-green-600 hover:bg-green-50 transition"
                title="Approve"
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

            {/* Reject */}
            {isAdmin && status !== "rejected" && (
              <button
                onClick={() => setRejectModalData(data)}
                className="w-9 h-9 rounded-full bg-white border border-red-200 shadow flex items-center justify-center text-red-500 hover:bg-red-50 transition"
                title="Reject"
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

          {/* Info card */}
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
                    rel="noreferrer noopener"
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

            {/* Views badge */}
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
                Views&nbsp;
                <span className="bg-white text-[#e8a020] rounded px-1 font-bold text-[11px]">
                  {data?.views ?? 0}
                </span>
              </div>
            </div>

            {/* Transfer Ownership (admin only) */}
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

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <div
        className={`h-auto flex flex-col items-center w-full bg-[#F8F7F7] md:mt-2 ${
          preview === "true" ? "opacity-100" : ""
        }`}
      >
        <div className="flex flex-col md:w-[80%] max-w-[98%] relative bg-white md:px-5 px-2 md:pb-7">
          {/* Breadcrumbs (desktop) */}
          <div className="max-md:hidden my-3">
            <BreadCrumbs
              slug={data?.category?.slug}
              city={serverCity}
              name={data?.slug}
              type={true}
            />
          </div>

          {/* Title + Logo (desktop) */}
          <div className="max-md:hidden md:w-[64.5%]">
            <TitleAndLogo
              handlePop={handlePop}
              name={data?.businessName}
              address={data?.businessAddress}
              extraFields={formattedFields?.logo}
              data={data}
              logo={data?.logo}
              ratings={data?.ratings}
              handleClick={handleClick}
              openingHours={data?.workingHours}
              enquirePop={enquirePop}
              setEnquirePop={setEnquirePop}
            />
          </div>

          {/* Full-width hero gallery (Hotel / Yoga Studio with 5+ images, desktop) */}
          {isSliderFull && !isMobile && (
            <div className="w-full mt-1 px-2 md:px-0 mb-4">
              <FullWidthGallery images={data?.images} />
            </div>
          )}

          {/* Standard slider (mobile OR normal categories) */}
          {(isMobile || !isSliderFull) && (
            <div className={!isMobile ? "md:w-[64.5%]" : "w-full"}>
              <SliderCard slider={false} images={data?.images} />
            </div>
          )}

          <div className="flex w-full justify-between max-md:flex-col md:mt-4">
            {/* ── LEFT COLUMN ────────────────────────────────── */}
            <div className="md:w-[64.5%]">
              {/* Title + Logo (mobile) */}
              <div className="md:hidden mx-auto w-full">
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
                  <span className="h-[1px] w-full bg-gray-200" />
                </span>
                <p className="md:text-[16px] text-[16px] mt-2 md:font-normal">
                  {data?.description}
                </p>
              </div>

              {/* COURSES */}
              <InfoSection
                title="COURSES"
                description={`${data?.businessAddress} provides the following courses:`}
                items={data?.courses}
              />

              {/* SERVICES */}
              <InfoSection
                title="SERVICES"
                description={`${data?.businessName} provides the following services:`}
                items={data?.services}
              />

              {/* FACILITIES */}
              <InfoSection
                title="FACILITIES"
                description={`${data?.businessName} provides the following facilities:`}
                items={data?.facilities}
              />

              {/* PAYMENT METHODS */}
              <InfoSection
                title="Payment Modes"
                description={`${data?.businessName} accepts the following payment methods:`}
                items={data?.paymentModes}
                useGrid={false} // because this was vertical
              />
              {/* FAQ SECTION */}
              <FAQSection faqs={faqs} />

              {/* OVERVIEW */}
              <div className="max-w-5xl mt-5 md:pl-2 px-1">
                <span className="flex gap-3 items-center">
                  <h3 className="font-semibold uppercase md:text-xl">
                    Overview
                  </h3>
                  <span className="h-[1px] w-full bg-gray-200" />
                </span>
                <div className="md:text-[13.5px] text-[15px] md:font-[500] flex flex-col gap-5 mt-2 max-w-4xl">
                  <p>
                    {`${data?.businessName} is located at ${data?.businessAddress}, ${serverCity}.`}
                    {data?.services?.length > 0 && (
                      <span>
                        {" Their services include: "}
                        {data.services
                          ?.slice(0, 5)
                          .map((f) => f.name)
                          .join(", ")}
                        .
                      </span>
                    )}
                    {data?.paymentModes?.length > 0 && (
                      <span>
                        {" They accept payments: "}
                        {data.paymentModes
                          ?.slice(0, 5)
                          .map((f) => f.name)
                          .join(", ")}
                        .
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

            {/* ── RIGHT COLUMN ───────────────────────────────── */}
            <div
              className={`md:w-[34%] ${
                isSliderFull ? "" : "md:absolute md:top-49 md:right-0"
              } max-md:hidden h-auto mb-10 flex flex-col gap-5`}
            >
              <QuickInformation
                id={data?.id}
                businesshours={data?.workingHours}
                extraFields={formattedFields} // full object
                category={data?.category}
                link={data?.websiteLink}
                handlePop={handlePop}
                handleWebsiteClick={handleWebsiteClick}
              />

              {rooms?.rooms?.length > 0 ? (
                <RoomsSection
                  enquirePop={enquirePop}
                  setEnquirePop={setEnquirePop}
                  category={rooms?.categoryType?.toLowerCase()}
                  data={formattedRoomsData}
                />
              ) : (
                <GetMoreInfo
                  isPop={false}
                  logo={`${APP_URL}${data?.logo}`}
                  image={`${APP_URL}${data?.images[0]}`}
                  type="listing"
                  name={data?.businessName}
                  id={data?._id}
                  slug={data?.slug}
                  setEnquirePop={setEnquirePop}
                />
              )}
              <UserInformation />
            </div>
          </div>

          {/* Mobile UserInformation */}
          <div className="md:hidden mt-10">
            <UserInformation />
          </div>

          {/* REVIEWS */}
          {data?.ratings?.length > 0 && (
            <div className="h-70 w-full space-y-2 my-5">
              <div className="flex w-full items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Recent Customer Reviews
                </h2>
              </div>
              <div className="py-2 md:pl-4 flex md:justify-between overflow-x-scroll hide-scroll w-full gap-5">
                {data.ratings.map((item, index) => (
                  <RecentCustomerReviewCard key={index} data={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── ENQUIRE POPUP ──────────────────────────────────── */}
      {enquirePop && (
        <div
          className="inset-0 flex items-center fixed justify-center backdrop-blur-xs bg-black/60 z-50 py-20 px-5"
          onClick={() => setEnquirePop(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <GetMoreInfo
              isPop={true}
              logo={`${APP_URL}/${data?.logo}`}
              address={data?.businessAddress}
              image={`${APP_URL}/${data?.images[0]}`}
              type="listing"
              name={data?.businessName}
              id={data?._id}
              slug={data?.slug}
              setEnquirePop={setEnquirePop}
            />
          </div>
        </div>
      )}

      {/* ── CONFIRM APPROVE MODAL ──────────────────────────── */}
      {confirmAction === "approve" && (
        <ConfirmModal
          open={confirmAction === "approve"}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleApprove}
          loading={loadingAction}
          type="approve"
          title="Approve this listing?"
          description="This will make the listing live and visible to the public."
          confirmText="Yes, approve"
        />
      )}

      {/* ── TOAST ─────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[10002] flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium shadow-2xl border ${
            toast.type === "error"
              ? "bg-red-50 border-red-200 text-red-600"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
          style={{ animation: "slideUp 0.2s ease" }}
        >
          <span>{toast.type === "error" ? "✕" : "✓"}</span>
          {toast.msg}
        </div>
      )}

      {/* ── REJECT MODAL ───────────────────────────────────── */}
      {rejectModalData && (
        <RejectReasonModal
          listing={rejectModalData}
          onClose={() => setRejectModalData(null)}
          onSubmit={handleRejectSubmit}
        />
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(8px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>

      {/* ── THANKS POPUP ───────────────────────────────────── */}
      {thanksPop && (
        <ThanksPop onClose={() => setThanksPop(false)} type={type} />
      )}
    </>
  );
};

export default SeeDetails;
