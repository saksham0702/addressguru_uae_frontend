import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const CardS = ({ data }) => {
  const { city } = useAuth();

  return (
    <Link
      href={`${data?.link || "/"}/${city.toLowerCase()}`}
      className="group flex flex-col gap-2 transition-transform duration-300 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
        <Image
          src={`/assets/Png/popularService/${data?.imgSrc}`}
          alt={data?.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <p className="px-1 text-sm font-semibold text-[#4B4B4B] group-hover:text-orange-600 transition-colors">
        {data?.title}
      </p>
    </Link>
  );
};

export default CardS;
