"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Plus, ArrowLeft, X, Type, AlignLeft, Hash, DollarSign, CheckSquare, ChevronDown, Pencil } from "lucide-react";

import {
  createAdditionalField,
  getAdditionalFieldsByCategory,
  updateAdditionalField,
  deleteAdditionalField,
} from "@/api/uaeAdminCategories";

// ─── Field type config ────────────────────────────────────────────────────────
const FIELD_TYPES = [
  { value: "text",      label: "Text",      icon: Type,         desc: "Single line input" },
  { value: "textarea",  label: "Text Area", icon: AlignLeft,    desc: "Multi-line input" },
  { value: "number",    label: "Number",    icon: Hash,         desc: "Numeric input with min/max" },
  { value: "price",     label: "Price",     icon: DollarSign,   desc: "Numeric + currency" },
  { value: "checkbox",  label: "Checkbox",  icon: CheckSquare,  desc: "Multiple selections" },
  { value: "dropdown",  label: "Dropdown",  icon: ChevronDown,  desc: "Single selection" },
];

const emptyField = {
  field_label:   "",
  field_type:    "",
  placeholder:   "",
  help_text:     "",
  is_required:   false,
  show_in_filter: false,
  display_order: 0,
  min_length:    "",
  max_length:    "",
  min_value:     "",
  max_value:     "",
  error_message: "",
  default_value: "",
  options:       [],
};

export default function AdditionalInfoBuilder() {
  const router = useRouter();
  const { id, subcategory_id } = router.query;

  const [fieldsList, setFieldsList]   = useState([]);
  const [loading, setLoading]         = useState(false);
  const [editingId, setEditingId]     = useState(null);
  const [field, setField]             = useState(emptyField);

  useEffect(() => {
    if (!id) return;
    fetchFields();
  }, [id]);

  const fetchFields = async () => {
    const res = await getAdditionalFieldsByCategory(id);
    if (res?.status) setFieldsList(res.data);
  };

  const updateFieldState = (key, value) =>
    setField((prev) => ({ ...prev, [key]: value }));

  const handleTypeChange = (type) => {
    setField((prev) => ({
      ...prev,
      field_type:  type,
      options:     ["checkbox", "dropdown"].includes(type) ? [""] : [],
      min_length:  "",
      max_length:  "",
      min_value:   "",
      max_value:   "",
    }));
  };

  const addOption = () =>
    updateFieldState("options", [...field.options, ""]);

  const updateOption = (index, value) => {
    const updated = [...field.options];
    updated[index] = value;
    updateFieldState("options", updated);
  };

  const removeOption = (index) => {
    updateFieldState("options", field.options.filter((_, i) => i !== index));
  };

  // ─── Load field into form for editing ────────────────────────────────────
  const handleEditClick = (item) => {
    setEditingId(item._id);
    const options = item.checkbox_items?.length
      ? item.checkbox_items
      : item.dropdown_items?.length
        ? item.dropdown_items
        : [];

    setField({
      field_label:    item.field_label    || "",
      field_type:     item.field_type     || "",
      placeholder:    item.placeholder    || "",
      help_text:      item.help_text      || "",
      is_required:    item.is_required    || false,
      show_in_filter: item.show_in_filter || false,
      display_order:  item.display_order  || 0,
      min_length:     item.min_length     ?? "",
      max_length:     item.max_length     ?? "",
      min_value:      item.min_value      ?? "",
      max_value:      item.max_value      ?? "",
      error_message:  item.error_message  || "",
      default_value:  item.default_value  || "",
      options,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setField(emptyField);
  };

  // ─── Soft delete ──────────────────────────────────────────────────────────
  const handleDelete = async (e, itemId) => {
    e.stopPropagation();
    if (!confirm("Delete this field?")) return;
    const res = await deleteAdditionalField(itemId);
    if (res?.status) {
      setFieldsList((prev) => prev.filter((f) => f._id !== itemId));
      if (editingId === itemId) handleCancelEdit();
    }
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!field.field_label || !field.field_type) return;
    setLoading(true);

    const payload = {
      category_id:    id,
      subcategory_id: subcategory_id || null,
      field_label:    field.field_label,
      field_type:     field.field_type,
      is_required:    field.is_required,
      show_in_filter: field.show_in_filter,
      display_order:  Number(field.display_order) || 0,
      placeholder:    field.placeholder    || null,
      help_text:      field.help_text      || null,
      error_message:  field.error_message  || null,
      default_value:  field.default_value  || null,
      // Type-specific fields — backend ignores what doesn't apply
      ...(field.field_type === "checkbox"  && { checkbox_items:  field.options.filter(Boolean) }),
      ...(field.field_type === "dropdown"  && { dropdown_items:  field.options.filter(Boolean) }),
      ...((field.field_type === "text" || field.field_type === "textarea") && {
        min_length: field.min_length !== "" ? Number(field.min_length) : null,
        max_length: field.max_length !== "" ? Number(field.max_length) : null,
      }),
      ...((field.field_type === "number" || field.field_type === "price") && {
        min_value: field.min_value !== "" ? Number(field.min_value) : null,
        max_value: field.max_value !== "" ? Number(field.max_value) : null,
      }),
    };

    const res = editingId
      ? await updateAdditionalField(editingId, payload)
      : await createAdditionalField(payload);

    if (res?.status) {
      fetchFields();
      handleCancelEdit();
    }

    setLoading(false);
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const hasOptions = ["checkbox", "dropdown"].includes(field.field_type);
  const hasLengthConstraints = ["text", "textarea"].includes(field.field_type);
  const hasValueConstraints = ["number", "price"].includes(field.field_type);

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-8">
      <div className="max-w-8xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Additional Field Builder</h1>
            <p className="text-sm text-gray-500">Create custom fields for listings</p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-3 gap-8">

          {/* ── LEFT: BUILDER ── */}
          <div className="col-span-2 bg-white rounded-2xl border border-gray-300 p-8 space-y-8">

            {/* Edit mode banner */}
            {editingId && (
              <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Pencil size={14} className="text-orange-500" />
                  <span className="text-sm text-orange-700 font-medium">Editing existing field</span>
                </div>
                <button
                  onClick={handleCancelEdit}
                  className="text-xs text-orange-500 hover:text-orange-700 underline"
                >
                  Cancel & Create New
                </button>
              </div>
            )}

            {/* ── FIELD TYPE PICKER ── */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-3 block">Field Type</label>
              <div className="grid grid-cols-3 gap-3">
                {FIELD_TYPES.map(({ value, label, icon: Icon, desc }) => (
                  <button
                    key={value}
                    onClick={() => handleTypeChange(value)}
                    className={`flex items-start gap-3 border rounded-xl px-4 py-3 text-left transition-all ${
                      field.field_type === value
                        ? "border-orange-400 bg-orange-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={`mt-0.5 shrink-0 ${field.field_type === value ? "text-orange-500" : "text-gray-400"}`}
                    />
                    <div>
                      <div className={`text-sm font-medium ${field.field_type === value ? "text-orange-700" : "text-gray-700"}`}>
                        {label}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── BASIC INFO ── */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Field Label *</label>
                <input
                  placeholder="e.g. Number of Rooms"
                  value={field.field_label}
                  onChange={(e) => updateFieldState("field_label", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Placeholder</label>
                <input
                  placeholder="e.g. Enter number of rooms"
                  value={field.placeholder}
                  onChange={(e) => updateFieldState("placeholder", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Help Text</label>
              <input
                placeholder="Short description shown below the field"
                value={field.help_text}
                onChange={(e) => updateFieldState("help_text", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>

            {/* ── VALIDATION RULES ── */}
            {(hasLengthConstraints || hasValueConstraints) && (
              <div className="border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">
                  {hasLengthConstraints ? "Character Limits" : "Value Range"}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">
                      {hasLengthConstraints ? "Min Characters" : "Min Value"}
                    </label>
                    <input
                      type="number"
                      placeholder="No minimum"
                      value={hasLengthConstraints ? field.min_length : field.min_value}
                      onChange={(e) =>
                        updateFieldState(
                          hasLengthConstraints ? "min_length" : "min_value",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">
                      {hasLengthConstraints ? "Max Characters" : "Max Value"}
                    </label>
                    <input
                      type="number"
                      placeholder="No maximum"
                      value={hasLengthConstraints ? field.max_length : field.max_value}
                      onChange={(e) =>
                        updateFieldState(
                          hasLengthConstraints ? "max_length" : "max_value",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-500">Custom Error Message</label>
                  <input
                    placeholder="Shown when validation fails"
                    value={field.error_message}
                    onChange={(e) => updateFieldState("error_message", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>
            )}

            {/* error message for types with no constraints */}
            {!hasLengthConstraints && !hasValueConstraints && field.field_type && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Custom Error Message</label>
                <input
                  placeholder="Shown when validation fails"
                  value={field.error_message}
                  onChange={(e) => updateFieldState("error_message", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                />
              </div>
            )}

            {/* ── OPTIONS (checkbox / dropdown) ── */}
            {hasOptions && (
              <div className="border border-gray-200 rounded-xl p-6 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Options</h3>

                {field.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-400"
                    />
                    {field.options.length > 1 && (
                      <button
                        onClick={() => removeOption(i)}
                        className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={addOption}
                  className="flex items-center gap-2 text-orange-600 text-sm hover:text-orange-700 mt-1"
                >
                  <Plus size={15} />
                  Add Option
                </button>
              </div>
            )}

            {/* ── SETTINGS ROW ── */}
            <div className="flex gap-6 items-center flex-wrap">
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={field.is_required}
                  onChange={(e) => updateFieldState("is_required", e.target.checked)}
                  className="accent-orange-500"
                />
                <span className="text-gray-700">Required</span>
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={field.show_in_filter}
                  onChange={(e) => updateFieldState("show_in_filter", e.target.checked)}
                  className="accent-orange-500"
                />
                <span className="text-gray-700">Show in Filter</span>
              </label>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Display Order</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={field.display_order}
                  onChange={(e) => updateFieldState("display_order", e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 w-24 text-sm focus:outline-none focus:border-orange-400"
                />
              </div>
            </div>

            {/* ── ACTIONS ── */}
            <div className="flex justify-end gap-3 pt-2">
              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={loading || !field.field_label || !field.field_type}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm transition-colors"
              >
                {loading
                  ? editingId ? "Updating..." : "Saving..."
                  : editingId ? "Update Field" : "Save Field"}
              </button>
            </div>
          </div>

          {/* ── RIGHT: CREATED FIELDS ── */}
          <div className="bg-white border border-gray-300 rounded-2xl p-6 h-fit sticky top-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-700">Created Fields</h3>
              {fieldsList.length > 0 && (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                  {fieldsList.length}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {fieldsList.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">No fields created yet</p>
              )}

              {fieldsList.map((item) => {
                const typeConfig = FIELD_TYPES.find((t) => t.value === item.field_type);
                const Icon = typeConfig?.icon;

                return (
                  <div
                    key={item._id}
                    onClick={() => handleEditClick(item)}
                    className={`relative border rounded-xl p-4 cursor-pointer transition-all hover:shadow-sm ${
                      editingId === item._id
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDelete(e, item._id)}
                      className="absolute top-2.5 right-2.5 p-0.5 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete field"
                    >
                      <X size={14} />
                    </button>

                    <div className="flex items-center gap-2 pr-5">
                      {Icon && (
                        <Icon
                          size={14}
                          className={editingId === item._id ? "text-orange-500" : "text-gray-400"}
                        />
                      )}
                      <span className="font-medium text-gray-800 text-sm">{item.field_label}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-600">
                        {item.field_type}
                      </span>

                      {item.is_required && (
                        <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded">
                          Required
                        </span>
                      )}

                      {item.show_in_filter && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                          Filter
                        </span>
                      )}
                    </div>

                    {item.placeholder && (
                      <p className="text-xs text-gray-400 mt-1.5 truncate">{item.placeholder}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}