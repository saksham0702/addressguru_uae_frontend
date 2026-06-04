import React from "react";
import Steps from "@/components/Forms/Steps";
import JobInfoSection from "./JobInfoSection";
import CompanyInfoSection from "./CompanyInfoSection";

const JobForm = ({
  steps,
  setActiveStep,
  postJobData,
  setPostJobData,
  errors,
  clearError,
  refs,
  options,
  subCategories,
  loading,
  handleStepSubmit,
  validateStep,
  handleUsePreviousCompany,
  logoPreview,
  setLogoPreview,
  API_URL,
  getSelectedOption,
}) => {
  const activeStep = steps.find((s) => s.active)?.step;

  return (
    <div className="bg-white w-[95%] mx-auto flex flex-col items-center relative max-w-[2000px]">
      {/* steps */}
      <section className="mt-10 w-[80%] flex justify-center">
        <Steps steps={steps} setActiveStep={setActiveStep} />
      </section>

      {/* inputs */}
      <div className="flex gap-2 w-[80%] mt-14 items-center relative">
        <section className="w-full h-full space-y-7 p-4 mb-12 rounded-xl">
          {activeStep === 1 ? (
            <JobInfoSection
              postJobData={postJobData}
              setPostJobData={setPostJobData}
              errors={errors}
              clearError={clearError}
              refs={refs}
              options={options}
              subCategories={subCategories}
              getSelectedOption={getSelectedOption}
            />
          ) : (
            <CompanyInfoSection
              postJobData={postJobData}
              setPostJobData={setPostJobData}
              errors={errors}
              clearError={clearError}
              refs={refs}
              options={options}
              logoPreview={logoPreview}
              setLogoPreview={setLogoPreview}
              API_URL={API_URL}
              getSelectedOption={getSelectedOption}
            />
          )}

          {/* Validation Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-6 p-4 border border-red-300 bg-red-50 rounded-lg">
              <h3 className="text-red-600 font-semibold mb-2">
                Please fix the following errors:
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(errors).map(([key, message]) => (
                  <li key={key} className="text-red-500 text-sm">
                    {message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-8">
            {activeStep > 1 && (
              <button
                onClick={() => setActiveStep(activeStep - 1)}
                disabled={loading}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
            )}

            <div className="ml-auto flex gap-2">
              {activeStep === 2 && (
                <button
                  type="button"
                  onClick={handleUsePreviousCompany}
                  className="absolute top-[-70px] right-6 flex items-center gap-2 px-3 py-1.5 text-xs font-medium 
                    bg-white border border-gray-200 rounded-md shadow-sm hover:shadow 
                    hover:bg-gray-50 transition-all"
                >
                  Use previous company details
                </button>
              )}
              <button
                onClick={async () => {
                  if (validateStep(activeStep)) {
                    await handleStepSubmit(activeStep);
                  }
                }}
                disabled={loading}
                className="px-6 py-3 bg-[#FF6E04] hover:bg-[#E55A03] text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    {activeStep === 2 ? "Submit Job" : "Next Step"}
                    {activeStep < 2 && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobForm;
