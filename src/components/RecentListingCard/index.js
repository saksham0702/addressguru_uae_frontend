import React from "react";
import Image from "next/image";
import Link from "next/link";
import { APP_URL } from "@/services/constants";

const RecentListingCard = ({ data,slugData }) => {
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <Link
      href={`/${slugData}/${data?.slug}?id=${data?.id}`}
      className="block w-[180px] h-[350px] md:w-[200px] 2xl:min-w-[240px] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex-shrink-0"
    >
      {/* House Image - Fixed Height */}
      <div className="w-full h-[200px] bg-gray-200 relative overflow-hidden">
        {data?.image ? (
          <Image
            src={`${APP_URL}/${data?.image[0]}`}
            alt={data?.title || "Business"}
            fill
            className="object-cover"
            sizes="200px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Card Content - Fixed Height */}
      <div className="h-[131px] px-4 py-3 flex flex-col justify-between">
        <div className="space-y-2">
          {data?.price_type === "amount" ? (
            <h3 className="text-lg font-semibold text-gray-950 line-clamp-2 leading-tight">
              $ {data?.price}
            </h3>
          ) : (
            <h3 className="text-lg font-semibold text-gray-950  leading-tight">
              {data?.price_type}
            </h3>
          )}
          {/* Business Name */}
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">
            {data?.title || "Business Name"}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-gray-500">
            <svg
              className="w-3 h-3 flex-shrink-0"
              viewBox="0 0 13 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.31641 0.501953C6.61354 0.490531 6.91411 0.52401 7.22949 0.580078L7.55176 0.643555C7.68249 0.671206 7.81065 0.709394 7.94531 0.754883L8.37793 0.90918C8.5785 0.981268 8.76502 1.05662 8.93555 1.14551C9.13514 1.24955 9.33096 1.36922 9.51953 1.5C9.63223 1.57834 9.74248 1.65829 9.84961 1.74023L10.1611 1.99316C10.3256 2.13493 10.4817 2.29255 10.624 2.45898C10.8006 2.6654 10.9675 2.8881 11.1338 3.12207V3.12305C11.2179 3.24137 11.2782 3.36282 11.3809 3.54492L11.3818 3.5459C11.4263 3.62466 11.4569 3.69311 11.5146 3.80762C11.5752 3.92796 11.6268 4.05267 11.6758 4.18555L11.8232 4.61426C11.9943 5.12135 12.0606 5.65881 12.082 6.22949C12.0856 6.32376 12.078 6.41661 12.0645 6.52148L12.0107 6.88574C11.9583 7.25015 11.8544 7.61063 11.7178 7.97559C11.6143 8.25149 11.5508 8.45647 11.4541 8.68555V8.68652C11.337 8.96437 11.2092 9.21957 11.0703 9.52148C10.998 9.67814 10.9689 9.75576 10.9092 9.87891L10.7461 10.1865C10.7217 10.233 10.6981 10.2797 10.6777 10.3203C10.6569 10.362 10.6386 10.3986 10.6201 10.4336C10.451 10.7502 10.2962 11.0499 10.1279 11.3467C9.92825 11.6991 9.71966 12.0453 9.50684 12.4033L9.02734 13.1953C8.85936 13.463 8.69169 13.7111 8.51074 13.9912L8.50977 13.9922C8.36434 14.218 8.25717 14.3984 8.12207 14.6016V14.6025C7.9238 14.9006 7.72056 15.1932 7.51465 15.4951C7.33931 15.7518 7.1684 16.0047 6.99316 16.2539C6.86489 16.4362 6.74852 16.5869 6.60547 16.7852V16.7861C6.50313 16.9282 6.39351 17.0829 6.29199 17.2256C6.19469 17.0893 6.09691 16.9527 6.00195 16.8213L5.73828 16.4697C5.63795 16.3292 5.57364 16.2275 5.46094 16.0664C5.3426 15.8972 5.26055 15.788 5.1543 15.6338C5.03631 15.4625 4.92177 15.2894 4.80273 15.1113C4.65804 14.8947 4.51763 14.6898 4.37988 14.4785C4.21019 14.2182 4.04788 13.9598 3.87598 13.6924H3.875C3.74411 13.489 3.62429 13.3082 3.50488 13.1162L3.50391 13.1152C3.36484 12.8918 3.23259 12.667 3.0918 12.4326H3.09082C2.96077 12.2163 2.83585 12.0115 2.71484 11.8027C2.5794 11.5695 2.44691 11.3333 2.31543 11.0947C2.18454 10.8572 2.05631 10.6174 1.92871 10.376C1.84005 10.2082 1.75329 10.0372 1.66699 9.86328H1.66797C1.56731 9.65976 1.46755 9.45476 1.36816 9.24707H1.36914C1.32547 9.15532 1.2881 9.07473 1.25684 8.99609C1.16187 8.75646 1.0685 8.51781 0.979492 8.2793C0.875577 8.00093 0.782319 7.77167 0.710938 7.52832C0.647569 7.31198 0.619071 7.11436 0.558594 6.83105C0.491778 6.51698 0.485746 6.18837 0.520508 5.84277C0.559704 5.45265 0.607511 5.09565 0.706055 4.76074C0.791396 4.47097 0.883001 4.19707 0.996094 3.94141L1.11719 3.69141C1.26977 3.40364 1.42079 3.14055 1.59473 2.90625L1.77734 2.68164C2.00334 2.42776 2.1803 2.21283 2.3877 2.01953C2.5731 1.84666 2.77618 1.71095 3.0332 1.51855V1.51758C3.14773 1.4318 3.27023 1.34956 3.40234 1.26562L3.40332 1.2666C3.4714 1.22351 3.53276 1.19001 3.58887 1.16699H3.58984C3.91102 1.03485 4.21827 0.91555 4.55078 0.78125C4.8747 0.650481 5.22392 0.600541 5.65039 0.537109L5.65137 0.538086C5.85722 0.507733 6.02526 0.516622 6.31641 0.501953ZM6.26172 2.96191C4.29691 2.97796 2.68731 4.55695 2.65137 6.53516L2.65332 6.72754C2.71595 8.6114 4.2841 10.292 6.40137 10.2314L6.40039 10.2305C8.35616 10.1754 9.91128 8.58098 9.93457 6.59863V6.58691C9.91234 4.59542 8.29794 2.94556 6.26172 2.96191Z"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </svg>
            <p className="text-xs font-medium truncate">
              {data?.city || "Location"}
            </p>
          </div>
        </div>

        {/* Date Badge */}
        <div className="flex justify-end">
          <span className="text-[10px] font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
            {formatDate(data?.created_at)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RecentListingCard;
