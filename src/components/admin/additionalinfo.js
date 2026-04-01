"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Plus, ArrowLeft, X } from "lucide-react";

import {
  createAdditionalField,
  getAdditionalFieldsByCategory,
  updateAdditionalField,
  deleteAdditionalField,
} from "@/api/uaeAdminCategories";

export default function AdditionalInfoBuilder() {
  const router = useRouter();
  const { id, subcategory_id } = router.query;

  const [fieldsList, setFieldsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null); // tracks which field is being edited

  const fieldTypes = [
    "text",
    "textarea",
    "number",
    "email",
    "url",
    "date",
    "time",
    "checkbox",
    "radio",
    "dropdown",
  ];

  const emptyField = {
    field_label: "",
    field_type: "",
    placeholder: "",
    help_text: "",
    is_required: false,
    show_in_filter: false,
    display_order: 0,
    min_length: "",
    max_length: "",
    min_value: "",
    max_value: "",
    pattern: "",
    error_message: "",
    default_value: "",
    options: [],
  };

  const [field, setField] = useState(emptyField);

  useEffect(() => {
    if (!id) return;
    fetchFields();
  }, [id]);

  const fetchFields = async () => {
    const res = await getAdditionalFieldsByCategory(id);
    if (res?.status) setFieldsList(res.data);
  };

  const updateField = (key, value) => {
    setField((prev) => ({ ...prev, [key]: value }));
  };

  const handleTypeChange = (type) => {
    updateField("field_type", type);
    if (["checkbox", "radio", "dropdown"].includes(type)) {
      updateField("options", [""]);
    } else {
      updateField("options", []);
    }
  };

  const addOption = () => {
    updateField("options", [...field.options, ""]);
  };

  const updateOption = (index, value) => {
    const updated = [...field.options];
    updated[index] = value;
    updateField("options", updated);
  };

  // ─── Click on a field card → fill form for editing ───────────────────────
  const handleEditClick = (item) => {
    setEditingId(item._id);

    // Merge options from whichever list exists
    const options = item.checkbox_items?.length
      ? item.checkbox_items
      : item.radio_items?.length
        ? item.radio_items
        : item.dropdown_items?.length
          ? item.dropdown_items
          : [];

    setField({
      field_label: item.field_label || "",
      field_type: item.field_type || "",
      placeholder: item.placeholder || "",
      help_text: item.help_text || "",
      is_required: item.is_required || false,
      show_in_filter: item.show_in_filter || false,
      display_order: item.display_order || 0,
      min_length: item.min_length || "",
      max_length: item.max_length || "",
      min_value: item.min_value || "",
      max_value: item.max_value || "",
      pattern: item.pattern || "",
      error_message: item.error_message || "",
      default_value: item.default_value || "",
      options,
    });
  };

  // ─── Cancel edit → reset form ─────────────────────────────────────────────
  const handleCancelEdit = () => {
    setEditingId(null);
    setField(emptyField);
  };

  // ─── Soft delete ──────────────────────────────────────────────────────────
  const handleDelete = async (e, itemId) => {
    e.stopPropagation(); // prevent triggering edit click
    if (!confirm("Are you sure you want to delete this field?")) return;

    const res = await deleteAdditionalField(itemId);
    if (res?.status) {
      setFieldsList((prev) => prev.filter((f) => f._id !== itemId));
      // If the deleted field was being edited, reset form
      if (editingId === itemId) handleCancelEdit();
    }
  };

  // ─── Submit: create or update ─────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      category_id: id,
      subcategory_id: subcategory_id || null,
      field_label: field.field_label,
      field_type: field.field_type,
      checkbox_items:
        field.field_type === "checkbox" ? field.options.filter(Boolean) : [],
      radio_items:
        field.field_type === "radio" ? field.options.filter(Boolean) : [],
      dropdown_items:
        field.field_type === "dropdown" ? field.options.filter(Boolean) : [],
      is_required: field.is_required,
      show_in_filter: field.show_in_filter,
      min_length: field.min_length,
      max_length: field.max_length,
      min_value: field.min_value,
      max_value: field.max_value,
      pattern: field.pattern,
      error_message: field.error_message,
      placeholder: field.placeholder,
      help_text: field.help_text,
      default_value: field.default_value,
      display_order: field.display_order,
    };

    let res;

    if (editingId) {
      // UPDATE
      res = await updateAdditionalField(editingId, payload);
    } else {
      // CREATE
      res = await createAdditionalField(payload);
    }

    if (res?.status) {
      fetchFields();
      handleCancelEdit();
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-10 ">
      <div className="max-w-8xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Additional Field Builder
            </h1>
            <p className="text-sm text-gray-500">
              Create custom fields for listings
            </p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-3 gap-8">
          {/* LEFT SIDE BUILDER */}
          <div className="col-span-2 bg-white rounded-2xl border border-gray-300 p-8 space-y-8">
            {/* Edit mode indicator */}
            {editingId && (
              <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5">
                <span className="text-sm text-orange-700 font-medium">
                  Editing existing field
                </span>
                <button
                  onClick={handleCancelEdit}
                  className="text-xs text-orange-500 hover:text-orange-700 underline"
                >
                  Cancel & Create New
                </button>
              </div>
            )}

            {/* FIELD TYPE */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                Field Type
              </label>

              <select
                value={field.field_type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-72 border border-gray-200 rounded-lg px-4 py-2"
              >
                <option value="">Select Type</option>
                {fieldTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* BASIC INFO */}
            <div className="grid grid-cols-2 gap-6">
              <input
                placeholder="Field Label"
                value={field.field_label}
                onChange={(e) => updateField("field_label", e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2"
              />

              <input
                placeholder="Placeholder"
                value={field.placeholder}
                onChange={(e) => updateField("placeholder", e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2"
              />
            </div>

            <input
              placeholder="Help Text"
              value={field.help_text}
              onChange={(e) => updateField("help_text", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2"
            />

            {/* VALIDATION */}
            <div className="border border-gray-200 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Validation Rules
              </h3>

              {(field.field_type === "text" ||
                field.field_type === "textarea") && (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="Min Length"
                    value={field.min_length}
                    onChange={(e) => updateField("min_length", e.target.value)}
                    className="border rounded-lg px-4 py-2"
                  />

                  <input
                    placeholder="Max Length"
                    value={field.max_length}
                    onChange={(e) => updateField("max_length", e.target.value)}
                    className="border rounded-lg px-4 py-2"
                  />
                </div>
              )}

              {field.field_type === "number" && (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="Min Value"
                    value={field.min_value}
                    onChange={(e) => updateField("min_value", e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2"
                  />

                  <input
                    placeholder="Max Value"
                    value={field.max_value}
                    onChange={(e) => updateField("max_value", e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2"
                  />
                </div>
              )}

              <input
                placeholder="Error Message"
                value={field.error_message}
                onChange={(e) => updateField("error_message", e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 w-full"
              />
            </div>

            {/* OPTIONS */}
            {(field.field_type === "checkbox" ||
              field.field_type === "radio" ||
              field.field_type === "dropdown") && (
              <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold mb-4">Options</h3>

                {field.options.map((opt, i) => (
                  <input
                    key={i}
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2 w-full mb-3"
                  />
                ))}

                <button
                  onClick={addOption}
                  className="flex items-center gap-2 text-orange-600 text-sm"
                >
                  <Plus size={16} />
                  Add Option
                </button>
              </div>
            )}

            {/* SETTINGS */}
            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={field.is_required}
                  onChange={(e) => updateField("is_required", e.target.checked)}
                />
                Required
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={field.show_in_filter}
                  onChange={(e) =>
                    updateField("show_in_filter", e.target.checked)
                  }
                />
                Show In Filter
              </label>

              <input
                placeholder="Display Order"
                value={field.display_order}
                onChange={(e) => updateField("display_order", e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 w-40"
              />
            </div>

            {/* SAVE / UPDATE BUTTON */}
            <div className="flex justify-end gap-3">
              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg"
              >
                {loading
                  ? editingId
                    ? "Updating..."
                    : "Saving..."
                  : editingId
                    ? "Update Field"
                    : "Save Field"}
              </button>
            </div>
          </div>

          {/* RIGHT SIDE CREATED FIELDS */}
          <div className="bg-white border border-gray-300 rounded-2xl p-6 h-fit">
            <h3 className="font-semibold text-gray-700 mb-4">Created Fields</h3>

            <div className="space-y-4">
              {fieldsList.length === 0 && (
                <p className="text-sm text-gray-400">No fields created yet</p>
              )}

              {fieldsList.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleEditClick(item)}
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all hover:shadow-sm ${
                    editingId === item._id
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-200"
                  }`}
                >
                  {/* Cross / Delete button — top right */}
                  <button
                    onClick={(e) => handleDelete(e, item._id)}
                    className="absolute top-2 right-2 p-0.5 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete field"
                  >
                    <X size={14} />
                  </button>

                  <div className="flex justify-between items-center pr-5">
                    <span className="font-medium text-gray-800">
                      {item.field_label}
                    </span>

                    <span className="text-xs px-2 py-1 rounded bg-orange-50 text-orange-600">
                      {item.field_type}
                    </span>
                  </div>

                  {item.placeholder && (
                    <p className="text-xs text-gray-400 mt-1">
                      {item.placeholder}
                    </p>
                  )}

                  <div className="flex gap-2 mt-2 flex-wrap">
                    {item.is_required && (
                      <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded">
                        Required
                      </span>
                    )}

                    {item.show_in_filter && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                        Filter
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
