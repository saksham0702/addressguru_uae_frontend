"use client";
import React, { useState, useEffect, useRef } from "react";
import { Trash2, Plus } from "lucide-react";
import {
  get_rooms_by_listing,
  create_room,
  update_room,
  delete_room,
} from "@/api/rooms";

const FILE_URL = "https://addressguru.ae/api";

const ROOM_TYPE_OPTIONS = {
  Hotel: ["Standard", "Deluxe", "Luxury"],
  Hostel: ["Shared", "Private"],
  "Yoga Studio": ["Shared", "Private"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Resolve any image value to a displayable URL */
const resolveImageUrl = (img) => {
  if (!img) return null;
  if (typeof img === "string") {
    // Already an absolute URL
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    // Relative path from backend — prepend FILE_URL
    return `${FILE_URL}/${img.replace(/^\//, "")}`;
  }
  // Object with preview (local blob) or url (backend)
  return img.preview ?? (img.url ? resolveImageUrl(img.url) : null);
};

const normalizeImages = (imgs) =>
  (imgs ?? []).map((img) =>
    typeof img === "string" ? { preview: resolveImageUrl(img), url: img } : img,
  );

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

const TimePicker = ({ value, onChange }) => {
  const parsed = parseTime(value);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState(parsed.period);

  useEffect(() => {
    const p = parseTime(value);
    setHour(p.hour);
    setMinute(p.minute);
    setPeriod(p.period);
  }, [value]);

  const update = (h, m, p) => onChange(`${h}:${m} ${p}`);
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

// ─── Image Upload (compact thumbnails) ───────────────────────────────────────
const ImageUpload = ({ images, onUpload, onRemove }) => {
  const inputRef = useRef();

  return (
    <div className="mt-3">
      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
        Room Images <span className="text-gray-400 font-normal">(max 4)</span>
      </label>

      <div className="flex items-center gap-1.5 flex-wrap">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative group w-40 h-40 rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0"
          >
            <img
              src={resolveImageUrl(img)}
              alt={`img-${index + 1}`}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-150" />

            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute inset-0 hidden group-hover:flex items-center justify-center"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path
                  d="M1 1l6 6M7 1L1 7"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ))}

        {images.length < 4 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-40 h-40 rounded-md border-2 border-dashed border-orange-200 bg-orange-50/50 hover:bg-orange-50 hover:border-orange-300 transition-all duration-150 flex items-center justify-center flex-shrink-0"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              className="text-orange-400"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={onUpload}
      />

      <p className="text-[10px] text-gray-400 mt-1">
        {images.length}/4 · JPG or PNG · max 2 MB each
      </p>
    </div>
  );
};

// ─── Room Form ────────────────────────────────────────────────────────────────
const RoomFormInline = ({
  categoryType,
  listingId,
  initialData,
  onSuccess,
  onCancel,
}) => {
  const isEdit = !!initialData?._id;

  const getCheckIn = (d) =>
    d?.checkIn ?? d?.hotel?.checkIn ?? d?.hostel?.checkIn ?? "12:00 PM";
  const getCheckOut = (d) =>
    d?.checkOut ?? d?.hotel?.checkOut ?? d?.hostel?.checkOut ?? "11:00 AM";

  const [form, setForm] = useState({
    roomType: initialData?.roomType ?? "",
    price: initialData?.price ?? "",
    capacity: initialData?.capacity ?? "",
    images: normalizeImages(initialData?.images),
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).filter(
      (f) => f.type.startsWith("image/") && f.size <= 2 * 1024 * 1024,
    );
    if (form.images.length + files.length > 4) {
      alert("Max 4 images allowed");
      return;
    }
    setForm((p) => ({
      ...p,
      images: [
        ...p.images,
        ...files.map((f) => ({ file: f, preview: URL.createObjectURL(f) })),
      ],
    }));
    e.target.value = "";
  };

  const removeImage = (index) =>
    setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== index) }));

  const set = (field) => (e) =>
    setForm((p) => ({
      ...p,
      [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const typeFields = () => {
    if (categoryType === "Hotel" || categoryType === "Hostel")
      return { checkIn: form.checkIn ?? null, checkOut: form.checkOut ?? null };
    if (categoryType === "Yoga Studio")
      return {
        batchSize: form.batchSize ? Number(form.batchSize) : null,
        language: form.language || null,
        daysNights: form.daysNights || null,
        mealsIncluded: form.mealsIncluded,
      };
    return {};
  };

  const buildPayload = () => {
    const newFiles = form.images.filter((img) => img.file);
    const existingUrls = form.images
      .filter((img) => !img.file && img.url)
      .map((img) => img.url);

    const baseFields = {
      listingId,
      roomType: form.roomType,
      price: form.price,
      capacity: form.capacity,
      ...typeFields(),
    };

    if (newFiles.length > 0) {
      const fd = new FormData();
      Object.entries(baseFields).forEach(([k, v]) => {
        if (v !== null && v !== undefined) fd.append(k, v);
      });
      existingUrls.forEach((url) => fd.append("existingImages", url));
      newFiles.forEach((img) => {
        if (img.file instanceof File) fd.append("images", img.file);
      });
      return fd;
    }

    return { ...baseFields, images: existingUrls };
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.roomType || !form.price || !form.capacity) {
      setError("Room type, price, and capacity are required.");
      return;
    }
    setLoading(true);
    const res = isEdit
      ? await update_room(initialData._id, buildPayload())
      : await create_room(buildPayload());
    setLoading(false);

    if (res?.success) {
      // Pass back the full updated/created room so the parent can immediately
      // replace the form with the correct card view
      onSuccess?.(res.data?.room ?? res.data);
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
        {/* Room Type dropdown — always scoped to the listing's category */}
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

        {(categoryType === "Hotel" || categoryType === "Hostel") && (
          <>
            <div className="col-span-2 sm:col-span-1">
              <label className={lbl}>Check-in Time</label>
              <TimePicker
                value={form.checkIn}
                onChange={(v) => setForm((p) => ({ ...p, checkIn: v }))}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className={lbl}>Check-out Time</label>
              <TimePicker
                value={form.checkOut}
                onChange={(v) => setForm((p) => ({ ...p, checkOut: v }))}
              />
            </div>
          </>
        )}

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

      <ImageUpload
        images={form.images}
        onUpload={handleImageUpload}
        onRemove={removeImage}
      />

      <div className="flex gap-2 max-w-44 mt-4">
        <button
          onClick={onCancel}
          className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-2 bg-[#e07b20] text-white rounded-lg text-xs font-semibold hover:bg-[#c96d18] transition disabled:opacity-60"
        >
          {loading ? "Saving…" : isEdit ? "Update" : "Add Room"}
        </button>
      </div>
    </div>
  );
};

// ─── Room Card ────────────────────────────────────────────────────────────────
const RoomCard = ({ room, categoryType, listingId, onUpdated, onDeleted }) => {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Delete this room?")) return;
    setDeleting(true);
    const res = await delete_room(room._id);
    setDeleting(false);
    if (res?.success) onDeleted?.(room._id);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm transition-all">
      {editing ? (
        <RoomFormInline
          categoryType={categoryType}
          listingId={listingId}
          initialData={room}
          onSuccess={(updated) => {
            // Merge updated data, close form → card view appears
            onUpdated?.({ ...room, ...updated });
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            {/* Room type badge */}
            <span className="text-[11px] font-semibold bg-orange-50 text-[#b55e10] px-2 py-0.5 rounded-full whitespace-nowrap">
              {room.roomType}
            </span>

            {/* Price */}
            <span className="text-gray-900 font-semibold text-sm whitespace-nowrap">
              AED {room.price?.toLocaleString()}
            </span>

            {/* Capacity */}
            <span className="text-[11px] text-gray-400 whitespace-nowrap">
              · {room.capacity}{" "}
              {categoryType === "Yoga Studio" ? "seats" : "guests"}
            </span>

            {/* Check-in / Check-out */}
            {(categoryType === "Hotel" || categoryType === "Hostel") &&
              (room.checkIn || room.hotel?.checkIn) && (
                <span className="text-[11px] text-gray-400 whitespace-nowrap hidden sm:inline">
                  · in{" "}
                  {room.checkIn ?? room.hotel?.checkIn ?? room.hostel?.checkIn}{" "}
                  / out{" "}
                  {room.checkOut ??
                    room.hotel?.checkOut ??
                    room.hostel?.checkOut}
                </span>
              )}

            {/* Compact image strip — uses resolveImageUrl for backend paths */}
            {room.images?.length > 0 && (
              <div className="flex gap-1">
                {room.images.slice(0, 3).map((img, i) => (
                  <img
                    key={i}
                    src={resolveImageUrl(img)}
                    alt=""
                    className="w-6 h-6 rounded object-cover border border-gray-200"
                  />
                ))}
                {room.images.length > 3 && (
                  <span className="w-6 h-6 rounded bg-gray-100 border border-gray-200 text-[9px] text-gray-500 flex items-center justify-center font-semibold">
                    +{room.images.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Actions — Edit + Delete only (toggle removed) */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setEditing(true)}
              title="Edit"
              className="text-gray-400 hover:text-blue-500 transition"
            >
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
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
  const listingId = listing._id ?? listing.id;

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await get_rooms_by_listing(listingId);
      setLoading(false);
      setFetched(true);
      if (res?.status) setRooms(res?.data?.rooms ?? []);
    })();
  }, [listingId]);

  // Optimistic updates
  const handleAdded = (room) => {
    setRooms((p) => [...p, room]);
    setShowAddForm(false); // ← close form, card view appears automatically
  };

  const handleUpdated = (updated) =>
    setRooms((p) =>
      p.map((r) => (r._id === updated._id ? { ...r, ...updated } : r)),
    );

  const handleDeleted = (id) => setRooms((p) => p.filter((r) => r._id !== id));

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Rooms{" "}
          <span className="ml-1 text-gray-400 font-normal">
            ({rooms.length}/4)
          </span>
        </p>
        {rooms.length < 4 && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 text-xs font-semibold text-[#e07b20] hover:text-[#c96d18] transition"
          >
            <Plus size={13} /> Add Room
          </button>
        )}
        {rooms.length >= 4 && (
          <span className="text-[10px] text-gray-400 italic">
            Max 4 reached
          </span>
        )}
      </div>

      {loading && <p className="text-xs text-gray-400 py-2">Loading rooms…</p>}
      {!loading && fetched && rooms.length === 0 && !showAddForm && (
        <p className="text-xs text-gray-400 italic py-1">No rooms added yet.</p>
      )}

      <div className="flex flex-col gap-2">
        {rooms.map((room) => (
          <RoomCard
            key={room._id}
            room={room}
            categoryType={categoryType}
            listingId={listingId}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
        ))}
      </div>

      {showAddForm && (
        <RoomFormInline
          categoryType={categoryType}
          listingId={listingId}
          onSuccess={handleAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default RoomsPanel;
