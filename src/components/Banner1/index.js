import React, { useState } from "react";
import Image from "next/image";
import SearchBar from "../SearchBar";
import { searchData } from "@/api/search";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

const Banner1 = ({ data, isOpen, setIsOpen }) => {
  const { city } = useAuth();
  const [slug, setSlug] = useState("");

  const router = useRouter();
  const handleSearch = async () => {
    if (!slug?.trim()) return;

    try {
      const res = await searchData(slug, city);

      if (!res || res.status === false || !res.category) {
        console.warn("Invalid search response", res);
        return;
      }

      const categorySlug = res.category.toLowerCase().replace(/\s+/g, "-");

      const citySlug = city.toLowerCase().replace(/\s+/g, "-");

      // ✅ THIS creates /hotel/UAE
      router.push(`/${categorySlug}/${citySlug}`);
    } catch (error) {
      console.error("Search API failed:", error);
    }
  };
  return (
    <div className="w-full 2xl:w-[80%] max-md:hidden flex items-center  relative ">
      <Image
        src="/assets/bannerImg.png"
        alt="banner background"
        height={100}
        width={100}
        className="w-full h-[290px] "
      />
      <div className="h-full w-full absolute top-[0px]  px-5 z-10">
        <Image
          src="/assets/Group 7305.svg"
          alt="banner background"
          height={1000}
          width={1000}
          className="w-full h-[290px] "
        />
      </div>
      <div className="absolute text-white top-[90px]   left-50 z-20">
        <h3 className=" mb-3 text-xl">
          Explore over <strong className="text-[#FF6E04]">150K+ </strong>
          Products & Services with ease
        </h3>
        <div className="relative right-10">
          <SearchBar
            value={slug}
            setValue={setSlug}
            onSearch={handleSearch}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            data={data}
          />
        </div>
      </div>

      <Image
        src="/assets/girlInBanner.png"
        alt="girl in banner"
        height={500}
        width={500}
        className="h-77 w-70 absolute z-30 top-[-18] right-70"
      />
      <div className="flex-col flex  text-white top-20 pr-20 absolute  right-[-20]">
        {" "}
        <h3 className="text-[65px] font-bold">150 K+ </h3>{" "}
        <p className="absolute  top-20 left-2"> Registered Businesess</p>
      </div>
    </div>
  );
};

export default Banner1;
