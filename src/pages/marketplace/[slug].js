import BreadCrumbs from "@/components/BreadCrumbs";
import React, { useEffect, useState, useCallback } from "react";
import SliderCard from "@/components/SeeDetails/SliderCard";
import QuickInformation from "@/components/SeeDetails/QuickInformation";
import GetMoreInfo from "@/components/SeeDetails/GetMoreInfo";
import UserInformation from "@/components/SeeDetails/UserInformation";
import RecentCustomerReviewCard from "@/components/BusinessListingComponents/RecentCustomerReviewCard";
import TitleAndLogoMobile from "@/components/SeeDetails/TitleAndLogoMobile";
import LandingPageSkeleton from "@/components/BusinessListingComponents/LandingPageSkeleton";
import { useRouter } from "next/router";
import SEOHead from "@/components/SEOHead";
import LandingPage from "@/components/HeadersMobile/LandingPage";
import ThanksPop from "@/components/SeeDetails/Popups/ThanksPop";
import {
  approve_marketplace_listing,
  get_marketplace_by_slug,
  reject_marketplace_listing,
} from "@/api/uae-marketplace";
import { useAuth } from "@/context/AuthContext";

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
    <h2 className="font-semibold uppercase md:text-xl whitespace-nowrap text-gray-800">
      {title}
    </h2>
    <span className="h-[1px] w-full bg-gray-200" />
  </span>
);

/* ─── Info row for overview ─── */
const InfoRow = ({ label, value, icon }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-500">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm text-gray-800 font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
};

/* ─── Price display component ─── */
const PriceDisplay = ({ price, condition }) => {
  if (!price?.amount) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-base font-semibold text-orange-700">
            Enquire for price
          </span>
        </div>
        <p className="text-xs text-orange-600/70 mt-1 ml-7">
          Contact seller for pricing details
        </p>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-AE").format(price.amount);

  return (
    <div className="bg-gray-50 rounded-xl p-4 text-white">
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm text-gray-900 font-medium">
          {price.currency}
        </span>
        <span className="text-3xl font-bold text-black tracking-tight">
          {formattedPrice}
        </span>
      </div>
      <div className="flex items-center gap-3 mt-2">
        {price.isNegotiable && (
          <span className="text-xs text-emerald-400 px-2 py-0.5 rounded-full font-medium">
            Negotiable
          </span>
        )}
        {price.isFixed && (
          <span className="text-xs  text-blue-400 px-2 py-0.5 rounded-full font-medium">
            Fixed Price
          </span>
        )}
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            condition === "new"
              ? "bg-green-500/20 text-green-400"
              : "bg-amber-500/20 text-amber-400"
          }`}
        >
          {condition}
        </span>
      </div>
    </div>
  );
};

/* ─── Seller card ─── */
const SellerCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">
        Seller Information
      </h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
            {data.contactPersonName?.charAt(0) || "?"}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {data.contactPersonName || "Anonymous"}
            </p>
            <p className="text-xs text-gray-400">
              Member since {new Date(data.createdAt).getFullYear()}
            </p>
          </div>
        </div>

        {data.isVerified && (
          <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-1.5 rounded-lg">
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Verified Seller
          </div>
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════
   Main Component
════════════════════════════════════════════════ */
const MarketplaceSeeDetails = () => {
  const router = useRouter();
  const { isReady, query } = router;
  const { slug, preview } = query;
  const { user } = useAuth();

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchData = useCallback(
    async (retries = 2) => {
      if (!slug) return;
      setLoading(true);
      setError(false);
      try {
        const res = await get_marketplace_by_slug(slug);
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
        console.error("Marketplace fetch error:", err);
        if (retries > 0) {
          setTimeout(() => fetchData(retries - 1), 600);
          return;
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [slug, router],
  );

  const handleApprove = async () => {
    try {
      const res = await approve_marketplace_listing(data?._id);
      alert("Marketplace Approved ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to approve ❌");
    }
  };

  const handleReject = async () => {
    try {
      const res = await reject_marketplace_listing(data?._id, {
        status: "rejected",
        rejectionReason: "rejected by admin",
      });
      alert("Marketplace Rejected ❌");
    } catch (err) {
      console.error(err);
      alert("Failed to reject ❌");
    }
  };

  useEffect(() => {
    if (!isReady || !slug) return;
    fetchData();
  }, [isReady, slug, fetchData]);

  if (loading || !data) {
    return <LandingPageSkeleton />;
  }

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

  const images = parseImages(data.images);
  const payments = parseList(data.payments);
  const facilities = parseList(data.facilities);
  const services = parseList(data.services);

  // Build extra fields for QuickInformation
  const marketplaceExtraFields = {
    quickinfo: [
      { label: "Condition", value: data.condition },
      { label: "Category", value: data.category?.name },
      { label: "Sub Category", value: data.subCategory?.name },
      { label: "Location", value: data.locality || data.city?.name },
      { label: "Address", value: data.address },
      { label: "Contact Person", value: data.contactPersonName },
      { label: "Phone", value: `${data.countryCode} ${data.mobileNumber}` },
      { label: "Email", value: data.email },
      ...(data.price?.amount
        ? [
            {
              label: "Price",
              value: `${data.price.currency} ${new Intl.NumberFormat("en-AE").format(data.price.amount)}${data.price.isNegotiable ? " (Negotiable)" : ""}`,
            },
          ]
        : []),
    ].filter((f) => f.value),
  };

  return (
    <>
      <SEOHead
        title={`${data?.title} | Marketplace | AddressGuru`}
        description={data?.description?.substring(0, 160)}
        keywords={`${data?.title}, marketplace UAE, AddressGuru marketplace, ${data?.category?.name || ""}`}
        canonical={`https://addressguru.ae/marketplace/${data?.slug}`}
        ogImage={images?.[0] || "/home-og-image.jpg"}
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: data?.title,
          description: data?.description,
          image: images,
          offers: {
            "@type": "Offer",
            price: data?.price?.amount || "0",
            priceCurrency: data?.price?.currency || "AED",
            availability: data?.isSold
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
          },
        }}
      />

      {/* Mobile header */}
      <div className="md:hidden">
        <LandingPage />
      </div>

      {/* Mobile breadcrumb */}
      <div className="md:hidden my-1.5 max-w-xs ml-[4%]">
        <BreadCrumbs slug="marketplace" name={data?.slug} />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div
        className={`h-auto flex flex-col items-center w-full bg-[#F8F7F7] md:mt-2 ${
          preview === "true" ? "pointer-events-none opacity-90" : ""
        }`}
      >
        <div className="flex flex-col md:w-[80%] max-w-[98%] bg-white md:px-5 px-2 md:pb-7">
          {/* Desktop breadcrumb */}
          <div className="max-md:hidden my-3">
            <BreadCrumbs slug="marketplace" name={data?.slug} />
          </div>

          {/* Desktop title + meta */}
          <div className="max-md:hidden pl-2 mb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="font-bold text-2xl line-clamp-2 capitalize mb-2 text-gray-900">
                  {data?.title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Posted {formatDate(data?.createdAt)}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {data?.city?.name}
                    {data?.locality && `, ${data.locality}`}
                  </span>
                  {data?.isSold && (
                    <>
                      <span>·</span>
                      <span className="text-red-500 font-medium text-xs bg-red-50 px-2 py-0.5 rounded-full">
                        SOLD
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Price badge for desktop header */}
              {data?.price?.amount ? (
                <div className="text-right">
                  <div className="flex items-baseline gap-1 justify-end">
                    <span className="text-sm text-gray-400">
                      {data.price.currency}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {new Intl.NumberFormat("en-AE").format(data.price.amount)}
                    </span>
                  </div>
                  {data.price.isNegotiable && (
                    <span className="text-xs text-emerald-600 font-medium">
                      Negotiable
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Enquire for price
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Two-column layout ── */}
          <div className="flex w-full justify-between max-md:flex-col md:mt-4">
            {/* LEFT COLUMN */}
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

              {/* Mobile Price / Enquire */}
              <div className="md:hidden px-2 mt-3">
                <PriceDisplay
                  price={data?.price}
                  condition={data?.condition}
                />{" "}
              </div>

              {/* Key Details Grid */}
              <div className="mt-5 md:pl-2 px-1">
                <SectionHeader title="Key Details" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  <InfoRow
                    label="Condition"
                    value={data?.condition}
                    icon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    }
                  />
                  <InfoRow
                    label="Category"
                    value={data?.category?.name}
                    // icon={<CategoryIcon />}
                  />
                  {data?.subCategory?.name && (
                    <InfoRow
                      label="Sub Category"
                      value={data.subCategory.name}
                      icon={
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                      }
                    />
                  )}
                  <InfoRow
                    label="Location"
                    value={`${data?.city?.name}${data?.locality ? `, ${data.locality}` : ""}`}
                    icon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    }
                  />
                  <InfoRow
                    label="Posted"
                    value={formatDate(data?.createdAt)}
                    icon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    }
                  />
                  <InfoRow
                    label="Status"
                    value={data?.isSold ? "Sold" : "Available"}
                    icon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    }
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 md:pl-2 px-1">
                <SectionHeader title="Description" />
                <div className="mt-3 bg-gray-50 rounded-xl p-4">
                  <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {data?.description}
                  </p>
                </div>
              </div>

              {/* Seller Info (Mobile) */}
              <div className="md:hidden mt-5 px-1">
                <SellerCard data={data} />
              </div>

              {/* Facilities */}
              {facilities.length > 0 && (
                <div className="max-w-4xl mt-6 md:pl-2 px-1">
                  <SectionHeader title="Facilities" />
                  <p className="text-sm text-gray-500 mt-2 mb-3">
                    {data?.title} provides the following facilities:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {facilities.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <CheckIcon />
                        <span className="text-sm text-gray-700 font-medium capitalize">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {services.length > 0 && (
                <div className="max-w-4xl mt-6 md:pl-2 px-1">
                  <SectionHeader title="Services" />
                  <p className="text-sm text-gray-500 mt-2 mb-3">
                    {data?.title} provides the following services:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {services.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <CheckIcon />
                        <span className="text-sm text-gray-700 font-medium capitalize">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Modes */}
              {payments.length > 0 && (
                <div className="max-w-5xl mt-6 md:pl-2 px-1">
                  <SectionHeader title="Payment Modes" />
                  <p className="text-sm text-gray-500 mt-2 mb-3">
                    Accepted payment methods:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {payments.map((item, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Location / Address */}
              {(data?.address || data?.city) && (
                <div className="mt-6 md:pl-2 px-1">
                  <SectionHeader title="Location" />
                  <div className="mt-3 bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {data.address}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {data.locality && `${data.locality}, `}
                          {data.city?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Overview */}
              <div className="max-w-5xl mt-6 md:pl-2 px-1 mb-6">
                <SectionHeader title="Overview" />
                <div className="text-sm text-gray-600 flex flex-col gap-3 mt-3">
                  <p>
                    <strong className="text-gray-800">{data?.title}</strong> is
                    listed on AddressGuru Marketplace
                    {data?.city?.name ? ` in ${data.city.name}` : ""}.
                    {data?.category?.name && (
                      <span>
                        {" "}
                        It falls under the{" "}
                        <strong className="text-orange-600">
                          {data.category.name}
                        </strong>{" "}
                        category
                      </span>
                    )}
                    {data?.subCategory?.name && (
                      <span>
                        {" "}
                        ›{" "}
                        <strong className="text-orange-600">
                          {data.subCategory.name}
                        </strong>
                      </span>
                    )}
                    .
                  </p>
                  {facilities.length > 0 && (
                    <p>Facilities include: {facilities.join(", ")}.</p>
                  )}
                  <p>
                    Found this listing helpful? Contact the seller using the
                    enquiry form or reach out directly via phone/email.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="md:w-[34%] max-md:hidden h-auto mb-10 flex flex-col gap-4">
              {/* Price Card */}
              <PriceDisplay price={data?.price} condition={data?.condition} />
              {/* Seller Card */}
              <SellerCard data={data} />

              {/* Quick Info */}
              <QuickInformation
                id={data?._id}
                marketplace={true}
                category={data?.category}
                link={data?.website_link}
                extraFields={marketplaceExtraFields}
              />

              {/* Enquiry Form */}
              <div className="w-full">
                <GetMoreInfo
                  name={data?.title}
                  type="marketplace"
                  id={data?._id}
                  setType={setType}
                  setThanksPop={setThanksPop}
                />
              </div>
            </div>
          </div>

          {/* Mobile Enquiry Button */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40">
            <button
              onClick={() => setEnquirePop(true)}
              className="w-full bg-[#FF6E04] text-white font-semibold py-3 rounded-xl shadow-lg active:scale-[0.98] transition-transform"
            >
              {data?.price?.amount ? "Contact Seller" : "Enquire Now"}
            </button>
          </div>

          {/* Reviews */}
          {data?.ratings && data.ratings.length > 0 && (
            <div className="h-70 w-full space-y-2 my-5">
              <div className="flex w-full items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
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
              type="marketplace"
              id={data?._id}
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

      {/* PREVIEW BANNER */}
      {preview === "true" && (
        <div className="fixed top-0 left-0 w-full z-[10000] backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-gray-700 tracking-wide">
                Preview Mode
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  router.push(
                    `/dashboard/marketplace-listing?productId=${data?.slug}&edit=true`,
                  )
                }
                className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
              >
                ✏️ Edit
              </button>
              {user?.data?.roles?.[0] == 1 && (
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition shadow-sm"
                  style={{ pointerEvents: "auto" }}
                >
                  ✔ Approve
                </button>
              )}
              {user?.data?.roles?.[0] == 1 && (
                <button
                  onClick={handleReject}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-sm"
                  style={{ pointerEvents: "auto" }}
                >
                  ✖ Reject
                </button>
              )}
              <button
                onClick={() => router.back()}
                className="ml-2 px-4 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                style={{ pointerEvents: "auto" }}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketplaceSeeDetails;
