"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import AddSubCategoryModal from "@/components/admin/categorypopup/addsubcategorypopup";
import {
  deleteSubCategory,
  getSubCategoriesByCategory,
} from "@/api/uaeAdminCategories";

export default function CategoryTable() {
  const router = useRouter();
  const { slug } = router.query;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchData = async () => {
    if (!slug) return;

    try {
      setLoading(true);

      // 2️⃣ get subcategories by category _id
      const subRes = await getSubCategoriesByCategory(slug);

      setData(subRes?.data || []);
    } catch (err) {
      console.log("Fetch subcategories error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [slug]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this subcategory?")) return;

    try {
      await deleteSubCategory(id);
      fetchData(); // refresh list
    } catch (error) {
      alert("Failed to delete subcategory");
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const closeModal = () => {
    setEditItem(null);
    setOpenModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ===== Header ===== */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-2xl font-semibold text-gray-900"><span className="text-blue-500 capitalize"> {slug} </span>Subcategories</h1>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Create Sub Category
        </button>
      </div>

      {/* ===== Card ===== */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto p-4">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-600">
                <th className="px-6 py-4 text-left font-medium">#</th>
                <th className="px-6 py-4 text-left font-medium">Name</th>
                <th className="px-6 py-4 text-left font-medium">Created at</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-500">
                    Loading…
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-500">
                    No subcategories found
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-100 last:border-none hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="rounded-md border border-gray-200 px-3 py-1.5 text-xs hover:bg-gray-100">
                          Dropdown
                        </button>

                        <button
                          onClick={() => setOpenModal(true)}
                          className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-green-600 hover:bg-gray-100"
                        >
                          +
                        </button>

                        <a
                          href={`/admin/sub-categories/subcategory/${item._id}`}
                          className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-blue-600 hover:bg-gray-100"
                        >
                          ✏️
                        </a>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-red-600 hover:bg-gray-100"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Modal ===== */}
      <AddSubCategoryModal
        open={openModal}
        onClose={closeModal}
        slug={slug}
        editData={editItem}
        onSuccess={fetchData}
      />
    </div>
  );
}
