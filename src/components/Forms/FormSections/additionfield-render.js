import React from "react";
import InputWithTitle from "../InputWithTitle";
import CheckBox from "../CheckBox";
import Select from "../Select";
import DropDown from "../DropDown";

const AdditionalFieldRenderer = ({ field, value, onChange }) => {
  const handleChange = (e) => {
    onChange(field._id, e.target.value);
  };

  switch (field.field_type) {
    case "text":
    case "email":
    case "number":
    case "date":
    case "time":
    case "url":
      return (
        <InputWithTitle
          title={field.field_label}
          value={value || ""}
          onChange={handleChange}
          placeholder={field.placeholder || ""}
          minLength={field.min_length}
          maxLength={field.max_length}
          required={field.is_required}
        />
      );

    case "textarea":
      return (
        <InputWithTitle
          title={field.field_label}
          value={value || ""}
          onChange={handleChange}
          placeholder={field.placeholder || ""}
          isTextarea={true}
          rows={4}
          required={field.is_required}
        />
      );

    case "dropdown":
      return (
        <div>
          <label className="font-medium">{field.field_label}</label>

          <DropDown
            options={field.dropdown_items || []}
            placeholder={field.placeholder || "Select"}
            value={value || ""}
            onChange={(val) => onChange(field._id, val)}
          />
        </div>
      );

    case "checkbox":
      return (
        <CheckBox
          heading={field.field_label}
          options={(field.checkbox_items || []).map((opt) => ({
            _id: opt,
            name: opt,
          }))}
          selectedIds={value || []}
          onChange={(val) => onChange(field._id, val)}
        />
      );

    case "radio":
      return (
        <Select
          heading={field.field_label}
          options={field.radio_items || []}
          onChange={(val) => onChange(field._id, val)}
        />
      );

    default:
      return null;
  }
};

export default AdditionalFieldRenderer;
