import React, { useState, useMemo } from "react";

const JobPop = ({ category, type, eduLevel, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [postJobData, setPostJobData] = useState({
    jobType: { id: "", label: "" },
    category: { id: "", label: "" },
    educationLevel: { id: "", label: "" },
  });
  console.log("category data", category);
  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return category || [];
    return (category || []).filter((cat) =>
      cat?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [category, searchTerm]);

  const handleCategorySelect = (selectedCategory) => {
    setPostJobData((prev) => ({
      ...prev,
      category: { id: selectedCategory.id, label: selectedCategory.name },
    }));
  };

  const handleTypeSelect = (selectedType) => {
    setPostJobData((prev) => ({
      ...prev,
      jobType: { id: selectedType.id, label: selectedType.type },
    }));
  };

  const handleEducationSelect = (selectedEducation) => {
    setPostJobData((prev) => ({
      ...prev,
      educationLevel: {
        id: selectedEducation.id,
        label: selectedEducation.level,
      },
    }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return postJobData?.category?.id !== "";
      case 2:
        return postJobData?.jobType?.id !== "";
      case 3:
        return postJobData?.educationLevel?.id !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3 && canProceedToNext()) {
      setCurrentStep((prev) => prev + 1);
      setSearchTerm(""); // Clear search when moving to next step
    } else if (currentStep === 3 && canProceedToNext()) {
      // Prepare data for parent with only IDs
      const finalData = {
        jobType: postJobData.jobType.id,
        category: postJobData.category.id,
        educationLevel: postJobData.educationLevel.id,
      };

      if (onComplete) {
        onComplete(finalData);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setSearchTerm("");
    }
  };
  const renderStepTitle = () => {
    const titles = {
      1: "Select Job Category",
      2: "Choose Job Type",
      3: "Select Education Level",
    };
    return (
      <h2 className="text-xl font-bold text-center mb-2 text-gray-800">
        {titles[currentStep]}
      </h2>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white rounded-lg p-2  shadow-sm border border-gray-100">
            {/* Search Bar for Categories */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=" px-5 py-[6px] border w-xs border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="max-h-64 overflow-y-auto flex flex-wrap gap-2 space-y-2">
              {filteredCategories?.length > 0 ? (
                filteredCategories?.map((cat, index) => (
                  <div
                    key={index}
                    onClick={() => handleCategorySelect(cat)}
                    className={`p-2 h-10 rounded-lg text-sm cursor-pointer transition-colors ${
                      postJobData?.category?.id === cat?.id
                        ? "bg-orange-100 border-2 border-orange-500 text-orange-700"
                        : "bg-gray-50 hover:bg-orange-50 border-2 border-transparent"
                    }`}
                  >
                    {cat?.name}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No categories found matching `{searchTerm}`
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="max-h-64 overflow-y-auto space-y-2">
              {type?.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleTypeSelect(item)}
                  className={`p-3 rounded-lg text-sm cursor-pointer transition-colors ${
                    postJobData?.jobType?.id === item?.id
                      ? "bg-orange-100 border-2 border-orange-500 text-orange-700"
                      : "bg-gray-50 hover:bg-orange-50 border-2 border-transparent"
                  }`}
                >
                  {item?.type}
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="max-h-64 overflow-y-auto space-y-2">
              {eduLevel?.map((level, index) => (
                <div
                  key={index}
                  onClick={() => handleEducationSelect(level)}
                  className={`p-3 rounded-lg text-sm cursor-pointer transition-colors ${
                    postJobData?.educationLevel?.id === level?.id
                      ? "bg-orange-100 border-2 border-orange-500 text-orange-700"
                      : "bg-gray-50 hover:bg-orange-50 border-2 border-transparent"
                  }`}
                >
                  {level?.level}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-w-2xl mx-auto  p-2 ">
      {/* {renderStepIndicator()} */}
      {renderStepTitle()}
      {renderCurrentStep()}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            currentStep === 1
              ? "hidden"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceedToNext()}
          className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
            canProceedToNext()
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {currentStep === 3 ? "Complete" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default JobPop;
