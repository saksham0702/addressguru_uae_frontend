"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Layers,
  Wrench,
  BookOpen,
  Tag,
  Search,
  X as XIcon,
  Sparkles,
  Loader2,
  CheckCircle2,
  Building2,
  GraduationCap,
} from "lucide-react";

import {
  getAllFeaturesApi,
  createOrUpdateCategory,
  assignFeaturesApi,
  createFeatureApi,
} from "@/api/uaeAdminCategories";
import FeatureModal from "../add-feature/featurepopup";

const STEPS = [
  { id: 1, label: "Basics", icon: Tag, desc: "Name & icon" },
  { id: 2, label: "Facilities", icon: Building2, desc: "Assign facilities" },
  { id: 3, label: "Services", icon: Wrench, desc: "Assign services" },
  { id: 4, label: "Courses", icon: GraduationCap, desc: "Assign courses" },
];

/* ================= Assign Step UI ================= */
function AssignStep({
  title,
  description,
  items,
  selected,
  onToggle,
  icon: Icon,
  color = "blue",
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, items]);

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    violet: "bg-violet-50 text-violet-600 border-violet-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
  };

  const selectedColorClasses = {
    blue: "bg-blue-600 border-blue-600",
    emerald: "bg-emerald-600 border-emerald-600",
    violet: "bg-violet-600 border-violet-600",
    amber: "bg-amber-600 border-amber-600",
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorClasses[color]}`}
        >
          <Icon size={22} strokeWidth={2} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        {selected.length > 0 && (
          <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-slate-900/20">
            {selected.length} selected
          </span>
        )}
      </div>

      <div className="relative group">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-600"
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${title.toLowerCase()}…`}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-10 text-sm outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-slate-200/50 transition-colors"
          >
            <XIcon size={14} className="text-slate-400" />
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="max-h-[320px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Search size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No items found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((item, index) => {
                const isChecked = selected.includes(item._id);
                return (
                  <div
                    key={item._id}
                    onClick={() => onToggle(item._id)}
                    className={`group flex cursor-pointer items-center gap-4 px-4 py-3.5 transition-all duration-200 ${isChecked ? "bg-slate-50/80" : "hover:bg-slate-50"
                      }`}
                    style={{
                      animationDelay: `${index * 20}ms`,
                    }}
                  >
                    <div
                      className={`
                      flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200
                      ${isChecked
                          ? `${selectedColorClasses[color]} shadow-sm`
                          : "border-slate-300 group-hover:border-slate-400 bg-white"
                        }
                    `}
                    >
                      {isChecked && (
                        <Check
                          size={12}
                          className="text-white"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium transition-colors ${isChecked ? "text-slate-900" : "text-slate-600"
                        }`}
                    >
                      {item.name}
                    </span>
                    {isChecked && (
                      <CheckCircle2
                        size={16}
                        className={`ml-auto ${colorClasses[color].split(" ")[1]}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= Progress Stepper ================= */
function Stepper({ steps, currentStep }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = s.id === currentStep;
          const isCompleted = s.id < currentStep;
          const isLast = idx === steps.length - 1;

          return (
            <div key={s.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all duration-300
                    ${isCompleted
                      ? "border-slate-900 bg-slate-900 text-white"
                      : isActive
                        ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/25"
                        : "border-slate-200 bg-white text-slate-400"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check size={18} strokeWidth={3} />
                  ) : (
                    <Icon size={18} strokeWidth={2} />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium transition-colors ${isActive || isCompleted
                    ? "text-slate-900"
                    : "text-slate-400"
                    }`}
                >
                  {s.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-all duration-500 ${isCompleted ? "bg-slate-900" : "bg-slate-200"
                    }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= Main Component ================= */
export default function AddEditForm({ isOpen, onClose, onCategoryCreated }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [allFeatures, setAllFeatures] = useState([]);
  const [errors, setErrors] = useState({});
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [featureType, setFeatureType] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [createdFeatureTypes, setCreatedFeatureTypes] = useState({
    facility: false,
    service: false,
    course: false,
  });

  const [form, setForm] = useState({
    name: "",
    iconSvg: "",
    facilities: [],
    services: [],
    courses: [],
  });

  const handleCreateFeature = async (payload) => {
    try {
      const finalPayload = {
        name: payload.name,
        type: featureType,
        iconSvg: payload.svg || "",
      };

      const res = await createFeatureApi(finalPayload);

      if (!res?.data) return;

      const newFeature = res.data;

      const pluralMap = {
        facility: "facilities",
        service: "services",
        course: "courses",
      };

      const key = pluralMap[featureType];

      setAllFeatures((prev) => [...prev, newFeature]);

      setForm((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), newFeature._id],
      }));

      setCreatedFeatureTypes((prev) => ({
        ...prev,
        [featureType]: true,
      }));

      setFeatureModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  /* ========== Fetch Features ========== */
  useEffect(() => {
    const fetchFeatures = async () => {
      const res = await getAllFeaturesApi();
      setAllFeatures(res?.data || []);
    };
    if (isOpen) fetchFeatures();
  }, [isOpen]);

  const facilitiesList = allFeatures.filter((f) => f.type === "facility");
  const servicesList = allFeatures.filter((f) => f.type === "service");
  const coursesList = allFeatures.filter((f) => f.type === "course");

  /* ========== Validation ========== */

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Category name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ========== Create Category Step 1 ========== */

  const handleCreateCategory = async () => {
    if (!validateStep1()) return;

    setLoading(true);
    setSubmitError("");

    try {
      const res = await createOrUpdateCategory({
        name: form.name,
        iconSvg: form.iconSvg,
      });

      if (res?.status) {
        setCategoryId(res.data._id);
        setStep(2);

        // trigger category refresh
        if (onCategoryCreated) {
          onCategoryCreated();
        }
      }
    } catch (err) {
      console.error("Create category error:", err);

      const message =
        err?.message || "Failed to create category";

      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  /* ========== Assign Features ========== */

  const handleAssign = async (key) => {
    if (!categoryId) return;

    const selectedItems = form[key];

    if (!selectedItems || selectedItems.length === 0) {
      setErrors({ [key]: `Please select at least one ${key.slice(0, -1)}` });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        facilities: [],
        services: [],
        courses: [],
      };
      payload[key] = selectedItems;

      await assignFeaturesApi(categoryId, payload);

      if (step < 4) {
        setStep((prev) => prev + 1);
      } else {
        // Success - close modal or show success state
        onClose();
        // Reset form
        setStep(1);
        setForm({
          name: "",
          iconSvg: "",
          facilities: [],
          services: [],
          courses: [],
        });
        setCategoryId(null);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save features";

      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-md shadow-slate-950/20 animate-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm shadow-slate-900/20">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Create Category
                </h2>
                <p className="text-sm text-slate-500">
                  Configure your new category
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group rounded-xl p-2 hover:bg-slate-200/50 transition-colors"
            >
              <X
                size={20}
                className="text-slate-400 group-hover:text-slate-600 transition-colors"
              />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-8">
          <Stepper steps={STEPS} currentStep={step} />

          <div className="mt-6">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Category Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: null });
                    }}
                    placeholder="e.g., Sports Complex"
                    className={`
                      w-full rounded-xl border bg-slate-50/50 px-4 py-3.5 text-sm outline-none transition-all
                      ${errors.name
                        ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                      }
                    `}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <XIcon size={12} /> {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Icon SVG <span className="text-slate-400 text-xs">(optional)</span>
                  </label>

                  <div className="relative">
                    <textarea
                      value={form.iconSvg}
                      onChange={(e) =>
                        setForm({ ...form, iconSvg: e.target.value })
                      }
                      placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>'
                      rows={4}
                      className="
        w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4
        font-mono text-xs leading-relaxed outline-none transition-all resize-none
        focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100
      "
                    />

                    {form.iconSvg && (
                      <div className="absolute right-3 top-3">
                        <div
                          className="h-8 w-8 rounded-lg bg-slate-100 p-1.5"
                          dangerouslySetInnerHTML={{ __html: form.iconSvg }}
                        />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-400">
                    Optional. Paste an SVG if you want a custom category icon.
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setFeatureType("facility");
                      setFeatureModalOpen(true);
                    }}
                    className="text-sm font-semibold text-emerald-600 hover:underline"
                  >
                    + Add Facility
                  </button>
                </div>


                <AssignStep
                  title="Facilities"
                  description="Select facilities available in this category"
                  items={facilitiesList}
                  selected={form.facilities}
                  onToggle={(id) =>
                    setForm((p) => ({
                      ...p,
                      facilities: p.facilities.includes(id)
                        ? p.facilities.filter((x) => x !== id)
                        : [...p.facilities, id],
                    }))
                  }
                  icon={Building2}
                  color="emerald"
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setFeatureType("service");
                      setFeatureModalOpen(true);
                    }}
                    className="text-sm font-semibold text-violet-600 hover:underline"
                  >
                    + Add Service
                  </button>
                </div>


                <AssignStep
                  title="Services"
                  description="Choose services offered in this category"
                  items={servicesList}
                  selected={form.services}
                  onToggle={(id) =>
                    setForm((p) => ({
                      ...p,
                      services: p.services.includes(id)
                        ? p.services.filter((x) => x !== id)
                        : [...p.services, id],
                    }))
                  }
                  icon={Wrench}
                  color="violet"
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setFeatureType("course");
                      setFeatureModalOpen(true);
                    }}
                    className="text-sm font-semibold text-amber-600 hover:underline"
                  >
                    + Add Course
                  </button>
                </div>

                <AssignStep
                  title="Courses"
                  description="Assign relevant courses to this category"
                  items={coursesList}
                  selected={form.courses}
                  onToggle={(id) =>
                    setForm((p) => ({
                      ...p,
                      courses: p.courses.includes(id)
                        ? p.courses.filter((x) => x !== id)
                        : [...p.courses, id],
                    }))
                  }
                  icon={GraduationCap}
                  color="amber"
                />
              </div>
            )}
          </div>
        </div>
        {submitError && (
          <div className="mx-8 mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2">
            <XIcon size={16} className="text-red-500 mt-0.5" />
            <p className="text-sm text-red-600 font-medium leading-relaxed">
              {submitError}
            </p>
          </div>
        )}
        {/* FOOTER */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-8 py-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1 || loading}
            className={`
              flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all
              ${step === 1
                ? "opacity-0 pointer-events-none"
                : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
              }
            `}
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <div className="flex gap-3">
            {step === 1 && (
              <button
                onClick={handleCreateCategory}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/25 transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create & Continue
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            )}

            {step === 2 && (
              <>
                <button
                  onClick={() => setStep(3)}
                  disabled={loading}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition"
                >
                  Skip
                </button>

                <button
                  onClick={() => handleAssign("facilities")}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Facilities
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <button
                  onClick={() => setStep(4)}
                  disabled={loading}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition"
                >
                  Skip
                </button>

                <button
                  onClick={() => handleAssign("services")}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-700"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Services
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </>
            )}

            {step === 4 && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    setStep(1);
                  }}
                  disabled={loading}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition"
                >
                  Skip
                </button>

                <button
                  onClick={() => handleAssign("courses")}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-600/25 hover:bg-amber-700"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Finish
                      <Check size={18} />
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <FeatureModal
        isOpen={featureModalOpen}
        onClose={() => setFeatureModalOpen(false)}
        type={featureType + "s"} // facilities / services / courses
        singular={
          featureType === "facility"
            ? "Facility"
            : featureType === "service"
              ? "Service"
              : "Course"
        }
        onSubmit={handleCreateFeature}
      />
    </div>
  );
}
