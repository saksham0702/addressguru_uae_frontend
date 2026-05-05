import { get_company_data } from "@/api/forms";
import InputWithTitle from "@/components/Forms/InputWithTitle";
import Navbar from "@/components/Forms/Navbar";
import { SearchableMultiSelect } from "@/components/Forms/SearchableMultiSelect";
import Steps from "@/components/Forms/Steps";
import DynamicArrayInput from "@/components/Forms/DynamicArrayInput";
import DropDown from "@/components/Forms/DropDown";
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
import MultiSelectDropDown from "@/components/Forms/MultiSelect";

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
    city: "",
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
      if (postJobData.skills.length === 0) {
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
        newErrors.phone = "Phone number must be 10 digits";
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

        // location JSON
        const selectedCity = cityOptions.find(
          (c) => c.value === postJobData.location,
        );

        const locationObj = {
          city: selectedCity
            ? {
              _id: selectedCity.value,
              name: selectedCity.label,
              slug: selectedCity.slug, // ✅ ADD THIS
            }
            : null,
          isRemote: postJobData.workMode === "remote",
        };

        formData.append("location", JSON.stringify(locationObj));

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
        // formData.append("slug", String(slug));

        const contactObj = {
          name: postJobData.name,
          email: postJobData.email,
          phone: String(postJobData.phone),
        };

        formData.append("contact", JSON.stringify(contactObj));

        const selectedCompanyCity = cityOptions.find(
          (c) => c.value === postJobData.city,
        );

        const companyObj = {
          name: postJobData.companyName,
          description: postJobData.companyDescription,
          website: postJobData.companyWebsite,
          address: postJobData.address,

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

        if (postJobData.companyLogo) {
          formData.append("logo", postJobData.companyLogo);
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
        setResponse("Job listing posted successfully!");

        if (res?.job_id) {
          setTimeout(() => {
            router.push(`/dashboard`);
          }, 2000);
        }
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

  // Convert dropdown data to options format
  const categoryOptions = (categories || []).map((cat) => ({
    value: cat._id,
    label: cat.name,
    slug: cat.slug, // ✅ IMPORTANT
  }));

  const cityOptions = cities?.map((city) => ({
    value: city._id, // important → ID
    label: city.name, // display name
    slug: city.slug,
  }));

  const getSelectedOption = (options = [], value) => {
    if (!value) return null;
    return options.find((opt) => opt?.value === value) || null;
  };

  const jobInfoForms = [
    {
      id: 1,
      name: "Category",
      key: "category_id",
      type: "dropdown",
      placeholder: "Select category",
      required: true,
      ref: categoryRef,
      options: categoryOptions,
    },
    {
      id: 2,
      name: "Sub Category",
      key: "sub_category_id",
      type: "dropdown",
      placeholder: "Select sub category",
      ref: subCategoryRef,
      options: subCategories,
    },
    {
      id: 3,
      name: "Job Title",
      key: "title",
      type: "text",
      placeholder: "Enter job title",
      ref: titleRef,
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
      ref: descriptionRef,
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
      type: "search",
      placeholder: "Enter skill",
      ref: skillsRef,
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
      ref: jobTypeRef,
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
    },
    {
      id: 12,
      width: true,
      name: "Experience Level",
      key: "experienceLevel",
      type: "dropdown",
      placeholder: "Select experience level",
      options: experienceLevelOptions,
      requried: true,
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
      ref: openingsRef,
      required: true,
    },
    {
      id: 15,
      width: true,
      name: "Location",
      key: "location",
      type: "dropdown",
      options: cityOptions,
    },
    {
      id: 16,
      width: true,
      name: "Education",
      key: "education",
      type: "dropdown",
      ref: educationLevelRef,
      options: (educationLevels || []).map((item) => ({
        value: item.value,
        label: item.name,
      })),
    },

    {
      id: 17,
      width: true,
      name: "Age Range",
      key: "ageRange",
      type: "dropdown",
      options: AGE_OPTIONS.map((a) => ({
        value: a.value,
        label: a.name,
      })),
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
      type: "multiselect", // multi-select
    },

    {
      id: 21,
      width: true,
      name: "Languages",
      key: "languages",
      type: "multiselect",
    },
  ];

  const companyForms = [
    {
      id: 1,
      name: "Company Logo",
      key: "companyLogo",
      type: "file",
      ref: companyLogoRef,
    },
    {
      id: 2,
      name: "Company Name",
      key: "companyName",
      type: "text",
      placeholder: "Enter company name",
      required: true,
      ref: companyNameRef,
    },
    {
      id: 3,
      name: "Company Description",
      key: "companyDescription",
      type: "textarea",
      placeholder: "Enter company description",
      ref: companyDescriptionRef,
    },
    {
      id: 4,
      name: "Company Website",
      key: "companyWebsite",
      type: "text",
      placeholder: "Enter website",
      ref: companyWebsiteRef,
    },
    {
      id: 5,
      width: true,
      name: "Name",
      key: "name",
      type: "text",
      placeholder: "Enter contact person name",
      ref: nameRef,
    },
    {
      id: 6,
      width: true,
      name: "Email",
      key: "email",
      type: "text",
      placeholder: "Enter email",
      required: true,
      ref: emailRef,
    },
    {
      id: 7,
      width: true,
      name: "Phone",
      key: "phone",
      type: "text",
      placeholder: "Enter phone number",
      required: true,
      ref: phoneRef,
    },
    {
      id: 8,
      width: true,
      name: "City",
      key: "city",
      type: "dropdown",
      placeholder: "Select city",
      ref: cityRef,
      options: cityOptions,
    },
    {
      id: 9,
      name: "Address",
      key: "address",
      type: "textarea",
      placeholder: "Enter address",
      ref: addressRef,
    },
  ];

  const activeStep = steps.find((s) => s.active)?.step;
  const currentForms = activeStep === 1 ? jobInfoForms : companyForms;

  return (
    <>
      <div className="min-h-screen w-full relative">
        <div className="bg-white w-[95%] mx-auto flex flex-col items-center relative max-w-[2000px]">
          {/* navbar */}
          <div className="fixed top-0 w-[90%] max-w-[1400px] bg-white z-40">
            <Navbar />
          </div>
          {/* steps */}
          <section className="mt-26 w-[80%] flex justify-center">
            <Steps steps={steps} setActiveStep={setActiveStep} />
          </section>

          {/* inputs */}
          <div className="flex gap-2 w-[80%] mt-14 items-center relative">
            <section className="w-[85%] h-full space-y-7 p-4 mb-12 rounded-xl">
              <div className="grid grid-cols-2 gap-6">
                {currentForms.map((item, index) => {
                  // ✅ Hide Sub Category if no data
                  if (
                    item.key === "sub_category_id" &&
                    subCategories.length === 0
                  ) {
                    return null;
                  }
                  const commonProps = {
                    key: item.id || index,
                    title: item.name,
                    placeholder: item.placeholder,
                    value: postJobData[item.key],
                    onChange: (e) => {
                      setPostJobData({
                        ...postJobData,
                        [item.key]: e.target.value,
                      });
                      clearError(item.key);
                    },
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
                              <span className="text-red-600 font-semibold ml-1">
                                &#42;
                              </span>
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
                                setPostJobData({
                                  ...postJobData,
                                  [item.key]: option.value,
                                });
                              }

                              clearError(item.key);
                            }}
                          />

                          {errors[item.key] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[item.key]}
                            </p>
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
                            <p className="text-red-500 text-sm mt-1">
                              {errors[item.key]}
                            </p>
                          )}
                        </>
                      )}

                      {item.type === "textarea" && (
                        <>
                          <InputWithTitle
                            isTextarea={true}
                            minLength={200}
                            maxLength={500}
                            required={item.required}
                            rows={3}
                            {...commonProps}
                          />
                          {errors[item.key] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[item.key]}
                            </p>
                          )}
                        </>
                      )}

                      {item.type === "array" && (
                        <>
                          <DynamicArrayInput
                            title={item.name}
                            value={postJobData[item.key] || []}
                            onChange={(newValue) => {
                              setPostJobData({
                                ...postJobData,
                                [item.key]: newValue,
                              });
                              clearError(item.key);
                            }}
                            placeholder={item.placeholder}
                          />
                          {errors[item.key] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[item.key]}
                            </p>
                          )}
                        </>
                      )}

                      {item.type === "search" && (
                        <>
                          <label className="text-black font-medium">
                            {item.name}
                            {item.required && (
                              <span className="text-red-600 font-semibold ml-1">
                                &#42;
                              </span>
                            )}
                          </label>
                          <SearchableMultiSelect
                            item={item}
                            options={
                              item.key === "nationality"
                                ? nationalityOptions
                                : item.key === "languages"
                                  ? languageOptions
                                  : []
                            }
                            value={postJobData[item.key] || []}
                            onChange={(selected) => {
                              setPostJobData({
                                ...postJobData,
                                [item.key]: selected,
                              });
                            }}
                          />
                          {errors[item.key] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[item.key]}
                            </p>
                          )}
                        </>
                      )}

                      {item.type === "multiselect" && (
                        <>
                          <label className="text-black font-medium">
                            {item.name}
                            {item.required && (
                              <span className="text-red-600 font-semibold ml-1">
                                *
                              </span>
                            )}
                          </label>

                          <MultiSelectDropDown
                            options={
                              item.key === "nationality"
                                ? nationalityOptions
                                : item.key === "languages"
                                  ? languageOptions
                                  : item.key === "benefits"
                                    ? BenefitOptions
                                    : []
                            }
                            value={postJobData[item.key] || []}
                            onChange={(selectedValues) => {
                              setPostJobData({
                                ...postJobData,
                                [item.key]: selectedValues,
                              });
                            }}
                          />
                          {errors[item.key] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[item.key]}
                            </p>
                          )}
                        </>
                      )}

                      {item.type === "file" && (
                        <>
                          <label className="text-black font-medium">
                            {item.name}
                            {item.required && (
                              <span className="text-red-600 font-semibold ml-1">
                                &#42;
                              </span>
                            )}
                          </label>
                          <div className="flex items-center gap-6">
                            {/* Upload Input */}
                            <div className="flex-1">
                              <input
                                id="logoInput"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;

                                  setPostJobData({
                                    ...postJobData,
                                    companyLogo: file,
                                  });

                                  setLogoPreview(URL.createObjectURL(file));
                                  clearError("companyLogo");
                                }}
                                className="block w-full px-4 py-3 text-sm border border-gray-300 rounded-lg
      file:mr-4 file:py-2 file:px-4
      file:rounded-md file:border-0
      file:text-sm file:font-semibold
      file:bg-gray-100 file:text-gray-700
      hover:file:bg-gray-200
      focus:outline-none focus:ring-2 focus:ring-[#FF6E04]"
                              />
                            </div>

                            {/* BIG Preview */}
                            <div className="relative w-50 h-30 rounded-xl border border-gray-200 bg-white shadow-md flex items-center justify-center overflow-hidden group">
                              {logoPreview || postJobData.companyLogo ? (
                                <>
                                  <img
                                    src={
                                      logoPreview
                                        ? logoPreview
                                        : typeof postJobData.companyLogo ===
                                          "string"
                                          ? `${API_URL}/${postJobData.companyLogo}`
                                          : "/placeholder.png"
                                    }
                                    alt="Company Logo"
                                    className="w-full h-full object-cover p-3"
                                  />

                                  {/* Hover overlay */}
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                    <span className="text-sm text-white font-medium">
                                      Change Logo
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                  <span className="text-3xl">🏢</span>
                                  <span className="text-sm mt-2">
                                    Upload Logo
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {errors[item.key] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[item.key]}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
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

                <div className="ml-auto flex gap-2 ">
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
      </div>

      <ResponseAlert text={response} onClose={() => setResponse("")} />
    </>
  );
};
export default JobListing;
