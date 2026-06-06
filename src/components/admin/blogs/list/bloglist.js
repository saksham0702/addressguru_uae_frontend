"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import { getBlogs } from "@/api/uae-blogs";
import Image from "next/image";

export default function BlogList() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalBlogs, setTotalBlogs] = useState(0);
  const limit = 10;

  //   const API_URL = "
  // .168.29.191:5001";
  const API_URL = "https://addressguru.ae/api";

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getBlogs({
        page: currentPage,
        limit: limit,
        search: searchQuery,
      });

      if (!res) {
        setBlogs([]);
        setLoading(false);
        return;
      }

      const blogData = res?.blogs || [];
      const pages = res?.pagination?.totalPages || 1;
      const totalResults = res?.pagination?.total || 0;

      const formatted = (blogData || []).map((item) => ({
        id: item._id,
        title: item.title,
        slug: item.slug,
        image: `${API_URL}/${item.coverImage}`,
        category: item.category_id?.name || "—",
        author: item.author?.name || "—",
        createdAt: new Date(item.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        status: item.status,
      }));
      setBlogs(formatted);
      setTotalPages(pages || 1);
      setTotalBlogs(totalResults || 0);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, API_URL, limit]);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, fetchBlogs]);

  const handleDelete = (id) => {
    if (confirm("Delete this blog?")) {
      console.log("Delete blog", id);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
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

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex justify-between items-end mb-5">
        <h1 className="text-3xl font-semibold text-gray-800">Blogs</h1>
        <p className="text-sm text-gray-500">Total: {totalBlogs} blogs</p>
      </div>

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
                  // "Author",
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
                      {(currentPage - 1) * limit + index + 1}
                    </td>

                    {/* Image */}
                    <td className="px-4 py-4 border-r border-gray-200">
                      <div className="w-28 h-24 relative rounded-md overflow-hidden border border-gray-200">
                        <Image
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
                      {blog?.category}
                    </td>

                    {/* Author */}
                    {/* <td className="px-4 py-4 border-r border-gray-200 text-gray-700">
                      {blog.author?.name}
                    </td> */}

                    {/* Date */}
                    <td className="px-4 py-4 border-r border-gray-200 text-gray-500 whitespace-nowrap">
                      {blog.createdAt}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 border-r border-gray-200">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        {blog.status === "published" ? "Active" : "published"}
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

        {/* Pagination Controls */}
        {!loading && blogs.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * limit, totalBlogs)}
              </span>{" "}
              of <span className="font-medium">{totalBlogs}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Show current page, and 2 pages before and after
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  // Show ellipses
                  if (
                    pageNum === currentPage - 3 ||
                    pageNum === currentPage + 3
                  ) {
                    return (
                      <span key={pageNum} className="px-1">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
