import BreadCrumbs from "@/components/BreadCrumbs";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import TitleAndLogo from "@/components/SeeDetails/TitleAndLogo";
import SliderCard from "@/components/SeeDetails/SliderCard";
import QuickInformation from "@/components/SeeDetails/QuickInformation";
import GetMoreInfo from "@/components/SeeDetails/GetMoreInfo";
import UserInformation from "@/components/SeeDetails/UserInformation";
import RecentCustomerReviewCard from "@/components/BusinessListingComponents/RecentCustomerReviewCard";
import TitleAndLogoMobile from "@/components/SeeDetails/TitleAndLogoMobile";
import { get_listing_data } from "@/api/showlistings";
import { Share } from "@/components/SeeDetails/Popups/Share";
import { Claim } from "@/components/SeeDetails/Popups/Claim";
import RateUs from "@/components/SeeDetails/Popups/RateUs";
import Report from "@/components/SeeDetails/Popups/Report";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import ThanksPop from "@/components/SeeDetails/Popups/ThanksPop";
import LandingPageSkeleton from "@/components/BusinessListingComponents/LandingPageSkeleton";
import Head from "next/head";
import { useAuth } from "@/context/AuthContext";
import { APP_URL } from "@/services/constants";
import { get_view } from "@/api/queries";
import Header from "@/layout/header";
import LandingPage from "@/components/HeadersMobile/LandingPage";

const SeeDetails = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePop, setActivePop] = useState(null);
  const [thanksPop, setThanksPop] = useState(false);
  const [type, setType] = useState(null);
  const [enquirePop, setEnquirePop] = useState(false);
  const [userIP, setUserIP] = useState(null);

  const router = useRouter();
  const { slug, preview } = router.query;
  const { city } = useAuth();
  const serverCity = city;

  /* ----------------------- FETCH USER IP ----------------------- */
  useEffect(() => {
    const getIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const ip = await res.json();
        setUserIP(ip.ip);
      } catch (err) {
        console.error("IP fetch error:", err);
      }
    };
    getIP();
  }, []);

  /* ----------------------- FETCH LISTING DATA ----------------------- */
  useEffect(() => {
    if (!slug || !userIP) return;

    const fetchListing = async () => {
      setLoading(true);
      try {
        const result = await get_listing_data(slug);
        if (result) {
          setData(result);
        } else {
          router.push("/404");
        }
      } catch (err) {
        console.error("Listing fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [slug, userIP]);

  /* ----------------------- SAFE VIEW HIT ----------------------- */
  useEffect(() => {
    if (!data?.id || !userIP) return;

    const sendView = async () => {
      try {
        const res = await get_view("listing", data.id, null, userIP);
        console.log("View Hit:", res);
      } catch (err) {
        console.error("View hit error:", err);
      }
    };

    sendView();
  }, [data?.id, userIP]);

  /* ----------------------- CLICK HANDLER ----------------------- */
  const handleClick = async (id, clickType) => {
    try {
      const res = await get_view("listing", id, clickType, userIP);
      console.log("Click tracked:", res);
    } catch (err) {
      console.error("Click track error:", err);
    }
  };

  /* ----------------------- PREVIEW MODE ----------------------- */
  useEffect(() => {
    if (preview === "true") {
      document.body.style.pointerEvents = "none";
    } else {
      document.body.style.pointerEvents = "auto";
    }
    return () => {
      document.body.style.pointerEvents = "auto";
    };
  }, [preview]);

  const handlePop = (name) => setActivePop(name);
  const closePopup = () => setActivePop(null);

  /* ----------------------- LOADING SKELETON ----------------------- */
  if (loading || !data) {
    return <LandingPageSkeleton />;
  }

  return (
    <>
      <Head>
        <title>
          {data?.business_name} | {serverCity} | AddressGuru
        </title>

        <meta
          name="description"
          content={data?.ad_description?.substring(0, 160)}
        />

        {/* OG Tags */}
        <meta property="og:title" content={data?.business_name} />
        <meta
          property="og:description"
          content={data?.ad_description?.substring(0, 160)}
        />
        <meta property="og:image" content={data?.images?.[0]} />
        <meta property="og:url" content={`https://${APP_URL}/${data?.slug}`} />
        <meta property="og:type" content="business.business" />

        {/* Twitter Tags */}
        <meta name="twitter:title" content={data?.business_name} />
        <meta
          name="twitter:description"
          content={data?.ad_description?.substring(0, 160)}
        />
        <meta name="twitter:image" content={data?.images?.[0]} />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Canonical */}
        <link rel="canonical" href={`https://${APP_URL}/${data?.slug}`} />

        {/* Schema JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: data?.business_name,
              description: data?.ad_description,
              image: data?.images,
              address: data?.business_address,
              url: `https://${APP_URL}/${data?.slug}`,
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue:
                  data?.ratings?.length > 0 ? data?.ratings[0]?.rating : 4,
                reviewCount: data?.ratings?.length || 1,
              },
              openingHours: data?.opening_hours,
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

      {activePop && (
        <div
          className="fixed min-h-screen w-full bg-black/20 left-0 p-3 flex z-50 items-center justify-center top-0"
          onClick={closePopup}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {activePop === "share" && <Share onClose={closePopup} />}
            {activePop === "claim" && (
              <Claim
                id={data?.id}
                type={"listing"}
                setType={setType}
                setThanksPop={setThanksPop}
                onClose={closePopup}
              />
            )}
            {activePop === "rateus" && (
              <RateUs
                id={data?.id}
                type={"listing"}
                setType={setType}
                setThanksPop={setThanksPop}
                onClose={closePopup}
              />
            )}
            {activePop === "report" && (
              <Report
                id={data?.id}
                type={"listing"}
                setType={setType}
                setThanksPop={setThanksPop}
                onClose={closePopup}
              />
            )}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="h-auto flex flex-col items-center w-full bg-[#F8F7F7] md:mt-2">
        <div className="flex flex-col md:w-[80%] max-w-[98%] bg-white md:px-5 px-2 md:pb-7">
          <div className="max-md:hidden my-3">
            <BreadCrumbs
              slug={data?.category?.slug}
              city={serverCity}
              name={data?.slug}
              type={true}
            />
          </div>

          <div className="max-md:hidden">
            <TitleAndLogo
              handlePop={handlePop}
              name={data?.business_name}
              address={data?.business_address}
              data={data}
              logo={data?.logo}
              ratings={data?.ratings}
              handleClick={handleClick}
              openingHours={data?.opening_hours}
            />
          </div>

          <div className="flex w-full justify-between max-md:flex-col  md:mt-4">
            {/* LEFT */}
            <div className="md:w-[64.5%] ">
              <SliderCard images={data?.images} />

              {/* Mobile */}
              <div className="md:hidden mx-auto  w-full">
                <TitleAndLogoMobile
                  data={data}
                  openingHours={data?.opening_hours}
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

                <p className="md:text-[13.5px] text-[15px] mt-2 md:font-[500]">
                  {data?.ad_description}
                </p>
              </div>

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
                    {data?.business_name} provides the following facilities:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data?.facilities?.map((facility, index) => (
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
                          {facility}
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
                    {data?.business_name} provides the following services:
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
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PAYMENT METHODS */}
              {data?.payments && data.payments.length > 0 && (
                <div className="max-w-5xl mt-5 md:pl-2 px-1">
                  <span className="flex gap-3 items-center">
                    <h2 className="font-semibold uppercase whitespace-nowrap md:text-xl">
                      Payment Modes
                    </h2>
                    <span className="h-[1px] w-full bg-gray-200"></span>
                  </span>

                  <p className="md:text-[13.5px] text-[15px] mt-2 mb-4 md:font-[500]">
                    {data?.business_name} accepts the following payment methods:
                  </p>

                  <div className="flex flex-col gap-4">
                    {data?.payments?.map((payment, index) => (
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
                          {payment}
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
                    {`${data?.business_name} is located at ${data?.business_address}, ${serverCity}.`}
                    {data?.facilities && data.facilities.length > 0 && (
                      <span>
                        {" Their facilities include: "}
                        {data.facilities.join(", ")}.
                      </span>
                    )}
                  </p>

                  <p>
                    Scroll to the top for more details about{" "}
                    {data?.business_name}.
                  </p>

                  <p>
                    Found this listing helpful? Tell {data?.business_name} you
                    discovered them on{" "}
                    <strong className="text-[#FF6E04]">Address Guru</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="md:w-[34%] max-md:hidden h-auto mb-10 flex flex-col gap-5">
              <QuickInformation
                id={data?.id}
                businessHours={data?.opening_hours}
                category={data?.category}
                link={data?.website_link}
                handlePop={handlePop}
                handleWebsiteClick={handleClick}
              />

              <div className="w-full h-[30rem] mb-7">
                <GetMoreInfo
                  name={data?.business_name}
                  type={"listing"}
                  id={data?.id}
                  setType={setType}
                  setThanksPop={setThanksPop}
                />
              </div>

              <UserInformation />
            </div>
          </div>

          {/* MOBILE USER INFO */}
          <div className="md:hidden">
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
          className="inset-0 flex items-center fixed justify-center backdrop-blur-sm z-50 py-20 px-5"
          onClick={() => setEnquirePop(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <GetMoreInfo
              type={"listing"}
              id={data?.id}
              setEnquirePop={setEnquirePop}
              name={data?.business_name}
            />
          </div>
        </div>
      )}

      {/* PREVIEW BANNER */}
      {preview === "true" && (
        <div className="fixed top-0 left-0 w-full z-[10000] bg-black/40 text-white flex items-center justify-between p-3">
          <h2 className="text-lg font-semibold">Preview Mode</h2>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-orange-600 text-white px-4 py-1 rounded font-medium"
            style={{ pointerEvents: "auto" }}
          >
            Go Back
          </button>
        </div>
      )}

      {/* THANK YOU POPUP */}
      {thanksPop && (
        <ThanksPop onClose={() => setThanksPop(false)} type={type} />
      )}
    </>
  );
};

export default SeeDetails;
