import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  ToggleLeft,
  ToggleRight,
  Plus,
  ChevronDown,
} from "lucide-react";
import {
  get_rooms_by_listing,
  create_room,
  update_room,
  delete_room,
  toggle_room_status,
} from "@/api/rooms";

const ROOM_SUPPORTED_CATEGORIES = ["Hotel", "Hostel", "Yoga Studio"];

const stepToPercent = (step) => {
  const map = { 1: 17, 2: 33, 3: 50, 4: 67, 5: 83, 6: 100 };
  return map[step] ?? 0;
};

const stepLabel = (step) => {
  const map = {
    1: "Business Info",
    2: "Social Links",
    3: "Contact Details",
    4: "SEO",
    5: "Media",
    6: "Plan & Published",
  };
  return map[step] ?? "Incomplete";
};

const CircularProgress = ({ percentage }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 83) return "#16a34a";
    if (percentage >= 50) return "#ea580c";
    return "#ef4444";
  };

  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 50 50">
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
          stroke={getColor()}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-in-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold text-gray-700 leading-tight">
          {percentage}%
        </span>
        <span className="text-[8px] text-gray-400 leading-tight">done</span>
      </div>
    </div>
  );
};

const ROOM_TYPE_OPTIONS = {
  Hotel: ["Standard", "Deluxe", "Luxury"],
  Hostel: ["Shared", "Private"],
  "Yoga Studio": ["Shared", "Private"],
};

// ─── Time Picker ──────────────────────────────────────────────────────────────
const HOURS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);
const MINUTES = ["00", "15", "30", "45"];
const PERIODS = ["AM", "PM"];

const parseTime = (val) => {
  if (!val) return { hour: "12", minute: "00", period: "PM" };
  const match = val.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return { hour: "12", minute: "00", period: "PM" };
  return {
    hour: match[1].padStart(2, "0"),
    minute: match[2],
    period: match[3].toUpperCase(),
  };
};

const formatTime = (hour, minute, period) => `${hour}:${minute} ${period}`;

const TimePicker = ({ value, onChange }) => {
  const parsed = parseTime(value);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState(parsed.period);

  const update = (h, m, p) => onChange(formatTime(h, m, p));

  const sel =
    "border border-gray-200 rounded-lg px-2 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-300 bg-white cursor-pointer appearance-none text-center";

  return (
    <div className="flex items-center gap-1">
      <select
        value={hour}
        onChange={(e) => {
          setHour(e.target.value);
          update(e.target.value, minute, period);
        }}
        className={`${sel} w-14`}
      >
        {HOURS.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="text-gray-400 font-bold text-sm">:</span>
      <select
        value={minute}
        onChange={(e) => {
          setMinute(e.target.value);
          update(hour, e.target.value, period);
        }}
        className={`${sel} w-14`}
      >
        {MINUTES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <select
        value={period}
        onChange={(e) => {
          setPeriod(e.target.value);
          update(hour, minute, e.target.value);
        }}
        className={`${sel} w-16`}
      >
        {PERIODS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );
};

// ─── Inline Room Form ─────────────────────────────────────────────────────────
const RoomFormInline = ({
  categoryType,
  listingId,
  initialData,
  onSuccess,
  onCancel,
}) => {
  const isEdit = !!initialData?._id;

  // Helper to safely extract checkIn/checkOut from nested hotel/hostel fields
  const getCheckIn = (data) =>
    data?.checkIn ??
    data?.hotel?.checkIn ??
    data?.hostel?.checkIn ??
    "12:00 PM";
  const getCheckOut = (data) =>
    data?.checkOut ??
    data?.hotel?.checkOut ??
    data?.hostel?.checkOut ??
    "11:00 AM";

  const [form, setForm] = useState({
    roomType: initialData?.roomType ?? "",
    price: initialData?.price ?? "",
    capacity: initialData?.capacity ?? "",
    isActive: initialData?.isActive ?? true,
    checkIn: getCheckIn(initialData),
    checkOut: getCheckOut(initialData),
    batchSize: initialData?.yoga?.batchSize ?? initialData?.batchSize ?? "",
    language: initialData?.yoga?.language ?? initialData?.language ?? "",
    daysNights: initialData?.yoga?.daysNights ?? initialData?.daysNights ?? "",
    mealsIncluded:
      initialData?.yoga?.mealsIncluded ?? initialData?.mealsIncluded ?? false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) =>
    setForm((p) => ({
      ...p,
      [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const setTimeField = (field) => (val) =>
    setForm((p) => ({ ...p, [field]: val }));

  const handleSubmit = async () => {
    setError("");
    if (!form.roomType || !form.price || !form.capacity) {
      setError("Room type, price, and capacity are required.");
      return;
    }

    const payload = {
      listingId,
      roomType: form.roomType,
      price: Number(form.price),
      capacity: Number(form.capacity),
      isActive: form.isActive,
    };

    if (categoryType === "Hotel" || categoryType === "Hostel") {
      payload.checkIn = form.checkIn || null;
      payload.checkOut = form.checkOut || null;
    }

    if (categoryType === "Yoga Studio") {
      payload.batchSize = form.batchSize ? Number(form.batchSize) : null;
      payload.language = form.language || null;
      payload.daysNights = form.daysNights || null;
      payload.mealsIncluded = form.mealsIncluded;
    }

    setLoading(true);
    const res = isEdit
      ? await update_room(initialData._id, payload)
      : await create_room(payload);
    setLoading(false);

    if (res?.success) {
      // Normalize: backend may return the room in res.data or res.data.room
      const roomData = res.data?.room ?? res.data;
      onSuccess?.(roomData);
    } else {
      setError(res?.message ?? "Something went wrong.");
    }
  };

  const inp =
    "border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-300 w-full";
  const lbl = "text-xs font-semibold text-gray-600 mb-0.5 block";

  return (
    <div className="mt-3 border border-orange-100 bg-orange-50/40 rounded-xl p-4">
      <p className="text-xs font-bold text-[#e07b20] uppercase tracking-wider mb-3">
        {isEdit ? "Edit Room" : "New Room"} — {categoryType}
      </p>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Room Type */}
        <div>
          <label className={lbl}>Room Type *</label>
          <select
            value={form.roomType}
            onChange={set("roomType")}
            className={inp}
          >
            <option value="">Select</option>
            {(ROOM_TYPE_OPTIONS[categoryType] ?? []).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className={lbl}>Price (AED) *</label>
          <input
            type="number"
            value={form.price}
            onChange={set("price")}
            placeholder="e.g. 2500"
            className={inp}
          />
        </div>

        {/* Capacity */}
        <div>
          <label className={lbl}>Capacity *</label>
          <input
            type="number"
            value={form.capacity}
            onChange={set("capacity")}
            placeholder="e.g. 2"
            className={inp}
          />
        </div>

        {/* Hotel / Hostel: Time Pickers */}
        {(categoryType === "Hotel" || categoryType === "Hostel") && (
          <>
            <div className="col-span-2 sm:col-span-1">
              <label className={lbl}>Check-in Time</label>
              <TimePicker
                value={form.checkIn}
                onChange={setTimeField("checkIn")}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className={lbl}>Check-out Time</label>
              <TimePicker
                value={form.checkOut}
                onChange={setTimeField("checkOut")}
              />
            </div>
          </>
        )}

        {/* Yoga extras */}
        {categoryType === "Yoga Studio" && (
          <>
            <div>
              <label className={lbl}>Batch Size</label>
              <input
                type="number"
                value={form.batchSize}
                onChange={set("batchSize")}
                placeholder="e.g. 10"
                className={inp}
              />
            </div>
            <div>
              <label className={lbl}>Language</label>
              <input
                type="text"
                value={form.language}
                onChange={set("language")}
                placeholder="English"
                className={inp}
              />
            </div>
            <div>
              <label className={lbl}>Duration</label>
              <input
                type="text"
                value={form.daysNights}
                onChange={set("daysNights")}
                placeholder="3 Days | 2 Nights"
                className={inp}
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id={`meals-${listingId}`}
                checked={form.mealsIncluded}
                onChange={set("mealsIncluded")}
                className="accent-[#e07b20]"
              />
              <label
                htmlFor={`meals-${listingId}`}
                className="text-xs text-gray-700 cursor-pointer"
              >
                Meals included
              </label>
            </div>
          </>
        )}
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-2 mt-3">
        <input
          type="checkbox"
          id={`active-${listingId}`}
          checked={form.isActive}
          onChange={set("isActive")}
          className="accent-[#e07b20]"
        />
        <label
          htmlFor={`active-${listingId}`}
          className="text-xs text-gray-600 cursor-pointer"
        >
          Visible to users
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-2 max-w-40 mt-4">
        <button
          onClick={onCancel}
          className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 transition"
        >
          Close
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-2 bg-[#e07b20] text-white rounded-lg text-xs font-semibold hover:bg-[#c96d18] transition disabled:opacity-60"
        >
          {loading ? "Saving..." : isEdit ? "Update Room" : "Add Room"}
        </button>
      </div>
    </div>
  );
};

// ─── Room Card ────────────────────────────────────────────────────────────────
const RoomCard = ({ room, categoryType, listingId, onUpdated, onDeleted }) => {
  const [editing, setEditing] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    const res = await toggle_room_status(room._id);
    setToggling(false);

    if (res?.success) {
      // Normalize: backend may return full room or just { isActive }
      const roomData = res.data?.room ?? res.data;
      if (roomData && typeof roomData === "object" && roomData._id) {
        // Full room object returned — use it directly
        onUpdated?.(roomData);
      } else {
        // Only partial data returned — merge with existing room
        onUpdated?.({
          ...room,
          isActive: roomData?.isActive ?? !room.isActive,
        });
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this room?")) return;
    setDeleting(true);
    const res = await delete_room(room._id);
    setDeleting(false);

    if (res?.success) {
      onDeleted?.(room._id);
    }
  };

  const handleUpdateSuccess = (updatedRoom) => {
    // Merge in case backend returns partial data
    const merged = { ...room, ...updatedRoom };
    onUpdated?.(merged);
    setEditing(false);
  };

  return (
    <div
      className={`rounded-lg border px-3 py-2.5 text-sm transition-all ${
        room.isActive
          ? "border-gray-200 bg-white"
          : "border-dashed border-gray-300 bg-gray-50 opacity-70"
      }`}
    >
      {editing ? (
        <RoomFormInline
          categoryType={categoryType}
          listingId={listingId}
          initialData={room}
          onSuccess={handleUpdateSuccess}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[11px] font-semibold bg-orange-50 text-[#b55e10] px-2 py-0.5 rounded-full whitespace-nowrap">
              {room.roomType}
            </span>
            <span className="text-gray-900 font-semibold text-sm whitespace-nowrap">
              ₹ {room.price?.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-gray-400 whitespace-nowrap">
              · {room.capacity}{" "}
              {categoryType === "Yoga Studio" ? "seats" : "guests"}
            </span>
            {/* Check-in/out times — support both flat and nested response shapes */}
            {(categoryType === "Hotel" || categoryType === "Hostel") &&
              (room.checkIn || room.hotel?.checkIn || room.hostel?.checkIn) && (
                <span className="text-[11px] text-gray-400 whitespace-nowrap hidden sm:inline">
                  · in{" "}
                  {room.checkIn ?? room.hotel?.checkIn ?? room.hostel?.checkIn}{" "}
                  / out{" "}
                  {room.checkOut ??
                    room.hotel?.checkOut ??
                    room.hostel?.checkOut}
                </span>
              )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Toggle */}
            <button
              onClick={handleToggle}
              disabled={toggling}
              title={room.isActive ? "Deactivate" : "Activate"}
              className="text-gray-400 hover:text-orange-500 transition disabled:opacity-50"
            >
              {room.isActive ? (
                <ToggleRight size={18} className="text-green-500" />
              ) : (
                <ToggleLeft size={18} />
              )}
            </button>

            {/* Edit */}
            <button
              onClick={() => setEditing(true)}
              title="Edit"
              className="text-gray-400 hover:text-blue-500 transition"
            >
              <svg
                width="14"
                height="14"
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
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Delete"
              className="text-gray-400 hover:text-red-500 transition disabled:opacity-50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Rooms Panel ──────────────────────────────────────────────────────────────
const RoomsPanel = ({ listing }) => {
  const categoryType = listing?.category?.name;
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchRooms = async () => {
    setLoadingRooms(true);
    const res = await get_rooms_by_listing(listing._id ?? listing.id);
    setLoadingRooms(false);
    setFetched(true);
    console.log("rooms",res)

    if (res?.status) {
      // Normalize: backend may return rooms in res.data.rooms or res.data directly
  const roomList = res?.data?.rooms ?? [];
      setRooms(roomList);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAdded = (newRoom) => {
    setRooms((prev) => [...prev, newRoom]);
    setShowAddForm(false);
  };

  const handleUpdated = (updated) => {
    setRooms((prev) =>
      prev.map((r) => (r._id === updated._id ? { ...r, ...updated } : r)),
    );
  };

  const handleDeleted = (roomId) => {
    setRooms((prev) => prev.filter((r) => r._id !== roomId));
  };

  const canAddMore = rooms.length < 4;

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Rooms
          <span className="ml-1.5 text-gray-400 font-normal">
            ({rooms.length}/4)
          </span>
        </p>
        {canAddMore && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 text-xs font-semibold text-[#e07b20] hover:text-[#c96d18] transition"
          >
            <Plus size={13} /> Add Room
          </button>
        )}
        {!canAddMore && (
          <span className="text-[10px] text-gray-400 italic">
            Max 4 rooms reached
          </span>
        )}
      </div>

      {loadingRooms && (
        <p className="text-xs text-gray-400 py-2">Loading rooms…</p>
      )}

      {!loadingRooms && fetched && rooms.length === 0 && !showAddForm && (
        <p className="text-xs text-gray-400 italic py-1">No rooms added yet.</p>
      )}

      <div className="flex flex-col gap-2">
        {rooms.map((room) => (
          <RoomCard
            key={room._id}
            room={room}
            categoryType={categoryType}
            listingId={listing._id ?? listing.id}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
        ))}
      </div>

      {showAddForm && (
        <RoomFormInline
          categoryType={categoryType}
          listingId={listing._id ?? listing.id}
          onSuccess={handleAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

// ─── Main MyListings ──────────────────────────────────────────────────────────
const MyListings = ({ data, APP_URL }) => {
  const [expandedRooms, setExpandedRooms] = useState({});
  const toggleRooms = (id) =>
    setExpandedRooms((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="bg-white shadow-sm border w-full max-md:w-[98%] max-md:mx-auto rounded-md border-gray-200">
      <div className="px-6 py-4 border-b bg-[#FFF8F3] border-gray-200">
        <h2 className="font-semibold text-gray-900">MY LISTINGS</h2>
      </div>

      <div className="md:p-4 p-2 space-y-4">
        {data?.map((listing) => {
          const categoryName = listing?.category?.name;
          const supportsRooms =
            ROOM_SUPPORTED_CATEGORIES.includes(categoryName);
          const percent = stepToPercent(listing?.stepCompleted ?? 1);
          const listingId = listing._id ?? listing.id;
          const isRoomOpen = expandedRooms[listingId];

          return (
            <div
              key={listingId}
              className="border border-gray-200 rounded-lg md:p-4 p-2.5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between gap-4">
                <div className="flex md:gap-4 gap-2 min-w-0 flex-1">
                  <Link
                    href={`/dashboard/listing-details/${listing?.slug}`}
                    className="w-20 h-20 max-md:w-13 max-md:h-13 flex-shrink-0"
                  >
                    <Image
                      width={500}
                      height={500}
                      src={`${APP_URL}/${listing?.logo}`}
                      alt={listing?.businessName?.slice(0, 12)}
                      className="w-full h-full rounded-lg object-cover border border-gray-100"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-base max-md:text-sm text-gray-900 line-clamp-1 leading-5">
                      {listing?.businessName}
                    </p>
                    <p
                      className="text-xs text-gray-500 truncate max-w-[220px] md:max-w-[340px] cursor-default"
                      title={listing?.businessAddress}
                    >
                      {listing?.businessAddress}
                    </p>
                    {categoryName && (
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-orange-50 text-[#b55e10] px-2 py-0.5 rounded-full">
                        {categoryName}
                      </span>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">
                      Step {listing?.stepCompleted ?? 1}/6 —{" "}
                      {stepLabel(listing?.stepCompleted ?? 1)}
                    </p>

                    <div className="flex mt-1 items-center md:hidden gap-3">
                      <span className="text-xs text-gray-600">
                        Status —{" "}
                        <span className="font-semibold">published</span>
                      </span>
                      {listing?.upgrade === "Paid" && (
                        <span className="flex items-center gap-1 text-xs text-green-700 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                          Paid
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 whitespace-nowrap max-md:mt-1 mt-2 flex-wrap">
                      <Link
                        href={`/dashboard/listing-forms?category=${listing?.category?._id}&categoryName=${encodeURIComponent(categoryName ?? "")}&name=${encodeURIComponent(listing?.slug)}`}
                        className="inline-flex items-center gap-1.5 px-3 max-md:px-2 py-1.5 max-md:text-[10px] max-md:border max-md:border-blue-500 max-md:text-blue-500 md:bg-blue-600 md:hover:bg-blue-700 md:text-white text-xs font-semibold rounded-sm transition-colors"
                      >
                        <svg
                          className="max-md:text-blue-500 md:text-white"
                          width="15"
                          height="15"
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
                        EDIT
                      </Link>

                      <Link
                        href={{
                          pathname: `/${listing?.slug}`,
                          query: { preview: true },
                        }}
                        className="inline-flex items-center gap-1.5 px-3 max-md:px-2 py-1.5 max-md:text-[10px] uppercase text-orange-600 border border-orange-600 text-xs font-semibold rounded-sm transition-colors hover:bg-orange-50"
                      >
                        Preview
                      </Link>

                      {supportsRooms && (
                        <button
                          onClick={() => toggleRooms(listingId)}
                          className="inline-flex items-center gap-1.5 px-3 max-md:px-2 py-1.5 max-md:text-[10px] uppercase text-white bg-[#e07b20] hover:bg-[#c96d18] text-xs font-semibold rounded-sm transition-colors"
                        >
                          Rooms
                          <ChevronDown
                            size={12}
                            className={`transition-transform duration-200 ${isRoomOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="max-md:hidden flex flex-col items-center">
                    {listing?.upgrade === "Paid" && (
                      <span className="flex items-center gap-1 text-xs text-green-700 font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                        Paid
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <CircularProgress percentage={percent} />
                    <span className="text-[9px] text-gray-400 mt-0.5 text-center leading-tight max-w-[56px]">
                      Profile
                    </span>
                  </div>
                </div>
              </div>

              {supportsRooms && isRoomOpen && <RoomsPanel listing={listing} />}
            </div>
          );
        })}
      </div>

      {(!data || data.length === 0) && (
        <div className="p-12 text-center text-gray-500">
          <p>No listings found. Create your first listing to get started.</p>
        </div>
      )}
    </div>
  );
};

export default MyListings;
