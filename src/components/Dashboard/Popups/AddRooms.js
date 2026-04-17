// components/RoomForm.jsx
// Business-owner form to add / edit a room.
// categoryType is passed in from the parent (already known from the listing).

import React, { useState, useEffect } from "react";

const YOGA_LEVELS = ["Beginner", "Intermediate", "Advanced", "All levels"];

const defaultCommon = {
  name: "",
  roomType: "",
  price: "",
  capacity: "",
  availableDates: "",   // comma-separated string; split before submit
  images: [],
  isActive: true,
};

const defaultHotel = {
  checkIn: "",
  checkOut: "",
  amenities: "",        // comma-separated
  bedType: "",
  floorNumber: "",
};

const defaultHostel = {
  checkIn: "",
  checkOut: "",
  amenities: "",
  lockerAvailable: false,
  bathroomType: "",
};

const defaultYoga = {
  batchSize: "",
  language: "",
  daysNights: "",
  instructorName: "",
  yogaStyle: "",
  level: "",
  mealsIncluded: false,
};

export default function RoomForm({
  categoryType = "hotel",   // "hotel" | "hostel" | "Yoga Studio"
  listingId,
  initialData,    // pass when editing an existing room
  onSuccess,
  onCancel,
}) {
  const isEdit = !!initialData?._id;

  const [common, setCommon] = useState({ ...defaultCommon });
  const [hotel, setHotel] = useState({ ...defaultHotel });
  const [hostel, setHostel] = useState({ ...defaultHostel });
  const [yoga, setYoga] = useState({ ...defaultYoga });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (!initialData) return;
    const d = initialData;

    setCommon({
      name: d.name ?? "",
      roomType: d.roomType ?? "",
      price: d.price ?? "",
      capacity: d.capacity ?? "",
      availableDates: (d.availableDates ?? []).join(", "),
      images: d.images ?? [],
      isActive: d.isActive ?? true,
    });

    if (categoryType === "hotel") {
      setHotel({
        checkIn: d.hotel?.checkIn ?? "",
        checkOut: d.hotel?.checkOut ?? "",
        amenities: (d.hotel?.amenities ?? []).join(", "),
        bedType: d.hotel?.bedType ?? "",
        floorNumber: d.hotel?.floorNumber ?? "",
      });
    } else if (categoryType === "hostel") {
      setHostel({
        checkIn: d.hostel?.checkIn ?? "",
        checkOut: d.hostel?.checkOut ?? "",
        amenities: (d.hostel?.amenities ?? []).join(", "),
        lockerAvailable: d.hostel?.lockerAvailable ?? false,
        bathroomType: d.hostel?.bathroomType ?? "",
      });
    } else if (categoryType === "Yoga Studio") {
      setYoga({
        batchSize: d.yoga?.batchSize ?? "",
        language: d.yoga?.language ?? "",
        daysNights: d.yoga?.daysNights ?? "",
        instructorName: d.yoga?.instructorName ?? "",
        yogaStyle: d.yoga?.yogaStyle ?? "",
        level: d.yoga?.level ?? "",
        mealsIncluded: d.yoga?.mealsIncluded ?? false,
      });
    }
  }, [initialData, categoryType]);

  // ── helpers ────────────────────────────────────────────────────────────────
  const setC = (field) => (e) =>
    setCommon((p) => ({ ...p, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const setH = (field) => (e) =>
    setHotel((p) => ({ ...p, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const setHo = (field) => (e) =>
    setHostel((p) => ({ ...p, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const setY = (field) => (e) =>
    setYoga((p) => ({ ...p, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const splitCSV = (str) =>
    str.split(",").map((s) => s.trim()).filter(Boolean);

  // ── submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError("");
    if (!common.name || !common.roomType || !common.price || !common.capacity) {
      setError("Name, room type, price, and capacity are required.");
      return;
    }

    const payload = {
      listingId,
      name: common.name,
      roomType: common.roomType,
      price: Number(common.price),
      capacity: Number(common.capacity),
      availableDates: splitCSV(common.availableDates),
      images: common.images,
      isActive: common.isActive,
    };

    if (categoryType === "hotel") {
      Object.assign(payload, {
        checkIn: hotel.checkIn,
        checkOut: hotel.checkOut,
        amenities: splitCSV(hotel.amenities),
        bedType: hotel.bedType,
        floorNumber: hotel.floorNumber ? Number(hotel.floorNumber) : null,
      });
    } else if (categoryType === "hostel") {
      Object.assign(payload, {
        checkIn: hostel.checkIn,
        checkOut: hostel.checkOut,
        amenities: splitCSV(hostel.amenities),
        lockerAvailable: hostel.lockerAvailable,
        bathroomType: hostel.bathroomType,
      });
    } else if (categoryType === "Yoga Studio") {
      Object.assign(payload, {
        batchSize: yoga.batchSize ? Number(yoga.batchSize) : null,
        language: yoga.language,
        daysNights: yoga.daysNights,
        instructorName: yoga.instructorName,
        yogaStyle: yoga.yogaStyle,
        level: yoga.level,
        mealsIncluded: yoga.mealsIncluded,
      });
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // adjust to your auth storage
      const url = isEdit
        ? `/api/rooms/${initialData._id}`
        : "/api/rooms";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Something went wrong.");
      onSuccess?.(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── shared input helpers ───────────────────────────────────────────────────
  const Input = ({ label, value, onChange, type = "text", placeholder }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-300"
      />
    </div>
  );

  const Checkbox = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-[#e07b20]"
      />
      {label}
    </label>
  );

  const Section = ({ title, children }) => (
    <div className="mt-4">
      <p className="text-xs font-bold text-[#e07b20] uppercase tracking-wider mb-2">
        {title}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );

  // ── room type options per category ────────────────────────────────────────
  const roomTypeOptions = {
    hotel: ["Standard", "Deluxe", "Luxury"],
    hostel: ["Shared", "Private"],
    "Yoga Studio": ["Shared", "Private"],
  }[categoryType] ?? [];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-[#1a1a1a] rounded-t-xl px-4 py-3 text-center text-white text-[15px] font-semibold -mx-5 -mt-5 mb-5 rounded-t-xl">
        {isEdit ? "Edit Room" : "Add New Room"} —{" "}
        <span className="text-[#e07b20]">{categoryType}</span>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Common fields */}
      <Section title="Room Details">
        <Input label="Room Name *" value={common.name} onChange={setC("name")} placeholder="e.g. Deluxe Room" />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Room Type *</label>
          <select
            value={common.roomType}
            onChange={setC("roomType")}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-300"
          >
            <option value="">Select type</option>
            {roomTypeOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <Input label="Price (₹) *" value={common.price} onChange={setC("price")} type="number" placeholder="e.g. 2500" />
        <Input label="No of People Allowed *" value={common.capacity} onChange={setC("capacity")} type="number" placeholder="e.g. 2" />
        <div className="sm:col-span-2">
          <Input
            label="Available Dates (comma-separated)"
            value={common.availableDates}
            onChange={setC("availableDates")}
            placeholder="15 May 2025, 22 May 2025"
          />
        </div>
        <div className="sm:col-span-2">
          <Checkbox label="Room is active (visible to users)" checked={common.isActive} onChange={setC("isActive")} />
        </div>
      </Section>

      {/* Hotel-specific */}
      {categoryType === "hotel" && (
        <Section title="Hotel Details">
          <Input label="Check-in Time" value={hotel.checkIn} onChange={setH("checkIn")} placeholder="12:00 PM" />
          <Input label="Check-out Time" value={hotel.checkOut} onChange={setH("checkOut")} placeholder="11:00 AM" />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Bed Type</label>
            <select
              value={hotel.bedType}
              onChange={setH("bedType")}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-300"
            >
              <option value="">Select</option>
              {["King", "Queen", "Twin", "Single"].map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <Input label="Floor Number" value={hotel.floorNumber} onChange={setH("floorNumber")} type="number" placeholder="e.g. 3" />
          <div className="sm:col-span-2">
            <Input label="Amenities (comma-separated)" value={hotel.amenities} onChange={setH("amenities")} placeholder="AC, WiFi, TV" />
          </div>
        </Section>
      )}

      {/* Hostel-specific */}
      {categoryType === "hostel" && (
        <Section title="Hostel Details">
          <Input label="Check-in Time" value={hostel.checkIn} onChange={setHo("checkIn")} placeholder="12:00 PM" />
          <Input label="Check-out Time" value={hostel.checkOut} onChange={setHo("checkOut")} placeholder="11:00 AM" />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Bathroom Type</label>
            <select
              value={hostel.bathroomType}
              onChange={setHo("bathroomType")}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-300"
            >
              <option value="">Select</option>
              <option>Shared</option>
              <option>Private</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <Input label="Amenities (comma-separated)" value={hostel.amenities} onChange={setHo("amenities")} placeholder="WiFi, Locker, Towel" />
          </div>
          <div className="sm:col-span-2">
            <Checkbox label="Locker available" checked={hostel.lockerAvailable} onChange={setHo("lockerAvailable")} />
          </div>
        </Section>
      )}

      {/* Yoga-specific */}
      {categoryType === "Yoga Studio" && (
        <Section title="Yoga Retreat Details">
          <Input label="Batch Size" value={yoga.batchSize} onChange={setY("batchSize")} type="number" placeholder="e.g. 10" />
          <Input label="Language" value={yoga.language} onChange={setY("language")} placeholder="e.g. English" />
          <Input label="Duration (e.g. 3 Days | 2 Nights)" value={yoga.daysNights} onChange={setY("daysNights")} placeholder="3 Days | 2 Nights" />
          <Input label="Instructor Name" value={yoga.instructorName} onChange={setY("instructorName")} placeholder="e.g. Ananda Ji" />
          <Input label="Yoga Style" value={yoga.yogaStyle} onChange={setY("yogaStyle")} placeholder="e.g. Hatha, Vinyasa" />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Level</label>
            <select
              value={yoga.level}
              onChange={setY("level")}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-300"
            >
              <option value="">Select level</option>
              {YOGA_LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <Checkbox label="Meals included" checked={yoga.mealsIncluded} onChange={setY("mealsIncluded")} />
          </div>
        </Section>
      )}

      {/* Actions */}
      <div className="flex gap-3 max-w-60 mt-6">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 border-[1.5px] border-[#e07b20] text-[#e07b20] rounded-lg text-sm font-semibold hover:bg-orange-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-2.5 bg-[#e07b20] text-white rounded-lg text-sm font-semibold hover:bg-[#c96d18] transition disabled:opacity-60"
        >
          {loading ? "Saving..." : isEdit ? "Update Room" : "Add Room"}
        </button>
      </div>
    </div>
  );
}