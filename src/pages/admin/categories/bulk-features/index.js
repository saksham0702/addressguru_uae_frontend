"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Plus, Trash2, ChevronDown, Check, X } from "lucide-react";
import Link from "next/link";

import {
  getAllCategories,
  bulkAddFeatureItems,
} from "@/api/uaeAdminCategories";

export default function BulkFeaturePage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [featureType, setFeatureType] = useState("facility");
  const [items, setItems] = useState([{ name: "" }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef(null);

  /* ================= FETCH CATEGORIES ================= */

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await getAllCategories();
    if (res?.status) {
      setCategories(res.data || []);
    }
  };

  /* ================= CLOSE DROPDOWN OUTSIDE CLICK ================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= CATEGORY SELECT ================= */

  const toggleCategory = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const removeSelectedCategory = (id) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== id));
  };

  /* ================= ITEMS ================= */

  const addItem = () => {
    setItems([...items, { name: "" }]);
  };

  const updateItem = (index, value) => {
    const updated = [...items];
    updated[index].name = value;
    setItems(updated);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  /* ================= SAVE ================= */

  const handleSaveBulk = async () => {
    if (selectedCategories.length === 0) {
      alert("Please select at least one category");
      return;
    }

    const validItems = items.filter((item) => item.name.trim());

    if (validItems.length === 0) {
      alert(`Please add at least one ${featureType}`);
      return;
    }

    setLoading(true);

    try {
      await bulkAddFeatureItems(featureType, {
        categoryIds: selectedCategories,
        items: validItems.map((item) => ({
          name: item.name,
        })),
      });

      setSuccess(
        `${featureType === "facility" ? "Facilities" : "Services"} added successfully.`,
      );

      setItems([{ name: "" }]);
      setSelectedCategories([]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 px-6 ">
      {/* HEADER */}
      <div className="mb-4 flex items-center gap-4">
        <Link
          href="/admin/categories"
          className="rounded-full p-2 hover:bg-gray-100 transition"
        >
          <ArrowLeft size={22} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Add Bulk Features
          </h1>
          <p className="text-sm text-gray-500">
            Add either Facilities OR Services for selected categories.
          </p>
        </div>
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="mb-8 rounded-xl border border-green-100 bg-green-50 px-5 py-3 text-sm text-green-700 shadow-sm">
          {success}
        </div>
      )}

      <div className="max-w-8xl mx-auto space-y-10">
        {/* ================= CATEGORY SECTION ================= */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-7">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Select Categories
          </h2>

          <div ref={dropdownRef} className="relative w-full md:w-[450px]">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="w-full flex justify-between items-center px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="text-sm font-medium text-gray-700">
                {selectedCategories.length > 0
                  ? `${selectedCategories.length} Categories Selected`
                  : "Choose Categories"}
              </span>
              <ChevronDown size={18} />
            </button>

            {openDropdown && (
              <div className="absolute mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => toggleCategory(cat._id)}
                    className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-50"
                  >
                    <span className="text-sm text-gray-700">{cat.name}</span>

                    {selectedCategories.includes(cat._id) && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SELECTED TAGS */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategories.map((id) => {
                const cat = categories.find((c) => c._id === id);
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-100"
                  >
                    {cat?.name}
                    <button onClick={() => removeSelectedCategory(id)}>
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= FEATURE TYPE + ITEMS MERGED ================= */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-7">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Feature Configuration
          </h2>

          {/* Feature Type */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => {
                setFeatureType("facility");
                setItems([{ name: "" }]);
              }}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200
              ${
                featureType === "facility"
                  ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Facilities
            </button>

            <button
              onClick={() => {
                setFeatureType("service");
                setItems([{ name: "" }]);
              }}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200
              ${
                featureType === "service"
                  ? "bg-green-50 text-green-700 border-green-200 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Services
            </button>
          </div>

          {/* Items Section */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-md font-semibold text-gray-800">
              Add {featureType === "facility" ? "Facilities" : "Services"}
            </h3>

            <button
              onClick={addItem}
              className="flex items-center gap-2 px-4 py-2 rounded-lg 
              border border-gray-200 bg-white text-gray-700 text-sm font-medium
              hover:bg-gray-50 hover:shadow-sm transition"
            >
              <Plus size={16} className="text-gray-500" />
              Add Item
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 border border-gray-100 rounded-xl px-4 py-3 bg-gray-50"
              >
                <input
                  value={item.name}
                  onChange={(e) => updateItem(i, e.target.value)}
                  placeholder={`Enter ${featureType} name`}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                />

                <button onClick={() => removeItem(i)}>
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            disabled={loading}
            onClick={handleSaveBulk}
            className="rounded-lg px-8 py-2.5 text-sm font-semibold
            bg-blue-600 text-white shadow-sm
            hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : `Save Bulk ${
                  featureType === "facility" ? "Facilities" : "Services"
                }`}
          </button>
        </div>
      </div>
    </div>
  );
}
