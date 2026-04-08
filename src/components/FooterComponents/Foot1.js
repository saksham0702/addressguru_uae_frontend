import React from "react";
import Image from "next/image";
import Link from "next/link";

const menuLinks = [
  { name: "About Us", path: "/about-us" },
  { name: "Blogs", path: "/blogs" },
  { name: "Become A Partner", path: "/partner" },
  { name: "Posting Rules", path: "/posting-rules" },
  { name: "Marketplace", path: "/marketplace" },
];

const quickLinks = [
  { name: "Post Ad", path: "/post-ad" },
  { name: "Our Plans", path: "/plans" },
  { name: "Infringement Policy", path: "/infringement-policy" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Click Here To Open The App", path: "/app" },
];

const Foot1 = () => {
  return (
    <div className="flex pl-20 justify-between w-full">
      {/* First Section */}
      <div className="w-xs flex flex-col text-center">
        {/* Logo */}
        <Link href="/">
          <div className="mb-4 border w-50 p-2 border-dashed rounded-xl border-[#FF6E04] cursor-pointer">
            <Image
              src="/assets/addressguru_logo.png"
              alt="AddressGuru Logo"
              width={500}
              height={500}
              className="bg-white shadow-lg py-3 px-4 w-full rounded-xl"
            />
          </div>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-900 font-semibold w-xs text-start mb-6">
          AddressGuru UAE is an online local business directory that provides
          information about your daily needs just one click away.
        </p>

        {/* Social Icons */}
        <div className="flex gap-2 relative bottom-3 text-xl">
          <Link href="https://linkedin.com" target="_blank">
            <Image
              src="/assets/Png/footer/linkedin.png"
              alt="LinkedIn"
              width={100}
              height={100}
              className="h-7 w-7 cursor-pointer"
            />
          </Link>

          <Link href="https://instagram.com" target="_blank">
            <Image
              src="/assets/Png/footer/insta.png"
              alt="Instagram"
              width={100}
              height={100}
              className="h-7 w-7 cursor-pointer"
            />
          </Link>

          <Link href="https://facebook.com" target="_blank">
            <Image
              src="/assets/Png/footer/fb.png"
              alt="Facebook"
              width={100}
              height={100}
              className="h-7 w-7 cursor-pointer"
            />
          </Link>

          <Link href="https://twitter.com" target="_blank">
            <Image
              src="/assets/Png/footer/twiter.png"
              alt="Twitter"
              width={100}
              height={100}
              className="h-7 w-7 cursor-pointer"
            />
          </Link>

          <Link href="https://youtube.com" target="_blank">
            <Image
              src="/assets/Png/footer/youtube.png"
              alt="YouTube"
              width={100}
              height={100}
              className="h-7 w-7 cursor-pointer"
            />
          </Link>
        </div>
      </div>

      {/* Menu Section */}
      <div className="mt-5">
        <h3 className="font-bold mb-2 text-base">MENU</h3>
        <ul className="space-y-1">
          {menuLinks.map((item, index) => (
            <li key={index}>
              <Link
                href={item.path}
                className="hover:underline text-sm font-semibold"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Links Section */}
      <div className="mt-5">
        <h3 className="font-bold mb-2 text-base">QUICK LINKS</h3>
        <ul className="space-y-1">
          {quickLinks.map((item, index) => (
            <li key={index}>
              <Link
                href={item.path}
                className="hover:underline text-sm font-semibold"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* App Download Section */}
      <div className="mt-4">
        <h3 className="uppercase font-bold">Download our app here..</h3>

        <div className="flex flex-col px-2 gap-4 my-5 w-sm">
          <Link href="https://play.google.com" target="_blank">
            <Image
              src="/assets/Png/last-banner/play-store.png"
              alt="Play Store"
              width={1000}
              height={1000}
              className="w-40 h-12 cursor-pointer"
            />
          </Link>

          <Link href="https://www.apple.com/app-store/" target="_blank">
            <Image
              src="/assets/Png/last-banner/app-store.png"
              alt="App Store"
              width={1000}
              height={1000}
              className="w-40 h-12 cursor-pointer"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Foot1;
