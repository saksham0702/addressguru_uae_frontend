import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import ResponseAlert from "@/components/ResponseAlert";
import SuccessModal from "@/components/Forms/sucesspopup";
import {
  saveToSession,
  getFromSession,
  clearSession,
} from "@/utils/sessionStorage";
import { get_job_edulvl, get_job_type } from "@/api/postAds";
import { AGE_OPTIONS } from "@/services/constants";
import {
  get_job_benefits,
  get_job_by_slug,
  get_job_categories,
  get_languages,
  get_last_company_details,
  get_monthly_salary,
  get_nationalities,
  save_job,
} from "@/api/uae-job-listing";
import { get_plans } from "@/api/plans";
import { create_order, verify_payment } from "@/api/payment";
import Script from "next/script";
import {
  workModeOptions,
  experienceLevelOptions,
  genderOptions,
  sectorOptions,
  jobTypeOptions,
} from "@/services/constants";
import { getSubCategoriesByCategory } from "@/api/uaeAdminCategories";
import { getCities } from "@/api/uaeadminCities";
import Navbar from "@/components/Forms/Navbar";

import JobForm from "@/components/Forms/JobForm/JobForm";

const JobListing = () => {
  const router = useRouter();
  const { jobId } = router.query;
  const { edit } = router.query;
  const [subCategories, setSubCategories] = useState([]);

  // Refs for error scrolling
  const categoryRef = useRef(null);
  const jobTypeRef = useRef(null);
  const educationLevelRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const experienceRef = useRef(null);
  const openingsRef = useRef(null);
  const skillsRef = useRef(null);
  const rolesRef = useRef(null);
  const keySkillsRef = useRef(null);
  const companyNameRef = useRef(null);
  const companyDescriptionRef = useRef(null);
  const companyWebsiteRef = useRef(null);
  const companyLogoRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const cityRef = useRef(null);
  const addressRef = useRef(null);
  const subCategoryRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobListingId, setJobListingId] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [cities, setCities] = useState([]);
  const [showThankYou, setShowThankYou] = useState(false);
  const [submittedSlug, setSubmittedSlug] = useState("");

  // Dropdown data states
  const [categories, setCategories] = useState([]);
  const [slug, setSlug] = useState("");
  const [educationLevels, setEducationLevels] = useState([]);

  const [salaryOptions, setSalaryOptions] = useState([]);
  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [BenefitOptions, setBenefitOptions] = useState([]);

  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const [postJobData, setPostJobData] = useState({
    category_id: "",
    sub_category_id: "",
    slug: "",

    title: "",
    description: "",

    requirements: [],
    responsibilities: [],
    benefits: [],
    skills: [],

    sector: "",
    jobType: "",
    workMode: "",
    experienceLevel: "",

    salaryCurrency: "AED",
    salaryPeriod: "monthly",
    salaryNegotiable: false,
    salaryHidden: false,

    openings: "",

    location: "",
    education: "",

    gender: "",
    ageRange: "",

    companyLogo: null,
    companyName: "",
    companyDescription: "",
    companyWebsite: "",
    name: "",
    email: "",
    phone: "",
    countryCode: "+971",
    city: "",
    locality: "",
    address: "",
  });

  const [steps, setSteps] = useState([
    {
      step: 1,
      title: "Job Information",
      description: "Update your job details & info",
      active: true,
      completed: false,
    },
    {
      step: 2,
      title: "Company Details",
      description: "Add company information",
      active: false,
      completed: false,
    },
    {
      step: 3,
      title: "Select Plan",
      description: "Choose a plan for your job post",
      active: false,
      completed: false,
    },
  ]);

  const API_URL = "https://addressguru.ae/api";

  // Fetch dropdown data on mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const categoriesData = await get_job_categories();
        const educationData = await get_job_edulvl();
        setCategories(categoriesData);
        setEducationLevels(educationData?.data?.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    const fetchExtraData = async () => {
      const salary = await get_monthly_salary();
      const nationality = await get_nationalities();
      const languages = await get_languages();
      const benefits = await get_job_benefits();

      setBenefitOptions(
        benefits.map((item) => ({
          value: item.value,
          label: item.name,
        })),
      );

      setSalaryOptions(
        salary.map((item) => ({
          value: item.value,
          label: item.name,
        })),
      );

      setNationalityOptions(
        nationality.map((item) => ({
          value: item.value,
          label: item.name,
        })),
      );

      setLanguageOptions(
        languages.map((item) => ({
          value: item.value,
          label: item.name,
        })),
      );
    };

    const fetchPlans = async () => {
      try {
        const res = await get_plans("job");
        setPlans(res?.data?.plans || []);
      } catch (error) {
        console.error("Error fetching job plans:", error);
      }
    };

    fetchDropdownData();
    fetchExtraData();
    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getCities();
        setCities(res.data);
      } catch (err) {
        console.error("Client-side error:", err);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (jobId) {
      getJobDetails(jobId);
    }
  }, [jobId]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!postJobData.category_slug) return;
      try {
        const res = await getSubCategoriesByCategory(postJobData.category_slug);
        const formatted = (res?.data || []).map((sub) => ({
          value: sub._id,
          label: sub.name,
        }));
        setSubCategories(formatted);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      }
    };
    fetchSubCategories();
  }, [postJobData.category_slug]);

  const getJobDetails = async (jobId) => {
    const res = await get_job_by_slug(jobId);
    if (!res) return;
    setSlug(res.slug);
    let subRes = null;
    if (res.category?.slug) {
      subRes = await getSubCategoriesByCategory(res.category.slug);
    }
    const formatted = (subRes?.data || []).map((sub) => ({
      value: sub._id,
      label: sub.name,
    }));
    setSubCategories(formatted);

    if (res.company?.logo) {
      setLogoPreview(`${API_URL}/${res.company.logo}`);
    }

    setPostJobData((prev) => ({
      ...prev,
      category_id: res.category?._id || "",
      category_slug: res.category?.slug || "",
      sub_category_id: res.subCategory?._id || "",
      title: res.title || "",
      description: res.description || "",
      requirements: res.requirements || [],
      responsibilities: res.responsibilities || [],
      benefits: res.benefits || [],
      skills: res.skills || [],
      sector: res.sector || "",
      jobType: res.jobType || "",
      experienceLevel: res.experienceLevel || "",
      education: res.education || "",
      openings: res.totalPositions || "",
      ageRange: res.ageRange ? `${res.ageRange.from}-${res.ageRange.to}` : "",
      salaryRange:
        res.salary?.from && res.salary?.to
          ? `${res.salary.from}-${res.salary.to}`
          : "",
      minExperience: res.noOfExperience || "",
      location: res.location?.city?._id || "",
      workMode: res.location?.isRemote ? "remote" : "on-site",
      gender: res.gender || "",
      nationality: res.nationality || [],
      languages: res.language || [],
      companyLogo: res.company?.logo || null,
      companyName: res.company?.name || "",
      companyDescription: res.company?.description || "",
      companyWebsite: res.company?.website || "",
      name: res.contact?.name || "",
      email: res.contact?.email || "",
      phone: res.contact?.phone || "",
      city: res.company?.city?._id || "",
      locality:
        res.company?.locality || res.locality || res.localities?.[0] || "",
      address: res.company?.address || "",
    }));
  };

  const handleUsePreviousCompany = async () => {
    try {
      setLoading(true);
      const res = await get_last_company_details();
      if (!res?.status || !res?.data?.length) {
        alert("No previous company data found");
        return;
      }
      const data = res.data[0];
      setPostJobData((prev) => ({
        ...prev,
        companyName: data.company?.name || "",
        companyDescription: data.company?.description || "",
        companyWebsite: data.company?.website || "",
        address: data.company?.address || "",
        city: data.company?.city?._id || "",
        companyLogo: data.company?.logo || "",
        name: data.contact?.name || "",
        email: data.contact?.email || "",
        phone: data.contact?.phone || "",
      }));
      if (data.company?.logo) {
        setLogoPreview(`${API_URL}/${data.company.logo}`);
      }
    } catch (error) {
      console.log("Error loading previous company", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedData = getFromSession();
    if (savedData.postJobData) setPostJobData(savedData.postJobData);
    if (savedData.jobListingId) setJobListingId(savedData.jobListingId);
    if (savedData.currentStep && savedData.currentStep > 1)
      setActiveStep(savedData.currentStep);
    if (savedData.steps) setSteps(savedData.steps);
    if (savedData.selectedPlanId) setSelectedPlanId(savedData.selectedPlanId);
  }, []);

  useEffect(() => {
    if (
      postJobData.title ||
      postJobData.description ||
      postJobData.companyName
    ) {
      saveToSession("postJobData", postJobData);
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [postJobData]);

  useEffect(() => {
    if (jobListingId) saveToSession("jobListingId", jobListingId);
  }, [jobListingId]);

  useEffect(() => {
    saveToSession("steps", steps);
  }, [steps]);

  useEffect(() => {
    if (selectedPlanId) saveToSession("selectedPlanId", selectedPlanId);
  }, [selectedPlanId]);

  useEffect(() => {
    const handleRouteChange = () => clearSession();
    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [router.events]);

  const setActiveStep = (stepNumber) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => ({
        ...step,
        active: step.step === stepNumber,
        completed: step.step < stepNumber,
      })),
    );
    saveToSession("currentStep", stepNumber);
  };

  const clearError = (errorKey) => {
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const scrollToError = (errorKey) => {
    const errorRefMap = {
      category_id: categoryRef,
      sub_category_id: subCategoryRef,
      jobType: jobTypeRef,
      education: educationLevelRef,
      title: titleRef,
      description: descriptionRef,
      openings: openingsRef,
      skills: skillsRef,
      companyName: companyNameRef,
      email: emailRef,
      phone: phoneRef,
    };
    const ref = errorRefMap[errorKey];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        const input = ref.current.querySelector("input, textarea, select");
        if (input) input.focus();
      }, 300);
    }
  };

  const isBlank = (v) =>
    v === undefined ||
    v === null ||
    (typeof v === "string" && v.trim() === "") ||
    (Array.isArray(v) && v.length === 0);

  const validateStep = (stepNumber) => {
    let newErrors = {};
    if (stepNumber === 1) {
      if (!postJobData.category_id)
        newErrors.category_id = "Job category is required";
      if (subCategories.length > 0 && !postJobData.sub_category_id)
        newErrors.sub_category_id = "Sub category is required";
      if (!postJobData.jobType) newErrors.jobType = "Job type is required";
      if (!postJobData.education)
        newErrors.education = "Education level is required";
      if (!postJobData.title.trim()) newErrors.title = "Job title is required";
      if (!postJobData.description.trim())
        newErrors.description = "Job description is required";
      if (!postJobData.salaryRange)
        newErrors.salaryRange = "Salary range is required";
      if (isBlank(postJobData.openings)) {
        newErrors.openings = "Total positions is required";
      } else if (!/^\d+$/.test(postJobData.openings.toString().trim())) {
        newErrors.openings = "Openings must be a number";
      }
      if (!postJobData.skills || postJobData.skills.length === 0)
        newErrors.skills = "Please add at least one skill";
    }
    if (stepNumber === 2) {
      if (!postJobData.companyName.trim())
        newErrors.companyName = "Company name is required";
      if (!postJobData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(postJobData.email.trim())) {
        newErrors.email = "Invalid email format";
      }
      if (!postJobData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{5,12}$/.test(postJobData.phone)) {
        newErrors.phone = "Phone number must be between 5 and 12 digits";
      }
    }
    if (stepNumber === 3) {
      if (!selectedPlanId) newErrors.plan = "Please select a plan";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      setTimeout(() => scrollToError(firstErrorKey), 100);
      return false;
    }
    return true;
  };

  const mapApiErrorsToState = (apiErrors, stepNumber) => {
    const errorMapping = {
      1: {
        title: "title",
        description: "description",
        total_positions: "openings",
        category: "category_id",
        job_type: "jobType",
      },
      2: {
        company_name: "companyName",
        name: "name",
        email: "email",
        phone: "phone",
      },
    };
    const mappedErrors = {};
    const mapping = errorMapping[stepNumber] || {};
    Object.keys(apiErrors).forEach((key) => {
      const frontendKey = mapping[key] || key;
      mappedErrors[frontendKey] = Array.isArray(apiErrors[key])
        ? apiErrors[key][0]
        : apiErrors[key];
    });
    return mappedErrors;
  };

  const handleStepSubmit = async (stepNumber) => {
    setLoading(true);
    setErrors({});
    const formData = new FormData();
    formData.append("step", stepNumber);
    if (jobListingId) {
      formData.append("job_id", jobListingId);
      formData.append("slug", slug);
    } else if (slug) {
      formData.append("slug", slug);
    }

    if (stepNumber === 1) {
      formData.append("category_id", postJobData.category_id);
      if (postJobData.sub_category_id)
        formData.append("sub_category_id", postJobData.sub_category_id);
      formData.append("title", postJobData.title);
      formData.append("description", postJobData.description);
      formData.append("education", postJobData.education);
      formData.append("requirements", JSON.stringify(postJobData.requirements));
      formData.append(
        "responsibilities",
        JSON.stringify(postJobData.responsibilities),
      );
      formData.append("benefits", JSON.stringify(postJobData.benefits));
      formData.append("skills", JSON.stringify(postJobData.skills));
      formData.append("sector", postJobData.sector);
      formData.append("jobType", postJobData.jobType);
      formData.append("experienceLevel", postJobData.experienceLevel);
      formData.append("total_positions", postJobData.openings);
      let salaryObj = {
        from: null,
        to: null,
        currency: postJobData.salaryCurrency,
        period: postJobData.salaryPeriod,
        isNegotiable: postJobData.salaryNegotiable,
        isHidden: postJobData.salaryHidden,
      };
      if (postJobData.salaryRange) {
        const [from, to] = postJobData.salaryRange.split("-");
        salaryObj.from = Number(from);
        salaryObj.to = Number(to);
      }
      formData.append("salary", JSON.stringify(salaryObj));
      formData.append("language", JSON.stringify(postJobData.languages || []));
      formData.append(
        "nationality",
        JSON.stringify(postJobData.nationality || []),
      );
      formData.append("noOfExperience", postJobData.minExperience);
      formData.append("gender", postJobData.gender);
      const selectedAge = AGE_OPTIONS.find(
        (a) => a.value === postJobData.ageRange,
      );
      let ageObj = {};
      if (selectedAge?.value) {
        const [from, to] = selectedAge.value.split("-");
        ageObj = { from: Number(from), to: Number(to) };
      }
      formData.append("ageRange", JSON.stringify(ageObj));
    } else if (stepNumber === 2) {
      formData.append("folder", "Jobs");
      formData.append(
        "contact",
        JSON.stringify({
          name: postJobData.name,
          email: postJobData.email,
          phone: String(postJobData.phone),
          countryCode: postJobData.countryCode,
        }),
      );
      const selectedCity = cities.find((c) => c._id === postJobData.city);
      formData.append(
        "company",
        JSON.stringify({
          name: postJobData.companyName,
          description: postJobData.companyDescription,
          website: postJobData.companyWebsite,
          address: postJobData.address,
          locality: postJobData.locality,
          city: selectedCity
            ? {
                _id: selectedCity._id,
                name: selectedCity.name,
                slug: selectedCity.slug,
              }
            : null,
        }),
      );
      if (postJobData.companyLogo instanceof File)
        formData.append("logo", postJobData.companyLogo);
      else if (typeof postJobData.companyLogo === "string")
        formData.append("previous_company_logo", postJobData.companyLogo);
    }

    try {
      const res = await save_job({
        step: stepNumber,
        formData,
        isEdit: stepNumber === 2 || !!edit,
      });
      if (res?.errors) {
        setErrors(mapApiErrorsToState(res.errors, stepNumber));
        setLoading(false);
        return false;
      }
      if (!res?.success) {
        setResponse(res?.message || "Operation failed");
        setLoading(false);
        return false;
      }
      if (stepNumber === 1) {
        setJobListingId(res.data?.data?.id);
        setSlug(res.data?.data?.slug);
      }
      setActiveStep(stepNumber + 1);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Submit error:", err);
      setResponse("Server error occurred");
      setLoading(false);
      return false;
    }
  };

  const handlePayment = async () => {
    try {
      if (!selectedPlanId) {
        setErrors({ plan: "Please select a plan" });
        return;
      }
      setLoading(true);
      const orderResponse = await create_order({
        plan_id: selectedPlanId,
        listing_id: jobListingId,
      });
      if (orderResponse.free_plan) {
        const formData = new FormData();
        formData.append("plan_id", selectedPlanId);
        formData.append("slug", slug);
        if (jobListingId) formData.append("job_id", jobListingId);
        const res = await save_job({ formData, step: 3, isEdit: true });

        console.log(res?.data);
        if (res?.data?.status) {
          clearSession();
          setSubmittedSlug(res.data?.data?.slug || slug);
          setShowThankYou(true);
        } else {
          setResponse(res?.data?.message || "Failed to finalize job");
        }
        setLoading(false);
        return;
      }

      const { payment_id, order_id, amount, currency, key } =
        orderResponse.data;
      const options = {
        key,
        amount,
        currency,
        name: "AddressGuru",
        description: "Job Listing Plan Purchase",
        order_id,
        handler: async function (response) {
          try {
            const verify = await verify_payment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: payment_id,
            });
            if (verify.success) {
              const formData = new FormData();
              formData.append("plan_id", selectedPlanId);
              formData.append("slug", slug);
              if (jobListingId) formData.append("job_id", jobListingId);
              const res = await save_job({ formData, step: 3, isEdit: true });
              if (res?.data?.status) {
                clearSession();
                setSubmittedSlug(res.data?.data?.slug || slug);
                setShowThankYou(true);
              } else {
                setResponse(
                  res?.data?.message || "Failed to finalize job listing",
                );
              }
            }
          } catch (error) {
            console.error("Payment verification failed", error);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: postJobData.name,
          email: postJobData.email,
          contact: postJobData.phone,
        },
        theme: { color: "#FF6E04" },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      razorpay.on("payment.failed", () => {
        setResponse("Payment failed");
        setLoading(false);
      });
    } catch (error) {
      console.error("Payment error", error);
      setResponse("Error initiating payment");
      setLoading(false);
    }
  };

  const formOptions = {
    categoryOptions: (categories || []).map((cat) => ({
      value: cat._id,
      label: cat.name,
      slug: cat.slug,
    })),
    cityOptions: cities?.map((city) => ({
      value: city._id,
      label: city.name,
      slug: city.slug,
    })),
    sectorOptions,
    jobTypeOptions,
    workModeOptions,
    experienceLevelOptions,
    salaryOptions,
    BenefitOptions,
    educationLevels: (educationLevels || []).map((item) => ({
      value: item.value,
      label: item.name,
    })),
    ageOptions: AGE_OPTIONS.map((a) => ({ value: a.value, label: a.name })),
    genderOptions,
    nationalityOptions,
    languageOptions,
  };

  const getSelectedOption = (opts = [], val) =>
    opts.find((o) => o.value === val) || null;

  const refs = {
    categoryRef,
    subCategoryRef,
    titleRef,
    descriptionRef,
    skillsRef,
    jobTypeRef,
    educationLevelRef,
    openingsRef,
    companyLogoRef,
    companyNameRef,
    companyDescriptionRef,
    companyWebsiteRef,
    nameRef,
    emailRef,
    phoneRef,
    cityRef,
    addressRef,
  };

  return (
    <>
      <div className="min-h-screen w-full relative">
        <div className="fixed top-0 w-full bg-white z-40 flex justify-center border-b">
          <div className="w-[90%] max-w-[1400px]">
            <Navbar />
          </div>
        </div>
        <div className="pt-20">
          <JobForm
            steps={steps}
            setActiveStep={setActiveStep}
            postJobData={postJobData}
            setPostJobData={setPostJobData}
            errors={errors}
            clearError={clearError}
            refs={refs}
            options={formOptions}
            subCategories={subCategories}
            loading={loading}
            handleStepSubmit={handleStepSubmit}
            validateStep={validateStep}
            handleUsePreviousCompany={handleUsePreviousCompany}
            logoPreview={logoPreview}
            setLogoPreview={setLogoPreview}
            API_URL={API_URL}
            getSelectedOption={getSelectedOption}
            plans={plans}
            selectedPlanId={selectedPlanId}
            setSelectedPlanId={setSelectedPlanId}
            handlePayment={handlePayment}
          />
        </div>
      </div>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <SuccessModal
        open={showThankYou}
        onClose={() => setShowThankYou(false)}
        title="Thank You! 🎉"
        message={
          <>
            Your job has been successfully submitted with{" "}
            <span className="font-semibold text-gray-800">AddressGuru UAE</span>
            .
            <br />
            Our team will review it shortly.
          </>
        }
        redirectTo="/dashboard"
        autoRedirect={true}
      />
      <ResponseAlert text={response} onClose={() => setResponse("")} />
    </>
  );
};

export default JobListing;
