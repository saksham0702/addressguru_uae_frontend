"use client";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Pencil,
  Building2,
  Wrench,
  GraduationCap,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  createOrUpdateCategory,
  getsingleCategory,
  getFeatureByCategory,
  addFeatureItem,
  getFacilitiesByCategory,
  updateFeatureItem,
  deleteFeatureItem,
  getallfeaturesdatabyCategory,
  getAllFeaturesApi,
  assignFeaturesApi,
  removeFeatureFromCategoryApi,
  getsingleSubCategory,
  createOrUpdateSubCategory,
  getSubCategoryFeaturesApi,
  removeFeatureFromSubCategoryApi,
  assignFeaturesToSubCategoryApi,
} from "@/api/uaeAdminCategories";
import AssignStep from "@/components/admin/add-feature/assignstep";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id, type } = router.query;
  const APP_URL = "https://addressguru.ae/api/";

  const [activeTab, setActiveTab] = useState("category");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [courses, setCourses] = useState([]);
  const isSubCategory = type === "subcategory";
  const [entity, setEntity] = useState(null);

  /* ================= CATEGORY ================= */
  const [category, setCategory] = useState({
    id: "",
    name: "",
    slug: "",
    color: "",
    svg: "",
    iconPng: "",
    type: "business",
    status: "Active",
  });

  /* ================= FEATURES ================= */
  const [facilities, setFacilities] = useState([]);
  const [services, setServices] = useState([]);

  const [editingItem, setEditingItem] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignType, setAssignType] = useState(null); // facility | service | course
  const [allFeatures, setAllFeatures] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]);

  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    type: null,
    featureId: null,
  });
  // { type: "facility" | "service", index, id }

  /* ================= FETCH ================= */
  useEffect(() => {
    if (id && type) {
      fetchEntityData();
    }
  }, [id, type]);

  const fetchEntityData = async () => {
    try {
      setLoading(true);

      let res;

      if (isSubCategory) {
        // 1️⃣ Get subcategory basic data
        const subRes = await getsingleSubCategory({ id });

        const subData = subRes?.data;

        setEntity({
          id: subData._id,
          name: subData.name || "",
          status: subData.isActive ? "Active" : "Inactive",
          category: subData.category,
        });

        // 2️⃣ Get subcategory assigned features
        const featureRes = await getSubCategoryFeaturesApi(
          subData?.category, // assuming backend sends this
          id,
        );

        setFacilities(featureRes?.data?.facilities ?? []);
        setServices(featureRes?.data?.services ?? []);
        setCourses(featureRes?.data?.courses ?? []);
      } else {
        res = await getallfeaturesdatabyCategory(id);

        const data = res?.data?.data;

        setEntity({
          id: data.category._id,
          name: data.category.name || "",
          status: data.category.isActive ? "Active" : "Inactive",
          slug: data.category.slug || "",
          color: data.category.color || "",
          svg: data.category.iconSvg || "",
          iconPng: data.category.iconPng || "",
          type: data.category.type || "business",
          textColor: data.category.textColor || "",
          metaTitle: data.category.metaTitle || "",
          metaDescription: data.category.metaDescription || "",
          ogImage: data.category.ogImage || "",
        });

        setFacilities(data.facilities || []);
        setServices(data.services || []);
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.log(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && !isSubCategory) {
      fetchFullCategoryData();
    }
  }, [id, isSubCategory]);

  useEffect(() => {
    const fetchFeatures = async () => {
      const res = await getAllFeaturesApi();
      setAllFeatures(res?.data || []);
    };

    fetchFeatures();
  }, []);

  const facilitiesList = allFeatures.filter((f) => f.type === "facility");
  const servicesList = allFeatures.filter((f) => f.type === "service");
  const coursesList = allFeatures.filter((f) => f.type === "course");

  const fetchFullCategoryData = async () => {
    try {
      setLoading(true);

      const res = await getallfeaturesdatabyCategory(id);
      const data = res?.data?.data;
      console.log("data", data);

      // CATEGORY
      setEntity({
        id: data?.category?._id,
        name: data?.category?.name || "",
        slug: data?.category?.slug || "",
        svg: data?.category?.iconSvg || "",
        iconPng: data?.category?.iconPng || "",
        type: data?.category?.type || "business",
        status: data.category.isActive ? "Active" : "Inactive",
        // ✅ ADD THESE
        metaTitle: data?.category?.seo?.title || "",
        metaDescription: data?.category?.seo?.description || "",
        ogImage: data?.category?.seo?.ogImage || "", // existing URL
      });

      // FACILITIES
      setFacilities(
        data.facilities?.map((item) => ({
          _id: item._id,
          name: item.name,
          checked: true, // already attached
        })) || [],
      );

      // SERVICES
      setServices(
        data.services?.map((item) => ({
          _id: item._id,
          name: item.name,
          checked: true,
        })) || [],
      );

      // COURSES
      setCourses(
        data.courses?.map((item) => ({
          _id: item._id,
          name: item.name,
          checked: true,
        })) || [],
      );
    } catch (err) {
      setError("Failed to fetch category data");
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (type, index) => {
    if (type === "facility") {
      const updated = [...facilities];
      updated[index].checked = !updated[index].checked;
      setFacilities(updated);
    }

    if (type === "service") {
      const updated = [...services];
      updated[index].checked = !updated[index].checked;
      setServices(updated);
    }

    if (type === "course") {
      const updated = [...courses];
      updated[index].checked = !updated[index].checked;
      setCourses(updated);
    }
  };

  /* ================= SAVE CATEGORY ================= */

  const saveEntity = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", entity.name);
      formData.append("slug", entity.slug);
      formData.append("color", entity.color);
      formData.append("iconSvg", entity.svg);
      formData.append("isActive", entity.status === "Active");

      formData.append("metaTitle", entity.metaTitle || "");
      formData.append("metaDescription", entity.metaDescription || "");

      if (entity.ogImage instanceof File) {
        formData.append("ogImage", entity.ogImage);
      }

      await createOrUpdateCategory({
        id: entity.id,
        formData,
      });

      setSuccess("Category updated successfully.");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  /* ================= SAVE / UPDATE FEATURES ================= */

  const handleAssignSave = async () => {
    if (!assignType) return;

    const payload = {
      facilities: [],
      services: [],
      courses: [],
    };

    if (assignType === "facility")
      payload.facilities = selectedIds.map((id) => id.toString());

    if (assignType === "service")
      payload.services = selectedIds.map((id) => id.toString());

    if (assignType === "course")
      payload.courses = selectedIds.map((id) => id.toString());

    if (isSubCategory) {
      await assignFeaturesToSubCategoryApi(
        entity?.category, // 👈 parent category id
        entity.id,
        payload,
      );
    } else {
      await assignFeaturesApi(id, payload);
    }

    setAssignModalOpen(false);
    fetchEntityData();
  };

  const confirmRemoveAssigned = async (type, featureId) => {
    try {
      const typeMap = {
        facility: "facilities",
        service: "services",
        course: "courses",
      };

      const featureType = typeMap[type];

      if (isSubCategory) {
        await removeFeatureFromSubCategoryApi(
          entity.category,
          entity.id,
          featureId,
          featureType,
        );
      } else {
        await removeFeatureFromCategoryApi(id, featureId, featureType);
      }

      if (type === "facility") {
        setFacilities((prev) => prev.filter((f) => f._id !== featureId));
      }
      if (type === "service") {
        setServices((prev) => prev.filter((s) => s._id !== featureId));
      }
      if (type === "course") {
        setCourses((prev) => prev.filter((c) => c._id !== featureId));
      }

      setDeleteConfirm({ open: false, type: null, featureId: null });
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 p-2 ">
      {/* HEADER */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/categories"
          className="rounded-md p-2 hover:bg-gray-200"
        >
          <ArrowLeft />
        </Link>
        <h1 className="text-xl font-semibold text-gray-800">
          {isSubCategory ? "Edit Sub Category" : "Edit Category"}
        </h1>
      </div>

      {success && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* h1 */}
      <div className="mb-6 border-b border-gray-200 flex gap-6 text-sm font-medium">
        {[
          ["category", "Edit Category"],
          ["facilities", "Edit Facilities"],
          ["services", "Edit Services"],
          ["courses", "Courses"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`pb-3 transition ${
              activeTab === key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
        {/* CATEGORY */}
        {activeTab === "category" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                value={entity?.name || ""}
                onChange={(e) =>
                  setEntity((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">SVG Code</label>
              <textarea
                rows={4}
                value={entity?.svg || ""}
                onChange={(e) =>
                  setEntity((prev) => ({
                    ...prev,
                    svg: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-200 px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={entity?.status || "Active"}
                onChange={(e) =>
                  setEntity((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-md font-semibold text-gray-800">
                SEO Settings
              </h3>

              {/* Meta Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Meta Title
                </label>
                <input
                  value={entity?.metaTitle || ""}
                  onChange={(e) =>
                    setEntity((prev) => ({
                      ...prev,
                      metaTitle: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={entity?.metaDescription || ""}
                  onChange={(e) =>
                    setEntity((prev) => ({
                      ...prev,
                      metaDescription: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">OG Image</label>

              {/* Preview */}
              {entity?.ogImage && (
                <img
                  src={
                    entity.ogImage instanceof File
                      ? URL.createObjectURL(entity.ogImage) // new upload
                      : entity.ogImage.startsWith("http")
                        ? entity.ogImage // full URL from API
                        : APP_URL + entity.ogImage // relative path from API
                  }
                  alt="og"
                  className="w-40 h-24 object-cover mb-2 rounded border"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEntity((prev) => ({
                    ...prev,
                    ogImage: e.target.files[0], // file
                  }))
                }
              />
            </div>

            <div className="flex justify-end">
              <button
                disabled={loading}
                onClick={saveEntity}
                className="rounded-md bg-blue-600 px-6 py-2 text-white"
              >
                {isSubCategory ? "Update Sub Category" : "Update Category"}
              </button>
            </div>
          </div>
        )}

        {/* FACILITIES */}
        {activeTab === "facilities" && (
          <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Assigned Facilities
                </h2>
                <p className="text-sm text-gray-500">
                  Manage facilities linked to this category
                </p>
              </div>

              <button
                onClick={() => {
                  setAssignType("facility");
                  setSelectedIds(facilities.map((f) => f._id));
                  setAssignModalOpen(true);
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
              >
                + Assign Facilities
              </button>
            </div>

            {/* CONTENT */}
            {facilities.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-400">
                No facilities assigned yet
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {facilities.map((f, i) => (
                  <div
                    key={f._id}
                    className="group relative bg-white border border-gray-200 rounded-xl px-4 py-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={f.checked}
                        onChange={() => toggleItem("facility", i)}
                        className="mt-1 h-4 w-4 accent-blue-600"
                      />

                      {/* Editable Name */}
                      <input
                        value={f.name}
                        onChange={(e) => {
                          const updated = [...facilities];
                          updated[i].name = e.target.value;
                          setFacilities(updated);
                        }}
                        className="flex-1 text-sm font-medium text-gray-700 bg-transparent outline-none border-b border-transparent focus:border-blue-500 transition-all"
                      />

                      {/* Remove Button */}
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            open: true,
                            type: "facility",
                            featureId: f._id,
                          })
                        }
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SERVICES */}
        {activeTab === "services" && (
          <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Assigned Services
                </h2>
                <p className="text-sm text-gray-500">
                  Manage services linked to this category
                </p>
              </div>

              <button
                onClick={() => {
                  setAssignType("service");
                  setSelectedIds(services.map((s) => s._id));
                  setAssignModalOpen(true);
                }}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
              >
                + Assign Services
              </button>
            </div>

            {/* CONTENT */}
            {services.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-400">
                No services assigned yet
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {services.map((s) => (
                  <div
                    key={s._id}
                    className="group relative bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {s.name}
                      </span>

                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            open: true,
                            type: "service",
                            featureId: s._id,
                          })
                        }
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "courses" && (
          <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Assigned Courses
                </h2>
                <p className="text-sm text-gray-500">
                  Manage courses linked to this category
                </p>
              </div>

              <button
                onClick={() => {
                  setAssignType("course");
                  setSelectedIds(courses.map((c) => c._id));
                  setAssignModalOpen(true);
                }}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
              >
                + Assign Courses
              </button>
            </div>

            {/* CONTENT */}
            {courses.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-400">
                No courses assigned yet
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {courses.map((c) => (
                  <div
                    key={c._id}
                    className="group relative bg-white border border-gray-200 rounded-xl px-4 py-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {c.name}
                      </span>

                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            open: true,
                            type: "course",
                            featureId: c._id,
                          })
                        }
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {assignModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6">
            <AssignStep
              title={
                assignType === "facility"
                  ? "Facilities"
                  : assignType === "service"
                    ? "Services"
                    : "Courses"
              }
              description="Select items to assign"
              items={
                assignType === "facility"
                  ? facilitiesList
                  : assignType === "service"
                    ? servicesList
                    : coursesList
              }
              selected={selectedIds}
              onToggle={(featureId) =>
                setSelectedIds((prev) =>
                  prev.includes(featureId)
                    ? prev.filter((x) => x !== featureId)
                    : [...prev, featureId],
                )
              }
              icon={
                assignType === "facility"
                  ? Building2
                  : assignType === "service"
                    ? Wrench
                    : GraduationCap
              }
              color={
                assignType === "facility"
                  ? "emerald"
                  : assignType === "service"
                    ? "violet"
                    : "amber"
              }
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 rounded-md border"
              >
                Cancel
              </button>

              <button
                onClick={handleAssignSave}
                className="px-4 py-2 rounded-md bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteConfirm.open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="bg-red-100 text-red-600 p-2 rounded-full">
                <Trash2 size={18} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Confirm Deletion
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to remove this{" "}
                  <span className="font-medium text-gray-700">
                    {deleteConfirm.type}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() =>
                  setDeleteConfirm({
                    open: false,
                    type: null,
                    featureId: null,
                  })
                }
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  confirmRemoveAssigned(
                    deleteConfirm.type,
                    deleteConfirm.featureId,
                  )
                }
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
