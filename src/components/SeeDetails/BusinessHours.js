import React, { useState, useRef } from "react";
import { Clock, ChevronDown } from "lucide-react";

const ORDERED_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const formatTime = (time) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hr = parseInt(hours);
  const ampm = hr >= 12 ? "PM" : "AM";
  const displayHr = hr % 12 || 12;
  return `${displayHr}:${minutes} ${ampm}`;
};

const BusinessHours = ({ openingHours, mobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const normalizeHours = () => {
    if (!openingHours) return {};

    if (Array.isArray(openingHours)) {
      return openingHours.reduce((acc, entry) => {
        if (entry?.day) {
          acc[entry.day.toLowerCase()] = entry;
        }
        return acc;
      }, {});
    }

    return Object.keys(openingHours).reduce((acc, key) => {
      acc[key.toLowerCase()] = openingHours[key];
      return acc;
    }, {});
  };
  const hoursMap = normalizeHours();
  const todayData = hoursMap[today];
  const isOpenToday = todayData?.is_open;

  const formattedHours = ORDERED_DAYS?.map((day) => ({
    day,
    is_open: hoursMap[day.toLowerCase()]?.is_open ?? false,
    open_time: hoursMap[day.toLowerCase()]?.open_time ?? null,
    close_time: hoursMap[day.toLowerCase()]?.close_time ?? null,
  }));

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
  };

  const HoursList = () => (
    <div className="px-3 pb-3 shadow-lg border-b border-orange-400 rounded-b-lg pt-1">
      {formattedHours.map(({ day, is_open, open_time, close_time }) => {
        const isToday = day.toLowerCase() === today;
        return (
          <div
            key={day}
            className={`flex items-center justify-between py-1 max-md:text-sm max-md:space-y-2.5 text-xs cursor-pointer  duration-150 hover:bg-gray-100 hover:scale-102 transition-all  ${
              isToday ? "font-semibold" : "font-normal"
            }`}
          >
            <span className="flex items-center gap-1.5 min-w-[95px]">
              {isToday ? (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0" />
              ) : (
                <span className="inline-block w-1.5 h-1.5 flex-shrink-0" />
              )}
              <span
                className={
                  isToday
                    ? is_open
                      ? "text-green-700"
                      : "text-red-500"
                    : "text-gray-800"
                }
              >
                {day}
              </span>
            </span>
            <span
              className={
                isToday && is_open
                  ? "text-green-700 font-semibold"
                  : !is_open
                    ? "text-red-500 font-semibold"
                    : "text-gray-700 font-semibold"
              }
            >
              {is_open
                ? `${formatTime(open_time)} – ${formatTime(close_time)}`
                : "Closed"}
            </span>
          </div>
        );
      })}
    </div>
  );

  // Mobile: click to expand inline (no layout shift — expands upward via flex-col-reverse trick not needed, just toggle)
  if (mobile) {
    return (
      <div className="w-full">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 text-sm w-full text-left"
        >
          <Clock className="w-4 h-4 text-black flex-shrink-0" />
          <span className="md:font-semibold md:text-[16px] text-[14px] text-black">
            Business Hours:
          </span>
          <span
            className={`text-sm ${isOpenToday ? "text-green-700" : "text-red-500"}`}
          >
            {isOpenToday ? "Open" : "Closed Today"}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-900" />
        </button>

        {/* BACKDROP */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* BOTTOM SHEET */}
        <div
          className={`fixed left-0 bottom-0 z-50 w-full h-[45vh] bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Handle bar */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />

          {/* Header */}
          <div className="px-5 pb-3 flex justify-between items-center border-b">
            <span className="font-medium text-lg">Business Hours</span>
            <button onClick={() => setIsOpen(false)} className="text-lg">
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto px-4 py-3">
            <HoursList />
          </div>
        </div>
      </div>
    );
  }

  // Desktop: hover → floats ABOVE (bottom-full), no layout shift
  return (
    <div
      className="relative w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating dropdown — appears ABOVE, doesn't push layout */}
      {isOpen && (
        <div className="absolute left-0 w-full top-full z-50 bg-white border-b border-gray-200 rounded-md rounded-t-none min-w-[220px]">
          <HoursList />
        </div>
      )}

      {/* Trigger row */}
      <div
        className={`flex items-center gap-1.5 text-sm cursor-pointer  rounded transition-colors ${isOpen ? "bg-white text-black" : "hover:bg-white hover:text-black"}`}
      >
        <Clock
          className={`w-4 h-4 text-black flex-shrink-0 ${isOpen ? "hidden" : ""}`}
        />
        <span
          className={`font-semibold text-[16px] ${isOpen ? "ml-5" : ""} text-black `}
        >
          Business Hours:
        </span>
        <span
          className={`text-[16px] font-semibold ${isOpenToday ? "text-green-700" : "text-red-500"}`}
        >
          {isOpenToday ? `Open` : "Closed Today"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-900 mr-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
    </div>
  );
};

export default BusinessHours;
