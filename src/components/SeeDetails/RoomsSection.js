import React, { useState } from "react";

const RoomsSection = ({ category = "hotel", data,enquirePop,setEnquirePop}) => {
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  const BASE_URL = "https://addressguru.ae/api/";

  const config = {
    hotel: {
      dateLabel: "Select check-in date",
      priceSuffix: "Per night",
      getBadge1: (room) => room.roomType,
      getBadge2: (room) => `${room.capacity} guests`,
    },
    hostel: {
      dateLabel: "Select arrival date",
      priceSuffix: "Per night",
      getBadge1: (room) => room.roomType,
      getBadge2: (room) => `${room.capacity} beds`,
    },
    "yoga studio": {
      dateLabel: "Select arrival date",
      priceSuffix: data?.daysNights ?? "3 Days | 2 Nights",
      getBadge1: (room) => room.roomType,
      getBadge2: (room) => `Batch: ${room.capacity}`,
    },
  };

  const cfg = config[category?.toLowerCase()] ?? config["hotel"];

  const openViewer = (images, index) => {
    setViewerImages(images);
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <div className="w-full">
      {/* Image Viewer Modal */}
      {viewerOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex flex-col items-center justify-center gap-4 p-4"
          onClick={() => setViewerOpen(false)}
        >
          <button
            className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-800 font-bold text-lg"
            onClick={() => setViewerOpen(false)}
          >
            ×
          </button>

          <img
            src={`${BASE_URL}${viewerImages[viewerIndex]}`}
            alt="Room"
            className="max-h-[65vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Thumbnail strip */}
          <div
            className="flex gap-2 flex-wrap justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {viewerImages.map((img, i) => (
              <div
                key={i}
                onClick={() => setViewerIndex(i)}
                className={`w-16 h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  i === viewerIndex ? "border-orange-500" : "border-transparent"
                }`}
              >
                <img
                  src={`${BASE_URL}${img}`}
                  alt={`Room ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#1a1a1a] rounded-t-xl px-4 py-3 text-center text-white text-[15px] font-semibold">
        Check your booking today!
      </div>

      <div className="border border-t-0 border-gray-200 rounded-b-xl p-4 bg-white">
        {/* Starting from */}
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Starting from</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-semibold text-gray-900">
              AED {data?.startingFrom?.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              {cfg.priceSuffix}
            </span>
          </div>

          {/* Hotel / Hostel meta */}
          {(category?.toLowerCase() === "hotel" ||
            category?.toLowerCase() === "hostel") && (
            <div className="flex gap-2 items-center">
              {data?.checkIn && (
                <p className="text-sm font-semibold text-gray-900">
                  Check-in —{" "}
                  <span className="text-gray-600 font-normal">
                    {data.checkIn}
                  </span>
                </p>
              )}
              {" | "}
              {data?.checkOut && (
                <p className="text-sm font-semibold text-gray-900">
                  Check-out —{" "}
                  <span className="text-gray-600 font-normal">
                    {data.checkOut}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Yoga Studio meta */}
          {category?.toLowerCase() === "yoga studio" && (
            <>
              {data?.batchSize && (
                <p className="text-sm text-gray-500">
                  Batch size —{" "}
                  <span className="text-gray-800 font-semibold">
                    {data.batchSize}
                  </span>
                </p>
              )}
              {data?.language && (
                <p className="text-sm text-gray-500">
                  Language —{" "}
                  <span className="text-gray-800 font-semibold">
                    {data.language}
                  </span>
                </p>
              )}
            </>
          )}
        </div>

        {/* Room cards */}
        <p className="text-sm font-semibold text-orange-500 mb-2">
          Select room type
        </p>
        <div className="flex flex-col gap-2.5 mb-4">
          {data?.rooms?.map((room, i) => (
            <div
              key={i}
              onClick={() => setSelectedRoom(i)}
              className={`border rounded-xl p-3 cursor-pointer transition-all ${
                i === selectedRoom
                  ? "border-orange-500 border-[1.5px]"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center text-[10px] flex-shrink-0 ${
                      i === selectedRoom
                        ? "bg-orange-500 border-orange-500 text-white"
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
                  AED {room.price?.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex gap-1.5 mt-2 ml-6">
                <span className="text-[11px] font-semibold bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">
                  {cfg.getBadge1(room)}
                </span>
                <span className="text-[11px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {cfg.getBadge2(room)}
                </span>
              </div>

              {/* Thumbnails */}
              {/* {room.images?.length > 0 && (
                <div className="flex gap-1.5 mt-2.5 ml-6">
                  {room.images.slice(0, 3).map((img, imgIdx) => (
                    <div
                      key={imgIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        openViewer(room.images, imgIdx);
                      }}
                      className="w-14 h-10 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-orange-400 transition-all flex-shrink-0"
                    >
                      <img
                        src={`${BASE_URL}${img}`}
                        alt={`Room ${imgIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {room.images.length > 3 && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        openViewer(room.images, 3);
                      }}
                      className="w-14 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 cursor-pointer hover:bg-orange-50 hover:text-orange-600 transition-all flex-shrink-0"
                    >
                      +{room.images.length - 3}
                    </div>
                  )}
                </div>
              )} */}

              <div className="flex gap-2 mt-2.5">
                {room.images?.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openViewer(room.images, 0);
                    }}
                    className="flex-1 text-xs border border-gray-200 py-2 max-w-40 hover:bg-orange-50 hover:text-orange-600 rounded-lg text-gray-700 font-semibold transition"
                  >
                    View images
                  </button>
                )}
                {/* <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 text-xs bg-orange-500 text-white rounded-lg py-1.5 font-semibold hover:bg-orange-600 transition"
                >
                  Enquire now
                </button> */}
              </div>
            </div>
          ))}
        </div>

        <hr className="border-gray-100 mb-4" />

        <button onClick={() => setEnquirePop(true)} className="w-full py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 rounded-lg text-[15px] font-semibold transition mb-2">
         Enquire Now
        </button>
      </div>
    </div>
  );
};

export default RoomsSection;
