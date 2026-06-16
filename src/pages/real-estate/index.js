import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Home,
  Waves,
  Building,
  Key,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
} from "lucide-react";
import BreadCrumbs from "@/components/BreadCrumbs";
import Navbar from "@/components/Forms/Navbar";
// import FooterComponents from "@/components/FooterComponents";
import MobileFooter from "@/components/MobileFooter";
import { useAuth } from "@/context/AuthContext";

const propertyCategories = [
  {
    name: "Apartments",
    slug: "apartments",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop&q=80",
    desc: "Luxury studios to spacious family apartments",
    icon: <Building2 className="w-5 h-5" />,
    color: "bg-blue-50 text-blue-600",
  },
  {
    name: "Villas",
    slug: "villas",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop&q=80",
    desc: "Premium independent homes in exclusive communities",
    icon: <Home className="w-5 h-5" />,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    name: "Penthouses",
    slug: "penthouses",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&q=80",
    desc: "Top-floor luxury with breathtaking skyline views",
    icon: <Waves className="w-5 h-5" />,
    color: "bg-purple-50 text-purple-600",
  },
  {
    name: "Townhouses",
    slug: "townhouses",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&q=80",
    desc: "Elegant terraced homes for modern families",
    icon: <Home className="w-5 h-5" />,
    color: "bg-amber-50 text-amber-600",
  },
  {
    name: "Commercial",
    slug: "commercial",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop&q=80",
    desc: "Offices, shops, and warehouses for your business",
    icon: <Building className="w-5 h-5" />,
    color: "bg-slate-100 text-slate-600",
  },
  {
    name: "Land/Plots",
    slug: "land",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop&q=80",
    desc: "Prime residential and commercial plots",
    icon: <MapPin className="w-5 h-5" />,
    color: "bg-orange-50 text-orange-600",
  },
];

const RealEstateLanding = () => {
  const router = useRouter();
  const { city: authCity } = useAuth();
  const city = (router.query.city || authCity || "uae").toLowerCase();
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <div className=" md:w-[80%] max-md:w-full mx-auto bg-white">
      <Head>
        <title>
          Real Estate in {cityName} | Buy, Rent & Lease Properties | AddressGuru
        </title>
        <meta
          name="description"
          content={`Explore premium real estate in ${cityName}. Find apartments, villas, and commercial properties for sale, rent, and lease.`}
        />
      </Head>

      {/* <Navbar /> */}

      <main className="pt-20">
        {/* Breadcrumb */}
        {/* <div className="bg-gray-50 border-b border-gray-100 px-4 md:px-12 py-3">
          <div className="max-w-7xl mx-auto">
            <BreadCrumbs
              slug="real-estate"
              city={city}
              name="Real Estate"
              type={true}
            />
          </div>
        </div> */}

        {/* Hero Section */}
        <div className="relative bg-white pt-8 pb-12 px-4 md:px-12 overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-[#FF6E04] text-[10px] font-bold uppercase tracking-wider mb-4 border border-orange-100">
                Premium Real Estate
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                Find Your Path to{" "}
                <span className="text-[#FF6E04]">Modern Living</span> in{" "}
                {cityName}
              </h1>
              <p className="mt-4 text-gray-600 text-base md:text-lg">
                Discover curated property listings across the Emirates. From
                luxury waterfront penthouses to cozy suburban villas.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-100 px-4 py-2 rounded-lg">
                  <ShieldCheck size={18} className="text-orange-500" />
                  <span>Verified Listings</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-100 px-4 py-2 rounded-lg">
                  <Star size={18} className="text-orange-500" />
                  <span>Top Rated Agents</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle Background Pattern or Image */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none hidden lg:block">
            <svg
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full fill-orange-500"
            >
              <path d="M0 100 Q 100 0, 200 100 T 400 100 L 400 300 Q 300 400, 200 300 T 0 300 Z" />
            </svg>
          </div>
        </div>

        {/* Categories Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-12 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Explore Categories
              </h2>
              <p className="text-gray-500 mt-1">
                Browse properties by their architectural style and purpose
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/properties?purpose=sale&city=${city}`}
                className="px-5 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
              >
                Buy
              </Link>
              <Link
                href={`/properties?purpose=rent&city=${city}`}
                className="px-5 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Rent
              </Link>
              <Link
                href={`/properties?purpose=lease&city=${city}`}
                className="px-5 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Lease
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertyCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/properties?type=${cat.slug}&city=${city}`}
                className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`p-2 rounded-lg ${cat.color} group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300`}
                    >
                      {cat.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {cat.desc}
                  </p>
                  <div className="flex items-center text-orange-500 text-xs font-bold uppercase tracking-wider group-hover:gap-2 transition-all">
                    <span>View Listings</span>
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Why Us Section */}
        <div className="bg-gray-50 py-16 px-4 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto md:mx-0">
                  <CheckCircle2 size={24} className="text-orange-500" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">
                  Verified & Secure
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Every listing is manually reviewed to ensure accuracy and
                  legitimacy, protecting your investment.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto md:mx-0">
                  <Key size={24} className="text-orange-500" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">
                  Flexible Options
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Whether you are buying, renting, or leasing, we offer the
                  widest selection of properties across UAE.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto md:mx-0">
                  <MapPin size={24} className="text-orange-500" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">
                  Local Expertise
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Deep insights into Dubai, Abu Dhabi, and Sharjah markets to
                  help you make informed decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <FooterComponents /> */}
      <div className="md:hidden">
        <MobileFooter />
      </div>
    </div>
  );
};

export default RealEstateLanding;
