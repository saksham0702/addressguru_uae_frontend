import React, { useState } from "react";
import { Clock, X } from "lucide-react";

const BusinessHours = ({ openingHours, mobile }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Get current day
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  // Find today's hours
  const todayHours = openingHours?.find((hour) => hour.day === today);

  // Format time from 24hr to 12hr
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hr = parseInt(hours);
    const ampm = hr >= 12 ? "PM" : "AM";
    const displayHr = hr % 12 || 12;
    return `${displayHr}:${minutes} ${ampm}`;
  };

  // Get display text for one-line view
  const getDisplayText = () => {
    if (!todayHours) return "Closed Today";
    if (!todayHours.is_open) return "Closed Today";
    return `${formatTime(todayHours.open_time)} - ${formatTime(
      todayHours.close_time
    )}`;
  };

  // Mobile view
  if (mobile) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 text-sm text-gray-900 hover:text-gray-800"
        >
          <Clock className="w-4 h-4" />
          Business Hours : 
          <span>{getDisplayText()}</span>
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-lg">Business Hours</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-600 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                {openingHours.map((hour) => {
                  const isToday = hour.day === today;
                  return (
                    <div
                      key={hour.day}
                      className={`flex justify-between py-2 ${
                        isToday ? "font-semibold text-blue-600" : ""
                      }`}
                    >
                      <span>{hour.day}</span>
                      <span>
                        {hour.is_open
                          ? `${formatTime(hour.open_time)} - ${formatTime(
                              hour.close_time
                            )}`
                          : "Closed"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop view
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 cursor-pointer">
        <Clock className="w-5 h-5" />
        <span className="font-medium">Business Hours:</span>
        <span className="text-gray-600">{getDisplayText()}</span>
      </div>

      {isHovered && (
        <div
          className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[250px] z-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="space-y-2">
            {openingHours.map((hour) => {
              const isToday = hour.day === today;
              return (
                <div
                  key={hour.day}
                  className={`flex justify-between ${
                    isToday ? "font-semibold text-blue-600" : ""
                  }`}
                >
                  <span>{hour.day}</span>
                  <span className="">
                    {hour.is_open
                      ? `${formatTime(hour.open_time)} - ${formatTime(
                          hour.close_time
                        )}`
                      : "Closed"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessHours;


