"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, ArrowLeft, Plus } from "lucide-react";
import { getCategories, deleteCategory, updateCategory } from "@/api/uae-blogs";
import DeleteConfirmModal from "../cities/deletemodal";

export default function BlogCategoriesTable() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState(null);

  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // ── Fetch Categories ─────────────────────
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();

      if (res?.status) {
        setCategories(res.data || []);
      }
    } catch {
      console.error("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ── Open Edit ────────────────────────────
  const openEdit = (cat) => {
    setEditTarget(cat);
    setForm({
      name: cat.name,
      description: cat.description || "",
    });
  };

  const closeEdit = () => {
    setEditTarget(null);
    setForm({ name: "", description: "" });
  };

  // ── Update Category ──────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    setSubmitting(true);

    try {
      const res = await updateCategory(editTarget._id, form);

      if (res?.status == true) {
        closeEdit(); // ✅ close modal
        await fetchCategories(); // ✅ sync data again
      }
    } catch {
      console.error("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete Category ──────────────────────
  const handleDelete = async (id) => {
    try {
      const res = await deleteCategory(id);

      if (res?.status == true) {
        await fetchCategories(); // ✅ refresh list
      }
    } catch {
      console.error("Delete failed");
    } finally {
      setDeleteId(null); // close modal
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>

        <button
          onClick={() => router.push("/admin/blogs/create-blog-category")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          <Plus size={16} />
          Create Category
        </button>
      </div>

      <h1 className="text-3xl font-semibold text-gray-900 mb-4">
        Blog Categories
      </h1>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm border-collapse">
          {/* Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 border-r border-gray-200 w-[60px]">
                #
              </th>

              <th className="px-6 py-3 text-left font-semibold text-gray-700 border-r border-gray-200">
                Name
              </th>

              <th className="px-6 py-3 text-left font-semibold text-gray-700 border-r border-gray-200">
                Slug
              </th>

              <th className="px-6 py-3 text-left font-semibold text-gray-700 border-r border-gray-200">
                Created
              </th>

              <th className="px-6 py-3 text-center font-semibold text-gray-700 w-[140px]">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Loading categories...
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((cat, index) => (
                <tr
                  key={cat._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 border-r border-gray-100 text-gray-600">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4 border-r border-gray-100">
                    <p className="font-semibold text-gray-900">{cat.name}</p>
                  </td>

                  <td className="px-6 py-4 border-r border-gray-100 text-gray-700 font-mono text-xs">
                    {cat.slug}
                  </td>

                  <td className="px-6 py-4 border-r border-gray-100 text-gray-700">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="flex items-center justify-center w-8 h-8 rounded-md border border-yellow-200 text-yellow-600 hover:bg-yellow-50 transition"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={() => setDeleteId(cat._id)}
                        className="flex items-center justify-center w-8 h-8 rounded-md border border-red-200 text-red-500 hover:bg-red-50 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
      />

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Category
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800"
                placeholder="Category name"
              />

              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800"
                placeholder="Description"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-orange-500  text-white rounded-lg text-sm"
                >
                  {submitting ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
