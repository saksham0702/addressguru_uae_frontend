import Descriptions from "@/components/FooterComponents/Descriptions";
import Foot1 from "@/components/FooterComponents/Foot1";
import Foot2 from "@/components/FooterComponents/Foot2";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Footer = () => {
  const router = useRouter();

  return (
    <div
      className={`absolute  flex flex-col bg-white pt-5 items-center max-md:hidden ${"2xl:w-[80%] 2xl:left-[10%] 2xl:right-[10%]"}`}
    >
      <Foot1 />
      <Foot2 />
      <Descriptions />

      <div className="h-[60px] w-full bg-[#181D2D] text-white flex items-center justify-between font-bold px-7">
        <h3>23,759 Live Ads | 3,738+ Agents</h3>
        <h3>
          © 2025 AddressGuru | by :
          <Link href="https://adxventure.com" target="_blank">
            {" "}
            AdxVenture
          </Link>
        </h3>
      </div>
    </div>
  );
};

export default Footer;
