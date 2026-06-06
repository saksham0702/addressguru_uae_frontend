import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import ResponseAlert from "@/components/ResponseAlert";
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
  ]);

  const API_URL = "https://addressguru.ae/api";

  // Fetch dropdown data on mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Replace these with your actual API calls
        const categoriesData = await get_job_categories();
        const educationData = await get_job_edulvl();
        console.log("categoriesData", categoriesData);
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
      console.log("languages data", languages);

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

    fetchDropdownData();
    fetchExtraData();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getCities();
        setCities(res.data);
      } catch (err) {
        console.error("Client-side error:", err);
        setErrors(err);
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
      if (!postJobData.category_slug) return; // ✅ change condition

      try {
        const res = await getSubCategoriesByCategory(postJobData.category_slug); // ✅ slug here

        const formatted = (res?.data || []).map((sub) => ({
          value: sub._id, // ✅ KEEP ID (no change)
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
    setSlug(res.slug); // ✅ IMPORTANT
    console.log("response of edit job", res);
    let subRes = null;

    if (res.category?.slug) {
      subRes = await getSubCategoriesByCategory(res.category.slug);
    }

    const formatted = (subRes?.data || []).map((sub) => ({
      value: sub._id,
      label: sub.name,
    }));

    setSubCategories(formatted);

    if (!res) return;

    if (res.company?.logo) {
      setLogoPreview(`${API_URL}/${res.company.logo}`);
    }

    setPostJobData((prev) => ({
      ...prev,

      // ✅ CATEGORY
      category_slug: res.category?.slug || "",

      // ❌ subCategory may be null
      sub_category_id: res.subCategory?._id || "",

      // ✅ BASIC
      title: res.title || "",
      description: res.description || "",

      // ✅ ARRAYS
      requirements: res.requirements || [],
      responsibilities: res.responsibilities || [],
      benefits: res.benefits || [],
      skills: res.skills || [],

      // ✅ JOB INFO
      sector: res.sector || "",
      jobType: res.jobType || "",
      experienceLevel: res.experienceLevel || "",

      education: res.education || "",
      openings: res.totalPositions || "",

      ageRange: res.ageRange ? `${res.ageRange.from}-${res.ageRange.to}` : "",

      // ✅ SALARY (IMPORTANT FIX)
      salaryRange:
        res.salary?.from && res.salary?.to
          ? `${res.salary.from}-${res.salary.to}`
          : "",

      // ✅ EXPERIENCE
      minExperience: res.noOfExperience || "",

      // ✅ LOCATION (IMPORTANT FIX)
      location: res.location?.city?._id || "",

      workMode: res.location?.isRemote ? "remote" : "on-site",

      // ✅ GENDER
      gender: res.gender || "",

      // ✅ MULTISELECT
      nationality: res.nationality || [],
      languages: res.language || [],

      // ✅ COMPANY
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
      // 🔥 MAP DATA INTO FORM
      setPostJobData((prev) => ({
        ...prev,
        // ✅ COMPANY
        companyName: data.company?.name || "",
        companyDescription: data.company?.description || "",
        companyWebsite: data.company?.website || "",
        address: data.company?.address || "",
        // ✅ CITY (IMPORTANT)
        city: data.company?.city?._id || "",
        // ✅ LOGO (STRING URL)
        companyLogo: data.company?.logo || "",
        // ✅ CONTACT
        name: data.contact?.name || "",
        email: data.contact?.email || "",
        phone: data.contact?.phone || "",
      }));

      // ✅ SET LOGO PREVIEW
      if (data.company?.logo) {
        setLogoPreview(`${API_URL}/${data.company.logo}`);
      }
    } catch (error) {
      console.log("Error loading previous company", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data from session storage on mount
  useEffect(() => {
    const savedData = getFromSession();
    if (savedData.postJobData) {
      setPostJobData(savedData.postJobData);
    }
    if (savedData.jobListingId) {
      setJobListingId(savedData.jobListingId);
    }
    if (savedData.currentStep && savedData.currentStep > 1) {
      setActiveStep(savedData.currentStep);
    }
    if (savedData.steps) {
      setSteps(savedData.steps);
    }
  }, []);

  // Save data to session storage whenever it changes
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
    if (jobListingId) {
      saveToSession("jobListingId", jobListingId);
    }
  }, [jobListingId]);

  useEffect(() => {
    saveToSession("steps", steps);
  }, [steps]);

  // Clear session on page leave
  useEffect(() => {
    const handleBeforeUnload = () => {
      clearSession();
    };

    const handleRouteChange = () => {
      clearSession();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  const setActiveStep = (stepNumber) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => ({
        ...step,
        active: step.step === stepNumber,
        completed: step.step < stepNumber ? true : step.completed,
      })),
    );
    saveToSession("currentStep", stepNumber);
  };

  // Clear specific error

  const clearError = (errorKey) => {
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Scroll to error field

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

    if (!ref?.current) return;

    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setTimeout(() => {
      const input = ref.current.querySelector("input, textarea, select");
      if (input) input.focus();
    }, 300);
  };

  const isBlank = (v) =>
    v === undefined ||
    v === null ||
    (typeof v === "string" && v.trim() === "") ||
    (Array.isArray(v) && v.length === 0);

  // Validate step 1

  const validateStep = (step) => {
    let newErrors = {};
    if (step === 1) {
      if (!postJobData.category_id) {
        newErrors.category_id = "Job category is required";
      }
      if (subCategories.length > 0 && !postJobData.sub_category_id) {
        newErrors.sub_category_id = "Sub category is required";
      }
      if (!postJobData.jobType) {
        newErrors.jobType = "Job type is required";
      }
      if (!postJobData.education) {
        newErrors.education = "Education level is required";
      }
      if (!postJobData.title.trim()) {
        newErrors.title = "Job title is required";
      }
      if (!postJobData.description.trim()) {
        newErrors.description = "Job description is required";
      }

      if (!postJobData.salaryRange) {
        newErrors.salaryRange = "Salary range is required";
      }

      if (isBlank(postJobData.openings)) {
        newErrors.openings = "Total positions is required";
      } else if (
        !/^\d+(\.\d+)?$/.test(postJobData.openings.toString().trim())
      ) {
        newErrors.openings = "Openings must be a number";
      }
      // Skills is now an array
      if (
        !postJobData.skills ||
        postJobData.skills.length === 0 ||
        postJobData.skills.every((s) => !s.trim())
      ) {
        newErrors.skills = "Please add at least one skill";
      }
    }
    if (step === 2) {
      if (!postJobData.companyName.trim()) {
        newErrors.companyName = "Company name is required";
      }
      if (!postJobData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(postJobData.email.trim())) {
        newErrors.email = "Invalid email format";
      }
      if (!postJobData.phone) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(postJobData.phone)) {
        newErrors.phone = "Phone number must be exactly 10 digits";
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      setTimeout(() => scrollToError(firstErrorKey), 100);
    }
    return Object.keys(newErrors).length === 0;
  };

  // Map API errors to frontend error keys

  const mapApiErrorsToState = (apiErrors, stepNumber) => {
    const errorMapping = {
      1: {
        title: "title",
        description: "description",
        experience: "experience",
        total_positions: "openings",
        skills: "skills",
        roles: "roles",
        key_skills: "keySkills",
        category: "category",
        job_type: "jobType",
        qualification: "qualification",

        // ✅ ADD THESE
        experienceLevel: "experienceLevel",
        gender: "gender",
        sector: "sector",
      },
      2: {
        company_name: "companyName",
        company_description: "companyDescription",
        company_website: "companyWebsite",
        company_logo: "companyLogo",
        name: "name",
        email: "email",
        phone: "phone",
        city: "city",
        address: "address",
      },
    };

    const mappedErrors = {};
    const currentStepMapping = errorMapping[stepNumber] || {};

    Object.keys(apiErrors).forEach((apiKey) => {
      const frontendKey = currentStepMapping[apiKey] || apiKey;
      const errorMessage = Array.isArray(apiErrors[apiKey])
        ? apiErrors[apiKey][0]
        : apiErrors[apiKey];
      mappedErrors[frontendKey] = errorMessage;
    });

    return mappedErrors;
  };

  // Submit data for specific step
  const handleStepSubmit = async (stepNumber) => {
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append("step", stepNumber);

    if (jobListingId) {
      formData.append("job_id", jobListingId);
      formData.append("slug", slug);
    } else if (slug) {
      formData.append("slug", slug); // ✅ IMPORTANT
    }

    switch (stepNumber) {
      case 1:
        formData.append("category_id", postJobData.category_id);
        if (postJobData.sub_category_id) {
          formData.append("sub_category_id", postJobData.sub_category_id);
        }
        formData.append("title", postJobData.title);
        formData.append("description", postJobData.description);
        formData.append("education", postJobData.education);

        // arrays → JSON string
        formData.append(
          "requirements",
          JSON.stringify(postJobData.requirements),
        );
        formData.append(
          "responsibilities",
          JSON.stringify(postJobData.responsibilities),
        );
        formData.append("benefits", JSON.stringify(postJobData.benefits));
        formData.append("skills", JSON.stringify(postJobData.skills));

        formData.append("sector", postJobData.sector);
        formData.append("jobType", postJobData.jobType);
        formData.append("experienceLevel", postJobData.experienceLevel);

        // openings → total_positions
        formData.append("total_positions", postJobData.openings);

        // salary JSON
        let salaryObj = {
          from: null,
          to: null,
          currency: postJobData.salaryCurrency || "AED",
          period: postJobData.salaryPeriod || "monthly",
          isNegotiable: postJobData.salaryNegotiable || false,
          isHidden: postJobData.salaryHidden || false,
        };

        if (postJobData.salaryRange) {
          const [from, to] = postJobData.salaryRange.split("-");

          salaryObj.from = Number(from);
          salaryObj.to = Number(to);
        }

        formData.append("salary", JSON.stringify(salaryObj));

        formData.append(
          "language",
          JSON.stringify(postJobData.languages || []),
        );

        formData.append(
          "nationality",
          JSON.stringify(postJobData.nationality || []),
        );

        // location → removed from Step 1 as requested
        formData.append("noOfExperience", postJobData.minExperience);

        formData.append("gender", postJobData.gender);

        const selectedAge = AGE_OPTIONS.find(
          (a) => a.value === postJobData.ageRange,
        );

        let ageObj = {};

        if (selectedAge?.value) {
          const [from, to] = selectedAge.value.split("-");

          ageObj = {
            from: Number(from),
            to: Number(to),
          };
        }

        formData.append("ageRange", JSON.stringify(ageObj));
        break;
      case 2:
        formData.append("folder", "Jobs");

        const contactObj = {
          name: postJobData.name,
          email: postJobData.email,
          phone: String(postJobData.phone),
          countryCode: postJobData.countryCode,
        };

        formData.append("contact", JSON.stringify(contactObj));

        const cityOptions = options.cityOptions || [];
        const selectedCompanyCity = cityOptions.find(
          (c) => c.value === postJobData.city,
        );

        const companyObj = {
          name: postJobData.companyName,
          description: postJobData.companyDescription,
          website: postJobData.companyWebsite,
          address: postJobData.address,
          locality: postJobData.locality,

          city: selectedCompanyCity
            ? {
                _id: selectedCompanyCity.value,
                name: selectedCompanyCity.label,
                slug:
                  selectedCompanyCity.slug ||
                  selectedCompanyCity.label.toLowerCase().replace(/\s+/g, "-"),
              }
            : null,
        };

        formData.append("company", JSON.stringify(companyObj));

        if (postJobData.companyLogo instanceof File) {
          formData.append("logo", postJobData.companyLogo);
        } else if (typeof postJobData.companyLogo === "string") {
          formData.append("previous_company_logo", postJobData.companyLogo);
        }

        break;
    }

    try {
      let res;

      if (stepNumber === 1) {
        res = await save_job({
          step: 1,
          formData,
          isEdit: !!edit, // ✅ FIXED
        });
      }

      if (stepNumber === 2) {
        res = await save_job({
          step: 2,
          formData,
          isEdit: true, // always update
        });
      }

      console.log(`Step ${stepNumber} submitted:`, res);
      const apiErrors = res?.errors || res?.error?.errors || {};

      if (apiErrors && Object.keys(apiErrors).length > 0) {
        const mappedErrors = mapApiErrorsToState(apiErrors, stepNumber);
        setErrors(mappedErrors);

        const firstErrorKey = Object.keys(mappedErrors)[0];
        setTimeout(() => scrollToError(firstErrorKey), 100);

        setLoading(false);
        return false;
      }

      if (!res?.success) {
        setResponse(res?.message || res?.error.error || "Something went wrong");
        setLoading(false);
        return false;
      }

      if (stepNumber == 1) {
        setJobListingId(res?.data?.data?.id);
        console.log("res of step 1 :", res);
        const newSlug = res?.data?.data?.slug;
        localStorage.setItem("slug", res?.data?.slug);

        setSlug(newSlug);

        saveToSession("slug", newSlug);
      }

      if (stepNumber === 2) {
        if (!res?.success) {
          setResponse(res?.message || "Failed to submit job");
          setLoading(false);
          return false;
        }

        clearSession();

        // Show thank-you popup
        const jobSlug = res?.data?.data?.slug || res?.data?.slug || slug;
        setSubmittedSlug(jobSlug);
        setShowThankYou(true);
      } else {
        setActiveStep(stepNumber + 1);
      }

      setLoading(false);
      return true;
    } catch (error) {
      console.error(`Error submitting step ${stepNumber}:`, error);
      if (error?.response?.data?.errors) {
        const mappedErrors = mapApiErrorsToState(
          error.response.data.errors,
          stepNumber,
        );
        setErrors(mappedErrors);
        const firstErrorKey = Object.keys(mappedErrors)[0];
        setTimeout(() => scrollToError(firstErrorKey), 100);
      } else {
        setResponse(
          error?.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      }
      setLoading(false);
      return false;
    }
  };

  const options = {
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
    ageOptions: AGE_OPTIONS.map((a) => ({
      value: a.value,
      label: a.name,
    })),
    genderOptions,
    nationalityOptions,
    languageOptions,
  };

  const getSelectedOption = (options = [], value) => {
    if (!value) return null;
    return options.find((opt) => opt?.value === value) || null;
  };

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
        <div className="fixed top-0 w-full bg-white z-40 flex justify-center">
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
            options={options}
            subCategories={subCategories}
            loading={loading}
            handleStepSubmit={handleStepSubmit}
            validateStep={validateStep}
            handleUsePreviousCompany={handleUsePreviousCompany}
            logoPreview={logoPreview}
            setLogoPreview={setLogoPreview}
            API_URL={API_URL}
            getSelectedOption={getSelectedOption}
          />
        </div>
      </div>

      {/* Thank You Popup Modal */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-[90%] text-center animate-[fadeInUp_0.3s_ease-out]">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Thank You! 🎉
            </h2>
            <p className="text-gray-600 mb-1">
              Your job has been submitted successfully with
            </p>
            <p className="text-[#FF6E04] font-semibold text-lg mb-4">
              AddressGuru UAE
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Our team will review your listing and approve it shortly. You will
              receive an email notification once it&apos;s live.
            </p>

            <div className="flex flex-col gap-3">
              {submittedSlug && (
                <button
                  onClick={() => {
                    setShowThankYou(false);
                    router.push(`/jobs/${submittedSlug}`);
                  }}
                  className="w-full px-6 py-3 bg-[#FF6E04] hover:bg-[#E55A03] text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Preview Job
                </button>
              )}
              <button
                onClick={() => {
                  setShowThankYou(false);
                  router.push("/dashboard");
                }}
                className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      <ResponseAlert text={response} onClose={() => setResponse("")} />

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};
export default JobListing;
