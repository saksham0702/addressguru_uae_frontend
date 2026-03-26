import React from "react";
import { Edit, Trash2, Eye, Edit3, ArrowUp } from "lucide-react";
import Image from "next/image";

import Link from "next/link";

const MyListings = ({ data, APP_URL }) => {
  console.log(data);

  // Data structure for listings
  const listings = [
    {
      id: 1,
      title: "DSOM - Dehradun School of Online Marketing",
      address: "(Rajpur Road, Dehradun)",
      status: "Published",
      views: 11055,
      createdAt: "Aug, 31, 2018 12:32PM",
      packages: "Not Eligible",
      upgrade: "Paid",
      profileStrength: 75,
      image: "/assets/Job/dsom-logo.png",
      hasImage: true,
    },
    {
      id: 2,
      title: "Two Room Set With Attached Bathroom & Kitchen",
      address: "(Saharanpur Road, Dehradun)",
      status: "Published",
      views: 8932,
      createdAt: "Aug, 31, 2018 12:32PM",
      packages: "",
      upgrade: "Free",
      profileStrength: 25,
      image: "/assets/Job/dsom-logo.png",
      hasImage: true,
    },
    {
      id: 3,
      title: "Digital Marketing Training Institute",
      address: "(Clock Tower, Dehradun)",
      status: "Published",
      views: 5621,
      createdAt: "Aug, 31, 2018 12:32PM",
      packages: "Not Eligible",
      upgrade: "Paid",
      profileStrength: 85,
      image: "/assets/Job/dsom-logo.png",
      hasImage: true,
    },
  ];

  // Component for circular progress indicator
  const CircularProgress = ({ percentage }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = (percentage) => {
      if (percentage >= 75) return "#00BA00"; // green
      if (percentage >= 50) return "#EB333E"; // orange
      return "#ef4444"; // red for lower values
    };

    return (
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="25"
            cy="25"
            r={radius}
            stroke={getColor(percentage)}
            strokeWidth="6"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-700">{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-sm border w-full max-md:w-[98%] max-md:mx-auto rounded-md border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-[#FFF8F3] border-gray-200">
        <h2 className="font-semibold text-gray-900">MY LISTINGS</h2>
      </div>

      {/* Listings Cards */}
      <div className="md:p-4 p-2 space-y-4">
        {data?.map((listing) => (
          <div
            key={listing?.id}
            className="border border-gray-200 rounded-lg md:p-4 p-2.5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between  gap-6">
              {/* Left Section - Logo, Name, and Buttons */}
              <div className="flex md:gap-4 gap-2 ">
                {/* Logo/Image Section */}
                <Link
                  href={`/dashboard/listing-details/${listing?.slug}`}
                  className="w-20 h-20 max-md:w-13  max-md:h-13"
                >
                  <Image
                    width={500}
                    height={500}
                    src={`${APP_URL}/${listing?.logo}`}
                    alt={listing?.businessName.slice(0, 12)}
                    className="w-full h-full rounded-lg object-cover border border-gray-100"
                  />
                </Link>

                {/* Company Info and Buttons */}
                <div className=" max-md:max-w-[60%]">
                  <span className="font-semibold text-base max-w-xs  max-md:text-sm  text-gray-900  md:mb-1">
                    <p className="line-clamp-2 leading-5">
                      {listing?.businessName}
                    </p>
                  </span>
                  <p className="text-xs text-gray-800 md:mb-3">
                    {listing?.businessAddress}
                  </p>

                  {/* for mobile only */}
                  <div className="flex mt-1 items-center md:hidden  gap-3  ">
                    <span className="text-xs flex items-center gap-1">
                      View
                      {/* <p className="font-semibold text-xs ">
                        {listing.views.toLocaleString()}
                      </p> */}
                    </span>

                    <span className="text-xs whitespace-nowrap flex  items-center text-gray-600">
                      Status -{" "}
                      <p className="font-semibold text-xs">published</p>
                    </span>

                    <div className="flex flex-col items-center md:hidden  justify-center  ">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            listing.upgrade === "Paid" ? "bg-green-500" : ""
                          }`}
                        ></div>
                        <span
                          className={`text-sm font-medium ${
                            listing.upgrade === "Paid" ? "text-green-700" : ""
                          }`}
                        >
                          {listing.upgrade === "Paid" ? "Paid" : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 whitespace-nowrap max-md:mt-1 ">
                    <Link
                      href={`/dashboard/listing-forms?category=${
                        listing?.category?._id
                      }&categoryName=${encodeURIComponent(
                        listing?.category?.name,
                      )}&name=${encodeURIComponent(listing?.slug)}`}
                      className="inline-flex items-center gap-2 px-4 max-md:px-2 py-1.5 max-md:text-[10px] max-md:border-1 max-md:border-blue-500 max-md:text-blue-400  md:bg-blue-600 md:hover:bg-blue-700 text-white text-xs font-semibold rounded-sm transition-colors"
                    >
                      <svg
                        className="max-md:p-[1px] text-[#0876FE] md:text-white"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.356 4.5739L8.75696 12.1729C8.00024 12.9297 5.75395 13.2801 5.25212 12.7783C4.7503 12.2765 5.09281 10.0302 5.84954 9.2735L13.4566 1.66647C13.6442 1.4618 13.8713 1.29728 14.1243 1.18282C14.3772 1.06835 14.6507 1.0063 14.9283 1.00045C15.2058 0.994616 15.4818 1.04507 15.7393 1.14879C15.9968 1.25251 16.2307 1.40736 16.4267 1.60394C16.6227 1.80053 16.7769 2.0348 16.8799 2.29261C16.9829 2.55043 17.0327 2.82643 17.0261 3.10399C17.0195 3.38155 16.9566 3.65492 16.8415 3.90754C16.7264 4.16017 16.5612 4.38686 16.356 4.5739Z"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M8.16894 2.66211H4.1862C3.34116 2.66211 2.53079 2.99779 1.93326 3.59532C1.33574 4.19285 1 5.00327 1 5.84831V13.8138C1 14.6589 1.33574 15.4693 1.93326 16.0668C2.53079 16.6643 3.34116 17 4.1862 17H12.9482C14.7086 17 15.3379 15.5662 15.3379 13.8138V9.83105"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      EDIT YOUR LISTING
                    </Link>
                    {/* 
                    <button className="inline-flex items-center gap-2 max-md:px-2 px-4 py-1.5 max-md:text-[10px]  uppercase text-orange-600 border border-orange-600 text-xs font-semibold rounded-sm transition-colors">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.66714 15.999H9.33365C9.4809 15.999 9.6003 15.8797 9.6003 15.7323V13.2305L9.98621 13.0376C10.0766 12.9925 10.1336 12.9002 10.1336 12.7992V11.1993C10.1336 10.6614 9.73362 10.2156 9.21529 10.1428C9.29263 9.97317 9.33365 9.78842 9.33365 9.59937C9.33365 8.86412 8.73563 8.26611 8.00039 8.26611C7.26528 8.26611 6.66714 8.86412 6.66714 9.59937C6.66714 9.78842 6.70828 9.97317 6.78562 10.1428C6.26716 10.2156 5.86719 10.6614 5.86719 11.1993V12.7992C5.86719 12.9002 5.92435 12.9925 6.0147 13.0378L6.40049 13.2305V15.7323C6.40049 15.8797 6.52001 15.999 6.66714 15.999ZM6.40049 11.1993C6.40049 10.9051 6.63967 10.666 6.93379 10.666H7.30148C7.41267 10.666 7.51214 10.5968 7.55107 10.4932C7.59 10.3894 7.56071 10.2719 7.47699 10.1988C7.29887 10.0424 7.20044 9.82969 7.20044 9.59937C7.20044 9.15825 7.5594 8.79941 8.00039 8.79941C8.44151 8.79941 8.80034 9.15825 8.80034 9.59937C8.80034 9.82969 8.70204 10.0424 8.52354 10.1985C8.43982 10.2716 8.41052 10.3892 8.44945 10.4929C8.48838 10.5966 8.58812 10.666 8.69931 10.666H9.06699C9.36112 10.666 9.6003 10.9051 9.6003 11.1993V12.6343L9.21451 12.8274C9.12415 12.8725 9.06699 12.9648 9.06699 13.0658V15.4657H6.93379V13.0658C6.93379 12.9648 6.87676 12.8725 6.7864 12.8272L6.40049 12.6343V11.1993Z"
                          fill="#FF6E04"
                        />
                        <path
                          d="M7.73344 12.5326H8.26674V11.6307L8.65266 11.438L8.41426 10.9607L8.00009 11.1678L7.58605 10.9607L7.34766 11.438L7.73344 11.6307V12.5326Z"
                          fill="#FF6E04"
                        />
                        <path
                          d="M1.59991 15.9991H4.26642C4.41367 15.9991 4.53307 15.8798 4.53307 15.7324V9.8661H5.59967C5.70318 9.8661 5.79731 9.80608 5.84132 9.71246C5.88533 9.61885 5.87088 9.50818 5.80447 9.42876L3.13797 6.22895C3.03667 6.1076 2.82978 6.1076 2.72836 6.22895L0.0618506 9.42876C-0.00455164 9.50844 -0.0186133 9.61911 0.0251341 9.71246C0.0691418 9.80608 0.163277 9.8661 0.266656 9.8661H1.33326V15.7324C1.33326 15.8798 1.45278 15.9991 1.59991 15.9991ZM0.836023 9.3328L2.93316 6.81615L5.03043 9.3328H4.26642C4.11929 9.3328 3.99976 9.45193 3.99976 9.59945V15.4658H1.86656V9.59945C1.86656 9.45193 1.74717 9.3328 1.59991 9.3328H0.836023Z"
                          fill="#FF6E04"
                        />
                        <path
                          d="M10.9077 6.77911C10.9517 6.6855 10.9373 6.57483 10.8709 6.49541L8.20437 3.2956C8.10308 3.17425 7.89619 3.17425 7.79476 3.2956L5.12826 6.49541C5.06185 6.57509 5.04779 6.68576 5.09154 6.77911C5.13555 6.87273 5.22968 6.93275 5.33306 6.93275H6.39966V8.266H6.93297V6.6661C6.93297 6.51858 6.81357 6.39945 6.66632 6.39945H5.90243L7.99957 3.8828L10.0968 6.39945H9.33282C9.18569 6.39945 9.06617 6.51858 9.06617 6.6661V8.266H9.59947V6.93275H10.6661C10.7696 6.93275 10.8637 6.87273 10.9077 6.77911Z"
                          fill="#FF6E04"
                        />
                        <path
                          d="M11.7327 15.999H14.3992C14.5465 15.999 14.6659 15.8797 14.6659 15.7323V3.73304H15.7325C15.836 3.73304 15.9301 3.67302 15.9741 3.57941C16.0181 3.48579 16.0037 3.37512 15.9373 3.2957L13.2708 0.0958929C13.1695 -0.0254539 12.9626 -0.0254539 12.8612 0.0958929L10.1947 3.2957C10.1283 3.37538 10.1142 3.48605 10.1579 3.57941C10.202 3.67302 10.2961 3.73304 10.3995 3.73304H11.4661V15.7323C11.4661 15.8797 11.5856 15.999 11.7327 15.999ZM10.9688 3.19974L13.066 0.683097L15.1632 3.19974H14.3992C14.2521 3.19974 14.1326 3.31888 14.1326 3.46639V15.4657H11.9994V3.46639C11.9994 3.31888 11.88 3.19974 11.7327 3.19974H10.9688Z"
                          fill="#FF6E04"
                        />
                        <path
                          d="M0.799952 2.1332H1.33325V1.33325H2.1332V0.799952H1.33325V0H0.799952V0.799952H0V1.33325H0.799952V2.1332Z"
                          fill="#FF6E04"
                        />
                        <path
                          d="M4 2.6665H4.79995V3.46646H5.33325V2.6665H6.1332V2.1332H5.33325V1.33325H4.79995V2.1332H4V2.6665Z"
                          fill="#FF6E04"
                        />
                        <path
                          d="M0.265625 5.33301H0.798926V5.86631H0.265625V5.33301Z"
                          fill="#FF6E04"
                        />
                        <path
                          d="M9.06641 0.266602H9.59971V0.799903H9.06641V0.266602Z"
                          fill="#FF6E04"
                        />
                        <path
                          d="M15.4648 15.199H15.9981V15.7323H15.4648V15.199Z"
                          fill="#FF6E04"
                        />
                      </svg>
                      Upgrade Now
                    </button> */}

                    <Link
                      href={{
                        pathname: `/${listing?.slug}`,
                        query: { preview: true },
                      }}
                      className="inline-flex items-center gap-2 max-md:px-2 px-4
                      py-1.5 max-md:text-[10px] uppercase text-orange-600 border
                      border-orange-600 text-xs font-semibold rounded-sm
                      transition-colors"
                    >
                      {" "}
                      preview
                    </Link>
                  </div>
                </div>
              </div>

              {/* Views Section */}
              {/* <div className="flex flex-col items-center max-md:hidden justify-center px-4 ">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0 1.84614C0 0.826546 0.826211 0 1.84539 0H14.148C15.1672 0 15.9934 0.826555 15.9934 1.84614V7.99995C15.9934 8.3398 15.718 8.61533 15.3783 8.61533C15.0386 8.61533 14.7631 8.3398 14.7631 7.99995V1.84614C14.7631 1.50627 14.4877 1.23076 14.148 1.23076H1.84539C1.50567 1.23076 1.23026 1.50628 1.23026 1.84614V14.1538C1.23026 14.4936 1.50566 14.7691 1.84539 14.7691H7.9967C8.33642 14.7691 8.61183 15.0447 8.61183 15.3845C8.61183 15.7244 8.33642 15.9999 7.9967 15.9999H1.84539C0.826219 15.9999 0 15.1734 0 14.1538V1.84614Z"
                      fill="#6B6B6B"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11.2788 9.43584C10.2596 9.43584 9.43339 10.2624 9.43339 11.282C9.43339 12.3015 10.2596 13.1281 11.2788 13.1281C12.2979 13.1281 13.1242 12.3015 13.1242 11.282C13.1242 10.2624 12.2979 9.43584 11.2788 9.43584ZM8.20312 11.282C8.20312 9.58263 9.58012 8.20508 11.2788 8.20508C12.9774 8.20508 14.3544 9.58263 14.3544 11.282C14.3544 12.9813 12.9774 14.3589 11.2788 14.3589C9.58012 14.3589 8.20312 12.9813 8.20312 11.282Z"
                      fill="#6B6B6B"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12.8536 12.5386C13.0658 12.2732 13.4529 12.2302 13.7181 12.4425L15.7686 14.0835C16.0339 14.2958 16.0769 14.6831 15.8647 14.9485C15.6524 15.2139 15.2654 15.2569 15.0001 15.0445L12.9496 13.4035C12.6844 13.1913 12.6413 12.804 12.8536 12.5386Z"
                      fill="#6B6B6B"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M3.28125 4.71816C3.28125 4.3783 3.55666 4.10278 3.89638 4.10278H12.0981C12.4378 4.10278 12.7133 4.3783 12.7133 4.71816C12.7133 5.05803 12.4378 5.33354 12.0981 5.33354H3.89638C3.55666 5.33354 3.28125 5.05803 3.28125 4.71816Z"
                      fill="#6B6B6B"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M3.28125 8.00015C3.28125 7.66029 3.55666 7.38477 3.89638 7.38477H7.17708C7.5168 7.38477 7.79221 7.66029 7.79221 8.00015C7.79221 8.34 7.5168 8.61553 7.17708 8.61553H3.89638C3.55666 8.61553 3.28125 8.34 3.28125 8.00015Z"
                      fill="#6B6B6B"
                    />
                  </svg>

                  <span className="text-xs">View</span>
                  <span className="font-semibold text-sm ">
                    {listing.views.toLocaleString()}
                  </span>
                </div>
                <span className="text-xs whitespace-nowrap text-gray-600">
                  Status - {listing.status}
                </span>
              </div> */}

              {/* Paid/Free Status */}
              <div className="flex flex-col items-center min-w-24  max-md:hidden justify-center px-4 ">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      listing.upgrade === "Paid" ? "bg-green-500" : ""
                    }`}
                  ></div>
                  <span
                    className={`text-sm font-medium ${
                      listing.upgrade === "Paid" ? "text-green-700" : ""
                    }`}
                  >
                    {listing.upgrade === "Paid" ? "Paid" : ""}
                  </span>
                </div>
              </div>

              {/* Profile Score Circle */}
              {/* <div className="flex flex-col items-center max-md:absolute right-1 max-md:scale-85 justify-center px-4 ">
                <CircularProgress percentage={listing.profileStrength} />
              </div> */}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (if no listings) */}
      {listings.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          <p>No listings found. Create your first listing to get started.</p>
        </div>
      )}
    </div>
  );
};

export default MyListings;
