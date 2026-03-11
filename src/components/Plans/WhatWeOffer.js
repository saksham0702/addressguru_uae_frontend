import React from "react";
import Image from "next/image";
const features = [
  {
    id: "01",
    title: "100% Free Listing",
    description:
      "No charges. No hidden fees – list your business absolutely free and start getting visibility.",
  },
  {
    id: "02",
    title: "Pan India Reach",
    description:
      "Your business can be discovered by users from all over India, not just your city.",
  },
  {
    id: "03",
    title: "SEO Optimized Profiles",
    description:
      "Get found on Google with search engine-friendly listings crafted to boost visibility.",
  },
  {
    id: "04",
    title: "Get More Leads",
    description:
      "Potential customers can call, email, or visit your website directly from your listing.",
  },
  {
    id: "05",
    title: "Mobile-Friendly Platform",
    description:
      "Optimized for all devices – your business looks great on mobile, tablet & desktop.",
  },
  {
    id: "06",
    title: "Real-Time Updates",
    description:
      "Easily update your contact info, services, and business hours anytime, anywhere.",
  },
  {
    id: "07",
    title: "Business Reviews & Ratings",
    description:
      "Collect positive reviews and build trust among local and online customers.",
  },
  {
    id: "08",
    title: "Add Photos & Offers",
    description:
      "Make your listing attractive with images, deals, and special promotions.",
  },
  {
    id: "09",
    title: "Share on Whatsapp & Social Media",
    description:
      "Share your listing link instantly with potential clients via WhatsApp and Facebook.",
  },
  {
    id: "10",
    title: "Be Part of a Growing Local Network",
    description:
      "Join thousands of Indian businesses already listed and growing through Addressguru.",
  },
];

const WhatWeOffer = () => {
  return (
    <div className="px-10">
      <div className="flex items-center gap-4 my-10">
        <h3 className="uppercase text-xl font-semibold">What we offer</h3>
        <hr className="w-30 h-[2px] bg-orange-500 text-orange-500" />
      </div>

      <div className="  mx-auto ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#FFF8F3CC] p-5 rounded-xl shadow-sm border border-gray-100 min-h-[160px]"
            >
              <div className="text-[#FFAC6F]  text-6xl mb-1">
                {feature.id}
              </div>
              <h3 className="font-bold text-md mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-600">{feature.description}</p>
            </div>
          ))}
          {/* Final image block */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 flex items-center  justify-center ">
            <Image
              src="/assets/our-plans/what-we-offer.png"
              alt="growth"
              height={500}
              width={500}
              className="w-full h-full 2xl:max-h-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeOffer;
