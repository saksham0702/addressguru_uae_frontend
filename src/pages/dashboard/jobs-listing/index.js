import { add_job_listing, get_company_data } from "@/api/forms";
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
import {
  get_job_categories,
  get_job_edulvl,
  get_job_type,
} from "@/api/postAds";
import { get_job_details } from "@/api/listings";
import axios from "axios";
import { API_URL } from "@/services/constants";
import Image from "next/image";

// Import your API functions here
// import { get_categories, get_job_types, get_education_levels } from "@/api/listings";

const JobListing = () => {
  const router = useRouter();
  const { jobId } = router.query;
  const { edit } = router.query;

  const getCompanyData = async () => {
    try {
      const res = await get_company_data();
      if (!res) return;

      if (res?.success) {
        setPostJobData((prev) => ({
          ...prev,
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

  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobListingId, setJobListingId] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [cities, setCities] = useState([]);

  // Dropdown data states
  const [categories, setCategories] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);

  const [postJobData, setPostJobData] = useState({
    jobType: "",
    category: "",
    qualification: [],
    title: "",
    description: "",
    salaryFrom: "",
    salaryTo: "",
    experience: "",
    openings: "",
    skills: [],
    roles: [],
    keySkills: [],
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

  // Fetch dropdown data on mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Replace these with your actual API calls
        const categoriesData = await get_job_categories();
        const jobTypesData = await get_job_type();
        const educationData = await get_job_edulvl();
        setCategories(categoriesData?.data?.categories);
        setJobTypes(jobTypesData?.data?.types);
        setEducationLevels(educationData?.data?.education_level);
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

  const getJobDetails = async (jobId) => {
    const res = await get_job_details(jobId);
    console.log("response of edit job", res);

    if (!res) return;

    setPostJobData((prev) => ({
      ...prev,
      jobType: res.job_type_id || "",
      category: res.category_id || "",
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
      category: categoryRef,
      jobType: jobTypeRef,
      qualification: educationLevelRef,
      title: titleRef,
      description: descriptionRef,
      salaryFrom: salaryFromRef,
      salaryTo: salaryToRef,
      experience: experienceRef,
      openings: openingsRef,
      skills: skillsRef,
      roles: rolesRef,
      keySkills: keySkillsRef,
      companyName: companyNameRef,
      companyDescription: companyDescriptionRef,
      companyWebsite: companyWebsiteRef,
      companyLogo: companyLogoRef,
      name: nameRef,
      email: emailRef,
      phone: phoneRef,
      city: cityRef,
      address: addressRef,
      zipCode: zipCodeRef,
    };

    const ref = errorRefMap[errorKey];
    if (ref?.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      if (ref.current.querySelector("input, textarea")) {
        setTimeout(() => {
          ref.current.querySelector("input, textarea")?.focus();
        }, 500);
      }
    }
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
      if (!postJobData.category) {
        newErrors.category = "Job category is required";
      }
      if (!postJobData.jobType) {
        newErrors.jobType = "Job type is required";
      }
      if (postJobData.qualification.length === 0) {
        newErrors.qualification = "Education level is required";
      }
      if (!postJobData.title.trim()) {
        newErrors.title = "Job title is required";
      }
      if (!postJobData.description.trim()) {
        newErrors.description = "Job description is required";
      }
      if (isBlank(postJobData.experience)) {
        newErrors.experience = "Experience is required";
      } else if (
        !/^\d+(\.\d+)?$/.test(postJobData.experience.toString().trim())
      ) {
        newErrors.experience = "Experience must be a number";
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
        newErrors.openings = "Number of openings is required";
      } else if (
        !/^\d+(\.\d+)?$/.test(postJobData.openings.toString().trim())
      ) {
        newErrors.openings = "Openings must be a number";
      }
      if (postJobData.skills.length === 0) {
        newErrors.skills = "Please add at least one skill";
      }
      if (postJobData.roles.length === 0) {
        newErrors.roles = "Please add at least one role";
      }
      if (postJobData.keySkills.length === 0) {
        newErrors.keySkills = "Please add at least one key skill";
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
      if (!postJobData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(postJobData.phone.trim())) {
        newErrors.phone = "Phone number must be 10 digits";
      }
      if (postJobData.zipCode && postJobData.zipCode.trim() !== "") {
        if (!/^\d+$/.test(postJobData.zipCode.trim())) {
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
        openings: "openings",
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
        formData.append("job_type", postJobData.jobType);
        formData.append("category", postJobData.category);
        postJobData.qualification.forEach((q) =>
          formData.append("qualification[]", q),
        );
        formData.append("title", postJobData.title);
        formData.append("description", postJobData.description);
        formData.append("salary_from", postJobData.salaryFrom);
        formData.append("salary_to", postJobData.salaryTo);
        formData.append("experience", postJobData.experience);
        formData.append("openings", postJobData.openings);
        postJobData.skills.forEach((s) => formData.append("skills[]", s));
        postJobData.roles.forEach((r) => formData.append("roles[]", r));
        postJobData.keySkills.forEach((k) =>
          formData.append("key_skills[]", k),
        );
        break;

      case 2:
        formData.append("job_id", jobListingId);
        if (postJobData.companyLogo) {
          formData.append("company_logo", postJobData.companyLogo);
        }
        formData.append("company_name", postJobData.companyName);
        formData.append("company_description", postJobData.companyDescription);
        formData.append("company_website", postJobData.companyWebsite);
        formData.append("name", postJobData.name);
        formData.append("email", postJobData.email);
        formData.append("phone", postJobData.phone);
        formData.append("city", postJobData.city);
        formData.append("address", postJobData.address);
        formData.append("zip_code", postJobData.zipCode);
        break;

      default:
        break;
    }

    try {
      const res = await add_job_listing(formData);
      console.log(`Step ${stepNumber} submitted:`, res);

      if (res?.errors && Object.keys(res.errors).length > 0) {
        const mappedErrors = mapApiErrorsToState(res.errors, stepNumber);
        setErrors(mappedErrors);
        const firstErrorKey = Object.keys(mappedErrors)[0];
        setTimeout(() => scrollToError(firstErrorKey), 100);
        setLoading(false);
        return false;
      }

      if (stepNumber === 1 && res?.job_id) {
        console.log("jobid", res?.job_id);
        setJobListingId(res?.job_id);
      }

      if (stepNumber === 2) {
        clearSession();
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
        setResponse(`Error submitting step ${stepNumber}. Please try again.`);
      }
      setLoading(false);
      return false;
    }
  };

  // Convert dropdown data to options format
  const categoryOptions = categories?.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const jobTypeOptions = jobTypes?.map((type) => ({
    value: type.id,
    label: type.type,
  }));

  const educationOptions = educationLevels?.map((level) => ({
    value: level.id,
    label: level.level,
  }));

  const cityOptions = cities?.map((city) => ({
    value: city, // important → ID
    label: city, // display name
  }));

  const getSelectedOption = (options, value) => {
    if (!options || !value) return null;
    return options.find((opt) => opt.value === value) || null;
  };

  const jobInfoForms = [
    {
      id: 1,
      name: "Job Category",
      key: "category",
      type: "dropdown",
      placeholder: "Select job category",
      required: true,
      ref: categoryRef,
      options: categoryOptions,
    },
    {
      id: 2,
      width: true,
      name: "Job Type",
      key: "jobType",
      type: "dropdown",
      placeholder: "Select job type",
      required: true,
      ref: jobTypeRef,
      options: jobTypeOptions,
    },
    {
      id: 3,
      width: true,
      name: "Education Level",
      key: "qualification",
      type: "dropdown",
      placeholder: "Select education level",
      required: true,
      ref: educationLevelRef,
      options: educationOptions,
    },
    {
      id: 4,
      name: "Title",
      key: "title",
      type: "text",
      placeholder: "Enter job title",
      required: true,
      ref: titleRef,
    },
    {
      id: 5,
      name: "Description",
      key: "description",
      type: "textarea",
      placeholder: "Enter job description",
      required: true,
      ref: descriptionRef,
    },
    {
      id: 6,
      width: true,
      name: "Salary From",
      key: "salaryFrom",
      type: "text",
      placeholder: "Enter min salary",
      required: true,
      ref: salaryFromRef,
    },
    {
      id: 7,
      width: true,
      name: "Salary To",
      key: "salaryTo",
      type: "text",
      placeholder: "Enter max salary",
      required: true,
      ref: salaryToRef,
    },
    {
      id: 8,
      width: true,
      name: "Experience",
      key: "experience",
      type: "text",
      placeholder: "Enter required experience",
      required: true,
      ref: experienceRef,
    },
    {
      id: 9,
      width: true,
      name: "Openings",
      key: "openings",
      type: "text",
      placeholder: "Enter number of openings",
      required: true,
      ref: openingsRef,
    },
    {
      id: 10,
      name: "Skills",
      key: "skills",
      type: "search",
      placeholder: "Enter a skill",
      required: true,
      ref: skillsRef,
    },
    {
      id: 11,
      name: "Roles",
      key: "roles",
      type: "array",
      placeholder: "Enter a role",
      ref: rolesRef,
    },
    {
      id: 12,
      name: "Key Skills",
      key: "keySkills",
      type: "array",
      placeholder: "Enter a key skill",
      ref: keySkillsRef,
    },
  ];

  const companyForms = [
    {
      id: 13,
      name: "Company Logo",
      key: "companyLogo",
      type: "file",
      ref: companyLogoRef,
    },
    {
      id: 14,
      name: "Company Name",
      key: "companyName",
      type: "text",
      placeholder: "Enter company name",
      required: true,
      ref: companyNameRef,
    },
    {
      id: 15,
      name: "Company Description",
      key: "companyDescription",
      type: "textarea",
      placeholder: "Enter company description",
      ref: companyDescriptionRef,
    },
    {
      id: 16,
      name: "Company Website",
      key: "companyWebsite",
      type: "text",
      placeholder: "Enter website",
      ref: companyWebsiteRef,
    },
    {
      id: 17,
      width: true,
      name: "Name",
      key: "name",
      type: "text",
      placeholder: "Enter contact person name",
      ref: nameRef,
    },
    {
      id: 18,
      width: true,
      name: "Email",
      key: "email",
      type: "text",
      placeholder: "Enter email",
      required: true,
      ref: emailRef,
    },
    {
      id: 19,
      width: true,
      name: "Phone",
      key: "phone",
      type: "text",
      placeholder: "Enter phone number",
      required: true,
      ref: phoneRef,
    },
    {
      id: 20,
      width: true,
      name: "City",
      key: "city",
      type: "dropdown",
      placeholder: "Select city",
      ref: cityRef,
      options: cityOptions,
    },
    {
      id: 21,
      name: "Address",
      key: "address",
      type: "textarea",
      placeholder: "Enter address",
      ref: addressRef,
    },
    {
      id: 22,
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
                            options={item.options}
                            placeholder={item.placeholder}
                            value={getSelectedOption(
                              item.options,
                              postJobData[item.key],
                            )}
                            onChange={(option) => {
                              setPostJobData({
                                ...postJobData,
                                [item.key]: option.value,
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

                      {item.type === "text" && (
                        <>
                          <InputWithTitle isTextarea={false} {...commonProps} />
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
