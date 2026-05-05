import { get_plans } from "@/api/plans";
import PricingTable from "@/components/Plans/PricingTable";
import PricingTables from "@/components/Plans/PricingTable";
import Slider from "@/components/Plans/Slider";
import WhatWeOffer from "@/components/Plans/WhatWeOffer";
import CustomerCare from "@/components/Register/CustomerCare";
import FAQ from "@/components/Register/FAQ";
import NeedSupport from "@/components/Register/NeedSupport";
import ReviewSlider from "@/components/Register/ReviewSlider";
import React, { useEffect, useState } from "react";


const OurPlans = () => {
  const [plans, setPlans] = useState(null);

  const getPlans = async () => {
    try {
      const res = await get_plans();
      console.log("response of plans", res?.data?.plans);
      setPlans(res?.data?.plans || []);
    } catch (error) {
      console.log("error in frontend", error);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  console.log("plans", plans);
  return (
    <div className="flex items-center h-full w-full overflow-hidden justify-center">
      <div className="w-full md:w-[80%] bg-white">
        <section className="flex flex-col gap-3 items-center mt-15 px-4 md:px-0">
          {/* heading section  */}
          <span>
            {" "}
            <svg
              width="250"
              height="6"
              viewBox="0 0 329 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.113249 3L3 5.88675L5.88675 3L3 0.113249L0.113249 3ZM328.887 3L326 0.113249L323.113 3L326 5.88675L328.887 3ZM3 3V3.5H326V3V2.5H3V3Z"
                fill="#FF6E04"
              />
            </svg>
          </span>
          <h1 className="text-2xl font-bold">PLANS WE OFFER</h1>
          <span>
            {" "}
            <svg
              width="250"
              height="6"
              viewBox="0 0 329 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.113249 3L3 5.88675L5.88675 3L3 0.113249L0.113249 3ZM328.887 3L326 0.113249L323.113 3L326 5.88675L328.887 3ZM3 3V3.5H326V3V2.5H3V3Z"
                fill="#FF6E04"
              />
            </svg>
          </span>
          {/* para section */}
          <p className="text-xs font-[500]">
            Explore plans tailored to your selected categories. Choose one &
            start growing your business today.
          </p>
          {/* <p>{plans?.length}</p> */}
          {plans && <PricingTable plans={plans} />}
        </section>

        {/* slider section */}
        {/* <div className="my-32">
          <Slider />
        </div> */}
        {/* custom slider */}
        <div className="w-full bg-[#E8F4FF] h-auto flex flex-col lg:flex-row justify-between py-8 px-4 md:px-10 gap-8 mt-15">
          {/* left section */}
          <div className="w-full lg:w-[20rem] space-y-3">
            {/* qoute icon */}
            <span>
              <svg
                width="100"
                height="100"
                viewBox="0 0 119 119"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M75.8711 118.779V72.486C75.8711 26.7258 90.2518 2.5638 119 0V24.839C108.614 29.2083 103.423 38.9174 103.423 53.9706H119V118.779H75.8711Z"
                  fill="#FF6E04"
                />
                <path
                  d="M0 118.779V72.486C0 26.7258 14.3808 2.5638 43.1287 0V24.839C32.7426 29.2083 27.5473 38.9174 27.5473 53.9706H43.1287V118.779H0Z"
                  fill="#FF6E04"
                />
              </svg>
            </span>
            <h4 className="text-2xl  text-[#323232]  mt-4 tracking-widest font-extrabold">
              Our Customer Success Stories
            </h4>
            <p className=" font-[500] w-[] ">
              <strong className="font-bold text-lg text-orange-500">
                {" "}
                45,000+
              </strong>{" "}
              businesses trusts AddressGuru UAE to bring them closer to their
              customers & grow their reach..
            </p>

            <button className="text-[11px] font-[500] bg-orange-500 px-3 py-2 rounded-sm  text-white uppercase cursor-pointer">
              see more stories
            </button>
            <h5 className="text-xl font-[1000] text-orange-500">
              {" "}
              Hurry, be one of them!
            </h5>
          </div>
          {/* right slider section */}
          <div className="max-w-xl 2xl:max-w-3xl">
            <ReviewSlider />
          </div>
        </div>
        {/* what we offer section */}
        <WhatWeOffer />
        <div className="flex flex-col md:flex-row justify-between px-4 md:px-3 py-10 gap-8 md:gap-2 w-full h-full">
          <div className="w-full md:w-1/2"><NeedSupport /></div>
          <div className="w-full md:w-1/2"><FAQ /></div>
        </div>
      </div>
    </div>
  );
};

export default OurPlans;
