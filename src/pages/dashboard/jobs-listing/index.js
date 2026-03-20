import { get_company_data } from "@/api/forms";
import CheckBox from "@/components/Forms/CheckBox";
import InputWithTitle from "@/components/Forms/InputWithTitle";
import Navbar from "@/components/Forms/Navbar";
import { SearchableMultiSelect } from "@/components/Forms/SearchableMultiSelect";
import Steps from "@/components/Forms/Steps";
import DynamicArrayInput from "@/components/Forms/DynamicArrayInput";
import DropDown from "@/components/Forms/DropDown";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import ResponseAlert from "@/components/ResponseAlert";
import {
  saveToSession,
  getFromSession,
  clearSession,
} from "@/utils/sessionStorage";
import { get_job_edulvl, get_job_type } from "@/api/postAds";
import { get_job_details } from "@/api/listings";
import axios from "axios";
import { API_URL } from "@/services/constants";
import Image from "next/image";
import {
  add_job_listing,
  get_job_categories,
  save_job_company,
} from "@/api/uae-job-listing";
import { getSubCategoriesByCategory } from "@/api/uaeAdminCategories";

// Import your API functions here
// import { get_categories, get_job_types, get_education_levels } from "@/api/listings";

const JobListing = () => {
  const router = useRouter();
  const { jobId } = router.query;
  const { edit } = router.query;
  const [subCategories, setSubCategories] = useState([]);

  const workModeOptions = [
    { value: "on-site", label: "On Site" },
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const experienceLevelOptions = [
    { value: "entry", label: "Entry Level" },
    { value: "junior", label: "Junior" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior" },
    { value: "lead", label: "Lead" },
    { value: "executive", label: "Executive" },
  ];

  const genderOptions = [
    { value: "any", label: "Any" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const getCompanyData = async () => {
    try {
      const res = await get_company_data();
      if (!res) return;

      if (res?.success) {
        setPostJobData((prev) => ({
          ...prev,
          category_id: "",
          companyLogo: res.company?.logo || null,
          companyName: res.company?.name || "",
          companyDescription: res.company?.description || "",
          companyWebsite: res.company?.website || "",
          name: res.company?.contact_person || "",
          email: res.company?.email || "",
          phone: res.company?.phone || "",

          city: res.company?.city || "",
          address: res.company?.address || "",
          zipCode: res.company?.zip_code || "",
        }));
      }
      console.log("response of company", res);
    } catch (error) {
      console.log("error of company", error);
    }
  };

  useEffect(() => {
    getCompanyData();
  }, []);

  // Refs for error scrolling
  const categoryRef = useRef(null);
  const jobTypeRef = useRef(null);
  const educationLevelRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const salaryFromRef = useRef(null);
  const salaryToRef = useRef(null);
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
  const zipCodeRef = useRef(null);
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
  const [jobTypes, setJobTypes] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);

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

    salaryFrom: "",
    salaryTo: "",
    salaryCurrency: "PKR",
    salaryPeriod: "monthly",
    salaryNegotiable: false,
    salaryHidden: false,

    experienceFrom: "",
    experienceTo: "",

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
    zipCode: "",
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

  const sectorOptions = [
    { value: "it", label: "IT" },
    { value: "commerce", label: "Commerce" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "engineering", label: "Engineering" },
    { value: "marketing", label: "Marketing" },
    { value: "legal", label: "Legal" },
    { value: "hospitality", label: "Hospitality" },
    { value: "construction", label: "Construction" },
    { value: "media", label: "Media" },
    { value: "ngo", label: "NGO" },
    { value: "government", label: "Government" },
    { value: "other", label: "Other" },
  ];

  const jobTypeOptions = [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
    { value: "internship", label: "Internship" },
    { value: "temporary", label: "Temporary" },
  ];

  // Fetch dropdown data on mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Replace these with your actual API calls
        const categoriesData = await get_job_categories();
        const jobTypesData = await get_job_type();
        const educationData = await get_job_edulvl();
        setCategories(categoriesData);
        setJobTypes(jobTypesData?.data?.types);
        setEducationLevels(educationData?.data?.education_level);
        console.log("job category response", categoriesData);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(`${API_URL}/cities`);
        setCities(res?.data);
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
      if (!postJobData.category_id) return;

      try {
        const res = await getSubCategoriesByCategory(postJobData.category_id);

        // adjust depending on API response structure
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
  }, [postJobData.category_id]);

  const getJobDetails = async (jobId) => {
    const res = await get_job_details(jobId);
    console.log("response of edit job", res);
    if (res.category_id) {
      const subRes = await getSubCategoriesByCategory(res.category_id);

      const formatted = (subRes?.data || []).map((sub) => ({
        value: sub._id,
        label: sub.name,
      }));

      setSubCategories(formatted);
    }

    if (!res) return;

    setPostJobData((prev) => ({
      ...prev,
      jobType: res.job_type_id || "",
      category_id: res.category_id || "",
      sub_category_id: res.sub_category_id || "",
      qualification: res.qualifications || [],
      title: res.title || "",
      description: res.description || "",
      salaryFrom: res.salary_from || "",
      salaryTo: res.salary_to || "",
      experience: res.experience || "",
      openings: res.openings || "",
      skills: res.skills || [],
      roles: res.roles || [],
      keySkills: res.key_skills || [],
      companyLogo: res.company?.logo || null,
      companyName: res.company?.name || "",
      companyDescription: res.company?.description || "",
      companyWebsite: res.company?.website || "",
      name: res.company?.contact_person || "",
      email: res.company?.email || "",
      phone: res.company?.phone || "",
      city: res.company?.city || "",
      address: res.company?.address || "",
      zipCode: res.company?.zip || "",
    }));
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
      salaryFrom: salaryFromRef,
      salaryTo: salaryToRef,
      experienceFrom: experienceRef,
      experienceTo: experienceRef,
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

      if (isBlank(postJobData.salaryFrom)) {
        newErrors.salaryFrom = "Minimum salary is required";
      } else if (
        !/^\d+(\.\d+)?$/.test(postJobData.salaryFrom.toString().trim())
      ) {
        newErrors.salaryFrom = "Salary must be a number";
      }
      if (isBlank(postJobData.salaryTo)) {
        newErrors.salaryTo = "Maximum salary is required";
      } else if (
        !/^\d+(\.\d+)?$/.test(postJobData.salaryTo.toString().trim())
      ) {
        newErrors.salaryTo = "Salary must be a number";
      }
      // Salary range validation
      if (!isBlank(postJobData.salaryFrom) && !isBlank(postJobData.salaryTo)) {
        if (Number(postJobData.salaryFrom) > Number(postJobData.salaryTo)) {
          newErrors.salaryTo = "Max salary should be greater than Min salary";
        }
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
      if (postJobData.zipCode && postJobData.zipCode !== "") {
        if (!/^\d+$/.test(postJobData.zipCode)) {
          newErrors.zipCode = "Zip Code must be numeric";
        }
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
        salary_from: "salaryFrom",
        salary_to: "salaryTo",
        experience: "experience",
        total_positions: "openings",
        skills: "skills",
        roles: "roles",
        key_skills: "keySkills",
        category: "category",
        job_type: "jobType",
        qualification: "qualification",
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
        zip_code: "zipCode",
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
    }

    switch (stepNumber) {
      case 1:
        formData.append("category_id", postJobData.category_id);
        formData.append("sub_category_id", postJobData.sub_category_id);

        formData.append("title", postJobData.title);
        formData.append("description", postJobData.description);

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
        const salaryObj = {
          from: postJobData.salaryFrom ? Number(postJobData.salaryFrom) : null,
          to: postJobData.salaryTo ? Number(postJobData.salaryTo) : null,
          currency: postJobData.salaryCurrency || "PKR",
          period: postJobData.salaryPeriod || "monthly",
          isNegotiable: postJobData.salaryNegotiable || false,
          isHidden: postJobData.salaryHidden || false,
        };

        formData.append("salary", JSON.stringify(salaryObj));

        // location JSON
        const locationObj = {
          city: postJobData.location,
          isRemote: postJobData.workMode === "remote",
        };

        formData.append("location", JSON.stringify(locationObj));

        formData.append("education", postJobData.education);
        const experienceObj = {
          from: postJobData.experienceFrom
            ? Number(postJobData.experienceFrom)
            : 0,
          to: postJobData.experienceTo
            ? Number(postJobData.experienceTo)
            : null,
        };

        formData.append("experienceYears", JSON.stringify(experienceObj));

        formData.append("gender", postJobData.gender);
        formData.append("ageRange", postJobData.ageRange);

        break;
      case 2:
        formData.append("slug", slug);
        formData.append("folder", "Jobs");

        const contactObj = {
          name: postJobData.name,
          email: postJobData.email,
          phone: String(postJobData.phone),
        };

        formData.append("contact", JSON.stringify(contactObj));

        const companyObj = {
          name: postJobData.companyName,
          description: postJobData.companyDescription,
          website: postJobData.companyWebsite,
          address: postJobData.address,
          city: postJobData.city,
          zip_code: postJobData.zipCode,
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
        res = await add_job_listing(formData);
      }

      if (stepNumber === 2) {
        res = await save_job_company(formData);
      }

      console.log(`Step ${stepNumber} submitted:`, res);

      if (res?.errors && Object.keys(res.errors).length > 0) {
        const mappedErrors = mapApiErrorsToState(res.errors, stepNumber);
        setErrors(mappedErrors);
        const firstErrorKey = Object.keys(mappedErrors)[0];
        setTimeout(() => scrollToError(firstErrorKey), 100);
        setLoading(false);
        return false;
      }
      if (!res?.success && res?.message) {
        setResponse(res.message);
      }

      if (stepNumber == 1) {
        setJobListingId(res?.data?.id);

        setSlug(res?.data?.slug);
      }

      if (stepNumber === 2) {
        clearSession();
        setResponse("");
        setResponse(res?.message || "Job listing posted successfully!");

        // Redirect after successful submission
        if (res?.job_id) {
          console.log("jobID", res?.job_id);
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
  }));

  const educationOptions = [
    { value: "none", label: "None" },
    { value: "matric", label: "Matriculation" },
    { value: "intermediate", label: "Intermediate" },
    { value: "bachelor", label: "Bachelor's Degree" },
    { value: "master", label: "Master's Degree" },
    { value: "phd", label: "PhD" },
    { value: "any", label: "Any" },
  ];

  const cityOptions = cities?.map((city) => ({
    value: city, // important → ID
    label: city, // display name
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
    },
    {
      id: 4,
      name: "Description",
      key: "description",
      type: "textarea",
      placeholder: "Enter description",
      ref: descriptionRef,
      required: true,
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
      id: 7,
      name: "Benefits",
      key: "benefits",
      type: "array",
      placeholder: "Enter benefit",
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
      name: "Salary From",
      key: "salaryFrom",
      type: "text",
      ref: salaryFromRef,
      required: true,
    },
    {
      id: 14,
      width: true,
      name: "Salary To",
      key: "salaryTo",
      type: "text",
      ref: salaryToRef,
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
      options: educationOptions,
    },
    {
      id: 17,
      width: true,
      name: "Experience From",
      key: "experienceFrom",
      type: "text",
      ref: experienceRef,
    },
    {
      id: 18,
      width: true,
      name: "Experience To",
      key: "experienceTo",
      type: "text",
    },
    {
      id: 19,
      width: true,
      name: "Age Range",
      key: "ageRange",
      type: "text",
    },
    {
      id: 20,
      width: true,
      name: "Total Positions",
      key: "openings",
      type: "text",
      placeholder: "Enter number of positions",
      ref: openingsRef,
      required: true,
    },
    {
      id: 21,
      width: true,
      name: "Gender",
      key: "gender",
      type: "dropdown",
      options: genderOptions,
      required: true,
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
    {
      id: 10,
      width: true,
      name: "Zip Code",
      key: "zipCode",
      type: "text",
      placeholder: "Enter zip code",
      ref: zipCodeRef,
    },
  ];

  const activeStep = steps.find((s) => s.active)?.step;
  const currentForms = activeStep === 1 ? jobInfoForms : companyForms;

  return (
    <>
      <div className="min-h-screen w-full">
        <div className="bg-white w-[95%] mx-auto flex flex-col items-center relative max-w-[2000px]">
          {/* navbar */}
          <div className="fixed top-0 w-[90%] max-w-[1400px] bg-white z-40">
            <Navbar />
          </div>

          {/* Auto-save indicator */}
          {/* {lastSaved && (
              <div className="fixed top-20 right-8 bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow-md z-50">
                Auto-saved at {lastSaved}
              </div>
            )} */}

          {/* steps */}
          <section className="mt-26 w-[80%] flex justify-center">
            <Steps steps={steps} setActiveStep={setActiveStep} />
          </section>

          {/* inputs */}
          <div className="flex gap-2 w-[80%] mt-14 items-center">
            <section className="w-[85%] h-full space-y-7 p-4 mb-12 rounded-xl">
              <div className="grid grid-cols-2 gap-6">
                {currentForms.map((item, index) => {
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
                          <label className="text-gray-500 font-semibold">
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

                              // Special handling for category
                              if (item.key === "category_id") {
                                setPostJobData({
                                  ...postJobData,
                                  category_id: option.value,
                                  sub_category_id: "", // reset subcategory
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
                          <label className="text-gray-500 font-semibold">
                            {item.name}
                            {item.required && (
                              <span className="text-red-600 font-semibold ml-1">
                                &#42;
                              </span>
                            )}
                          </label>
                          <SearchableMultiSelect
                            item={item}
                            value={postJobData[item.key] || []}
                            onChange={(selectedSkills) => {
                              setPostJobData({
                                ...postJobData,
                                [item.key]: selectedSkills,
                              });
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

                      {item.type === "file" && (
                        <>
                          <label className="text-gray-500 font-semibold">
                            {item.name}
                            {item.required && (
                              <span className="text-red-600 font-semibold ml-1">
                                &#42;
                              </span>
                            )}
                          </label>
                          <div className="flex items-center gap-6">
                            {/* Upload input */}
                            <div className="flex-1">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;

                                  setPostJobData({
                                    ...postJobData,
                                    [item.key]: file,
                                  });

                                  setLogoPreview(URL.createObjectURL(file));
                                  clearError(item.key);
                                }}
                                className="block w-full px-4 py-2 text-sm border border-gray-300 rounded-lg
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gray-100 file:text-gray-700
                  hover:file:bg-gray-200
                  focus:outline-none focus:ring-2 focus:ring-[#FF6E04]"
                              />
                            </div>

                            {/* Preview */}
                            <div className="w-28 h-28 flex items-center justify-center border rounded-lg bg-gray-50">
                              {logoPreview ? (
                                <Image
                                  width={500}
                                  height={500}
                                  src={logoPreview}
                                  alt="Company Logo Preview"
                                  className="max-h-24 max-w-24 object-contain"
                                />
                              ) : (
                                <span className="text-xs text-gray-400 text-center px-2">
                                  Logo Preview
                                </span>
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

                <div className="ml-auto">
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
