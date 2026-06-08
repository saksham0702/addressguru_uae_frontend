import React from "react";
import DropDown from "@/components/Forms/DropDown";
import InputWithTitle from "@/components/Forms/InputWithTitle";
import DynamicArrayInput from "@/components/Forms/DynamicArrayInput";
import MultiSelectDropDown from "@/components/Forms/MultiSelect";
import { SearchableMultiSelect } from "@/components/Forms/SearchableMultiSelect";

const JobInfoSection = ({
  postJobData,
  setPostJobData,
  errors,
  clearError,
  refs,
  options,
  subCategories,
  getSelectedOption,
}) => {
  const {
    categoryOptions,
    sectorOptions,
    jobTypeOptions,
    workModeOptions,
    experienceLevelOptions,
    salaryOptions,
    BenefitOptions,
    educationLevels,
    ageOptions,
    genderOptions,
    nationalityOptions,
    languageOptions,
  } = options;

  const handleInputChange = (key, value) => {
    setPostJobData((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (clearError) clearError(key);
  };

  const jobInfoForms = [
    {
      id: 1,
      name: "Category",
      key: "category_id",
      type: "dropdown",
      placeholder: "Select category",
      required: true,
      ref: refs.categoryRef,
      options: categoryOptions,
    },
    {
      id: 2,
      name: "Sub Category",
      key: "sub_category_id",
      type: "dropdown",
      placeholder: "Select sub category",
      ref: refs.subCategoryRef,
      options: subCategories,
    },
    {
      id: 3,
      name: "Job Title",
      key: "title",
      type: "text",
      placeholder: "Enter job title",
      ref: refs.titleRef,
      required: true,
      minlength: 20,
      maxlength: 100,
    },
    {
      id: 4,
      name: "Description",
      key: "description",
      type: "textarea",
      placeholder: "Enter description",
      ref: refs.descriptionRef,
      required: true,
      minlength: 200,
      maxlength: 500,
    },
    {
      id: 5,
      name: "Requirements",
      key: "requirements",
      type: "array",
      placeholder: "Enter requirement",
    },
    {
      id: 6,
      name: "Responsibilities",
      key: "responsibilities",
      type: "array",
      placeholder: "Enter responsibility",
    },
    {
      id: 8,
      name: "Skills",
      key: "skills",
      type: "array", // Changed to array for manual entry
      placeholder: "Enter skill",
      ref: refs.skillsRef,
      required: true,
    },
    {
      id: 9,
      width: true,
      name: "Sector",
      key: "sector",
      type: "dropdown",
      placeholder: "Select sector",
      options: sectorOptions,
      required: true,
    },
    {
      id: 10,
      width: true,
      name: "Job Type",
      key: "jobType",
      type: "dropdown",
      placeholder: "Select job type",
      ref: refs.jobTypeRef,
      options: jobTypeOptions,
      required: true,
    },
    {
      id: 11,
      width: true,
      name: "Work Mode",
      key: "workMode",
      type: "dropdown",
      placeholder: "Remote / Onsite / Hybrid",
      options: workModeOptions,
      required: true,
    },
    {
      id: 12,
      width: true,
      name: "Experience Level",
      key: "experienceLevel",
      type: "dropdown",
      placeholder: "Select experience level",
      options: experienceLevelOptions,
      required: true,
    },
    {
      id: 13,
      width: true,
      name: "Monthly Salary",
      key: "salaryRange",
      type: "dropdown",
      options: salaryOptions,
      required: true,
    },
    {
      id: 7,
      width: true,
      name: "Benefits",
      key: "benefits",
      type: "multiselect",
      options: BenefitOptions,
      placeholder: "Enter benefit",
    },
    {
      id: 14,
      width: true,
      name: "Minimum Work Experience",
      key: "minExperience",
      type: "text",
    },
    {
      id: 18,
      width: true,
      name: "Total Positions",
      key: "openings",
      type: "text",
      placeholder: "Enter number of positions",
      ref: refs.openingsRef,
      required: true,
    },
    // Location field removed as per requirement
    {
      id: 16,
      width: true,
      name: "Education",
      key: "education",
      type: "dropdown",
      ref: refs.educationLevelRef,
      options: educationLevels,
    },
    {
      id: 17,
      width: true,
      name: "Age Range",
      key: "ageRange",
      type: "text",
      placeholder: "e.g. 18-25 or 25-40",
    },
    {
      id: 19,
      width: true,
      name: "Gender",
      key: "gender",
      type: "dropdown",
      options: genderOptions,
      required: true,
    },
    {
      id: 20,
      width: true,
      name: "Nationality",
      key: "nationality",
      type: "multiselect",
      options: nationalityOptions,
    },
    {
      id: 21,
      width: true,
      name: "Languages",
      key: "languages",
      type: "multiselect",
      options: languageOptions,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {jobInfoForms.map((item, index) => {
        if (item.key === "sub_category_id" && subCategories.length === 0) {
          return null;
        }

        const commonProps = {
          key: item.id || index,
          title: item.name,
          placeholder: item.placeholder,
          value: postJobData[item.key] || "",
          onChange: (e) => handleInputChange(item.key, e.target.value),
        };

        return (
          <div
            key={item.id || index}
            ref={item.ref}
            className={`${item?.width ? "col-span-1" : "col-span-2"}`}
          >
            {item.type === "dropdown" && (
              <>
                <label className="text-black font-medium">
                  {item.name}
                  {item.required && (
                    <span className="text-red-600 font-semibold ml-1">&#42;</span>
                  )}
                </label>
                <DropDown
                  options={item.options || []}
                  placeholder={item.placeholder}
                  value={getSelectedOption(
                    item.options || [],
                    postJobData[item.key],
                  )}
                  onChange={(option) => {
                    if (!option) return;
                    if (item.key === "category_id") {
                      setPostJobData({
                        ...postJobData,
                        category_id: option.value,
                        category_slug: option.slug,
                        sub_category_id: "",
                      });
                    } else {
                      handleInputChange(item.key, option.value);
                    }
                  }}
                />
                {errors[item.key] && (
                  <p className="text-red-500 text-sm mt-1">{errors[item.key]}</p>
                )}
              </>
            )}

            {item.type === "text" && (
              <>
                <InputWithTitle
                  isTextarea={false}
                  minLength={item?.minlength || ""}
                  maxLength={item?.maxlength || ""}
                  required={item.required}
                  {...commonProps}
                />
                {errors[item.key] && (
                  <p className="text-red-500 text-sm mt-1">{errors[item.key]}</p>
                )}
              </>
            )}

            {item.type === "textarea" && (
              <>
                <InputWithTitle
                  isTextarea={true}
                  minLength={item?.minlength || 200}
                  maxLength={item?.maxlength || 500}
                  required={item.required}
                  rows={3}
                  {...commonProps}
                />
                {errors[item.key] && (
                  <p className="text-red-500 text-sm mt-1">{errors[item.key]}</p>
                )}
              </>
            )}

            {item.type === "array" && (
              <>
                <DynamicArrayInput
                  title={item.name}
                  value={postJobData[item.key] || []}
                  onChange={(newValue) => handleInputChange(item.key, newValue)}
                  placeholder={item.placeholder}
                />
                {errors[item.key] && (
                  <p className="text-red-500 text-sm mt-1">{errors[item.key]}</p>
                )}
              </>
            )}

            {item.type === "multiselect" && (
              <>
                <label className="text-black font-medium">
                  {item.name}
                  {item.required && (
                    <span className="text-red-600 font-semibold ml-1">*</span>
                  )}
                </label>
                <MultiSelectDropDown
                  options={item.options || []}
                  value={postJobData[item.key] || []}
                  onChange={(selectedValues) =>
                    handleInputChange(item.key, selectedValues)
                  }
                />
                {errors[item.key] && (
                  <p className="text-red-500 text-sm mt-1">{errors[item.key]}</p>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default JobInfoSection;
