// import React, { useState, useRef } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import {
//   MapPin,
//   Star,
//   ChevronLeft,
//   ChevronRight,
//   Building2,
//   Phone,
//   MessageSquare,
// } from "lucide-react";
// import { APP_URL } from "@/services/constants";
// import { get_view } from "@/api/queries";

// const WhatsAppIcon = ({ size = 13 }) => (
//   <svg
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="currentColor"
//     aria-hidden="true"
//   >
//     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
//     <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.975-1.302A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.952 7.952 0 0 1-4.073-1.117l-.292-.174-3.038.796.812-2.967-.19-.305A7.96 7.96 0 0 1 4 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
//   </svg>
// );

// const MiniSlider = ({ images, businessName, logo }) => {
//   const [cur, setCur] = useState(0);
//   const touchStartX = useRef(null);
//   const total = images.length;
//   const goTo = (n) => setCur((n + total) % total);
//   const onTouchStart = (e) => {
//     touchStartX.current = e.touches[0].clientX;
//   };
//   const onTouchEnd = (e) => {
//     if (!touchStartX.current) return;
//     const dx = e.changedTouches[0].clientX - touchStartX.current;
//     if (Math.abs(dx) > 30) goTo(cur + (dx < 0 ? 1 : -1));
//     touchStartX.current = null;
//   };

//   if (!images || images.length === 0) {
//     return (
//       <div
//         className="relative flex-shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden"
//         style={{ width: 120, alignSelf: "stretch" }}
//       >
//         {logo ? (
//           <Image
//             src={`${APP_URL}/${logo}`}
//             alt={businessName}
//             fill
//             className="object-contain p-4"
//             sizes="120px"
//           />
//         ) : (
//           <Building2 size={26} className="text-gray-300" />
//         )}
//       </div>
//     );
//   }

//   return (
//     <div
//       className="relative flex-shrink-0 overflow-hidden bg-gray-100"
//       style={{ width: 120, alignSelf: "stretch" }}
//       onTouchStart={onTouchStart}
//       onTouchEnd={onTouchEnd}
//     >
//       <div
//         className="flex h-full transition-transform duration-300 ease-in-out"
//         style={{ transform: `translateX(-${cur * 100}%)` }}
//       >
//         {images.map((img, i) => (
//           <div
//             key={i}
//             className="relative flex-shrink-0 h-full"
//             style={{ width: 120 }}
//           >
//             <Image
//               src={`${APP_URL}/${img}`}
//               alt={`${businessName} ${i + 1}`}
//               fill
//               className="object-cover"
//               sizes="120px"
//               priority={i === 0}
//             />
//           </div>
//         ))}
//       </div>
//       {total > 1 && (
//         <div
//           className="absolute top-1.5 left-1/2 -translate-x-1/2 z-10 bg-black/55 text-white rounded-full"
//           style={{ fontSize: 8, padding: "2px 5px", whiteSpace: "nowrap" }}
//         >
//           {cur + 1}/{total}
//         </div>
//       )}
//       {total > 1 && (
//         <>
//           <button
//             onClick={() => goTo(cur - 1)}
//             aria-label="Prev"
//             className="absolute left-0.5 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-black/40 text-white flex items-center justify-center"
//           >
//             <ChevronLeft size={10} />
//           </button>
//           <button
//             onClick={() => goTo(cur + 1)}
//             aria-label="Next"
//             className="absolute right-0.5 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-black/40 text-white flex items-center justify-center"
//           >
//             <ChevronRight size={10} />
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// const BusinessCardMobile = ({ data }) => {
//   const router = useRouter();
//   const [callState, setCallState] = useState("idle");
//   const [revealedNumber, setRevealedNumber] = useState(null);

//   const waMsg = encodeURIComponent(
//     `Hi,\n${data?.businessName}, I am looking for ${data?.category?.name}\nI found your business on AddressGuru UAE\nhttps://addressguru.ae/${data?.slug}`,
//   );

//   const handleCall = async () => {
//     if (callState === "revealed" && revealedNumber) {
//       window.location.href = `tel:${revealedNumber}`;
//       return;
//     }
//     if (callState !== "idle") return;
//     setCallState("loading");
//     try {
//       const res = await get_view("listing", data?.id, "phone");
//       const num =
//         res?.mobile_number || `${data?.countryCode}${data?.mobileNumber}`;
//       setRevealedNumber(num);
//       setCallState("revealed");
//     } catch {
//       setRevealedNumber(`${data?.countryCode}${data?.mobileNumber}`);
//       setCallState("revealed");
//     }
//   };

//   const facilities = data?.facilities?.slice(0, 3) || [];
//   const callLabel =
//     callState === "loading"
//       ? "..."
//       : callState === "revealed" && revealedNumber
//         ? revealedNumber
//         : "Call Now";

//   return (
//     <div className="md:hidden w-full">
//       <div
//         className="flex bg-white mx-2 my-1 rounded-sm overflow-hidden"
//         style={{ minHeight: 130 }}
//       >
//         {/* Left image */}
//         <MiniSlider
//           images={data?.images || []}
//           businessName={data?.businessName}
//           logo={data?.logo}
//         />

//         {/* Right content — flex-1 with extra left padding */}
//         <div className="flex flex-col flex-1 min-w-0 pl-3 pr-2.5 pt-2.5 pb-2.5">
//           {/* 1st Line: Name */}
//           <div className="flex items-start justify-between gap-1 mb-1">
//             <Link href={`/${data?.slug}`} className="flex-1 min-w-0">
//               <h2 className="text-[14px] font-semibold text-gray-900 leading-tight line-clamp-1">
//                 {data?.businessName}
//               </h2>
//             </Link>
//           </div>

//           {/* 2nd Line: Address */}
//           <div className="flex items-center gap-1 mb-1">
//             <MapPin size={9} className="text-gray-800 flex-shrink-0" />
//             <p
//               className="text-gray-800 line-clamp-1 leading-tight"
//               style={{ fontSize: 10 }}
//             >
//               {data?.businessAddress}
//             </p>
//           </div>

//           {/* 3rd Line: Rating + Reviews inline */}
//           <div className="flex items-center gap-2 mb-1.5 flex-wrap">
//             {data?.statistics?.averageRating > 0 && (
//               <div
//                 className="flex items-center gap-0.5 flex-shrink-0 bg-[#3D8727] text-white rounded"
//                 style={{ fontSize: 9, fontWeight: 700, padding: "1px 4px" }}
//               >
//                 <Star size={7} fill="white" strokeWidth={0} />
//                 {data.statistics.averageRating}
//               </div>
//             )}
//             {data?.statistics?.totalReviews > 0 && (
//               <span className="text-gray-400" style={{ fontSize: 9 }}>
//                 {data.statistics.totalReviews} reviews
//               </span>
//             )}
//           </div>

//           {/* Facilities — text only, no icons */}
//           {facilities.length > 0 && (
//             <div className="flex gap-1 flex-wrap mb-2.5">
//               {facilities.map((f, i) => (
//                 <span
//                   key={i}
//                   className="bg-gray-50 border border-gray-200 rounded-full text-gray-700"
//                   style={{ fontSize: 9, padding: "2px 7px" }}
//                 >
//                   {f?.name}
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* Buttons — outlined style, reduced radius */}
//           <div className="flex items-center gap-1.5 mt-auto flex-nowrap">
//             <button
//               onClick={handleCall}
//               disabled={callState === "loading"}
//               className="flex-1 flex items-center justify-center gap-1 rounded-md border border-[#FF6E04] bg-transparent active:bg-orange-50 transition-colors min-w-0"
//               style={{ padding: "5px 2px" }}
//               aria-label="Call"
//             >
//               <Phone size={10} className="text-[#FF6E04]" strokeWidth={2.5} />
//               <span
//                 className="text-[#FF6E04] font-bold whitespace-nowrap"
//                 style={{
//                   fontSize: callState === "revealed" && revealedNumber ? 8 : 9,
//                 }}
//               >
//                 {callLabel}
//               </span>
//             </button>

//             <button
//               onClick={() => data?.slug && router.push(`/${data.slug}`)}
//               className="flex-1 flex items-center justify-center gap-1 rounded-md border border-[#0876FE] bg-transparent active:bg-blue-50 transition-colors min-w-0"
//               style={{ padding: "5px 2px" }}
//               aria-label="Enquire"
//             >
//               <MessageSquare size={10} color="#0876FE" strokeWidth={2.5} />
//               <span
//                 className="font-semibold text-[#0876FE] whitespace-nowrap"
//                 style={{ fontSize: 9 }}
//               >
//                 Enquire Now
//               </span>
//             </button>

//             <a
//               href={`https://wa.me/${data?.countryCode}${data?.mobileNumber}?text=${waMsg}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex-shrink-0 flex items-center justify-center rounded-md border border-[#25D366] bg-transparent active:bg-green-50 text-green-500 transition-colors"
//               style={{ padding: "5px 7px" }}
//               aria-label="WhatsApp"
//             >
//               <WhatsAppIcon size={12} />
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BusinessCardMobile;

"use client";
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

/* ─── WhatsApp icon ─── */
const WhatsAppIcon = ({ size = 14 }) => (
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

/* ─── AG Verified icon ─── */
const AGVerifiedIcon = () => (
  <div className="flex items-center gap-1">
    <div
      className="flex items-center justify-center rounded-full bg-orange-500 text-white"
      style={{ width: 14, height: 14, flexShrink: 0 }}
    >
      <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
        <path
          d="M2 6l3 3 5-5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <span style={{ fontSize: 11, fontWeight: 600, color: "#FF6200" }}>
      AG Verified
    </span>
  </div>
);

/* ─── Mini image slider ─── */
const MiniSlider = ({ images, businessName, logo }) => {
  const [cur, setCur] = useState(0);
  const touchStartX = useRef(null);
  const total = images?.length || 0;
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
            className="object-contain p-3"
            sizes="120px"
          />
        ) : (
          <Building2 size={28} className="text-gray-300" />
        )}
      </div>
    );
  }

  return (
    <div
      className="relative flex-shrink-0 overflow-hidden rounded-sm  bg-gray-100"
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
            className="relative flex-shrink-0 h-[160px] rounded-lg "
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
          className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white"
          style={{
            fontSize: 9,
            padding: "2px 6px",
            borderRadius: 10,
            whiteSpace: "nowrap",
          }}
        >
          {cur + 1}/{total}
        </div>
      )}
      {total > 1 && (
        <>
          <button
            onClick={() => goTo(cur - 1)}
            aria-label="Prev"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-black/40 text-white flex items-center justify-center"
          >
            <ChevronLeft size={12} />
          </button>
          <button
            onClick={() => goTo(cur + 1)}
            aria-label="Next"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-black/40 text-white flex items-center justify-center"
          >
            <ChevronRight size={12} />
          </button>
        </>
      )}
    </div>
  );
};

/* ─── Main card ─── */
const BusinessCardMobile = ({ data, index = 0, isFilledCall }) => {
  const router = useRouter();
  const [callState, setCallState] = useState("idle");
  const [revealedNumber, setRevealedNumber] = useState(null);

  // Every 3rd listing (index 2, 5, 8 … i.e. (index+1) % 3 === 0) → filled orange Call Now

  const waMsg = encodeURIComponent(
    `Hi,\n${data?.businessName}, I am looking for ${data?.category?.name}\nI found your business on AddressGuru UAE\nhttps://addressguru.ae/${data?.slug}`,
  );

  const handleCall = async () => {
    if (callState === "loading") return;

    setCallState("loading");

    try {
      const res = await get_view("listing", data?.id, "phone");

      const num =
        res?.mobile_number || `${data?.countryCode}${data?.mobileNumber}`;

      window.location.href = `tel:${num}`;
    } catch {
      const fallbackNum = `${data?.countryCode}${data?.mobileNumber}`;

      window.location.href = `tel:${fallbackNum}`;
    } finally {
      setCallState("idle");
    }
  };

  const callLabel =
    callState === "loading"
      ? "..."
      : callState === "revealed" && revealedNumber
        ? revealedNumber
        : "CALL NOW";

  const facilities = data?.facilities?.slice(0, 3) || [];

  return (
    <div className="md:hidden w-full bg-white ">
      {/* ── Card body: image + content ── */}
      <div className="flex ml-2" style={{ minHeight: 148 }}>
        {/* Left: image */}
        <MiniSlider
          images={data?.images || []}
          businessName={data?.businessName}
          logo={data?.logo}
        />

        {/* Right: content */}
        <div className="flex flex-col flex-1 min-w-0 px-3 pt-2.5 pb-2">
          {/* Name */}
          <Link href={`/${data?.slug}`}>
            <h2
              className="text-gray-900 font-medium  leading-snug line-clamp-1"
              style={{ fontSize: 17 }}
            >
              {data?.businessName}
            </h2>
          </Link>

          {/* Address + distance */}
          <div className="flex items-center gap-1 mt-0.5 mb-1.5">
            <MapPin size={10} className="text-gray-500 flex-shrink-0" />
            <p
              className="text-gray-500 line-clamp-1 uppercase tracking-wide"
              style={{ fontSize: 10 }}
            >
              {data?.businessAddress}
            </p>
            {data?.distance && (
              <>
                <span className="text-gray-400 mx-0.5" style={{ fontSize: 10 }}>
                  |
                </span>
                <MapPin size={9} className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-500" style={{ fontSize: 10 }}>
                  {data.distance} km
                </span>
              </>
            )}
          </div>

          {/* Rating + reviews + AG Verified */}
          <div className="flex items-center gap-1 mb-1.5 flex-wrap">
            {data?.statistics?.averageRating > 0 && (
              <div
                className="flex items-center gap-0.5 bg-green-800 text-white"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 5px",
                  borderRadius: 4,
                }}
              >
                {data.statistics.averageRating}
                <svg
                  width="12"
                  height="11"
                  viewBox="0 0 12 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.00734384 4.17939C0.0887648 4.17939 0.169867 4.17939 0.251288 4.17939C1.61884 4.18128 2.98639 4.18254 4.35427 4.18695C4.42419 4.18727 4.45165 4.16205 4.47145 4.10153C4.66622 3.49948 4.86227 2.89774 5.05896 2.29632C5.27608 1.63248 5.49416 0.96896 5.7116 0.30544C5.74321 0.2093 5.77387 0.113161 5.8109 0C5.8307 0.0289994 5.84347 0.0412927 5.84826 0.0561076C6.09061 0.794648 6.33296 1.53319 6.57403 2.27204C6.77199 2.87851 6.96932 3.48529 7.16473 4.09302C7.18772 4.16426 7.22348 4.18758 7.30011 4.18727C8.713 4.18285 10.1259 4.18159 11.5388 4.18002C11.5717 4.18002 11.6046 4.18317 11.6429 4.20334C11.5608 4.26292 11.4791 4.32312 11.3964 4.38207C10.4423 5.06324 9.48794 5.74378 8.53356 6.42495C8.38924 6.52803 8.24651 6.63299 8.10155 6.73512C8.06355 6.76191 8.05302 6.7865 8.06866 6.83347C8.36465 7.72299 8.65872 8.61315 8.95344 9.50299C9.10766 9.96887 9.26284 10.4348 9.41738 10.9006C9.42185 10.9142 9.42153 10.9296 9.42504 10.958C9.39439 10.94 9.37363 10.9303 9.35575 10.917C8.20468 10.0883 7.05361 9.25965 5.9035 8.42907C5.84443 8.38651 5.80612 8.37832 5.73938 8.42655C4.80065 9.10646 3.85904 9.78227 2.91806 10.4597C2.70988 10.6097 2.50234 10.761 2.29448 10.9114C2.27372 10.9265 2.25105 10.9394 2.21274 10.9448C2.23764 10.8647 2.26159 10.7843 2.28777 10.7049C2.60515 9.74507 2.92285 8.78494 3.24056 7.82512C3.3488 7.49856 3.45512 7.17137 3.56624 6.84576C3.58508 6.7906 3.57741 6.76254 3.52952 6.7285C2.80503 6.21313 2.08214 5.69555 1.35861 5.17861C0.936501 4.87727 0.514389 4.57624 0.0922771 4.27458C0.0606666 4.25189 0.0306526 4.2273 0 4.20366C0.00255438 4.19546 0.00510875 4.18727 0.00734384 4.17939Z"
                    fill="white"
                  />
                  <mask
                    id="mask0_1254_37398"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="12"
                    height="11"
                  >
                    <path
                      d="M0.00746591 4.17939C0.0888869 4.17939 0.169989 4.17939 0.25141 4.17939C1.61896 4.18128 2.98652 4.18254 4.35439 4.18695C4.42432 4.18727 4.45178 4.16205 4.47157 4.10153C4.66634 3.49948 4.86239 2.89774 5.05908 2.29632C5.2762 1.63248 5.49428 0.96896 5.71173 0.30544C5.74334 0.2093 5.77399 0.113161 5.81103 0C5.83082 0.0289994 5.8436 0.0412927 5.84838 0.0561076C6.09073 0.794648 6.33308 1.53319 6.57415 2.27204C6.77211 2.87851 6.96944 3.48529 7.16485 4.09302C7.18784 4.16426 7.2236 4.18758 7.30023 4.18727C8.71313 4.18285 10.126 4.18159 11.5389 4.18002C11.5718 4.18002 11.6047 4.18317 11.643 4.20334C11.5609 4.26292 11.4792 4.32312 11.3965 4.38207C10.4424 5.06324 9.48806 5.74378 8.53368 6.42495C8.38936 6.52803 8.24663 6.63299 8.10167 6.73512C8.06367 6.76191 8.05314 6.7865 8.06878 6.83347C8.36477 7.72299 8.65885 8.61315 8.95356 9.50299C9.10778 9.96887 9.26296 10.4348 9.4175 10.9006C9.42197 10.9142 9.42165 10.9296 9.42516 10.958C9.39451 10.94 9.37375 10.9303 9.35587 10.917C8.2048 10.0883 7.05373 9.25965 5.90362 8.42907C5.84455 8.38651 5.80624 8.37832 5.7395 8.42655C4.80077 9.10646 3.85916 9.78227 2.91819 10.4597C2.71 10.6097 2.50246 10.761 2.2946 10.9114C2.27384 10.9265 2.25117 10.9394 2.21286 10.9448C2.23776 10.8647 2.26171 10.7843 2.28789 10.7049C2.60527 9.74507 2.92298 8.78494 3.24068 7.82512C3.34892 7.49856 3.45525 7.17137 3.56636 6.84576C3.5852 6.7906 3.57754 6.76254 3.52964 6.7285C2.80516 6.21313 2.08226 5.69555 1.35873 5.17861C0.936623 4.87727 0.514511 4.57624 0.0923992 4.27458C0.0607887 4.25189 0.0307747 4.2273 0.00012207 4.20366C0.00267645 4.19546 0.00523082 4.18727 0.00746591 4.17939Z"
                      fill="#FFBB00"
                    />
                  </mask>
                  <g mask="url(#mask0_1254_37398)">
                    <path
                      d="M12.3279 8.90338L2.73969 0.684875L1.0275 0L-4.79395 6.16388L4.45187 17.1219L12.3279 8.90338Z"
                      fill="#FFBB00"
                    />
                  </g>
                </svg>
              </div>
            )}
            {data?.statistics?.totalReviews > 0 && (
              <span className="text-gray-400" style={{ fontSize: 10 }}>
                {data.statistics.totalReviews} Review
              </span>
            )}

            <span className="flex items-center bg-[#EEF7FF] text-[#FF6E04] gap-1 py-1.5 px-2 text-[12px] rounded-full  max-md:scale-80 font-semibold">
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8" r="8" fill="#FF6E04" />
                <path
                  d="M13.7212 4.25825C13.3499 3.91381 12.747 3.91402 12.3752 4.25825L6.31744 9.87088L3.62503 7.37643C3.25325 7.03198 2.65061 7.03198 2.27883 7.37643C1.90706 7.72087 1.90706 8.27921 2.27883 8.62365L5.6442 11.7416C5.82998 11.9137 6.07357 12 6.31718 12C6.5608 12 6.80463 11.9139 6.9904 11.7416L13.7212 5.50546C14.0929 5.16125 14.0929 4.60267 13.7212 4.25825Z"
                  fill="white"
                />
              </svg>
              <p>AG</p>
              <p className="text-black">Verified</p>
            </span>
            {data?.isVerified && <AGVerifiedIcon />}
          </div>

          {/* Facility tags */}
          {facilities.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-0">
              {facilities.map((f, i) => (
                <span
                  key={i}
                  className="text-gray-700 border max-md:max-w-40 max-md:truncate border-gray-300 bg-white"
                  style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4 }}
                >
                  {f?.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Action buttons row — sits below the card, same width ── */}
      <div className="flex items-stretch gap-2 px-2 pb-2.5 pt-2">
        {/* Call Now — filled on every 3rd card, outlined otherwise */}
        <button
          onClick={handleCall}
          disabled={callState === "loading"}
          className="flex-1 flex items-center justify-center gap-1.5 transition-colors active:opacity-80"
          style={{
            padding: "8px 6px",
            borderRadius: 6,
            border: "1.5px solid #FF6200",
            background: isFilledCall ? "#FF6200" : "transparent",
          }}
          aria-label="Call"
        >
          <Phone
            size={12}
            strokeWidth={2.5}
            style={{ color: isFilledCall ? "#fff" : "#FF6200" }}
          />
          <span
            style={{
              fontSize: callState === "revealed" && revealedNumber ? 9 : 12,
              fontWeight: 500,
              color: isFilledCall ? "#fff" : "#FF6200",
              whiteSpace: "nowrap",
              letterSpacing: "0.03em",
            }}
          >
            {callLabel}
          </span>
        </button>

        {/* Enquire Now — always outlined blue */}
        <button
          onClick={() => data?.slug && router.push(`/${data.slug}`)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-transparent active:bg-blue-50 transition-colors"
          style={{
            padding: "8px 6px",
            borderRadius: 6,
            border: "1.5px solid #0876FE",
          }}
          aria-label="Enquire"
        >
          <MessageSquare size={12} color="#0876FE" strokeWidth={2.5} />
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#0876FE",
              whiteSpace: "nowrap",
              letterSpacing: "0.03em",
            }}
          >
            ENQUIRE NOW
          </span>
        </button>

        {/* WhatsApp — outlined green square */}
        <a
          href={`https://wa.me/${data?.countryCode}${data?.mobileNumber}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-transparent active:bg-green-50 transition-colors text-green-500 flex-shrink-0"
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1.5px solid #25D366",
          }}
          aria-label="WhatsApp"
        >
          <WhatsAppIcon size={16} />
        </a>
      </div>

      {/* Bottom divider */}
      <div style={{ height: 1, background: "#FFF0E6", marginBottom: 0 }} />
    </div>
  );
};

export default BusinessCardMobile;
