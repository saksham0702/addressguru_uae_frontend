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
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  get_all_seo_content,
  upsert_seo_content,
  delete_seo_content,
} from "@/api/seoApi";
import { getAllCategories } from "@/api/uaeAdminCategories";
import { getCities } from "@/api/uaeadminCities";

// Dynamic import for Tiptap
const TiptapEditor = dynamic(
  () => import("@/components/admin/editor/TiptapEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] bg-gray-100 rounded-xl border-[1.5px] border-gray-200 animate-pulse" />
    ),
  },
);

// ── Toast ──────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <div
    className={`
      fixed top-5 right-5 z-[2000] flex items-center gap-2 px-3.5 py-2.5
      rounded-xl border shadow-lg max-w-xs
      ${
        type === "success"
          ? "bg-green-50 border-green-200"
          : "bg-rose-50 border-rose-200"
      }
    `}
  >
    {type === "success" ? (
      <CheckCircle size={15} className="text-green-600 flex-shrink-0" />
    ) : (
      <AlertCircle size={15} className="text-rose-600 flex-shrink-0" />
    )}
    <span
      className={`text-[13px] font-medium ${type === "success" ? "text-green-800" : "text-rose-800"}`}
    >
      {message}
    </span>
    <button
      onClick={onClose}
      className="ml-auto p-0 bg-transparent border-none cursor-pointer leading-none"
    >
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
    <p className="text-base font-semibold text-gray-900 m-0">
      No SEO content yet
    </p>
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
  const cityName = item.city_id?.name || "—";
  const categoryName = item.category_id?.name || "—";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2.5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col gap-1 flex-1">
          <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-orange-500 w-fit">
            <Tag size={11} />
            <span>{categoryName}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={11} className="text-gray-400" />
            <span className="text-[12px] text-gray-500">{cityName}</span>
          </div>
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
            {deleting === item._id ? (
              <Loader size={14} className="text-red-500 animate-spin" />
            ) : (
              <Trash2 size={14} className="text-red-500" />
            )}
          </button>
        </div>
      </div>

      <h3 className="text-[14px] font-semibold">
        {item.category_id?.name} - {item.city_id?.name}
      </h3>
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

// ── FAQ Item Component ─────────────────────────────────────────────────────────
const FaqItem = ({ faq, index, onChange, onRemove }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-[12px] font-semibold text-gray-500 uppercase">
          FAQ #{index + 1}
        </span>
        <button
          onClick={onRemove}
          className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
          title="Remove FAQ"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <input
        placeholder="Question"
        value={faq.question || ""}
        onChange={(e) => onChange({ ...faq, question: e.target.value })}
        className="border-[1.5px] border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 outline-none w-full focus:border-orange-500 transition-colors"
      />

      <textarea
        placeholder="Answer"
        value={faq.answer || ""}
        onChange={(e) => onChange({ ...faq, answer: e.target.value })}
        rows={3}
        className="border-[1.5px] border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 outline-none w-full resize-none focus:border-orange-500 transition-colors"
      />
    </div>
  );
};

// ── Searchable Dropdown Component ─────────────────────────────────────────────
const SearchableDropdown = ({
  label,
  icon: Icon,
  required = false,
  placeholder,
  searchValue,
  onSearchChange,
  options,
  selectedId,
  onSelect,
  selectedLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-1.5" ref={dropdownRef}>
      <label className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-700 uppercase tracking-wide">
        {Icon && <Icon size={13} className="text-orange-500" />}
        {label}
        {required && <span className="text-orange-500 ml-0.5">*</span>}
      </label>

      {/* Selected Display / Trigger */}
      <div
        className={`
          border-[1.5px] rounded-lg px-3 py-2 text-[13px] cursor-pointer transition-colors
          ${isOpen ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedLabel ? (
          <div className="flex items-center gap-2 text-gray-900 font-medium">
            {Icon && <Icon size={13} className="text-orange-500" />}
            {selectedLabel}
          </div>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="relative">
          <div className="absolute top-1 left-0 right-0 bg-white border-[1.5px] border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-1.5">
                <Search size={13} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="border-none outline-none text-[13px] text-gray-900 bg-transparent w-full"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-[200px] overflow-y-auto">
              {options.length === 0 ? (
                <div className="px-3 py-3 text-[13px] text-gray-400 text-center">
                  No results found
                </div>
              ) : (
                options.map((option) => (
                  <div
                    key={option._id}
                    className={`
                      px-3 py-2 text-[13px] cursor-pointer transition-colors
                      ${
                        selectedId === option._id
                          ? "bg-orange-50 text-orange-500 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                    onClick={() => {
                      onSelect(option._id);
                      setIsOpen(false);
                      onSearchChange("");
                    }}
                  >
                    {option.name}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Form default ───────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  _id: null,
  category_id: "",
  city_id: "",
  city_content: "",
  seo_content: "",
  pricing_content: "",
  faq_content: [],
};

const ContentTabs = ({ activeTab, setActiveTab, tabs }) => (
  <div className="border-b border-gray-200 mb-4">
    <div className="flex gap-1 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap
            ${
              activeTab === tab.id
                ? "border-orange-500 text-orange-500 bg-orange-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }
          `}
        >
          <div className="flex items-center gap-2">
            {tab.icon && <tab.icon size={14} />}
            {tab.label}
          </div>
        </button>
      ))}
    </div>
  </div>
);

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
  const [activeTab, setActiveTab] = useState("city");

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
    Promise.all([fetchData(), fetchDropdowns()]).finally(() =>
      setLoading(false),
    );
  }, [fetchData, fetchDropdowns]);

  // ── CRUD ─────────────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setIsEdit(false);
    setOpen(true);
  };

  const openEdit = (item) => {
    setForm({
      _id: item._id,
      category_id: item.category_id?._id || item.category_id || "",
      city_id: item.city_id?._id || item.city_id || "",
      city_content: item.city_content || "",
      seo_content: item.seo_content || "",
      pricing_content: item.pricing_content || "",
      faq_content: item.faq_content || [],
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
    // Validation
    if (!form.category_id) return showToast("Category required", "error");
    if (!form.city_id) return showToast("City required", "error");
    if (!form.city_content.trim())
      return showToast("City content required", "error");

    setSaving(true);
    try {
      await upsert_seo_content(form);
      showToast(isEdit ? "SEO content updated!" : "SEO content created!");
      closeModal();
      await fetchData();
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Failed to save. Please try again.",
        "error",
      );
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

  // ── FAQ Management ────────────────────────────────────────────────────────
  const addFaq = () => {
    setForm({
      ...form,
      faq_content: [...form.faq_content, { question: "", answer: "" }],
    });
  };

  const updateFaq = (index, updatedFaq) => {
    const newFaqs = [...form.faq_content];
    newFaqs[index] = updatedFaq;
    setForm({ ...form, faq_content: newFaqs });
  };

  const removeFaq = (index) => {
    const newFaqs = form.faq_content.filter((_, i) => i !== index);
    setForm({ ...form, faq_content: newFaqs });
  };

  // ── Filtered lists ────────────────────────────────────────────────────────
  const filteredData = data.filter((item) => {
    const q = searchData.toLowerCase();
    return (
      item.category_id?.name?.toLowerCase().includes(q) ||
      item.city_id?.name?.toLowerCase().includes(q)
    );
  });

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase()),
  );

  const selectedCategoryName =
    categories.find((c) => c._id === form.category_id)?.name || "";
  const selectedCityName =
    cities.find((c) => c._id === form.city_id)?.name || "";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white p-5 min-h-screen relative">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 m-0 tracking-tight">
            SEO Content
          </h1>
          <p className="text-[13px] text-gray-500 mt-1 mb-0">
            Manage category-specific content for cities
          </p>
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
          {
            label: "Categories Covered",
            value: new Set(data.map((d) => d.category_id?._id)).size,
          },
          {
            label: "Cities Covered",
            value: new Set(data.map((d) => d.city_id?._id)).size,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex flex-col gap-0.5"
          >
            <span className="text-[22px] font-semibold text-orange-500 leading-none">
              {s.value}
            </span>
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
              {s.label}
            </span>
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
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[180px] bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : filteredData.length === 0 ? (
        searchData ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-[14px]">No results found for {searchData}</p>
          </div>
        ) : (
          <EmptyState onAdd={openAdd} />
        )
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {filteredData.map((item) => (
            <SeoCard
              key={item._id}
              item={item}
              onEdit={openEdit}
              onDelete={handleDelete}
              deleting={deleting}
            />
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {open && (
        <div
          className="fixed inset-0 bg-gray-900/45 flex items-start justify-center z-[1000] p-8 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-2xl w-full max-w-[960px] flex flex-col overflow-hidden my-auto">
            {/* Modal header */}
            <div className="flex justify-between items-start px-6 py-5 border-b border-gray-100 gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 m-0">
                  {isEdit ? "Edit SEO Entry" : "New SEO Entry"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5 mb-0">
                  Fill in the content that will appear on the category page for
                  the selected city
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
            <div
              className="px-6 py-5 flex flex-col gap-5 overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 200px)" }}
            >
              {/* Two-column top section */}
              <div className="grid grid-cols-2 gap-5">
                {/* Category */}
                <SearchableDropdown
                  label="Category"
                  icon={Tag}
                  required={true}
                  placeholder="Select category..."
                  searchValue={categorySearch}
                  onSearchChange={setCategorySearch}
                  options={filteredCategories}
                  selectedId={form.category_id}
                  onSelect={(id) => setForm({ ...form, category_id: id })}
                  selectedLabel={selectedCategoryName}
                />

                {/* City */}
                <SearchableDropdown
                  label="City"
                  icon={MapPin}
                  required={true}
                  placeholder="Select city..."
                  searchValue={citySearch}
                  onSearchChange={setCitySearch}
                  options={filteredCities}
                  selectedId={form.city_id}
                  onSelect={(id) => setForm({ ...form, city_id: id })}
                  selectedLabel={selectedCityName}
                />
              </div>
              {/* Tab Navigation */}
              <ContentTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={[
                  { id: "city", label: "City Content", icon: FileText },
                  { id: "seo", label: "SEO Content", icon: FileText },
                  { id: "pricing", label: "Pricing", icon: FileText },
                  { id: "faq", label: "FAQs", icon: HelpCircle },
                ]}
              />

              {/* Tab Content */}
              <div className="min-h-[320px]">
                {activeTab === "city" && (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[12px] text-gray-500 mb-2">
                      Content specific to this city{" "}
                      <span className="text-orange-500">*</span>
                    </p>
                    <TiptapEditor
                      value={form.city_content}
                      onChange={(val) =>
                        setForm({ ...form, city_content: val })
                      }
                      placeholder="Write city-specific content here..."
                    />
                  </div>
                )}

                {activeTab === "seo" && (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[12px] text-gray-500 mb-2">
                      Additional SEO-optimized content
                    </p>
                    <TiptapEditor
                      value={form.seo_content}
                      onChange={(val) => setForm({ ...form, seo_content: val })}
                      placeholder="Write SEO content here..."
                    />
                  </div>
                )}

                {activeTab === "pricing" && (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[12px] text-gray-500 mb-2">
                      Pricing information and details
                    </p>
                    <TiptapEditor
                      value={form.pricing_content}
                      onChange={(val) =>
                        setForm({ ...form, pricing_content: val })
                      }
                      placeholder="Write pricing content here..."
                    />
                  </div>
                )}

                {activeTab === "faq" && (
                  <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-2">
                    {form.faq_content.map((faq, index) => (
                      <FaqItem
                        key={index}
                        faq={faq}
                        index={index}
                        onChange={(updated) => updateFaq(index, updated)}
                        onRemove={() => removeFaq(index)}
                      />
                    ))}

                    <button
                      onClick={addFaq}
                      className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-500 border border-orange-200 rounded-lg px-3 py-2 text-[13px] font-semibold cursor-pointer hover:bg-orange-100 transition-colors w-fit"
                    >
                      <Plus size={14} />
                      Add FAQ
                    </button>
                  </div>
                )}
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
