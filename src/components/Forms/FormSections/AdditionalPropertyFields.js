// components/Forms/FormSections/AdditionalPropertyFields.jsx

import InputWithTitle from "@/components/Forms/InputWithTitle";
import DropDown from "@/components/Forms/DropDown";

// Field config per slug
export const FIELD_CONFIG = {
  "apartments-flats-studio": [
    { key: "bedrooms", label: "No. of Bedrooms", type: "dropdown", options: ["Studio", "1", "2", "3", "4", "5+"], required: true },
    { key: "bathrooms", label: "No. of Bathrooms", type: "dropdown", options: ["1", "2", "3", "4+"], required: true },
    { key: "floor_number", label: "Floor Number", type: "input", inputType: "number", required: false },
    { key: "total_floors", label: "Total Floors in Building", type: "input", inputType: "number", required: false },
    { key: "furnishing", label: "Furnishing Status", type: "dropdown", options: ["Unfurnished", "Semi-Furnished", "Fully Furnished"], required: true },
    { key: "facing", label: "Facing", type: "dropdown", options: ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"], required: false },
    { key: "parking", label: "Parking", type: "dropdown", options: ["None", "1 Car", "2 Cars", "Covered", "Open"], required: false },
  ],

  "house": [
    { key: "bedrooms", label: "No. of Bedrooms", type: "dropdown", options: ["1", "2", "3", "4", "5", "6+"], required: true },
    { key: "bathrooms", label: "No. of Bathrooms", type: "dropdown", options: ["1", "2", "3", "4+"], required: true },
    { key: "total_floors", label: "No. of Floors", type: "dropdown", options: ["1", "2", "3", "4+"], required: true },
    { key: "furnishing", label: "Furnishing Status", type: "dropdown", options: ["Unfurnished", "Semi-Furnished", "Fully Furnished"], required: true },
    { key: "parking", label: "Parking", type: "dropdown", options: ["None", "1 Car", "2 Cars", "Covered", "Open"], required: false },
    { key: "facing", label: "Facing", type: "dropdown", options: ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"], required: false },
    { key: "age_of_property", label: "Age of Property (years)", type: "input", inputType: "number", required: false },
  ],

  "lands-plots": [
    { key: "plot_type", label: "Plot Type", type: "dropdown", options: ["Residential", "Commercial", "Agricultural", "Industrial"], required: true },
    { key: "length", label: "Length (ft)", type: "input", inputType: "number", required: false },
    { key: "width", label: "Width (ft)", type: "input", inputType: "number", required: false },
    { key: "road_facing_width", label: "Road Facing Width (ft)", type: "input", inputType: "number", required: false },
    { key: "boundary_wall", label: "Boundary Wall", type: "dropdown", options: ["Yes", "No", "Partial"], required: false },
    { key: "corner_plot", label: "Corner Plot", type: "dropdown", options: ["Yes", "No"], required: false },
  ],

  "hostel-guest-house": [
    { key: "room_type", label: "Room Type", type: "dropdown", options: ["Single Sharing", "Double Sharing", "Triple Sharing", "Private Room", "Dormitory"], required: true },
    { key: "total_rooms", label: "Total Rooms Available", type: "input", inputType: "number", required: true },
    { key: "bathroom_type", label: "Bathroom Type", type: "dropdown", options: ["Attached", "Common", "Both"], required: true },
    { key: "meal_included", label: "Meals Included", type: "dropdown", options: ["None", "Breakfast", "Breakfast & Dinner", "All Meals"], required: false },
    { key: "gender_preference", label: "Gender Preference", type: "dropdown", options: ["Any", "Male Only", "Female Only"], required: false },
    { key: "furnishing", label: "Furnishing", type: "dropdown", options: ["Unfurnished", "Basic", "Fully Furnished"], required: false },
  ],

  "commercial-property": [
    { key: "property_subtype", label: "Property Subtype", type: "dropdown", options: ["Office", "Shop/Showroom", "Warehouse", "Industrial", "Co-working Space", "Others"], required: true },
    { key: "floor_number", label: "Floor Number", type: "input", inputType: "number", required: false },
    { key: "total_floors", label: "Total Floors", type: "input", inputType: "number", required: false },
    { key: "bathrooms", label: "No. of Washrooms", type: "dropdown", options: ["1", "2", "3", "4+"], required: false },
    { key: "furnishing", label: "Furnishing", type: "dropdown", options: ["Bare Shell", "Semi-Furnished", "Fully Furnished"], required: false },
    { key: "parking", label: "Parking", type: "dropdown", options: ["None", "1-2 Slots", "3-5 Slots", "6+ Slots"], required: false },
    { key: "facing", label: "Facing", type: "dropdown", options: ["North", "South", "East", "West", "Main Road"], required: false },
  ],

  "other": [
    { key: "property_subtype", label: "Property Type", type: "input", inputType: "text", required: false },
    { key: "bedrooms", label: "No. of Rooms (if any)", type: "input", inputType: "number", required: false },
    { key: "furnishing", label: "Furnishing", type: "dropdown", options: ["Unfurnished", "Semi-Furnished", "Fully Furnished"], required: false },
  ],
};

const AdditionalPropertyFields = ({ categorySlug, values = {}, onChange, errors = {}, clearError, setErrors }) => {
  const fields = FIELD_CONFIG[categorySlug] || FIELD_CONFIG["other"];

  const handleChange = (key, value, inputType) => {
    // If number field and value is not empty, validate it's actually a number
    if (inputType === "number" && value !== "") {
      if (!/^\d*\.?\d*$/.test(value)) {
        // Set error but still allow typing so user sees the message
        if (setErrors) {
          setErrors((prev) => ({
            ...prev,
            [key]: "Only numbers are allowed",
          }));
        }
        return; // block the invalid character entirely
      }
    }
    onChange({ ...values, [key]: value });
    if (clearError) clearError(key);
  };

  if (!fields || fields.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-600 mt-8 uppercase text-sm xl:text-lg tracking-wide pb-2">
        Property Details
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.key}>
            {field.type === "dropdown" ? (
              <>
                <h4 className="font-semibold text-gray-500 capitalize mb-1">
                  {field.label} {field.required && "*"}
                </h4>
                <DropDown
                  placeholder={`Select ${field.label}`}
                  options={field.options.map((opt) => ({
                    value: opt.toLowerCase().replace(/\s+/g, "_"),
                    label: opt,
                  }))}
                  value={
                    values[field.key]
                      ? {
                          value: values[field.key],
                          label:
                            field.options.find(
                              (o) =>
                                o.toLowerCase().replace(/\s+/g, "_") ===
                                values[field.key]
                            ) || values[field.key],
                        }
                      : null
                  }
                  onChange={(selected) => handleChange(field.key, selected.value, field.inputType)}
                />
              </>
            ) : (
              <InputWithTitle
                title={field.label}
                required={field.required}
                type="text" // keep as text so we control what's allowed
                value={values[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value, field.inputType)}
              />
            )}
            {errors[field.key] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.key]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdditionalPropertyFields;