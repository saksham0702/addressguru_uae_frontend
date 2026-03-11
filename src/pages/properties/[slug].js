import BreadCrumbs from "@/components/BreadCrumbs";
import React, { useEffect, useState, useCallback } from "react";
import SliderCard from "@/components/SeeDetails/SliderCard";
import QuickInformation from "@/components/SeeDetails/QuickInformation";
import GetMoreInfo from "@/components/SeeDetails/GetMoreInfo";
import UserInformation from "@/components/SeeDetails/UserInformation";
import RecentCustomerReviewCard from "@/components/BusinessListingComponents/RecentCustomerReviewCard";
import TitleAndLogoMobile from "@/components/SeeDetails/TitleAndLogoMobile";
import LandingPageSkeleton from "@/components/BusinessListingComponents/LandingPageSkeleton";
import { get_property_by_slug } from "@/api/showlistings";
import { useRouter } from "next/router";
import Head from "next/head";
import { APP_URL } from "@/services/constants";
import LandingPage from "@/components/HeadersMobile/LandingPage";
import ThanksPop from "@/components/SeeDetails/Popups/ThanksPop";

/* ─── Checkmark SVG ─── */
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="10" fill="#FFE9D9" />
    <path
      d="M17.15 5.32c-.46-.43-1.21-.43-1.68 0L7.9 12.34 4.53 9.22c-.47-.43-1.22-.43-1.69 0-.46.43-.46 1.13 0 1.56L7.06 14.7c.23.21.53.33.84.33s.61-.12.84-.33l8.42-7.8c.47-.43.47-1.13 0-1.56z"
      fill="#FF6E04"
    />
  </svg>
);

/* ─── Section header ─── */
const SectionHeader = ({ title }) => (
  <span className="flex gap-3 items-center">
    <h2 className="font-semibold uppercase md:text-xl whitespace-nowrap">
      {title}
    </h2>
    <span className="h-[1px] w-full bg-gray-200" />
  </span>
);

/* ─── CheckList ─── */
const CheckList = ({ items, cols = 2 }) => (
  <div
    className={`grid grid-cols-1 ${cols === 2 ? "md:grid-cols-2" : ""} gap-4`}
  >
    {items.map((item, i) => (
      <div key={i} className="flex items-center space-x-2">
        <CheckIcon />
        <span className="md:text-[13.5px] text-[15px] font-semibold capitalize">
          {item}
        </span>
      </div>
    ))}
  </div>
);

/* ─── Icons for property detail fields ─── */
const FieldIcons = {
  amount: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  rent_amt: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  size: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 3L3 21" />
      <path d="M21 3h-6" />
      <path d="M21 3v6" />
      <path d="M3 21h6" />
      <path d="M3 21v-6" />
    </svg>
  ),
  bedrooms: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3" />
      <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1H7v-1a2 2 0 0 0-4 0" />
      <path d="M3 18v2" />
      <path d="M21 18v2" />
    </svg>
  ),
  bathrooms: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <line x1="10" y1="5" x2="8" y2="7" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="7" y1="19" x2="7" y2="21" />
      <line x1="17" y1="19" x2="17" y2="21" />
    </svg>
  ),
  furnishing: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  parking: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </svg>
  ),
  facing: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  floor_number: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  total_floors: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="16" y2="14" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>
  ),
  property_subtype: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  ),
  category_name: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 20 5-5 5 5" />
      <path d="m7 4 5 5 5-5" />
      <line x1="12" y1="15" x2="12" y2="9" />
    </svg>
  ),
  sale_by: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  available: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  carpet_area: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  ),
  built_area: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 3v18" />
    </svg>
  ),
  age_of_property: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  balcony_no: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  ),
  total_rooms: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  security_amt: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  maintance_amt: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  project_name: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 20h20" />
      <path d="M5 20V8l7-5 7 5v12" />
      <path d="M9 20v-5h6v5" />
    </svg>
  ),
  property_for: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  payment_plan: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  cae_number: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  con_status: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  boundary_wall: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V5a5 5 0 0 1 10 0v6" />
    </svg>
  ),
  corner_plot: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6E04"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  ),
};

/* ─── Helper: format label from key ─── */
const formatLabel = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/* ─── Helper: format value ─── */
const formatValue = (key, value) => {
  if (value === null || value === undefined || value === "") return null;

  // Boolean-like
  if (value === true || value === "yes" || value === 1) return "Yes";
  if (value === false || value === "no" || value === 0) return "No";

  // Date
  if (key === "available" || key === "available_date") {
    const d = new Date(value);
    if (!isNaN(d))
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
  }

  // Amount fields
  if (
    (key === "amount" ||
      key === "rent_amt" ||
      key === "security_amt" ||
      key === "maintance_amt") &&
    !isNaN(value)
  ) {
    return ` ${Number(value).toLocaleString("en-IN")}`;
  }

  // Size / area
  if (key === "size" || key === "carpet_area" || key === "built_area") {
    return `${value} sq.ft`;
  }

  // Underscores in values → spaces, capitalize
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

/* ─── Single detail tile ─── */
const DetailTile = ({ label, value, icon }) => (
  <div className="flex items-start gap-3 bg-[#FFF9F6] border hover:scale-105 transition-transform border-[#FFE9D9] rounded-xl p-3">
    <div className="mt-0.5 shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide leading-tight">
        {label}
      </p>
      <p className="md:text-[13px] text-[14px] font-semibold text-gray-800 capitalize leading-snug mt-0.5 break-words">
        {value}
      </p>
    </div>
  </div>
);

/* ════════════════════════════════════════════════
   Fields to render in "Property Details" grid
   (key → label override, optional)
════════════════════════════════════════════════ */
const DETAIL_FIELDS = [
  { key: "property_for", label: "Listed For" },
  { key: "property_subtype", label: "Property Type" },
  { key: "category_name", label: "Category" },
  { key: "amount", label: "Price" },
  { key: "rent_amt", label: "Rent" },
  { key: "size", label: "Size" },
  { key: "carpet_area", label: "Carpet Area" },
  { key: "built_area", label: "Built-up Area" },
  { key: "bedrooms", label: "Bedrooms" },
  { key: "bathrooms", label: "Bathrooms" },
  { key: "balcony_no", label: "Balconies" },
  { key: "total_rooms", label: "Total Rooms" },
  { key: "total_floors", label: "Total Floors" },
  { key: "floor_number", label: "Floor No." },
  { key: "furnishing", label: "Furnishing" },
  { key: "parking", label: "Parking" },
  { key: "facing", label: "Facing" },
  { key: "age_of_property", label: "Age of Property" },
  { key: "con_status", label: "Construction Status" },
  { key: "available", label: "Available From" },
  { key: "project_name", label: "Project Name" },
  { key: "sale_by", label: "Sale By" },
  { key: "payment_plan", label: "Payment Plan" },
  { key: "security_amt", label: "Security Deposit" },
  { key: "maintance_amt", label: "Maintenance Charge" },
  { key: "boundary_wall", label: "Boundary Wall" },
  { key: "corner_plot", label: "Corner Plot" },
  { key: "cae_number", label: "CEA Reg. No." },
];

/* ════════════════════════════════════════════════
   Main Component
════════════════════════════════════════════════ */
const PropertySeeDetails = () => {
  const router = useRouter();
  const { isReady, query } = router;
  const { slug } = query;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [enquirePop, setEnquirePop] = useState(false);
  const [thanksPop, setThanksPop] = useState(false);
  const [type, setType] = useState(null);

  const parseImages = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  };

  const parseList = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  };

  const fetchData = useCallback(
    async (retries = 2) => {
      if (!slug) return;
      setLoading(true);
      setError(false);
      try {
        const res = await get_property_by_slug(slug);
        console.log("response of property", res?.data);
        if (res?.data) {
          setData(res.data);
        } else {
          if (retries > 0) {
            setTimeout(() => fetchData(retries - 1), 600);
            return;
          }
          router.push("/404");
        }
      } catch (err) {
        console.error("Property fetch error:", err);
        if (retries > 0) {
          setTimeout(() => fetchData(retries - 1), 600);
          return;
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [slug],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isReady || !slug) return;
    fetchData();
  }, [isReady, slug, fetchData]);

  if (loading || !data) return <LandingPageSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500 text-lg">Failed to load listing.</p>
        <button
          onClick={() => fetchData()}
          className="bg-[#FF6E04] text-white px-6 py-2 rounded font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  const images = parseImages(data?.images);
  const payments = parseList(data?.payments);
  const facilities = parseList(data?.facilities);
  const services = parseList(data?.services);

  /* ── Build tiles — only include non-null fields ── */
  const detailTiles = DETAIL_FIELDS.reduce((acc, { key, label }) => {
    const raw = data?.[key];
    const formatted = formatValue(key, raw);
    if (formatted !== null && formatted !== undefined && formatted !== "") {
      acc.push({ key, label, value: formatted, icon: FieldIcons[key] || null });
    }
    return acc;
  }, []);

  return (
    <>
      <Head>
        <title>
          {data?.seo_title || data?.title} | Properties | AddressGuru
        </title>
        <meta
          name="description"
          content={
            data?.seo_description || data?.description?.substring(0, 160)
          }
        />
        <meta property="og:title" content={data?.seo_title || data?.title} />
        <meta
          property="og:description"
          content={
            data?.seo_description || data?.description?.substring(0, 160)
          }
        />
        <meta property="og:image" content={images?.[0]} />
        <meta
          property="og:url"
          content={`https://${APP_URL}/properties/${data?.slug}`}
        />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data?.seo_title || data?.title} />
        <meta
          name="twitter:description"
          content={
            data?.seo_description || data?.description?.substring(0, 160)
          }
        />
        <meta name="twitter:image" content={images?.[0]} />
        <link
          rel="canonical"
          href={`https://${APP_URL}/properties/${data?.slug}`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateListing",
              name: data?.title,
              description: data?.description,
              image: images,
              ...(data?.amount && {
                offers: {
                  "@type": "Offer",
                  price: data.amount,
                  priceCurrency: "INR",
                  availability: "https://schema.org/InStock",
                },
              }),
              ...(data?.locality || data?.city || data?.state
                ? {
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: data?.locality || data?.city,
                      addressRegion: data?.state,
                    },
                  }
                : {}),
            }),
          }}
        />
      </Head>

      {/* Mobile header */}
      <div className="md:hidden">
        <LandingPage />
      </div>

      {/* Mobile breadcrumb */}
      <div className="md:hidden my-1.5 max-w-xs ml-[4%]">
        <BreadCrumbs slug="properties" name={data?.slug} />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="h-auto flex flex-col items-center w-full bg-[#F8F7F7] md:mt-2">
        <div className="flex flex-col md:w-[80%] max-w-[98%] bg-white md:px-5 px-2 md:pb-7">
          {/* Desktop breadcrumb */}
          <div className="max-md:hidden my-3">
            <BreadCrumbs slug="properties" name={data?.slug} />
          </div>

          {/* Desktop title + location */}
          <div className="max-md:hidden pl-2 mb-2">
            <h1 className="font-semibold text-2xl line-clamp-2 capitalize mb-1">
              {data?.title}
            </h1>
            {(data?.locality || data?.city || data?.state) && (
              <span className="flex gap-1.5 items-center text-gray-400 font-medium text-[15px]">
                <svg
                  width="13"
                  height="18"
                  viewBox="0 0 13 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M6.29303 0.00275534C6.7548 -0.0155547 7.20809 0.0599183 7.65512 0.154148C7.95924 0.218456 8.2531 0.333229 8.54695 0.438623C8.75818 0.514543 8.96808 0.598947 9.16681 0.702555C9.38698 0.817328 9.60044 0.948177 9.80453 1.08975C10.0403 1.25364 10.2708 1.42736 10.4878 1.61493C10.6723 1.77391 10.8455 1.94898 11.0036 2.13386C11.1943 2.35671 11.3707 2.5934 11.5409 2.83277C11.6454 2.9797 11.728 3.14181 11.8169 3.29945C11.8691 3.39189 11.9138 3.48836 11.9615 3.58303C12.1022 3.8626 12.1978 4.15868 12.2974 4.45477C12.4899 5.02551 12.5591 5.61545 12.5814 6.2103C12.5908 6.45815 12.5412 6.70913 12.5055 6.95699C12.4465 7.36695 12.3313 7.76308 12.1862 8.15071C12.0951 8.39366 12.0156 8.64151 11.9147 8.88043C11.7936 9.16759 11.6547 9.4476 11.5243 9.73118C11.4681 9.8531 11.4172 9.97725 11.3587 10.0978C11.3055 10.2068 11.2448 10.3117 11.1885 10.4189C11.1452 10.5015 11.105 10.5864 11.0612 10.669C10.8964 10.9776 10.7357 11.2889 10.5633 11.593C10.3601 11.9516 10.1471 12.3049 9.93628 12.6594C9.7764 12.9278 9.61697 13.1967 9.45084 13.4611C9.28158 13.7308 9.10339 13.9952 8.93057 14.2627C8.79882 14.4672 8.67289 14.6762 8.53802 14.879C8.3375 15.1804 8.13207 15.4783 7.92798 15.7775C7.75381 16.0325 7.58009 16.2884 7.40235 16.5412C7.27507 16.722 7.14065 16.8984 7.01114 17.078C6.88699 17.2503 6.76507 17.4245 6.64137 17.5973C6.55607 17.717 6.47032 17.8363 6.38279 17.9542C6.33724 18.0158 6.24257 18.0153 6.19746 17.9524C5.9965 17.6733 5.79821 17.3924 5.5968 17.1137C5.51106 16.9949 5.41817 16.8806 5.33242 16.7613C5.23641 16.6269 5.14575 16.4885 5.05107 16.3532C4.94925 16.2076 4.84341 16.0642 4.74248 15.9177C4.62191 15.7427 4.50445 15.5658 4.38656 15.3894C4.24454 15.1768 4.10119 14.9656 3.96141 14.7513C3.79081 14.4896 3.62379 14.2252 3.45498 13.9626C3.32993 13.7683 3.20176 13.5758 3.07985 13.3798C2.93783 13.1516 2.80118 12.9202 2.66273 12.6898C2.53546 12.4781 2.40639 12.2673 2.28269 12.0539C2.1447 11.8163 2.01027 11.5765 1.87764 11.3358C1.745 11.0951 1.61504 10.853 1.48643 10.6096C1.39488 10.4363 1.30645 10.2608 1.21937 10.0853C1.1171 9.87855 1.01707 9.67044 0.917477 9.46233C0.873265 9.36944 0.8295 9.27566 0.79154 9.18009C0.695971 8.93894 0.601741 8.69733 0.511084 8.45439C0.413728 8.19359 0.308781 7.93501 0.230628 7.6684C0.160514 7.42903 0.122108 7.17984 0.0698575 6.93511C-0.0105279 6.5573 -0.0149938 6.17502 0.0234126 5.79319C0.0631587 5.39751 0.11407 5.00139 0.226609 4.61911C0.344061 4.22031 0.48027 3.82598 0.675428 3.45754C0.88309 3.06589 1.10683 2.68227 1.40426 2.34912C1.61415 2.11332 1.8169 1.86859 2.04689 1.65423C2.25857 1.45684 2.50062 1.29205 2.7333 1.11788C2.86325 1.02052 2.99901 0.930761 3.13612 0.843677C3.22007 0.790533 3.30805 0.741855 3.3996 0.704342C3.7198 0.572599 4.04268 0.447555 4.36333 0.318045C4.75365 0.1604 5.16719 0.10413 5.57849 0.042948C5.81474 0.00811427 6.055 0.0148132 6.29303 0.00275534ZM9.43476 6.59258C9.41556 4.86875 8.01864 3.44727 6.26534 3.46156C4.51562 3.47585 3.09324 4.92726 3.15264 6.71092C3.20668 8.33649 4.56117 9.78432 6.38681 9.73207C8.06955 9.68473 9.41467 8.31148 9.43476 6.59258Z"
                    fill="#8C8C8C"
                  />
                </svg>
                {data?.locality && <p>{data.locality}</p>}
                {data?.locality && (data?.city || data?.state) && (
                  <span>/</span>
                )}
                {data?.city && <p>{data.city}</p>}
                {data?.city && data?.state && <span>/</span>}
                {data?.state && <p>{data.state}</p>}
              </span>
            )}
          </div>

          {/* ── Two-column layout ── */}
          <div className="flex w-full justify-between max-md:flex-col md:mt-4">
            {/* ── LEFT ── */}
            <div className="md:w-[64.5%]">
              <SliderCard images={images} />

              {/* Mobile title block */}
              <div className="md:hidden mx-auto w-full">
                <TitleAndLogoMobile
                  data={data}
                  enquirePop={enquirePop}
                  setEnquirePop={setEnquirePop}
                />
              </div>

              {/* Description */}
              {data?.description && (
                <div className="mt-5 md:pl-2 px-1">
                  <SectionHeader title="Description" />
                  <p className="md:text-[13.5px] text-[15px] mt-2 md:font-[500] leading-relaxed">
                    {data.description}
                  </p>
                </div>
              )}

              {/* ── Property Details Grid ── */}
              {detailTiles.length > 0 && (
                <div className="mt-6 md:pl-2 px-1">
                  <SectionHeader title="Property Details" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                    {detailTiles.map(({ key, label, value, icon }) => (
                      <DetailTile
                        key={key}
                        label={label}
                        value={value}
                        icon={icon}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities */}
              {facilities.length > 0 && (
                <div className="max-w-4xl mt-6 md:pl-2 px-1">
                  <SectionHeader title="Facilities" />
                  <p className="md:text-[13.5px] text-[15px] mt-2 mb-4 md:font-[500]">
                    {data?.title} provides the following facilities:
                  </p>
                  <CheckList items={facilities} />
                </div>
              )}

              {/* Services */}
              {services.length > 0 && (
                <div className="max-w-4xl mt-6 md:pl-2 px-1">
                  <SectionHeader title="Services" />
                  <p className="md:text-[13.5px] text-[15px] mt-2 mb-4 md:font-[500]">
                    {data?.title} provides the following services:
                  </p>
                  <CheckList items={services} />
                </div>
              )}

              {/* Payment Modes */}
              {payments.length > 0 && (
                <div className="max-w-5xl mt-6 md:pl-2 px-1">
                  <SectionHeader title="Payment Modes" />
                  <p className="md:text-[13.5px] text-[15px] mt-2 mb-4 md:font-[500]">
                    {data?.title} accepts the following payment methods:
                  </p>
                  <CheckList items={payments} cols={1} />
                </div>
              )}

              {/* Overview */}
              <div className="max-w-5xl mt-6 md:pl-2 px-1 mb-4">
                <SectionHeader title="Overview" />
                <div className="md:text-[13.5px] text-[15px] md:font-[500] flex flex-col gap-4 mt-2 max-w-4xl">
                  <p>
                    {`${data?.title} is listed on AddressGuru`}
                    {data?.locality ? ` in ${data.locality}` : ""}
                    {data?.city ? `, ${data.city}` : ""}
                    {data?.state ? `, ${data.state}` : ""}.
                    {facilities.length > 0 && (
                      <span> Facilities include: {facilities.join(", ")}.</span>
                    )}
                  </p>
                  <p>Scroll to the top for more details about {data?.title}.</p>
                  <p>
                    Found this listing helpful? Tell {data?.title} you
                    discovered them on{" "}
                    <strong className="text-[#FF6E04]">Address Guru</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="md:w-[34%] max-md:hidden h-auto mb-10 flex flex-col gap-5">
              <QuickInformation
                id={data?.id}
                category={data?.category}
                link={data?.website_link}
              />
              <div className="w-full h-[30rem] mb-7">
                <GetMoreInfo
                  name={data?.title}
                  type="property"
                  id={data?.id}
                  setType={setType}
                  setThanksPop={setThanksPop}
                />
              </div>
              <UserInformation />
            </div>
          </div>

          {/* Mobile UserInformation */}
          <div className="md:hidden">
            <UserInformation />
          </div>

          {/* Reviews */}
          {data?.ratings && data?.ratings?.length > 0 && (
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

      {/* Mobile Enquire Popup */}
      {enquirePop && (
        <div
          className="inset-0 flex items-center fixed justify-center backdrop-blur-sm z-50 py-20 px-5"
          onClick={() => setEnquirePop(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <GetMoreInfo
              name={data?.title}
              type="property"
              id={data?.id}
              setEnquirePop={setEnquirePop}
              setType={setType}
              setThanksPop={setThanksPop}
            />
          </div>
        </div>
      )}

      {/* Thank You Popup */}
      {thanksPop && (
        <ThanksPop onClose={() => setThanksPop(false)} type={type} />
      )}
    </>
  );
};

export default PropertySeeDetails;
