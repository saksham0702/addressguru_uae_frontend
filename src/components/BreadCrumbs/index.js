import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Slash = () => <span className="text-gray-400 font-normal">/</span>;

const BreadCrumbs = ({ slug, name, length, type }) => {
  const { city } = useAuth();
  const router = useRouter();

  return (
    <div>
      <span className="text-xs flex items-center flex-wrap max-md:text-[11px] font-medium gap-1">
        {/* Home */}
        <Link
          href="/"
          className="text-gray-500 hover:text-orange-500 transition-colors"
        >
          Home
        </Link>

        {/* City */}
        {city && (
          <>
            <Slash />
            <span
              onClick={() => router.push("/")}
              className="text-gray-500 cursor-pointer hover:text-orange-500 transition-colors capitalize"
            >
              {city}
            </span>
          </>
        )}

        {/* Slug */}
        {slug && (
          <>
            <Slash />
            <span
              onClick={() => router.back()}
              className="text-gray-500 capitalize cursor-pointer hover:text-orange-500 transition-colors"
            >
              {slug}
            </span>
          </>
        )}

        {/* Type */}
   {/* Type */}
{type && type !== true && (
  <>
    <Slash />
    <span
      onClick={() => router.back()}
      className="text-gray-500 capitalize cursor-pointer hover:text-orange-500 transition-colors"
    >
      {type}
    </span>
  </>
)}

        {/* Name — final crumb, not clickable */}
        {name && (
          <>
            <Slash />
            <strong className="text-gray-800 capitalize flex items-center gap-1">
              {length && <span>{length}</span>}
              {name}
            </strong>
          </>
        )}
      </span>
    </div>
  );
};

export default BreadCrumbs;
