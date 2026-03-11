"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";

import {
  createOrUpdateCategory,
  getAllCategories,
} from "@/api/uaeAdminCategories";

import CategoryTable from "@/components/admin/categorypopup/categorytable";
import AddEditForm from "@/components/admin/categorypopup/addeditmodal";
import { useError } from "@/context/ErrorContext";
// ⬇️ these are placeholders – keep your existing components
// import FacilitiesSection from "@/components/admin/category/FacilitiesSection";
// import ServicesSection from "@/components/admin/category/ServicesSection";
// import DropdownLabelSection from "@/components/admin/category/DropdownLabelSection";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);
  const [modalType, setModalType] = useState("category");
  const [loading, setLoading] = useState(false);

  // 🔥 NEW
  const [activeSection, setActiveSection] = useState("list");
  // list | edit-category | facilities | services | dropdown

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAllCategories();
      if (res?.status) setCategories(res?.data || []);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ACTIONS ================= */

  const handleEdit = (category) => {
    setSelected(category);
    setParentCategory(null);
    setModalType("category");
    setActiveSection("edit-category"); // 🔥 KEY
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      setLoading(true);
      const payload = {
        ...formData,
        parentId: modalType === "subcategory" ? parentCategory?._id : null,
        ...(selected && { id: selected._id }),
      };

      const res = await createOrUpdateCategory(payload);
      if (res?.status) {
        fetchCategories();
      }
    } finally {
      setLoading(false);
    }
  };

  const goBackToList = () => {
    setActiveSection("list");
    setSelected(null);
    setParentCategory(null);
    setModalType("category");
  };

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen rounded-md bg-gray-50 p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {activeSection !== "list" && (
            <button
              onClick={goBackToList}
              className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-green-700 transition hover:bg-green-200"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <h1 className="text-3xl font-semibold text-gray-800">
            {activeSection === "list" ? "Category" : "Edit Category"}
          </h1>
        </div>

        {activeSection === "list" && (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => {
                setSelected(null);
                setModalType("category");
                setActiveSection("edit-category");
              }}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-700"
            >
              <Plus size={18} /> Create Category
            </button>
            {/* <Link
              href="/admin/categories/bulk-features"
              className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              Add Bulk Features
            </Link> */}
          </div>
        )}
      </div>

      {/* ================= TABS ================= */}
      {activeSection !== "list" && (
        <div className="mb-6 border-b flex gap-6 text-sm font-medium">
          {[
            ["edit-category", "Edit Category"],
            ["facilities", "Edit Facilities"],
            ["services", "Edit Services"],
            ["dropdown", "Edit Dropdown label"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`pb-2 ${
                activeSection === key
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div className="rounded-2xl bg-white p-4 shadow">
        {/* LIST */}
        {activeSection === "list" && (
          <CategoryTable
            categories={categories}
            onEdit={handleEdit}
            isLoading={loading}
          />
        )}

        {/* EDIT CATEGORY */}
        {activeSection === "edit-category" && (
          <AddEditForm
            isOpen={true}
            category={selected}
            type="category"
            onCategoryCreated={fetchCategories}
            onSubmit={handleCreateOrUpdate}
            onClose={goBackToList}
          />
        )}

        {/* EDIT FACILITIES */}
        {activeSection === "facilities" && (
          <div>
            {/* ⬇️ plug your existing facilities component */}
            {/* <FacilitiesSection categoryId={selected?._id} /> */}
            <p className="text-gray-500">Facilities section</p>
          </div>
        )}

        {/* EDIT SERVICES */}
        {activeSection === "services" && (
          <div>
            {/* <ServicesSection categoryId={selected?._id} /> */}
            <p className="text-gray-500">Services section</p>
          </div>
        )}

        {/* EDIT DROPDOWN */}
        {activeSection === "dropdown" && (
          <div>
            {/* <DropdownLabelSection categoryId={selected?._id} /> */}
            <p className="text-gray-500">Dropdown label section</p>
          </div>
        )}
      </div>
    </div>
  );
}
