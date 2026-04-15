import React, { useState, useRef } from "react";
import { Clock, ChevronDown } from "lucide-react";

const ORDERED_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const normalizeHours = () => {
    if (!openingHours) return {};
    if (Array.isArray(openingHours)) {
      return openingHours.reduce((acc, entry) => {
        if (entry?.day) acc[entry.day] = entry;
        return acc;
      }, {});
    }
    return openingHours;
  };

  const hoursMap = normalizeHours();
  const todayData = hoursMap[today];
  const isOpenToday = todayData?.is_open;

  const formattedHours = ORDERED_DAYS?.map((day) => ({
    day,
    is_open: hoursMap[day]?.is_open ?? false,
    open_time: hoursMap[day]?.open_time ?? null,
    close_time: hoursMap[day]?.close_time ?? null,
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
        const isToday = day === today;
        return (
          <div
            key={day}
            className={`flex items-center justify-between py-1 text-xs ${isToday ? "font-semibold" : "font-normal"}`}
          >
            <span className="flex items-center gap-1.5 min-w-[95px]">
              {isToday
                ? <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0" />
                : <span className="inline-block w-1.5 h-1.5 flex-shrink-0" />
              }
              <span className={isToday ? "text-green-700" : "text-gray-800"}>{day}</span>
            </span>
            <span className={
              isToday && is_open
                ? "text-green-700 font-semibold"
                : !is_open
                  ? "text-red-500"
                  : "text-gray-700"
            }>
              {is_open ? `${formatTime(open_time)} – ${formatTime(close_time)}` : "Closed"}
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
          onClick={() => setIsOpen((p) => !p)}
          className="flex items-center gap-1.5 text-sm w-full text-left"
        >
          <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="font-medium text-black">Business Hours:</span>
          <span className={`text-xs ml-1 ${isOpenToday ? "text-green-700" : "text-red-500"}`}>
            {isOpenToday
              ? `Open`
              : "Closed Today"}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-gray-400 ml-auto transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && (
          <div className="mt-1 bg-white  rounded-md border border-gray-200 ">
            <HoursList />
          </div>
        )}
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
      <div className={`flex items-center gap-1.5 text-sm cursor-pointer py-1 rounded transition-colors ${isOpen ? "bg-white text-black" : "hover:bg-white hover:text-black"}`}>
        <Clock className={`w-4 h-4 text-gray-500 flex-shrink-0 ${isOpen ? "hidden" : ""}`} />
        <span className={`font-medium ${isOpen ? "ml-5" : ""} text-black `}>Business Hours:</span>
        <span className={`text-xs ml-0.5 ${isOpenToday ? "text-green-700" : "text-red-500"}`}>
          {isOpenToday
            ? `Open`
            : "Closed Today"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-900 mr-5 ml-auto transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
    </div>
  );
};

export default BusinessHours;