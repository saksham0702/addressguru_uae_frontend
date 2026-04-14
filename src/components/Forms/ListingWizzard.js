// components/ListingWizard.jsx
import { useRouter } from "next/router";
import Navbar from "@/components/Forms/Navbar";
import Steps from "@/components/Forms/Steps";
import Footer from "@/layout/footer";
import SuccessModal from "@/components/Forms/sucesspopup";
import BusinessInfo from "@/components/Forms/FormSections/BusinessInfo";
import AdditionalInfo from "@/components/Forms/FormSections/AdditionalInfo";
import SocialDetails from "@/components/Forms/FormSections/SocialDetails";
import ContactDetails from "@/components/Forms/FormSections/ContactDetails";
import SearchEngine from "@/components/Forms/FormSections/SearchEngine";
import ImageUploadSections from "@/components/Forms/FormSections/ImageUploadSections";
import PricingTable from "@/components/Plans/PricingTable";
import { BUSINESS_POSTING_TIPS } from "@/services/constants";
import { useListingForm } from "@/hooks/useListingForms";

export default function ListingWizard({
  categoryId,
  categoryName,
  subCategoryName,
  name,
}) {
  const router = useRouter();
  const form = useListingForm({ categoryId, name });
  const isEditMode = !!name;
  const currentPostingStep = BUSINESS_POSTING_TIPS.find(
    (t) => t.step === form?.currentStep,
  );
  console.log("form", form);

  const renderStep = () => {
    switch (form?.currentStep) {
      case 1:
        return (
          <div className="w-[72%]">
            <BusinessInfo
              category={categoryName}
              subCategory={subCategoryName}
              business={form?.business}
              setBusiness={form?.setBusiness}
              schedule={form?.schedule}
              setSchedule={form?.setSchedule}
              facilities={form?.facility}
              services={form?.service}
              courses={form?.courses}
              payment={form?.payment}
              selectedFacilities={form?.selectedFacilities}
              setSelectedFacilities={form?.setSelectedFacilities}
              selectedServices={form?.selectedServices}
              setSelectedServices={form?.setSelectedServices}
              selectedCourses={form?.selectedCourses}
              setSelectedCourses={form?.setSelectedCourses}
              selectedPayment={form?.selectedPayment}
              setSelectedPayment={form?.setSelectedPayment}
              errors={form?.errors}
              clearError={form?.clearError}
              refs={form?.refs}
            />

            {form?.additional_fields?.length > 0 && (
              <AdditionalInfo
                additionalFields={form?.additional_fields}
                values={form?.additionalFields}
                setValues={form?.setAdditionalFields}
              />
            )}
          </div>
        );
      case 2:
        return (
          <SocialDetails
            social={form?.social}
            setSocial={form?.setSocial}
            error={form?.errors}
            clearError={form?.clearError}
            refs={form?.refs}
          />
        );
      case 3:
        return (
          <ContactDetails
            contact={form?.contact}
            setContact={form?.setContact}
            business={form?.business}
            setBusiness={form?.setBusiness}
            error={form?.errors}
            clearError={form?.clearError}
            islistingForm={true}
            refs={form?.refs}
          />
        );
      case 4:
        return (
          <SearchEngine
            seo={form?.seo}
            setSeo={form?.setSeo}
            business={form?.business}
            error={form?.errors}
            clearError={form?.clearError}
            refs={form?.refs}
          />
        );
      // case 5 in renderStep():
      case 5:
        return (
          <ImageUploadSections
            media={form.media}
            setMedia={form.setMedia}
            error={form.errors}
            clearError={form.clearError}
            refs={form.refs}
            type="business" // or "marketplace" or "property"
            isEditMode={isEditMode}
          />
        );
      case 6:
        return (
          <section className="w-full" ref={form?.refs.planRef}>
            <PricingTable
              plans={form?.plans}
              selectedPlanId={form?.selectedPlanId}
              setSelectedPlanId={form?.setSelectedPlanId}
              onSelect={() => form?.clearError("plan")}
            />
            {form?.errors.plan && (
              <p className="text-red-500 mt-2 text-center">
                {form?.errors.plan}
              </p>
            )}
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full">
      <div className="bg-white md:w-[80%] max-md:w-full h-auto mx-auto flex flex-col items-center relative max-w-[2000px]">
        {/* Fixed top bar */}
        <div className="fixed top-0 md:w-[80%] max-w-[1400px] w-full bg-white z-40">
          {/* Posting tips */}
          <div className="relative group">
            <button
              className="absolute right-4 top-52 z-50 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 w-10 h-10 flex items-center justify-center rounded-full shadow-md font-semibold"
              title="Posting Tips"
            >
              i
            </button>
            <div className="absolute right-0 top-64 w-[380px] z-50 shadow-xl bg-[#FFF8F3] p-4 rounded-xl text-sm border border-orange-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <h6 className="font-extrabold text-base mb-3">Posting Tips</h6>
              {currentPostingStep?.fields?.map((field, i) => (
                <div key={i} className="mb-2">
                  <p className="font-semibold text-xs text-gray-800">
                    {field.title}
                  </p>
                  <p className="text-gray-600 text-[11px] leading-snug">
                    {field.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <Navbar
            categoryName={categoryName}
            subCategoryName={subCategoryName}
          />
        </div>

        {/* Steps indicator */}
        <section className="mt-26 md:scale-85 max-md:scale-90 2xl:scale-95 flex max-md:mb-5 justify-center">
          <Steps steps={form?.steps} setActiveStep={form?.setActiveStep} />
        </section>

        {/* Step content */}
        <div className="flex max-md:flex-col gap-2 items-start relative 2xl:w-[95%] md:mt-14 mb-24">
          <section className="2xl:w-[95%] w-full h-full max-md:px-5 md:pl-10 rounded-xl">
            {renderStep()}
          </section>
        </div>

        {/* Nav buttons */}
        <div className="flex justify-between w-[95%] 2xl:w-[95%] mb-8">
          {form?.currentStep > 1 ? (
            <button
              onClick={() => form?.setActiveStep(form?.currentStep - 1)}
              disabled={form?.isSubmitting}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              ← Previous
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() => form.handleStepSubmit(form.currentStep)}
            disabled={form?.isSubmitting}
            className="px-6 py-3 bg-[#FF6E04] hover:bg-[#E55A03] text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            {form?.isSubmitting
              ? "Submitting..."
              : form?.currentStep === 6
                ? "Complete Payment"
                : "Next Step →"}
          </button>
        </div>

        {/* Global error */}
        {form?.globalError && (
          <div className="w-[95%] mb-4 flex items-start gap-3 p-4 rounded-lg border border-red-200 bg-red-50">
            <span className="text-sm text-red-700 font-medium flex-1">
              {form?.globalError}
            </span>
            <button
              onClick={() => form?.setGlobalError("")}
              className="text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        )}

        <SuccessModal
          open={form?.showSuccess}
          onClose={() => form?.setShowSuccess(false)}
          title="Thank You!"
          message={
            <>
              Your listing has been submitted on{" "}
              <span className="font-semibold text-gray-800">
                AddressGuru.ae
              </span>
              .<br />
              Our team will review it shortly.
            </>
          }
          redirectTo="/dashboard"
        />
      </div>
      <Footer />
    </div>
  );
}
