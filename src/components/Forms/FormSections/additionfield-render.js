import React from "react";
import InputWithTitle from "../InputWithTitle";
import CheckBox from "../CheckBox";
import DropDown from "../DropDown";
import PriceInput from "../PriceInput";

const AdditionalFieldRenderer = ({ field, value, onChange }) => {
  console.log('additional ',field);

  const handleChange = (e) => {
    onChange(field._id, e.target.value);
  };

  switch (field.field_type) {
    case "text":
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

    case "number":
      return (
        <InputWithTitle
          title={field.field_label}
          type="number"
          value={value || ""}
          onChange={handleChange}
          placeholder={field.placeholder || ""}
          min={field.min_value}
          max={field.max_value}
          required={field.is_required}
        />
      );

    case "price":
      return (
        <PriceInput
          field={field}
          value={value || { amount: "", currency: "AED" }}
          onChange={(val) => onChange(field._id, val)}
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

    default:
      return null;
  }
};

export default AdditionalFieldRenderer;