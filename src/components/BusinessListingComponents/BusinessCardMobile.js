import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Building2,
  Phone,
  MessageSquare,
} from "lucide-react";
import { APP_URL } from "@/services/constants";
import { get_view } from "@/api/queries";

const WhatsAppIcon = ({ size = 13 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.975-1.302A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.952 7.952 0 0 1-4.073-1.117l-.292-.174-3.038.796.812-2.967-.19-.305A7.96 7.96 0 0 1 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
  </svg>
);

const MiniSlider = ({ images, businessName, logo }) => {
  const [cur, setCur] = useState(0);
  const touchStartX = useRef(null);
  const total = images.length;
  const goTo = (n) => setCur((n + total) % total);
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 30) goTo(cur + (dx < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  if (!images || images.length === 0) {
    return (
      <div
        className="relative flex-shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden"
        style={{ width: 120, alignSelf: "stretch" }}
      >
        {logo ? (
          <Image
            src={`${APP_URL}/${logo}`}
            alt={businessName}
            fill
            className="object-contain p-4"
            sizes="120px"
          />
        ) : (
          <Building2 size={26} className="text-gray-300" />
        )}
      </div>
    );
  }

  return (
    <div
      className="relative flex-shrink-0 overflow-hidden bg-gray-100"
      style={{ width: 120, alignSelf: "stretch" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${cur * 100}%)` }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 h-full"
            style={{ width: 120 }}
          >
            <Image
              src={`${APP_URL}/${img}`}
              alt={`${businessName} ${i + 1}`}
              fill
              className="object-cover"
              sizes="120px"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
      {total > 1 && (
        <div
          className="absolute top-1.5 left-1/2 -translate-x-1/2 z-10 bg-black/55 text-white rounded-full"
          style={{ fontSize: 8, padding: "2px 5px", whiteSpace: "nowrap" }}
        >
          {cur + 1}/{total}
        </div>
      )}
      {total > 1 && (
        <>
          <button
            onClick={() => goTo(cur - 1)}
            aria-label="Prev"
            className="absolute left-0.5 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-black/40 text-white flex items-center justify-center"
          >
            <ChevronLeft size={10} />
          </button>
          <button
            onClick={() => goTo(cur + 1)}
            aria-label="Next"
            className="absolute right-0.5 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-black/40 text-white flex items-center justify-center"
          >
            <ChevronRight size={10} />
          </button>
        </>
      )}
    </div>
  );
};

const BusinessCardMobile = ({ data }) => {
  const router = useRouter();
  const [callState, setCallState] = useState("idle");
  const [revealedNumber, setRevealedNumber] = useState(null);

  const waMsg = encodeURIComponent(
    `Hi,\n${data?.businessName}, I am looking for ${data?.category?.name}\nI found your business on AddressGuru UAE\nhttps://addressguru.ae/${data?.slug}`,
  );

  const handleCall = async () => {
    if (callState === "revealed" && revealedNumber) {
      window.location.href = `tel:${revealedNumber}`;
      return;
    }
    if (callState !== "idle") return;
    setCallState("loading");
    try {
      const res = await get_view("listing", data?.id, "phone");
      const num =
        res?.mobile_number || `${data?.countryCode}${data?.mobileNumber}`;
      setRevealedNumber(num);
      setCallState("revealed");
    } catch {
      setRevealedNumber(`${data?.countryCode}${data?.mobileNumber}`);
      setCallState("revealed");
    }
  };

  const facilities = data?.facilities?.slice(0, 3) || [];
  const callLabel =
    callState === "loading"
      ? "..."
      : callState === "revealed" && revealedNumber
        ? revealedNumber
        : "Call Now";

  return (
    <div className="md:hidden w-full">
      <div
        className="flex bg-white mx-2 my-1 rounded-sm overflow-hidden"
        style={{ minHeight: 130 }}
      >
        {/* Left image */}
        <MiniSlider
          images={data?.images || []}
          businessName={data?.businessName}
          logo={data?.logo}
        />

        {/* Right content — flex-1 with extra left padding */}
        <div className="flex flex-col flex-1 min-w-0 pl-3 pr-2.5 pt-2.5 pb-2.5">
          {/* 1st Line: Name */}
          <div className="flex items-start justify-between gap-1 mb-1">
            <Link href={`/${data?.slug}`} className="flex-1 min-w-0">
              <h2 className="text-[14px] font-semibold text-gray-900 leading-tight line-clamp-1">
                {data?.businessName}
              </h2>
            </Link>
          </div>

          {/* 2nd Line: Address */}
          <div className="flex items-center gap-1 mb-1">
            <MapPin size={9} className="text-gray-800 flex-shrink-0" />
            <p
              className="text-gray-800 line-clamp-1 leading-tight"
              style={{ fontSize: 10 }}
            >
              {data?.businessAddress}
            </p>
          </div>

          {/* 3rd Line: Rating + Reviews inline */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {data?.statistics?.averageRating > 0 && (
              <div
                className="flex items-center gap-0.5 flex-shrink-0 bg-[#3D8727] text-white rounded"
                style={{ fontSize: 9, fontWeight: 700, padding: "1px 4px" }}
              >
                <Star size={7} fill="white" strokeWidth={0} />
                {data.statistics.averageRating}
              </div>
            )}
            {data?.statistics?.totalReviews > 0 && (
              <span className="text-gray-400" style={{ fontSize: 9 }}>
                {data.statistics.totalReviews} reviews
              </span>
            )}
          </div>

          {/* Facilities — text only, no icons */}
          {facilities.length > 0 && (
            <div className="flex gap-1 flex-wrap mb-2.5">
              {facilities.map((f, i) => (
                <span
                  key={i}
                  className="bg-gray-50 border border-gray-200 rounded-full text-gray-700"
                  style={{ fontSize: 9, padding: "2px 7px" }}
                >
                  {f?.name}
                </span>
              ))}
            </div>
          )}

          {/* Buttons — outlined style, reduced radius */}
          <div className="flex items-center gap-1.5 mt-auto flex-nowrap">
            <button
              onClick={handleCall}
              disabled={callState === "loading"}
              className="flex-1 flex items-center justify-center gap-1 rounded-md border border-[#FF6E04] bg-transparent active:bg-orange-50 transition-colors min-w-0"
              style={{ padding: "5px 2px" }}
              aria-label="Call"
            >
              <Phone size={10} className="text-[#FF6E04]" strokeWidth={2.5} />
              <span
                className="text-[#FF6E04] font-bold whitespace-nowrap"
                style={{
                  fontSize: callState === "revealed" && revealedNumber ? 8 : 9,
                }}
              >
                {callLabel}
              </span>
            </button>

            <button
              onClick={() => data?.slug && router.push(`/${data.slug}`)}
              className="flex-1 flex items-center justify-center gap-1 rounded-md border border-[#0876FE] bg-transparent active:bg-blue-50 transition-colors min-w-0"
              style={{ padding: "5px 2px" }}
              aria-label="Enquire"
            >
              <MessageSquare size={10} color="#0876FE" strokeWidth={2.5} />
              <span
                className="font-semibold text-[#0876FE] whitespace-nowrap"
                style={{ fontSize: 9 }}
              >
                Enquire Now
              </span>
            </button>

            <a
              href={`https://wa.me/${data?.countryCode}${data?.mobileNumber}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center justify-center rounded-md border border-[#25D366] bg-transparent active:bg-green-50 text-green-500 transition-colors"
              style={{ padding: "5px 7px" }}
              aria-label="WhatsApp"
            >
              <WhatsAppIcon size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCardMobile;
