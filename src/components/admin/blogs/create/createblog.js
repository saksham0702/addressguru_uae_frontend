// pages/admin/blogs/create.jsx (reuse same file for edit by passing ?id=xxx)
// Install: npm install react-quill

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  getCategories,
  createBlog,
  updateBlog,
  getBlogBySlug,
} from "@/api/uae-blogs";
import { API_URL, APP_URL } from "@/services/constants";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const TinyEditor = dynamic(() => import("../../editor/editor"), {
  ssr: false,
});

// ── Image Preview component ───────────────────────────────────────────────────
const ImagePicker = ({ label, name, preview, onChange, onRemove }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      <label className="block cursor-pointer">
        <input
          type="file"
          name={name}
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
        {preview && !imageError ? (
          <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 group">
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Image failed to load:", preview);
                setImageError(true);
              }}
              onLoad={() => {
                console.log("Image loaded successfully:", preview);
                setImageError(false);
              }}
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="text-white text-xs font-medium">
                Change Image
              </span>
              {onRemove && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-40 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-400 transition-colors">
            <svg
              className="w-8 h-8 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs">
              {imageError
                ? "Failed to load image - Click to upload new"
                : "Click to upload"}
            </span>
          </div>
        )}
      </label>
      {/* Debug info - remove in production */}
      {preview && (
        <p className="text-xs text-gray-400 mt-1 break-all">
          Preview: {preview}
        </p>
      )}
    </div>
  );
};

// ── Section heading ───────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100">
      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
        {title}
      </h3>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </div>
);

// ── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, required, children, hint }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1.5">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const inputCls = `w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400
  placeholder:text-gray-300 transition`;

// ─────────────────────────────────────────────────────────────────────────────
export default function CreateBlog() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const { id } = router.query; // present when editing
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [existingCoverImage, setExistingCoverImage] = useState(null); // Track original image
  const { user } = useAuth();
  const author = user?.data;

  // Debug: Log API_URL on mount
  useEffect(() => {
    console.log("API_URL:", API_URL);
  }, []);

  const [form, setForm] = useState({
    blogid: "",
    title: "",
    content: "",
    category_id: "",
    tags: "",
    status: "draft",
    featured: false,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  // ── Toast ────────────────────────────────────────────────────────────────────
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Load categories + (if editing) existing blog ─────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const catRes = await getCategories();
        if (catRes?.status === true) setCategories(catRes.data);

        // 🔥 EDIT MODE
        if (id) {
          const res = await getBlogBySlug(id);
          const blog = res?.data;

          if (!blog) {
            showToast("error", "Blog not found");
            return;
          }

          // ✅ Prefill form
          setForm({
            title: blog.title || "",
            content: blog.content || "",
            category_id: blog.category_id?._id || "",
            tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
            status: blog.status || "draft",
            featured: blog.featured || false,
            blogid: blog._id || "",
            seoTitle: blog.seo?.title || "",
            seoDescription: blog.seo?.description || "",
            seoKeywords: Array.isArray(blog.seo?.keywords)
              ? blog.seo.keywords.join(", ")
              : "",
          });

          // ✅ Handle existing cover image
          if (blog.coverImage) {
            // Remove any leading slashes to avoid double slashes
            const cleanPath = blog.coverImage.replace(/^\/+/, "");
            const imageUrl = blog.coverImage.startsWith("http")
              ? blog.coverImage
              : `${APP_URL}/${cleanPath}`;

            console.log("Setting cover preview:", imageUrl); // Debug log
            setCoverPreview(imageUrl);
            setExistingCoverImage(blog.coverImage);
          }
        }
      } catch (error) {
        console.error("Init error:", error);
        showToast("error", "Failed to load data");
      }
    };

    if (router.isReady) init();
  }, [router.isReady, id]);

  // ── Field change ─────────────────────────────────────────────────────────────
  const set = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [key]: value }));

    // Clear error for this field
    if (errors[key]) {
      setErrors((p) => ({ ...p, [key]: "" }));
    }
  };

  // ── Image handlers ────────────────────────────────────────────────────────────
  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast("error", "Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Image size should be less than 5MB");
      return;
    }

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setExistingCoverImage(null); // Clear existing image reference
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setExistingCoverImage(null);
  };

  // ── Validation ────────────────────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (
      !form.content ||
      form.content.trim() === "<p><br></p>" ||
      form.content.trim() === ""
    ) {
      newErrors.content = "Content is required";
    }

    if (!form.category_id) {
      newErrors.category_id = "Category is required";
    }

    if (form.seoDescription && form.seoDescription.length > 160) {
      newErrors.seoDescription =
        "Meta description should be max 160 characters";
    }

    return newErrors;
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e, publishStatus = null) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      showToast("error", "Please fix the form errors");
      // Scroll to first error
      const firstError = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const fd = new FormData();

    // Prepare payload
    const payload = {
      ...form,
      status: publishStatus || form.status, // Allow override from button
    };

    // Remove blogid from payload (used only for routing)
    delete payload.blogid;

    // Append form fields
    Object.entries(payload).forEach(([k, v]) => {
      if (k === "tags" || k === "seoKeywords") {
        // Convert comma-separated string to JSON array
        const arr =
          typeof v === "string"
            ? v
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [];
        fd.append(k, JSON.stringify(arr));
      } else if (k === "featured") {
        fd.append("featured", v ? "true" : "false");
      } else {
        fd.append(k, v ?? "");
      }
    });

    // Append new cover image if selected
    if (coverFile instanceof File) {
      fd.append("coverImage", coverFile);
    }
    // Note: Backend will keep existing image if no new file is uploaded

    setSubmitting(true);

    try {
      const res = id ? await updateBlog(form.blogid, fd) : await createBlog(fd);

      if (res?.success || res?.status) {
        const message = id
          ? "Blog updated successfully!"
          : "Blog created successfully!";
        showToast("success", message);

        setTimeout(() => {
          router.push("/admin/blogs/list");
        }, 1200);
      } else {
        showToast("error", res?.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Submit error:", err);
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to save blog";
      showToast("error", errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{id ? "Edit Blog" : "Create Blog"} | Admin</title>
      </Head>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium animate-slide-in
          ${toast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {toast.msg}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {id ? "Edit Blog" : "Create New Blog"}
              </h1>
              <p className="text-xs text-gray-400">Fill in the details below</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Save as Draft */}
            <button
              type="button"
              disabled={submitting}
              onClick={(e) => handleSubmit(e, "draft")}
              className="px-5 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold
                rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              Save Draft
            </button>

            {/* Publish */}
            <button
              type="button"
              disabled={submitting}
              onClick={(e) => handleSubmit(e, "published")}
              className="px-5 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold
                rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && (
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {id ? "Update" : "Publish"}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-8xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* ── Left column (content) ─────────────────────────────────── */}
            <div className="xl:col-span-2 space-y-6">
              {/* Core */}
              <Section title="Post Details">
                <Field label="Title" required>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={set("title")}
                    placeholder="Enter blog title..."
                    className={`${inputCls} ${errors.title ? "border-red-400 focus:ring-red-300" : ""}`}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                  )}
                </Field>

  

                <Field label="Content" required>
                  <div
                    className={
                      errors.content ? "border-2 border-red-400 rounded-lg" : ""
                    }
                  >
                    <TinyEditor
                      value={form.content}
                      onChange={(value) => {
                        setForm((prev) => ({ ...prev, content: value }));
                        if (errors.content) {
                          setErrors((p) => ({ ...p, content: "" }));
                        }
                      }}
                    />
                  </div>
                  {errors.content && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.content}
                    </p>
                  )}
                </Field>
              </Section>

              {/* SEO */}
              <Section title="SEO Settings">
                <Field label="SEO Title" hint="Defaults to blog title if empty">
                  <input
                    type="text"
                    name="seoTitle"
                    placeholder="Custom SEO title..."
                    value={form.seoTitle}
                    onChange={set("seoTitle")}
                    className={inputCls}
                  />
                </Field>

                <Field
                  label="Meta Description"
                  hint="Recommended: 150-160 characters"
                >
                  <textarea
                    rows={3}
                    name="seoDescription"
                    placeholder="Write a compelling meta description..."
                    value={form.seoDescription}
                    onChange={set("seoDescription")}
                    className={`${inputCls} resize-none ${errors.seoDescription ? "border-red-400" : ""}`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.seoDescription && (
                      <p className="text-xs text-red-500">
                        {errors.seoDescription}
                      </p>
                    )}
                    <p
                      className={`text-xs ml-auto ${form.seoDescription.length > 160 ? "text-red-500" : "text-gray-400"}`}
                    >
                      {form.seoDescription.length}/160
                    </p>
                  </div>
                </Field>

                <Field
                  label="SEO Keywords"
                  hint="Comma separated (e.g., nodejs, mongodb, express)"
                >
                  <input
                    type="text"
                    name="seoKeywords"
                    placeholder="nodejs, mongodb, express"
                    value={form.seoKeywords}
                    onChange={set("seoKeywords")}
                    className={inputCls}
                  />
                </Field>
              </Section>
            </div>

            {/* ── Right column (meta + images) ──────────────────────────── */}
            <div className="space-y-6">
              {/* Publish settings */}
              <Section title="Publish Settings">
                <Field label="Category" required>
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={set("category_id")}
                    className={`${inputCls} ${errors.category_id ? "border-red-400 focus:ring-red-300" : ""}`}
                  >
                    <option value="">Select category...</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.category_id}
                    </p>
                  )}
                </Field>

                <Field label="Tags" hint="Comma separated">
                  <input
                    type="text"
                    name="tags"
                    placeholder="technology, nodejs, tips"
                    value={form.tags}
                    onChange={set("tags")}
                    className={inputCls}
                  />
                </Field>

                <Field label="Status">
                  <select
                    name="status"
                    value={form.status}
                    onChange={set("status")}
                    className={inputCls}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </Field>

                {/* <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({ ...p, featured: !p.featured }))
                    }
                    className={`relative w-10 h-5 rounded-full transition-colors ${form.featured ? "bg-orange-500" : "bg-gray-200"}`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform
                      ${form.featured ? "translate-x-5" : "translate-x-0.5"}`}
                    />
                  </button>
                  <span className="text-sm text-gray-600 font-medium">
                    Featured post
                  </span>
                </div> */}
              </Section>

              {/* Cover image */}
              <Section title="Cover Image">
                <ImagePicker
                  label="Cover Photo"
                  name="coverImage"
                  preview={coverPreview}
                  onChange={handleCoverChange}
                  onRemove={coverPreview ? handleRemoveCover : null}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Recommended size: 1200x630px (16:9 ratio)
                </p>
              </Section>

              {/* Author */}
              <Section title="Author">
                <div className="space-y-4">
                  {/* Profile Card */}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0 bg-white">
                      <Image
                        src={
                          author?.avatar?.startsWith("http")
                            ? author.avatar
                            : author?.avatar
                              ? `${APP_URL}/${author.avatar}`
                              : "/assets/default-avatar.png"
                        }
                        alt={author?.name || "Author"}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {author?.name || "—"}
                      </h4>
                      {author?.designation ? (
                        <p className="text-xs text-orange-500 font-medium mt-0.5">
                          {author.designation}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-0.5 italic">
                          No designation set
                        </p>
                      )}
                      {author?.profile_bio ? (
                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-3">
                          {author.profile_bio}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1.5 italic">
                          No bio added
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Social Links */}
                  {(() => {
                    const social =
                      Array.isArray(author?.socialLinks) &&
                      author.socialLinks.length > 0
                        ? author.socialLinks[0]
                        : {};
                    const items = [
                      { label: "Facebook", value: social?.facebook },
                      { label: "LinkedIn", value: social?.linkedin },
                      { label: "Instagram", value: social?.instagram },
                      { label: "Telegram", value: social?.telegram },
                    ].filter((s) => s.value);

                    if (!items.length) return null;

                    return (
                      <div className="flex flex-wrap gap-2">
                        {items.map((s) => (
                          <a
                            key={s.label}
                            href={
                              s.value.startsWith("http")
                                ? s.value
                                : `https://${s.value}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                              bg-white border border-gray-200 rounded-full text-gray-600
                              hover:border-orange-300 hover:text-orange-500 transition-colors"
                          >
                            {s.label}
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Update Profile prompt */}
                  {(!author?.designation ||
                    !author?.profile_bio ||
                    !author?.avatar) && (
                    <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <svg
                        className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
                        />
                      </svg>
                      <div>
                        <p className="text-xs text-amber-700 font-medium">
                          Complete your profile for better author representation
                        </p>
                        <button
                          type="button"
                          onClick={() => router.push("/admin/my-profile")}
                          className="mt-1.5 text-xs text-orange-500 hover:text-orange-600 font-semibold
                            flex items-center gap-1 transition-colors"
                        >
                          Update Profile
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            </div>
          </div>
        </div>
      </div>

      {/* <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style> */}
    </>
  );
}
