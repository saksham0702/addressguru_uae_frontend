import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Slash = () => <span className="text-gray-400 font-normal">/</span>;

const BreadCrumbs = ({ slug, name, length, type }) => {
  const { city } = useAuth();
  const router = useRouter();

  const handleSlugClick = () => {
    if (slug && type) router.back();
  };

  return (
    <div>
      <span className="text-sm flex items-center flex-wrap max-md:text-[11px] font-medium gap-1">

        {/* home */}
        <Link href="/" className="text-gray-500">Home</Link> <Slash />

        {/* City — always shown if available */}
        {city && <span className="text-gray-500">{city}</span>}

        {/* Slug */}
        {slug && (
          <>
            <Slash />
            <span
              onClick={handleSlugClick}
              className={`capitalize ${
                type
                  ? "text-orange-500 cursor-pointer hover:underline"
                  : "text-gray-500"
              }`}
            >
              {slug}
            </span>
          </>
        )}

        {/* Type — sits between slug and name */}
        {type && (
          <>
            <Slash />
            <span className="text-gray-500 capitalize">{type}</span>
          </>
        )}

        {/* Name — final crumb, bold */}
        {name && (
          <>
            {/* <Slash /> */}
            <strong className="text-gray-800 capitalize flex items-center gap-1">
              {length && <span>{length}+</span>}
              {name}
            </strong>
          </>
        )}
      </span>
    </div>
  );
};

export default BreadCrumbs;
