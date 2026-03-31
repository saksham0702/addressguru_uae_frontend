"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import { getBlogs } from "@/api/uae-blogs";

export default function BlogList() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  //   const API_URL = "
  // .168.29.191:5001";
  const API_URL = "https://addressguru.ae/api";
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    const res = await getBlogs({
      page: 1,
      limit: 10,
      search: "",
    });

    // 🔥 adjust based on your backend response
    setBlogs(res || res || []);

    // 🔥 Transform backend → UI format
    const formatted = res.map((item) => ({
      id: item._id,
      title: item.title,
      slug: item.slug,
      image: `${API_URL}/${item.coverImage}`,
      category: item.category?.name || "—",
      author: item.author?.name || "—",
      createdAt: new Date(item.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      status: item.status,
    }));

    setBlogs(formatted);
    setLoading(false);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this blog?")) {
      console.log("Delete blog", id);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <button
            onClick={() => router.push("/admin/blogs/create")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
          >
            <Plus size={16} />
            Create Blog
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-semibold text-gray-800 mb-5">Blogs</h1>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* HEAD */}
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                {[
                  "ID",
                  "Feature Image",
                  "Title",
                  "Slug",
                  "Category",
                  "Author",
                  "Created",
                  "Status",
                  "Operation",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-3 font-medium text-left border-r bg-slate-100 border-gray-200 last:border-r-0"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-gray-500">
                    Loading blogs...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-gray-400">
                    No blogs found
                  </td>
                </tr>
              ) : (
                blogs.map((blog, index) => (
                  <tr
                    key={blog.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    {/* ID */}
                    <td className="px-4 py-4 border-r border-gray-200">
                      {index + 1}
                    </td>

                    {/* Image */}
                    <td className="px-4 py-4 border-r border-gray-200">
                      <div className="w-28 h-24 relative rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          fill
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-4 py-4 border-r border-gray-200 max-w-[260px] font-medium text-gray-800">
                      {blog.title}
                    </td>

                    {/* Slug */}
                    <td className="px-4 py-4 border-r border-gray-200 text-gray-500 max-w-[280px] break-words">
                      {blog.slug}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4 border-r border-gray-200 text-gray-700">
                      {blog.category}
                    </td>

                    {/* Author */}
                    <td className="px-4 py-4 border-r border-gray-200 text-gray-700">
                      {blog.author}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 border-r border-gray-200 text-gray-500 whitespace-nowrap">
                      {blog.createdAt}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 border-r border-gray-200">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        {blog.status === "published" ? "Active" : "Draft"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 flex justify-center items-center h-full pt-10 gap-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/blogs/update/${blog.slug}`)
                        }
                        className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-md shadow-sm"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md shadow-sm"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
