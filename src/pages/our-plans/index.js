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

// const plans = [
//   {
//     name: "FREE",
//     price: "₹0",
//     duration: "",
//     features: [
//       { label: "No Lead Sharing", available: true },
//       { label: "Ads Free Listing", available: false },
//       { label: "No Other Competitor Ads", available: true },
//       { label: "Lead Show", value: "10 Leads" },
//       { label: "Support", value: "Email" },
//       { label: "Photos", value: "5" },
//     ],
//     buttonLabel: "SELECT PLAN",
//   },
//   {
//     name: "PROFESSIONAL",
//     price: "₹1,299",
//     duration: "/Year",
//     features: [
//       { label: "No Lead Sharing", available: true },
//       { label: "Ads Free Listing", available: true },
//       { label: "No Other Competitor Ads", available: false },
//       { label: "Lead Show", value: "Unlimited Leads" },
//       { label: "Support", value: "Email+Call+Whatsapp+SMS" },
//       { label: "Photos", value: "10" },
//     ],
//     buttonLabel: "SELECT PLAN",
//   },
//   {
//     name: "PREMIUM",
//     price: "₹4,999",
//     duration: "/5 Years",
//     note: "Save 1500/-",
//     features: [
//       { label: "No Lead Sharing", available: false },
//       { label: "Ads Free Listing", available: true },
//       { label: "No Other Competitor Ads", available: false },
//       { label: "Lead Show", value: "Unlimited Leads" },
//       { label: "Support", value: "Email+Call+Whatsapp+SMS" },
//       { label: "Photos", value: "15" },
//     ],
//     buttonLabel: "SELECT PLAN",
//   },
// ];
const OurPlans = () => {
  const [plans, setPlans] = useState(null);

  const getPlans = async () => {
    try {
      const res = await get_plans();
      console.log("response of plans", res?.data);
      setPlans(res?.data);
    } catch (error) {
      console.log("error in frontend", error);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  return (
    <div className="flex items-center h-full w-full overflow-hidden justify-center">
      <div className="w-[80%] bg-white">
        <section className="flex flex-col gap-3 items-center mt-15">
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

          {/* table section */}
          {/* <div className="overflow-x-auto p-4">
          {plans?.map(() => (
              <table className="w-full table-auto border-collapse ">
                <thead>
                  <tr className="text-white text-center text-sm">
                    <th className="bg-white px-4 py-3 text-base font-bold"></th>
                    <th className="bg-[linear-gradient(90deg,_#0876FE_0%,_#054798_100%)] rounded-tl-md px-4 py-3 text-lg font-semibold">
                      FREE
                      <br />
                    </th>
                    <th className="bg-[linear-gradient(90deg,_#E06C5E_0%,_#7A3B33_100%)] px-4 py-3 text-lg font-semibold">
                      PROFESSIONAL
                      <br />
                    </th>
                    <th className="bg-[linear-gradient(90deg,_#00B5A1,_#004F46)] px-4 py-3 text-lg rounded-tr-md font-semibold">
                      PREMIUM
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center text-sm">
                  <tr className="border border-gray-200 rounded-md font-bold text-xl">
                    <td className="text-left text-lg font-bold px-4 py-2 border border-gray-200">
                      Features List
                    </td>
                    <td className="border border-gray-200">
                      <span className="text-lg ">₹0</span>
                    </td>
                    <td className="py-2 border border-gray-200">
                      <span className="text-lg">
                        ₹1,299<span className="text-sm">/Year</span>
                      </span>
                    </td>
                    <td className="py-2 border border-gray-200">
                      <div className="text-xs font-semibold ml-20">
                        Save 1500/-
                      </div>
                      <div className="text-lg font-bold">
                        ₹4,999
                        <span className="text-sm font-semibold">/5Years</span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="text-left px-4 py-2 border border-gray-200">
                      No Lead Sharing
                    </td>
                    <td className="py-2 border border-gray-200">✅</td>
                    <td className="py-2 border border-gray-200">✅</td>
                    <td className="py-2 border border-gray-200">❌</td>
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="text-left px-4 py-2 border border-gray-200">
                      Ads Free Listing
                    </td>
                    <td className="py-2 border border-gray-200">❌</td>
                    <td className="py-2 border border-gray-200">✅</td>
                    <td className="py-2 border border-gray-200">✅</td>
                  </tr>

                  <tr>
                    <td className="text-left px-4 py-2 border border-gray-200">
                      No Other Competitor Ads
                    </td>
                    <td className="py-2 border border-gray-200">✅</td>
                    <td className="py-2 border border-gray-200">❌</td>
                    <td className="py-2 border border-gray-200">❌</td>
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="text-left px-4 py-2 border border-gray-200">
                      Lead Show
                    </td>
                    <td className="py-2 border border-gray-200">10 Leads</td>
                    <td className="py-2 border border-gray-200">
                      Unlimited Leads
                    </td>
                    <td className="py-2 border border-gray-200">
                      Unlimited Leads
                    </td>
                  </tr>

                  <tr>
                    <td className="text-left px-4 py-2 border border-gray-200">
                      Support
                    </td>
                    <td className="py-2 border border-gray-200">Email</td>
                    <td className="py-2 border border-gray-200">
                      Email+Call+Whatsapp+SMS
                    </td>
                    <td className="py-2 border border-gray-200">
                      Email+Call+Whatsapp+SMS
                    </td>
                  </tr>

                  <tr className="bg-gray-50">
                    <td className="text-left px-4 py-2 border border-gray-200">
                      Photos
                    </td>
                    <td className="py-2 border border-gray-200">5</td>
                    <td className="py-2 border border-gray-200">10</td>
                    <td className="py-2 border border-gray-200">15</td>
                  </tr>

                  <tr>
                    <td className=""></td>
                    <td className="py-3 border border-gray-200 ">
                      <button className="bg-white hover:bg-orange-500 text-orange-500 cursor-pointer border-orange-500 border hover:text-white mx-4 px-3 py-2 rounded font-semibold text-xs">
                        SELECT PLAN
                      </button>
                    </td>
                    <td className="py-3 border border-gray-200">
                      <button className="bg-white hover:bg-orange-500 text-orange-500 cursor-pointer border-orange-500 border hover:text-white mx-4 px-3 py-2 rounded font-semibold text-xs">
                        SELECT PLAN
                      </button>
                    </td>
                    <td className="py-3 border border-gray-200">
                      <button className="bg-white hover:bg-orange-500 text-orange-500 cursor-pointer border-orange-500 border hover:text-white mx-4 px-3 py-2 rounded font-semibold text-xs">
                        SELECT PLAN
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
          ))}
          </div> */}
          <PricingTable plans={plans} />
        </section>

        {/* slider section */}
        <div className="my-32">
          <Slider />
        </div>
        {/* custom slider */}
        <div className="w-full bg-[#E8F4FF] h-auto flex justify-between py-8 px-10">
          {/* left section */}
          <div className=" w-[20rem] space-y-3">
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
              businesses trusts Address Guru to bring them closer to their
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
        <div className="flex justify-between px-3 py-10 gap-2 w-full h-full ">
          <NeedSupport />

          <FAQ />
        </div>
      </div>
    </div>
  );
};

export default OurPlans;
