"use client";
import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Plus,
  Trash2,
  Edit3,
  X,
  Search,
  FileText,
  MapPin,
  Tag,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";

import {
  get_all_seo_content,
  upsert_seo_content,
  delete_seo_content,
} from "@/api/seoApi";
import { getAllCategories } from "@/api/uaeAdminCategories";
import { getCities } from "@/api/uaeadminCities";

// Dynamic import for Tiptap — required for Next.js Page Router (no SSR)
const TiptapEditor = dynamic(
  () => import("@/components/admin/editor/TiptapEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] bg-gray-100 rounded-xl border-[1.5px] border-gray-200 animate-pulse" />
    ),
  }
);

// ── Toast ──────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <div
    className={`
      fixed top-5 right-5 z-[2000] flex items-center gap-2 px-3.5 py-2.5
      rounded-xl border shadow-lg max-w-xs
      ${type === "success"
        ? "bg-green-50 border-green-200"
        : "bg-rose-50 border-rose-200"
      }
    `}
  >
    {type === "success"
      ? <CheckCircle size={15} className="text-green-600 flex-shrink-0" />
      : <AlertCircle size={15} className="text-rose-600 flex-shrink-0" />
    }
    <span className={`text-[13px] font-medium ${type === "success" ? "text-green-800" : "text-rose-800"}`}>
      {message}
    </span>
    <button onClick={onClose} className="ml-auto p-0 bg-transparent border-none cursor-pointer leading-none">
      <X size={13} className="text-gray-400" />
    </button>
  </div>
);

// ── Empty state ────────────────────────────────────────────────────────────────
const EmptyState = ({ onAdd }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 gap-3 text-center">
    <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center">
      <FileText size={28} className="text-orange-500" />
    </div>
    <p className="text-base font-semibold text-gray-900 m-0">No SEO content yet</p>
    <p className="text-[13px] text-gray-500 max-w-[360px] leading-relaxed m-0">
      Create city-specific content for categories to improve SEO rankings.
    </p>
    <button
      className="inline-flex items-center gap-1.5 bg-orange-500 text-white border-none rounded-lg px-4 py-2 text-[13px] font-semibold cursor-pointer hover:bg-orange-700 transition-colors"
      onClick={onAdd}
    >
      <Plus size={15} />
      Add First SEO Entry
    </button>
  </div>
);

// ── SEO Card ───────────────────────────────────────────────────────────────────
const SeoCard = ({ item, onEdit, onDelete, deleting }) => {
  const cities = item.city_ids || [];
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2.5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col gap-1 flex-1">
          <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-orange-500 w-fit">
            <Tag size={11} />
            <span>{item.category_id?.name || "—"}</span>
          </div>
          {cities.length > 0 && (
            <div className="flex items-center gap-1">
              <MapPin size={11} className="text-gray-400" />
              <span className="text-[12px] text-gray-500">
                {cities.slice(0, 3).map((c) => c?.name || c).join(", ")}
                {cities.length > 3 && (
                  <span className="text-orange-500"> +{cities.length - 3} more</span>
                )}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            className="inline-flex items-center justify-center w-[30px] h-[30px] border border-gray-200 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onEdit(item)}
            title="Edit"
          >
            <Edit3 size={14} className="text-gray-500" />
          </button>
          <button
            className="inline-flex items-center justify-center w-[30px] h-[30px] border border-red-100 rounded-lg bg-rose-50 cursor-pointer hover:bg-red-100 transition-colors disabled:opacity-60"
            onClick={() => onDelete(item._id)}
            disabled={deleting === item._id}
            title="Delete"
          >
            {deleting === item._id
              ? <Loader size={14} className="text-red-500 animate-spin" />
              : <Trash2 size={14} className="text-red-500" />
            }
          </button>
        </div>
      </div>

      <h3 className="text-[15px] font-semibold text-gray-900 m-0 leading-snug">
        {item.title || "Untitled"}
      </h3>

      {item.content && (
        <div
          className="text-[13px] text-gray-500 leading-relaxed overflow-hidden line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: item.content.substring(0, 180) + (item.content.length > 180 ? "…" : ""),
          }}
        />
      )}

      <div className="flex justify-end border-t border-gray-100 pt-2 mt-1">
        <span className="text-[11px] text-gray-400">
          {item.updatedAt
            ? new Date(item.updatedAt).toLocaleDateString("en-AE", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </span>
      </div>
    </div>
  );
};

// ── Form default ───────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  _id: null,
  category_id: "",
  city_ids: [],
  title: "",
  content: "",
};

// ── Main page ──────────────────────────────────────────────────────────────────
const SeoEditor = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const [searchData, setSearchData] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [toast, setToast] = useState(null);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await get_all_seo_content();
      if (res?.data) setData(res.data);
    } catch {
      showToast("Failed to fetch SEO content", "error");
    }
  }, []);

  const fetchDropdowns = useCallback(async () => {
    try {
      const [cat, cit] = await Promise.all([getAllCategories(), getCities()]);
      setCategories(cat?.data || []);
      setCities(cit?.data || []);
    } catch {
      showToast("Failed to load categories or cities", "error");
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchData(), fetchDropdowns()]).finally(() => setLoading(false));
  }, [fetchData, fetchDropdowns]);

  // ── CRUD ─────────────────────────────────────────────────────────────────
  const openAdd = () => { setForm(EMPTY_FORM); setIsEdit(false); setOpen(true); };

  const openEdit = (item) => {
    setForm({
      _id: item._id,
      category_id: item.category_id?._id || item.category_id || "",
      city_ids: (item.city_ids || []).map((c) => c?._id || c),
      title: item.title || "",
      content: item.content || "",
    });
    setIsEdit(true);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setForm(EMPTY_FORM);
    setCategorySearch("");
    setCitySearch("");
  };

  const handleSave = async () => {
    if (!form.category_id) { showToast("Please select a category", "error"); return; }
    if (!form.title.trim()) { showToast("Title is required", "error"); return; }
    setSaving(true);
    try {
      await upsert_seo_content(form);
      showToast(isEdit ? "SEO content updated!" : "SEO content created!");
      closeModal();
      await fetchData();
    } catch {
      showToast("Failed to save. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this SEO entry?")) return;
    setDeleting(id);
    try {
      await delete_seo_content(id);
      showToast("Entry deleted");
      await fetchData();
    } catch {
      showToast("Failed to delete", "error");
    } finally {
      setDeleting(null);
    }
  };

  const toggleCity = (id) => {
    setForm((prev) => ({
      ...prev,
      city_ids: prev.city_ids.includes(id)
        ? prev.city_ids.filter((c) => c !== id)
        : [...prev.city_ids, id],
    }));
  };

  // ── Filtered lists ────────────────────────────────────────────────────────
  const filteredData = data.filter((item) => {
    const q = searchData.toLowerCase();
    return item.title?.toLowerCase().includes(q) || item.category_id?.name?.toLowerCase().includes(q);
  });

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  const selectedCategoryName = categories.find((c) => c._id === form.category_id)?.name || "";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className=" bg-white p-5 min-h-screen  relative">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 m-0 tracking-tight">SEO Content</h1>
          <p className="text-[13px] text-gray-500 mt-1 mb-0">Manage category-specific content for cities</p>
        </div>
        <button
          className="inline-flex items-center gap-1.5 bg-orange-500 text-white border-none rounded-lg px-4 py-2 text-[13px] font-semibold cursor-pointer hover:bg-orange-700 transition-colors flex-shrink-0"
          onClick={openAdd}
        >
          <Plus size={15} />
          Add SEO Entry
        </button>
      </div>

      {/* ── Stats bar ── */}
      <div className="flex gap-3 mb-6 flex-wrap items-center">
        {[
          { label: "Total Entries", value: data.length },
          { label: "Categories Covered", value: new Set(data.map((d) => d.category_id?._id)).size },
          { label: "Cities Covered", value: new Set(data.flatMap((d) => d.city_ids || [])).size },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex flex-col gap-0.5">
            <span className="text-[22px] font-bold text-orange-500 leading-none">{s.value}</span>
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{s.label}</span>
          </div>
        ))}

        {/* Search */}
        <div className="ml-auto flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 h-[38px] min-w-[220px]">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            placeholder="Search entries..."
            value={searchData}
            onChange={(e) => setSearchData(e.target.value)}
            className="border-none outline-none text-[13px] text-gray-700 bg-transparent w-full"
          />
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[180px] bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredData.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {filteredData.map((item) => (
            <SeoCard key={item._id} item={item} onEdit={openEdit} onDelete={handleDelete} deleting={deleting} />
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {open && (
        <div
          className="fixed inset-0 bg-gray-900/45 flex items-start justify-center z-[1000] p-8 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-2xl w-full max-w-[860px] flex flex-col overflow-hidden my-auto">

            {/* Modal header */}
            <div className="flex justify-between items-start px-6 py-5 border-b border-gray-100 gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 m-0">
                  {isEdit ? "Edit SEO Entry" : "New SEO Entry"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5 mb-0">
                  Fill in the content that will appear on the category page for selected cities
                </p>
              </div>
              <button
                className="bg-gray-100 border-none rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors flex-shrink-0"
                onClick={closeModal}
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">

              {/* Two-column top section */}
              <div className="grid grid-cols-2 gap-5">

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-700 uppercase tracking-wide">
                    <Tag size={13} className="text-orange-500" />
                    Category
                    <span className="text-orange-500 ml-0.5">*</span>
                  </label>
                  <div className="flex flex-col gap-0">
                    <input
                      placeholder="Search category..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="border-[1.5px] border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 outline-none w-full box-border bg-white mb-1 focus:border-orange-500 transition-colors"
                    />
                    <div className="border-[1.5px] border-gray-200 rounded-lg max-h-[180px] overflow-y-auto bg-white">
                      {filteredCategories.length === 0 ? (
                        <div className="px-3 py-3 text-[13px] text-gray-400 text-center">No categories found</div>
                      ) : (
                        filteredCategories.map((cat) => (
                          <div
                            key={cat._id}
                            className={`px-3 py-2 text-[13px] cursor-pointer transition-colors flex items-center gap-2
                              ${form.category_id === cat._id
                                ? "bg-orange-50 text-orange-500 font-semibold"
                                : "text-gray-700 hover:bg-gray-50"
                              }`}
                            onClick={() => setForm({ ...form, category_id: cat._id })}
                          >
                            {cat.name}
                          </div>
                        ))
                      )}
                    </div>
                    {selectedCategoryName && (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-0.5 text-[12px] font-semibold text-orange-500 w-fit">
                        <Tag size={11} />
                        {selectedCategoryName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cities */}
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-700 uppercase tracking-wide">
                    <MapPin size={13} className="text-orange-500" />
                    Cities
                    {form.city_ids.length > 0 && (
                      <span className="ml-1.5 bg-orange-500 text-white rounded-full px-2 py-0 text-[10px] font-semibold">
                        {form.city_ids.length} selected
                      </span>
                    )}
                  </label>
                  <div className="flex flex-col gap-0">
                    <input
                      placeholder="Search city..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="border-[1.5px] border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 outline-none w-full box-border bg-white mb-1 focus:border-orange-500 transition-colors"
                    />
                    <div className="border-[1.5px] border-gray-200 rounded-lg max-h-[180px] overflow-y-auto bg-white">
                      {filteredCities.length === 0 ? (
                        <div className="px-3 py-3 text-[13px] text-gray-400 text-center">No cities found</div>
                      ) : (
                        filteredCities.map((city) => {
                          const checked = form.city_ids.includes(city._id);
                          return (
                            <div
                              key={city._id}
                              className={`px-3 py-2 text-[13px] cursor-pointer transition-colors flex items-center gap-2
                                ${checked ? "bg-orange-50" : "hover:bg-gray-50"}`}
                              onClick={() => toggleCity(city._id)}
                            >
                              {/* Custom checkbox */}
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-[1.5px] transition-all
                                  ${checked ? "bg-orange-500 border-orange-500" : "bg-white border-gray-300"}`}
                              >
                                {checked && (
                                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                    <path d="M1 3.5L3.5 6L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </div>
                              <span className={`text-[13px] ${checked ? "text-orange-500 font-medium" : "text-gray-700"}`}>
                                {city.name}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-700 uppercase tracking-wide">
                  Page Title
                  <span className="text-orange-500 ml-0.5">*</span>
                </label>
                <input
                  placeholder="e.g. Best Plumbers in Dubai — Verified & Affordable"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="border-[1.5px] border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 outline-none w-full box-border bg-white focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Content editor */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-700 uppercase tracking-wide">
                  Page Content
                </label>
                <TiptapEditor
                  value={form.content}
                  onChange={(val) => setForm({ ...form, content: val })}
                  placeholder="Write detailed, SEO-friendly content about this category in the selected cities…"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                className="inline-flex items-center gap-1.5 bg-white text-gray-700 border border-gray-200 rounded-lg px-4 py-2 text-[13px] font-medium cursor-pointer hover:bg-gray-50 transition-colors disabled:opacity-60"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="inline-flex items-center gap-1.5 bg-orange-500 text-white border-none rounded-lg px-4 py-2 text-[13px] font-semibold cursor-pointer hover:bg-orange-700 transition-colors disabled:opacity-60"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} />
                    {isEdit ? "Update Entry" : "Save Entry"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeoEditor;