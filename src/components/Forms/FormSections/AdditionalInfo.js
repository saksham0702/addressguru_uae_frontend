import AdditionalFieldRenderer from "./additionfield-render";

const AdditionalInfo = ({
  additionalFields,
  values,
  setValues,
}) => {

  const handleChange = (id, value) => {
    setValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Section Title */}
      <h2 className="text-xl text-gray-600 font-semibold mb-4">
        Additional Fields
      </h2>

      {additionalFields.map((field) => (
        <AdditionalFieldRenderer
          key={field._id}
          field={field}
          value={values[field._id] || " "}
          onChange={handleChange}
        />
      ))}
    </div>
  );
};

export default AdditionalInfo;