import React, { useState } from "react";
import Image from "next/image";
import SearchBar from "../SearchBar";

const Banner1 = ({ data, isOpen, setIsOpen }) => {
  const [slug, setSlug] = useState("");

  return (
    <div className="w-full 2xl:w-[80%] h-[290px] bg-blue-700 max-md:hidden flex items-center  relative ">
      <div className="h-full w-full absolute top-[0px]  px-5 z-10">
        <Image
          src="/assets/Group 7305.svg"
          alt="banner background"
          height={1000}
          width={1000}
          className="w-full h-[290px] "
        />
      </div>
      <div className="absolute text-white top-[90px]   left-30 z-20">
        <h3 className=" mb-3 text-xl">
          Explore over <strong className="text-[#FF6E04]">1K+ </strong>
          Products & Services with ease
        </h3>
        <div className="relative  z-50">
          <SearchBar
            value={slug}
            setValue={setSlug}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            data={data}
            variant="banner"
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
        <h3 className="text-[65px] font-bold">1000+ </h3>{" "}
        <p className="absolute  top-20 left-2"> Registered Businesess</p>
      </div>
    </div>
  );
};

export default Banner1;
