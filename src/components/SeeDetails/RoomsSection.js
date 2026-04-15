import React, { useState } from "react";

// The component figures out labels/badges based on category
const RoomsSection = ({ category = "Yoga Studio", data }) => {
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);

  // Category-specific field labels
  const config = {
    "Yoga Studio" : {
      dateLabel: "Select arrival date",
      capacityLabel: "Batch size",
      priceSuffix: data?.daysNights ?? "3 Days | 2 Nights",
      getBadge1: (room) => room.roomType, // "Shared" | "Private"
      getBadge2: (room) => `Batch: ${room.capacity}`,
    },
    hotel: {
      dateLabel: "Select check-in date",
      capacityLabel: "Max guests",
      priceSuffix: "Per night",
      getBadge1: (room) => room.roomType, // "Standard" | "Deluxe" | "Luxury"
      getBadge2: (room) => `${room.capacity} guests`,
    },
    hostel: {
      dateLabel: "Select arrival date",
      capacityLabel: "Beds",
      priceSuffix: "Per night",
      getBadge1: (room) => room.roomType, // "Shared" | "Private"
      getBadge2: (room) => `${room.capacity} beds`,
    },
  };

  const cfg = config[category];

  return (
    <div className="w-full">
      <div className="bg-[#1a1a1a] rounded-t-xl px-4 py-3 text-center text-white text-[15px] font-semibold">
        Check your booking today!
      </div>

      <div className="border border-t-0 border-gray-200 rounded-b-xl p-4 bg-white">
        {/* Starting from */}
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Starting from</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-semibold text-gray-900">
              ₹ {data?.startingFrom?.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-semibold text-[#e07b20] bg-orange-50 px-2 py-0.5 rounded-full">
              {cfg.priceSuffix}
            </span>
          </div>

          {/* Meta fields differ per category */}
          {category === "yoga studio" && (
            <>
              <p className="text-sm text-gray-500">
                Batch size —{" "}
                <span className="text-gray-800 font-semibold">
                  {data?.batchSize}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Language —{" "}
                <span className="text-gray-800 font-semibold">
                  {data?.language}
                </span>
              </p>
            </>
          )}
          {(category === "hotel" || category === "hostel") && (
            <>
              <p className="text-sm text-gray-500">
                Check-in —{" "}
                <span className="text-gray-800 font-semibold">
                  {data?.checkIn}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Check-out —{" "}
                <span className="text-gray-800 font-semibold">
                  {data?.checkOut}
                </span>
              </p>
            </>
          )}
        </div>

        {/* Date selector */}
        <p className="text-sm font-semibold text-[#e07b20] mb-1.5">
          {cfg.dateLabel}
        </p>
        <select
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white mb-4 focus:outline-none focus:ring-1 focus:ring-orange-300"
          value={selectedDate}
          onChange={(e) => setSelectedDate(Number(e.target.value))}
        >
          {data?.availableDates?.map((d, i) => (
            <option key={i} value={i}>
              {d}
            </option>
          ))}
        </select>

        {/* Room cards */}
        <div className="flex flex-col gap-2.5 mb-4">
          {data?.rooms?.map((room, i) => (
            <div
              key={i}
              onClick={() => setSelectedRoom(i)}
              className={`border rounded-xl p-3 cursor-pointer transition-all ${
                i === selectedRoom
                  ? "border-[#e07b20] border-[1.5px]"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center text-[10px] flex-shrink-0 ${
                      i === selectedRoom
                        ? "bg-[#e07b20] border-[#e07b20] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {i === selectedRoom && "✓"}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {room.name}
                  </span>
                </div>
                <span className="text-[15px] font-semibold text-gray-900 whitespace-nowrap">
                  ₹ {room.price?.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex gap-1.5 mt-2 ml-6">
                <span className="text-[11px] font-semibold bg-orange-50 text-[#b55e10] px-2 py-0.5 rounded-full">
                  {cfg.getBadge1(room)}
                </span>
                <span className="text-[11px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {cfg.getBadge2(room)}
                </span>
              </div>

              <div className="flex gap-2 mt-2.5">
                <button className="flex-1 text-xs border border-gray-200 rounded-lg py-1.5 text-gray-700 font-semibold hover:bg-gray-50 transition">
                  View images
                </button>
                <button className="flex-1 text-xs bg-[#e07b20] text-white rounded-lg py-1.5 font-semibold hover:bg-[#c96d18] transition">
                  Enquiry now
                </button>
              </div>
            </div>
          ))}
        </div>

        <hr className="border-gray-100 mb-4" />

        <button className="w-full py-3 bg-[#e07b20] text-white rounded-lg text-[15px] font-semibold hover:bg-[#c96d18] transition mb-2">
          Book now
        </button>
        <button className="w-full py-2.5 border-[1.5px] border-[#e07b20] text-[#e07b20] rounded-lg text-sm font-semibold hover:bg-orange-50 transition">
          Need more info
        </button>
      </div>
    </div>
  );
};

export default RoomsSection;
