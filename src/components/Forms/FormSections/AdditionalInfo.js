import AdditionalFieldRenderer from "./additionfield-render";

const AdditionalInfo = ({ additionalFields, values, setValues }) => {
  const handleChange = (id, value) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  // Returns the correct empty default per field type
  // This avoids passing a plain " " string into a price field
  const getDefaultValue = (field) => {
    if (field.field_type === "price") return { amount: "", currency: "AED" };
    if (field.field_type === "checkbox") return [];
    return "";
  };

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-xl text-gray-600 font-semibold mb-4">
        Additional Fields
      </h2>

      {additionalFields.map((field) => (
        <AdditionalFieldRenderer
          key={field._id}
          field={field}
          value={values[field._id] ?? getDefaultValue(field)}
          onChange={handleChange}
        />
      ))}
    </div>
  );
};

export default AdditionalInfo;