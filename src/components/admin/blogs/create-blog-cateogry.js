// pages/admin/blog-categories.jsx
import { useState, useEffect } from "react";
import Head from "next/head";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/uae-blogs";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "../cities/deletemodal";

export default function BlogCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const router = useRouter();

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      if (res?.status === true) setCategories(res.data || []);
    } catch {
      showToast("error", "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openEdit = (cat) => {
    setEditTarget(cat);
    setForm({
      name: cat.name,
      description: cat.description || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditTarget(null);
    setForm({ name: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      return showToast("error", "Name is required");
    }

    setSubmitting(true);

    try {
      if (editTarget) {
        const res = await updateCategory(editTarget._id, form);

        if (res?.success) {
          showToast("success", "Category updated");
          await fetchCategories();
          resetForm();
        } else showToast("error", res?.message || "Update failed");
      } else {
        const res = await createCategory(form);

        if (res?.success) {
          showToast("success", "Category created");
          await fetchCategories();
          resetForm();
        } else showToast("error", res?.message || "Create failed");
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteCategory(id);

      if (res?.success) {
        showToast("success", "Category deleted");
        await fetchCategories();
      } else showToast("error", res?.message || "Delete failed");
    } catch {
      showToast("error", "Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <Head>
        <title>Blog Categories | Admin</title>
      </Head>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium border backdrop-blur
          ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Blog Categories
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and organize blog categories
              </p>
            </div>

            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              ← Back
            </button>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* FORM CARD */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-gray-800 mb-6">
                  {editTarget ? "Edit Category" : "Create Category"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Category Name
                    </label>

                    <input
                      type="text"
                      value={form.name}
                      placeholder="Technology"
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm
                      focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Description
                    </label>

                    <textarea
                      rows={3}
                      value={form.description}
                      placeholder="Optional category description"
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm
                      focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium
                      hover:bg-orange-600 transition disabled:opacity-50"
                    >
                      {submitting
                        ? "Processing..."
                        : editTarget
                          ? "Update Category"
                          : "Create Category"}
                    </button>

                    {editTarget && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* LIST CARD */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[520px]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800">Categories</h2>

                  <span className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full font-medium">
                    {categories.length}
                  </span>
                </div>

                {/* List */}
                {loading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                    {categories.map((cat) => (
                      <div
                        key={cat._id}
                        className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {cat.name}
                          </p>

                          {cat.description && (
                            <p className="text-xs text-gray-400 mt-1">
                              {cat.description}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(cat)}
                            className="text-xs px-3 py-1.5 border border-gray-200 rounded-md text-gray-600 hover:border-orange-400 hover:text-orange-500 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => setDeleteId(cat._id)}
                            className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded-md hover:bg-red-50 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
      />
    </>
  );
}
