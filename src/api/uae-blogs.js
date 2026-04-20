// api/blogs.js
// ─────────────────────────────────────────────────────────────────────────────
// All blog + category API calls in one place.
// Usage: import { getBlogs, createBlog, ... } from "@/api/blogs"
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";
const API_URL = "https://addressguru.ae/api";
// const API_URL = "http://192.168.31.107:5001";
// const API_URL = "http://192.168.29.191:5001";
const API = axios.create({
  baseURL: API_URL, // e.g. http://localhost:5000/api
});

// Attach token automatically if present (admin routes)
// API.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// ── Public Blog APIs ──────────────────────────────────────────────────────────

export const getBlogs = async ({ page = 1, limit = 10, search = "" } = {}) => {
  try {
    const res = await API.get("/blogs/get-blogs", {
      params: {
        page,
        limit,
        search,
      },
    });
    // console.log("response of blogs:", res);

    return res?.data?.data?.blogs; // full response (pagination + blogs)
  } catch (error) {
    console.log("Error fetching blogs:", error);
    throw error;
  }
};

export const getBlogDetails = async (slug) => {
  const { data } = await API.get(`/blogs/get-blog-by-slug/${slug}`);
  return data;
};

export const getRecentBlogs = async (limit = 6) => {
  const { data } = await API.get("/blogs/get-recent-blogs?limit=6", {
    params: { limit },
  });
  return data;
};

export const getMostViewedBlogs = async (limit = 5) => {
  const { data } = await API.get("/blogs/get-most-viewed-blogs?limit=5", {
    params: { limit },
  });
  return data;
};

export const getBlogBySlug = async (slug) => {
  try {
    const { data } = await API.get(`/blogs/get-blog-by-slug/${slug}`);
    return data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
};

export const getFeaturedBlogs = async () => {
  const { data } = await API.get("/blogs/featured");
  return data;
};

export const getBlogsByCategory = async (categoryId, params = {}) => {
  const { data } = await API.get(
    `/blogs/get-blogs-by-category/${categoryId}?page=1&limit=10`,
    { params },
  );
  return data;
};

// ── Public Category APIs ──────────────────────────────────────────────────────

export const getCategories = async () => {
  const { data } = await API.get("/blogs/get-blog-categories");
  console.log("response of categories:", data);
  return data;
};

// ── Admin Blog APIs ───────────────────────────────────────────────────────────

export const adminGetAllBlogs = async (params = {}) => {
  const { data } = await API.get("/admin/blogs", { params });
  return data;
};

export const createBlog = async (formData) => {
  const { data } = await API.post("/blogs/admin/create-blog", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateBlog = async (id, formData) => {
  const { data } = await API.put(`/blogs/admin/update-blog/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteBlog = async (id) => {
  const { data } = await API.delete(`/admin/blogs/${id}`);
  return data;
};

// ── Admin Category APIs ───────────────────────────────────────────────────────

export const createCategory = async (payload) => {
  const { data } = await API.post("/blogs/admin/create-category", payload);
  return data;
};

export const updateCategory = async (id, payload) => {
  const { data } = await API.put(`/blogs/admin/update-category/${id}`, payload);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await API.delete(`/blogs/admin/delete-category/${id}`);
  return data;
};
