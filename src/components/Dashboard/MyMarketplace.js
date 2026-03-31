import React from "react";
import { Eye, ShoppingBag, Tag, Package } from "lucide-react";
import Image from "next/image";
// import { APP_URL } from "@/services/constants";
import Link from "next/link";

const MyMarketplaceListings = ({ data }) => {
  console.log("Marketplace listings data:", data);
  const APP_URL = "https://addressguru.ae/api";
  // Helper to format price
  const formatPrice = (price) => {
    if (!price) return "Not Specified";
    return `₹${Number(price).toLocaleString()}`;
  };

  // Helper to get condition label
  const getConditionLabel = (condition) => {
    const conditions = {
      1: "New",
      2: "Like New",
      3: "Good",
      4: "Fair",
      5: "Poor",
    };
    return conditions[condition] || "Not Specified";
  };

  // Helper to get condition color
  const getConditionColor = (condition) => {
    const colors = {
      1: "bg-green-50 text-green-700",
      2: "bg-blue-50 text-blue-700",
      3: "bg-yellow-50 text-yellow-700",
      4: "bg-orange-50 text-orange-700",
      5: "bg-red-50 text-red-700",
    };
    return colors[condition] || "bg-gray-50 text-gray-700";
  };

  // Helper to get status badge
  const getStatusBadge = (status) => {
    if (status === "1" || status === 1) {
      return {
        label: "Published",
        color: "bg-green-500",
        textColor: "text-green-700",
      };
    } else if (status === "0" || status === 0) {
      return {
        label: "Draft",
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
      };
    } else {
      return {
        label: "Inactive",
        color: "bg-gray-500",
        textColor: "text-gray-700",
      };
    }
  };

  return (
    <div className="bg-white shadow-sm border w-full max-md:w-[98%] max-md:mx-auto rounded-md border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-[#FFF8F3] border-gray-200">
        <h2 className="font-semibold text-gray-900">MY MARKETPLACE LISTINGS</h2>
      </div>

      {/* Product Cards */}
      <div className="md:p-4 p-2 space-y-4">
        {data?.map((product) => {
          const statusInfo = getStatusBadge(product?.status);

          return (
            <div
              key={product?.id}
              className="border border-gray-200 rounded-lg md:p-4 p-2.5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between gap-6">
                {/* Left Section */}
                <div className="flex md:gap-4 gap-2 flex-1">
                  {/* Product Image */}
                  <div className="w-20 h-20 max-md:w-13 max-md:h-13 flex-shrink-0">
                    {product?.images?.length > 0 ? (
                      <img
                        width={500}
                        height={500}
                        src={`${APP_URL}/${product?.images[0]}`}
                        alt={product?.title?.slice(0, 12) || "Product"}
                        className="w-full h-full rounded-lg object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-orange-50 rounded-lg border border-orange-100">
                        <ShoppingBag className="w-10 h-10 text-orange-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Info and Buttons */}
                  <div className="flex-1 max-md:max-w-[60%]">
                    <span className="font-semibold text-base max-w-xs max-md:text-sm text-gray-900 md:mb-1">
                      <p className="line-clamp-2 leading-5 capitalize">
                        {product?.title}
                      </p>
                    </span>

                    {/* Product Details */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-gray-600 md:mb-3 mb-2">
                      {/* <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {formatPrice(product?.price)}
                      </span> */}
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {product?.quantity ?? 1} in stock
                      </span>
                      {product?.condition && (
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${getConditionColor(
                            product?.condition,
                          )}`}
                        >
                          {getConditionLabel(product?.condition)}
                        </span>
                      )}
                    </div>

                    {/* Category Tag */}
                    {product?.category_name && (
                      <div className="flex flex-wrap gap-1 mb-2 max-md:hidden">
                        <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded">
                          {product?.category_name}
                        </span>
                      </div>
                    )}

                    {/* Mobile Status */}
                    <div className="flex mt-1 items-center md:hidden gap-3">
                      <span className="text-xs whitespace-nowrap flex items-center text-gray-600">
                        Status -{" "}
                        <span
                          className={`font-semibold text-xs ml-1 ${statusInfo.textColor}`}
                        >
                          {statusInfo.label}
                        </span>
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 whitespace-nowrap max-md:mt-1">
                      <Link
                        href={`/dashboard/marketplace-listing?productId=${product?.slug}&edit=true`}
                        className="inline-flex items-center gap-2 px-4 max-md:px-2 py-1.5 max-md:text-[10px] max-md:border-1 max-md:border-blue-500 max-md:text-blue-400 md:bg-blue-600 md:hover:bg-blue-700 text-white text-xs font-semibold rounded-sm transition-colors"
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
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8.16894 2.66211H4.1862C3.34116 2.66211 2.53079 2.99779 1.93326 3.59532C1.33574 4.19285 1 5.00327 1 5.84831V13.8138C1 14.6589 1.33574 15.4693 1.93326 16.0668C2.53079 16.6643 3.34116 17 4.1862 17H12.9482C14.7086 17 15.3379 15.5662 15.3379 13.8138V9.83105"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        EDIT PRODUCT
                      </Link>

                      <Link
                        href={`/marketplace/${product?.slug}?preview=true`}
                        className="inline-flex items-center gap-2 max-md:px-2 px-4 py-1.5 max-md:text-[10px] uppercase text-orange-600 border border-orange-600 text-xs font-semibold rounded-sm transition-colors hover:bg-orange-50"
                      >
                        <Eye className="w-3 h-3" />
                        PREVIEW
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Section - Status */}
                <div className="flex flex-col items-center min-w-24 max-md:hidden justify-center px-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-3 h-3 rounded-full ${statusInfo.color}`}
                    ></div>
                    <span
                      className={`text-sm font-medium ${statusInfo.textColor}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  {product?.price?.amount && (
                    <span className="text-xs text-gray-500 mt-1 font-semibold">
                      {formatPrice(product?.price?.amount)}
                    </span>
                  )}
                </div>
              </div>

              {/* Additional Info on Mobile */}
              <div className="md:hidden mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-600 line-clamp-2">
                  {product?.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {(!data || data.length === 0) && (
        <div className="p-12 text-center text-gray-500">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">
            No marketplace listings found
          </p>
          <p className="text-sm">Add your first product to get started.</p>
        </div>
      )}
    </div>
  );
};

export default MyMarketplaceListings;
