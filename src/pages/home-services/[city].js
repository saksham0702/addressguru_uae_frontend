import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  User,
  Sprout,
  Wand2,
  Truck,
  Palette,
  Wrench,
  Bug,
  Recycle,
  ShieldCheck,
  Star,
  Clock,
  LayoutGrid,
  Search,
  BarChart2,
  Info,
} from "lucide-react";
import BreadCrumbs from "@/components/BreadCrumbs";

const services = [
  {
    name: "Maid Services",
    icon: <User size={20} />,
    slug: "maid",
    desc: "Cleaning & Housekeeping",
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    name: "Gardening",
    icon: <Sprout size={20} />,
    slug: "gardening",
    desc: "Landscaping & Care",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    name: "Deep Cleaning",
    icon: <Wand2 size={20} />,
    slug: "deep-cleaning",
    desc: "Home & Office",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    name: "Logistic Services",
    icon: <Truck size={20} />,
    slug: "logistic-services",
    desc: "Moving & Delivery",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    name: "Interior Design",
    icon: <Palette size={20} />,
    slug: "interior-designer",
    desc: "Space & Décor",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    name: "Plumber Services",
    icon: <Wrench size={20} />,
    slug: "plumber-services",
    desc: "Repair & Install",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  {
    name: "Pest Control",
    icon: <Bug size={20} />,
    slug: "pest-control",
    desc: "Pest-Free Home",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    name: "Scrap Dealers",
    icon: <Recycle size={20} />,
    slug: "scrap-dealers",
    desc: "Recycling & Pickup",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

const popular = [
  "Home Cleaning",
  "AC Repair",
  "Plumber Near Me",
  "Pest Control",
  "Packers & Movers",
  "Carpenter",
  "Painting",
  "Sofa Cleaning",
  "Electrician",
];

const stats = [
  { val: "500+", label: "Verified Professionals" },
  { val: "12K+", label: "Happy Customers" },
  { val: "7", label: "UAE Cities" },
  { val: "< 2 hrs", label: "Avg. Response" },
];

const HomeServices = () => {
  const router = useRouter();
  const { city } = router.query;

  return (
    <div className="mx-auto max-w-[2000px] min-h-screen bg-gray-50 2xl:max-w-[80%]">
      <Head>
        <title>Home Services in {city}</title>
        <meta
          name="description"
          content={`Find the best home services in ${city}.`}
        />
      </Head>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-2.5">
        <BreadCrumbs
          slug="home-services"
          city={city}
          name="Professional Home Services"
          type={true}
        />
      </div>

      {/* Hero */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-600 mb-1">
          Home Services
        </p>
        <h1 className="text-xl font-semibold text-gray-900">
          Professional Home Services{city ? ` in ${city}` : ""}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Verified professionals for all your household needs · Doorstep service
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { icon: <ShieldCheck size={12} />, label: "Verified Pros" },
            { icon: <Star size={12} />, label: "4.7+ Rated" },
            { icon: <Clock size={12} />, label: "Quick Response" },
          ].map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded"
            >
              {b.icon}
              {b.label}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-6 py-4 max-w-screen-xl mx-auto space-y-3">
        {/* Services Tiles */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-[13px] font-semibold text-gray-800 flex items-center gap-2">
              <LayoutGrid size={14} className="text-blue-600" />
              Browse by service
            </h2>
            <span className="text-[11px] text-gray-400">
              {services.length} services
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/${service.slug}/${city}`}
                className="group flex flex-col items-center text-center gap-2 p-3 border border-gray-100 rounded-md hover:border-blue-300 hover:bg-blue-50/40 transition-all duration-150"
              >
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${service.iconBg} ${service.iconColor}`}
                >
                  {service.icon}
                </div>
                <div>
                  <p className="text-[12px] font-medium text-gray-800 group-hover:text-blue-700 leading-tight">
                    {service.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                    {service.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-t border-blue-100 text-[11px] text-blue-700">
            <Info size={12} />
            Click any service to see verified professionals and book a visit in
            your area.
          </div>
        </div>

        {/* Popular Searches */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
            <Search size={13} className="text-blue-600" />
            <h2 className="text-[13px] font-semibold text-gray-800">
              Popular searches
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 px-4 py-3">
            {popular.map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-gray-500 bg-gray-50 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
            <BarChart2 size={13} className="text-blue-600" />
            <h2 className="text-[13px] font-semibold text-gray-800">
              Why AddressGuru
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`px-5 py-4 text-center ${i < stats.length - 1 ? "border-r border-gray-100" : ""}`}
              >
                <p className="text-lg font-semibold text-blue-600">{s.val}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeServices;
