import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const propertyTypes = [
  {
    title: "Apartments",
    slug: "apartments",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop&q=80",
    count: "120+",
  },
  {
    title: "Villas",
    slug: "villas",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop&q=80",
    count: "85+",
  },
  {
    title: "Townhouses",
    slug: "townhouses",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop&q=80",
    count: "60+",
  },
  {
    title: "Penthouses",
    slug: "penthouses",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop&q=80",
    count: "30+",
  },
  {
    title: "Studios",
    slug: "studios",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop&q=80",
    count: "95+",
  },
  {
    title: "Commercial",
    slug: "commercial",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&q=80",
    count: "45+",
  },
];

const purposes = [
  {
    label: "Buy",
    value: "sale",
    desc: "Find your dream home",
    color: "#1a6340",
    bg: "#ecfdf5",
  },
  {
    label: "Rent",
    value: "rent",
    desc: "Flexible living options",
    color: "#1e40af",
    bg: "#eff6ff",
  },
  {
    label: "Lease",
    value: "lease",
    desc: "Long-term agreements",
    color: "#92400e",
    bg: "#fffbeb",
  },
];

const PropertyShowcase = () => {
  const { city } = useAuth();

  return (
    <section className="w-full py-8 px-4">
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Real Estate
          </p>
          <h3 className="text-xl font-semibold text-[#212121]">
            Find Properties in UAE
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Apartments, villas, and commercial spaces across the Emirates
          </p>
        </div>
        <Link
          href="/real-estate"
          className="text-sm font-medium text-[#FF6E04] hover:underline whitespace-nowrap hidden md:block"
        >
          View all →
        </Link>
      </div>

      {/* Purpose Tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto hide-scroll pb-1">
        {purposes.map((p) => (
          <Link
            key={p.value}
            href={`/properties?purpose=${p.value}&city=${city?.toLowerCase() || "uae"}`}
            className="flex items-center gap-3 px-5 py-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-all min-w-fit"
            style={{ backgroundColor: p.bg }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: p.color }}>
                {p.label}
              </p>
              <p className="text-[11px] text-gray-500">{p.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Property Type Cards  */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {propertyTypes.map((type) => (
          <Link
            key={type.slug}
            href={`/properties?type=${type.slug}&city=${city?.toLowerCase() || "uae"}`}
            className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-100"
          >
            <Image
              src={type.image}
              alt={type.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p
                className="text-white text-sm font-semibold leading-tight"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
              >
                {type.title}
              </p>
              <p className="text-white/70 text-[11px] mt-0.5">
                {type.count} Listings
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile view all link */}
      <div className="mt-4 text-center md:hidden">
        <Link
          href="/real-estate"
          className="text-sm font-medium text-[#FF6E04] hover:underline"
        >
          View all properties →
        </Link>
      </div>
    </section>
  );
};

export default PropertyShowcase;
