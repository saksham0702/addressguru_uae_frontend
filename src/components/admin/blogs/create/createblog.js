// pages/admin/blogs/create.jsx  (reuse same file for edit by passing ?id=xxx)
// Install: npm install react-quill

import { useState, useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import {
  getCategories,
  createBlog,
  updateBlog,
  adminGetAllBlogs,
  getBlogBySlug,
} from "@/api/uae-blogs";

import { API_URL } from "@/services/constants";
import TinyEditor from "../../editor/editor";

// ── Image Preview component ───────────────────────────────────────────────────
const ImagePicker = ({ label, name, preview, onChange }) => (
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
      {preview ? (
        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={preview}
            alt="preview"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity
            flex items-center justify-center text-white text-xs font-medium"
          >
            Change Image
          </div>
        </div>
      ) : (
        <div
          className="w-full h-40 border-2 border-dashed border-gray-200 rounded-lg
          flex flex-col items-center justify-center text-gray-400 hover:border-orange-400
          hover:text-orange-400 transition-colors"
        >
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
          <span className="text-xs">Click to upload</span>
        </div>
      )}
    </label>
  </div>
);

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
  const API_URL = "https://addressguru.ae/api";
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [form, setForm] = useState({
    // core
    blogid: "",
    title: "",
    excerpt: "",
    content: "",
    category_id: "",
    tags: "", // comma-separated string → JSON array on submit
    status: "draft",
    featured: false,
    // author
    authorName: "",
    authorBio: "",
    authorJobTitle: "",
    authorTwitter: "",
    authorLinkedin: "",
    authorGithub: "",
    authorWebsite: "",
    // seo
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
        if (catRes?.status == true) setCategories(catRes.data);

        // 🔥 EDIT MODE
        if (id) {
          const res = await getBlogBySlug(id);

          const blog = res?.data;
          if (!blog) return;

          // ✅ Prefill form
          setForm({
            title: blog.title || "",
            excerpt: blog.excerpt || "",
            content: blog.content || "",
            category_id: blog.category_id?._id || "",
            tags: blog.tags?.join(", ") || "",
            status: blog.status || "draft",
            featured: blog.featured || false,
            blogid: blog._id || "",
            authorName: blog.author?.name || "",
            authorBio: blog.author?.bio || "",
            authorJobTitle: blog.author?.jobTitle || "",
            authorTwitter: blog.author?.social?.twitter || "",
            authorLinkedin: blog.author?.social?.linkedin || "",
            authorGithub: blog.author?.social?.github || "",
            authorWebsite: blog.author?.social?.website || "",

            seoTitle: blog.seo?.title || "",
            seoDescription: blog.seo?.description || "",
            seoKeywords: blog.seo?.keywords?.join(", ") || "",
          });

          // ✅ Image previews
          if (blog.coverImage) {
            setCoverPreview(`${API_URL}/${blog.coverImage}`);
          }

          if (blog.author?.avatar) {
            setAvatarPreview(`${API_URL}/${blog.author.avatar}`);
          }
        }
      } catch {
        showToast("error", "Failed to load data");
      }
    };

    if (router.isReady) init();
  }, [router.isReady, id]);
  // ── Field change ─────────────────────────────────────────────────────────────
  const set = (key) => (e) =>
    setForm((p) => ({
      ...p,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  // ── Image handlers ────────────────────────────────────────────────────────────
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.content || form.content.trim() === "<p><br></p>") {
      newErrors.content = "Content is required";
    }

    if (!form.authorName.trim()) {
      newErrors.authorName = "Author name is required";
    }

    if (!form.category_id) {
      newErrors.category_id = "Category is required";
    }

    // Optional but professional checks
    if (form.seoDescription.length > 160) {
      newErrors.seoDescription = "Max 160 characters allowed";
    }

    return newErrors;
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e, saveStatus) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return showToast("error", "Please fix form errors");
    }

    const fd = new FormData();
    const payload = { ...form, status: saveStatus || form.status };

    Object.entries(payload).forEach(([k, v]) => {
      if (k === "tags") {
        fd.append(
          "tags",
          JSON.stringify(
            v
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          ),
        );
      } else if (k === "seoKeywords") {
        fd.append(
          "seoKeywords",
          JSON.stringify(
            v
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          ),
        );
      } else {
        fd.append(k, String(v));
      }
    });

    if (coverFile) fd.append("coverImage", coverFile);
    if (avatarFile) fd.append("authorAvatar", avatarFile);

    setSubmitting(true);

    try {
      const res = id
        ? await updateBlog(form?.blogid, fd)
        : await createBlog(fd);

      if (res?.success) {
        showToast("success", id ? "Blog updated!" : "Blog created!");
        setTimeout(() => router.push("/admin/blogs"), 1200);
      } else {
        showToast("error", res?.message || "Something went wrong");
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Request failed");
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
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium
          ${toast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}
        >
          {toast.msg}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 font-sans">
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
            <button
              type="button"
              disabled={submitting}
              onClick={(e) => handleSubmit(e, "draft")}
              className="px-4 py-2 text-sm border border-gray-200 text-gray-600 font-semibold
                rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
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
                    value={form.title}
                    onChange={(e) => {
                      set("title")(e);
                      if (errors.title) setErrors((p) => ({ ...p, title: "" }));
                    }}
                    className={`${inputCls} ${errors.title ? "border-red-400 focus:ring-red-300" : ""}`}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                  )}
                </Field>
                <Field
                  label="Excerpt"
                  hint="Shown in blog cards and meta description fallback"
                >
                  <textarea
                    rows={2}
                    placeholder="Short summary (max 300 chars)…"
                    maxLength={300}
                    value={form.excerpt}
                    onChange={set("excerpt")}
                    className={`${inputCls} resize-none`}
                  />
                  <p className="text-xs text-gray-300 text-right mt-1">
                    {form.excerpt.length}/300
                  </p>
                </Field>
                <Field label="Content" required>
                  <TinyEditor
                    value={form.content}
                    onChange={(value) => {
                      setForm((prev) => ({ ...prev, content: value }));
                      if (errors.content)
                        setErrors((p) => ({ ...p, content: "" }));
                    }}
                  />

                  {errors.content && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.content}
                    </p>
                  )}
                </Field>
              </Section>

              {/* SEO */}
              <Section title="SEO">
                <Field label="SEO Title" hint="Defaults to blog title if empty">
                  <input
                    type="text"
                    placeholder="SEO optimised title…"
                    value={form.seoTitle}
                    onChange={set("seoTitle")}
                    className={inputCls}
                  />
                </Field>
                <Field label="Meta Description" hint="Max 160 characters">
                  <textarea
                    value={form.seoDescription}
                    onChange={(e) => {
                      set("seoDescription")(e);
                      if (errors.seoDescription)
                        setErrors((p) => ({ ...p, seoDescription: "" }));
                    }}
                    className={`${inputCls} ${errors.seoDescription ? "border-red-400" : ""}`}
                  />

                  {errors.seoDescription && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.seoDescription}
                    </p>
                  )}
                </Field>
                <Field
                  label="SEO Keywords"
                  hint="Comma separated — nodejs, mongodb, express"
                >
                  <input
                    type="text"
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
              <Section title="Publish">
                <Field label="Status">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 font-medium">
                      {form.status === "published" ? "Published" : "Draft"}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          status:
                            p.status === "published" ? "draft" : "published",
                        }))
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        form.status === "published"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 left-0 h-5 bg-white rounded-full shadow transition-transform
        ${form.status === "published" ? "translate-x-5" : "translate-x-0.5"}`}
                      />
                    </button>
                  </div>
                </Field>
                <Field label="Category">
                  <select
                    value={form.category_id}
                    onChange={(e) => {
                      set("category_id")(e);
                      if (errors.category_id) {
                        setErrors((p) => ({ ...p, category_id: "" }));
                      }
                    }}
                    className={`${inputCls} ${
                      errors.category_id
                        ? "border-red-400 focus:ring-red-300"
                        : ""
                    }`}
                  >
                    <option value="">Select category…</option>
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
                    placeholder="technology, nodejs, tips"
                    value={form.tags}
                    onChange={set("tags")}
                    className={inputCls}
                  />
                </Field>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({ ...p, featured: !p.featured }))
                    }
                    className={`relative w-10 h-5 rounded-full transition-colors ${form.featured ? "bg-orange-500" : "bg-gray-200"}`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 left-0 bg-white rounded-full shadow transition-transform
                      ${form.featured ? "translate-x-5" : "translate-x-0.5"}`}
                    />
                  </button>
                  <span className="text-sm text-gray-600 font-medium">
                    Featured post
                  </span>
                </div>
              </Section>

              {/* Cover image */}
              <Section title="Cover Image">
                <ImagePicker
                  label="Cover Photo"
                  name="coverImage"
                  preview={coverPreview}
                  onChange={handleCoverChange}
                />
              </Section>

              {/* Author */}
              <Section title="Author">
                <ImagePicker
                  label="Author Avatar"
                  name="authorAvatar"
                  preview={avatarPreview}
                  onChange={handleAvatarChange}
                />
                <Field label="Full Name" required>
                  <input
                    type="text"
                    value={form.authorName}
                    onChange={(e) => {
                      set("authorName")(e);
                      if (errors.authorName)
                        setErrors((p) => ({ ...p, authorName: "" }));
                    }}
                    className={`${inputCls} ${errors.authorName ? "border-red-400" : ""}`}
                  />

                  {errors.authorName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.authorName}
                    </p>
                  )}
                </Field>
                <Field label="Designation">
                  <input
                    type="text"
                    placeholder="Senior Developer"
                    value={form.authorJobTitle}
                    onChange={set("authorJobTitle")}
                    className={inputCls}
                  />
                </Field>
                <Field label="Bio" hint="Shown in 'About the Author' section">
                  <textarea
                    rows={3}
                    maxLength={500}
                    placeholder="Short author bio…"
                    value={form.authorBio}
                    onChange={set("authorBio")}
                    className={`${inputCls} resize-none`}
                  />
                  <p className="text-xs text-gray-300 text-right mt-1">
                    {form.authorBio.length}/500
                  </p>
                </Field>

                {/* Social links — collapsible */}
                <details className="group">
                  <summary
                    className="text-xs font-semibold text-orange-500 cursor-pointer select-none list-none
                    flex items-center gap-1 hover:text-orange-600"
                  >
                    <svg
                      className="w-3.5 h-3.5 group-open:rotate-90 transition-transform"
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
                    Social Links
                  </summary>
                  <div className="mt-3 space-y-3">
                    {[
                      {
                        key: "authorTwitter",
                        placeholder: "https://twitter.com/username",
                        label: "Twitter / X",
                      },
                      {
                        key: "authorLinkedin",
                        placeholder: "https://linkedin.com/in/username",
                        label: "LinkedIn",
                      },
                      {
                        key: "authorGithub",
                        placeholder: "https://github.com/username",
                        label: "GitHub",
                      },
                      {
                        key: "authorWebsite",
                        placeholder: "https://yoursite.com",
                        label: "Website",
                      },
                    ].map(({ key, placeholder, label }) => (
                      <div key={key}>
                        <label className="block text-xs text-gray-500 mb-1">
                          {label}
                        </label>
                        <input
                          type="url"
                          placeholder={placeholder}
                          value={form[key]}
                          onChange={set(key)}
                          className={inputCls}
                        />
                      </div>
                    ))}
                  </div>
                </details>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
