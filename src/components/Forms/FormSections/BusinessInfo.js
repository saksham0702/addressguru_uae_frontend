// ========== BusinessInfo.jsx (CORRECTED) ==========
import React, { useState, useEffect } from "react";
import InputWithTitle from "../InputWithTitle";
import CheckBox from "../CheckBox";
import Timings from "../Timings";
import axios from "axios";
import { GEMINI_KEY } from "@/services/constants";

const BusinessInfo = ({
  business,
  setBusiness,
  category,
  subCategory,
  errors,
  facilities,
  services,
  courses,
  payment,
  schedule,
  setSchedule,
  selectedFacilities,
  selectedServices,
  setSelectedFacilities,
  selectedCourses,
  setSelectedCourses,
  setSelectedServices,
  setSelectedPayment,
  refs,
  clearError,
  selectedPayment,
}) => {
  const [loading, setLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const [checkingModels, setCheckingModels] = useState(true);

  const handleInputChange = (field, value, errorKey) => {
    handleChange(field, value);

    // Clear error when user starts typing
    if (clearError && errorKey) {
      clearError(errorKey);
    }
  };

  useEffect(() => {
    const fetchAvailableModels = async () => {
      setCheckingModels(true);
      try {
        if (!GEMINI_KEY) {
          setCheckingModels(false);
          return;
        }

        const response = await axios.get(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_KEY}`,
        );

        if (response.data?.models) {
          const generateModels = response.data.models
            .filter((model) =>
              model.supportedGenerationMethods?.includes("generateContent"),
            )
            .map((model) => model.name.replace("models/", ""));

          setAvailableModels(generateModels);
        }
      } catch (error) {
        console.log("Error fetching models:", error);
      } finally {
        setCheckingModels(false);
      }
    };

    fetchAvailableModels();
  }, []);

  const handleChange = (field, value) => {
    setBusiness((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const canGenerate = business.name?.trim() && business.address?.trim();

  const getSelectedNames = (selectedIds, optionsArray) => {
    if (!selectedIds || selectedIds.length === 0) return "general";
    return selectedIds
      .map((id) => {
        const item = optionsArray.find((opt) => opt.id === id);
        return item?.name || item?.title || "";
      })
      .filter(Boolean)
      .join(", ");
  };

  const generateDescription = async () => {
    if (!canGenerate) {
      alert("Please enter business name and address first");
      return;
    }

    if (availableModels.length === 0) {
      alert(
        "No compatible Gemini models found. Please check your API key at https://aistudio.google.com/app/apikey",
      );
      return;
    }

    setLoading(true);

    const facilityNames = getSelectedNames(selectedFacilities, facilities);
    const serviceNames = getSelectedNames(selectedServices, services);

    for (const modelName of availableModels) {
      try {
        const prompt = `Write a detailed, engaging classified or business directory SEO optimized ad description for a business named "${
          business.name
        }" located at "${business.address}". It's in the category "${
          category 
        }". Its facilities are ${facilityNames} and services it provides are ${serviceNames}. This is for a classified website. The description must be minimum 500 and maximum 550 characters . Be professional and attractive. Only provide the description text, nothing else. No icons, no emojis, no special characters. Use easy English with high readability.`;

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 700,
            },
          },
        );

        const generatedText =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (generatedText) {
          const cleanText = generatedText
            .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
            .replace(/[✨🎉🌟⭐💫🔥👍✓✔️❤️]/g, "")
            .trim();

          handleChange("description", cleanText);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log(`Failed with ${modelName}:`, error.message);
        continue;
      }
    }

    setLoading(false);
    alert(
      "Failed to generate description with all available models. Please try again later.",
    );
  };

  return (
    <section className="space-y-4">
      {/* Business Name - Wrapped with ref */}
      <div ref={refs?.businessNameRef}>
        <InputWithTitle
          required={true}
          error={errors?.businessName}
          title="Business Name"
          isTextarea={false}
          placeholder="Enter business name"
          value={business.name}
          onChange={(e) =>
            handleInputChange("name", e.target.value, "businessName")
          }
        />
      </div>
      <div ref={refs?.businessAddressRef}>
        <InputWithTitle
          required={true}
          error={errors?.businessAddress}
          title="Business Address"
          isTextarea={true}
          rows={2}
          placeholder="Enter address"
          value={business.address}
          onChange={(e) =>
            handleInputChange("address", e.target.value, "businessAddress")
          }
        />
      </div>

      {/* establishment year and tax number */}

      <section className="flex gap-5 max-w-[600px] w-full items-center">
        <div className="w-sm" ref={refs?.establishmentYearRef}>
          <InputWithTitle
            placeholder={"yyyy"}
            error={errors?.establishmentYear}
            title="Establishment Year"
            value={business.establishmentYear}
            onChange={(e) =>
              handleInputChange(
                "establishmentYear",
                e.target.value,
                "establishmentYear",
              )
            }
          />
        </div>
      </section>

      {/* Facilities - with ref and selectedIds */}
      {facilities.length > 0 && (
        <div ref={refs?.facilitiesRef}>
          <CheckBox
            error={errors?.facilities}
            heading="Facility"
            options={facilities}
            selectedIds={selectedFacilities}
            onChange={(ids) => {
              setSelectedFacilities(ids);
              if (clearError && ids.length > 0) {
                clearError("facilities");
              }
            }}
            errorRef={refs?.facilitiesRef}
          />
        </div>
      )}
      {services.length > 0 && (
        <div ref={refs?.servicesRef}>
          <CheckBox
            error={errors?.services}
            heading="Service"
            options={services}
            selectedIds={selectedServices}
            onChange={(ids) => {
              setSelectedServices(ids);
              if (clearError && ids.length > 0) {
                clearError("services");
              }
            }}
            errorRef={refs?.servicesRef}
          />
        </div>
      )}
      {courses.length > 0 && (
        <div ref={refs?.coursesRef}>
          <CheckBox
            error={errors?.courses}
            heading="Courses"
            options={courses}
            selectedIds={selectedCourses}
            onChange={(ids) => {
              setSelectedCourses(ids);
              if (clearError && ids.length > 0) {
                clearError("courses");
              }
            }}
            errorRef={refs?.coursesRef}
          />
        </div>
      )}
      <div ref={refs?.payment}>
        <CheckBox
          error={errors?.payments}
          heading="Payment Mode"
          options={payment}
          selectedIds={selectedPayment} // ✅ Use actual state
          onChange={(ids) => {
            setSelectedPayment(ids);
            if (clearError && ids.length > 0) {
              clearError("payments"); // ✅ Fix key name
            }
          }}
          errorRef={refs?.paymentRef}
        />
      </div>

      {/* Ad Description - Wrapped with ref */}
      <div ref={refs?.businessDescriptionRef}>
        <div className="flex items-center justify-between mb-2">
          <span className="flex gap-1 items-center">
            <h3 className="text-[#696969] 2xl:text-lg relative capitalize font-semibold">
              Ad Description
              <span className="text-red-600 ml-1">&#42;</span>
            </h3>
            {errors?.businessDescription && (
              <p className="text-red-500 text-sm mt-1 font-normal">
                {errors?.businessDescription}
              </p>
            )}
          </span>

          {/* Model Status Indicator */}
          <div className="flex items-center gap-2">
            {checkingModels && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Checking AI...
              </span>
            )}
            {!checkingModels && availableModels.length > 0 && (
              <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                AI Ready
              </span>
            )}
            {!checkingModels && availableModels.length === 0 && (
              <span className="text-xs text-red-600 flex items-center gap-1 bg-red-50 px-2 py-1 rounded">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                AI Unavailable
              </span>
            )}
          </div>
        </div>

        {/* Error Message */}
        {!checkingModels && availableModels.length === 0 && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <p className="font-semibold">AI Generation Not Available</p>
            <p className="mt-1">
              Please check your API key at{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-red-800"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        )}

        {loading && (
          <div className="mb-3 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-700 font-medium">
              Generating description...
            </span>
          </div>
        )}

        <div className="relative">
          <textarea
            className="w-full border border-gray-200 p-2 pr-32 rounded-md resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
            rows={5}
            placeholder="Enter description or generate using AI"
            value={business.description || ""}
            onChange={(e) =>
              handleInputChange(
                "description",
                e.target.value,
                "businessDescription",
              )
            }
            //
          />
          <button
            onClick={generateDescription}
            disabled={!canGenerate || loading || availableModels.length === 0}
            className="absolute top-2 right-2 px-3 py-1.5 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            title={
              availableModels.length === 0
                ? "AI model not available"
                : !canGenerate
                  ? "Enter business name and address first"
                  : "Generate AI description"
            }
          >
            {loading ? "Generating..." : "Generate AI"}
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1 text-right">
          {business.description ? business.description.length : 0} / 700
          characters
        </div>
      </div>

      <Timings schedule={schedule} setSchedule={setSchedule} />
    </section>
  );
};

export default BusinessInfo;
