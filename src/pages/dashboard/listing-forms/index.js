// ========== ListingForms.jsx (COMPLETE WITH SESSION STORAGE) ==========
import { get_payment_mode, get_service_facility } from "@/api/forms";
import { get_plans } from "@/api/plans";
import BusinessInfo from "@/components/Forms/FormSections/BusinessInfo";
import ContactDetails from "@/components/Forms/FormSections/ContactDetails";
import ImageUploadSections from "@/components/Forms/FormSections/ImageUploadSections";
import SearchEngine from "@/components/Forms/FormSections/SearchEngine";
import SocialDetails from "@/components/Forms/FormSections/SocialDetails";
import Navbar from "@/components/Forms/Navbar";
import Steps from "@/components/Forms/Steps";
import PricingTable from "@/components/Plans/PricingTable";
import Footer from "@/layout/footer";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  saveToSession,
  getFromSession,
  clearSession,
} from "@/utils/sessionStorage";

import { BUSINESS_POSTING_TIPS } from "@/services/constants";
import AdditionalInfo from "@/components/Forms/FormSections/AdditionalInfo";
import { getBusinessFeatures } from "@/api/uaeAdminCategories";
import { add_listings, get_listing_data } from "@/api/listing-form";
import SuccessModal from "@/components/Forms/sucesspopup";

const ListingForms = () => {
  const router = useRouter();
  const categoryId = router.query.category;
  const { categoryName, subCategoryName, name } = router.query;
  const category = router.query.categoryName;
  const subCategory = router.query.subCategoryName;
  const [showTips, setShowTips] = useState(false);
  // Refs for error scrolling
  const businessNameRef = useRef(null);
  const businessAddressRef = useRef(null);
  const businessDescriptionRef = useRef(null);
  const establishmentYearRef = useRef(null);
  const uenNumberRef = useRef(null);
  const taxNumberRef = useRef(null);
  const facilitiesRef = useRef(null);
  const coursesRef = useRef(null);
  const servicesRef = useRef(null);
  const websiteLinkRef = useRef(null);
  const videoLinkRef = useRef(null);
  const contactNameRef = useRef(null);
  const contactEmailRef = useRef(null);
  const contactNumberRef = useRef(null);
  const contactAltNumberRef = useRef(null);
  const contactCityRef = useRef(null);
  const contactLandmarkRef = useRef(null);
  const seoTitleRef = useRef(null);
  const seoDescriptionRef = useRef(null);
  const logoRef = useRef(null);
  const imagesRef = useRef(null);
  const planRef = useRef(null);

  const [plans, setPlans] = useState(null);
  const [listingId, setListingId] = useState(null);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [service, setService] = useState([]);
  const [facility, setFacility] = useState([]);
  const [courses, setCourses] = useState([]);
  const [payment, setPayment] = useState([]);
  const [existingData, setExistingData] = useState(null);
  const [additional_fields, setadditional_fields] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [slug, setSlug] = useState();
  const [globalError, setGlobalError] = useState("");

  const [business, setBusiness] = useState({
    name: "",
    address: "",
    description: "",
    establishmentYear: "",
    uenNumber: "",
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [additionalFields, setAdditionalFields] = useState({});

  const [schedule, setSchedule] = useState({
    Monday: { is_open: "1", open_time: "09:00", close_time: "20:00" },
    Tuesday: { is_open: "1", open_time: "09:00", close_time: "20:00" },
    Wednesday: { is_open: "1", open_time: "09:00", close_time: "20:00" },
    Thursday: { is_open: "1", open_time: "09:00", close_time: "20:00" },
    Friday: { is_open: "1", open_time: "09:00", close_time: "20:00" },
    Saturday: { is_open: null, open_time: null, close_time: null },
    Sunday: { is_open: null, open_time: null, close_time: null },
  });

  const [social, setSocial] = useState({
    websiteLink: "",
    videoLink: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
  });

  const [contact, setContact] = useState({
    name: "",
    email: "",
    number: "",
    countryCode: "+65",
    altCountryCode: "+65",
    altNumber: "",
    city: "",
    cityId: "",
    landmark: "",
  });

  const [seo, setSeo] = useState({
    title: "",
    description: "",
  });

  const [media, setMedia] = useState({
    logo: null,
    images: [],
  });

  const [steps, setSteps] = useState([
    {
      step: 1,
      title: "Business Information",
      description: "Update your business details & info",
      active: true,
      completed: false,
    },
    {
      step: 2,
      title: "Social Details",
      description: "Add links of your social profiles",
      active: false,
      completed: false,
    },
    {
      step: 3,
      title: "Contact Details",
      description: "Add your contact details for buyers to connect",
      active: false,
      completed: false,
    },
    {
      step: 4,
      title: "Search Engine Friendly",
      description: "Update SEO friendly keywords & description",
      active: false,
      completed: false,
    },
    {
      step: 5,
      title: "Upload Images",
      description: "Upload relevant images of your business",
      active: false,
      completed: false,
    },
    {
      step: 6,
      title: "Payment",
      description: "Proceed for payment",
      active: false,
      completed: false,
    },
  ]);

  // Load data from session storage on mount
  useEffect(() => {
    const savedData = getFromSession();

    if (savedData.business) {
      setBusiness(savedData.business);
    }
    if (savedData.schedule) {
      setSchedule(savedData.schedule);
    }
    if (savedData.social) {
      setSocial(savedData.social);
    }
    if (savedData.contact) {
      setContact(savedData.contact);
    }
    if (savedData.seo) {
      setSeo(savedData.seo);
    }
    if (savedData.selectedFacilities) {
      setSelectedFacilities(savedData.selectedFacilities);
    }
    if (savedData.selectedServices) {
      setSelectedServices(savedData.selectedServices);
    }
    if (savedData.selectedCourses) {
      setSelectedCourses(savedData.selectedCourses);
    }
    if (savedData.selectedPayment) {
      setSelectedPayment(savedData.selectedPayment);
    }
    if (savedData.selectedPlanId) {
      setSelectedPlanId(savedData.selectedPlanId);
    }
    if (savedData.listingId) {
      setListingId(savedData.listingId);
    }
    if (savedData.currentStep && savedData.currentStep > 1) {
      setActiveStep(savedData.currentStep);
    }
    if (savedData.steps) {
      setSteps(savedData.steps);
    }
  }, []);

  // Save business data to session storage whenever it changes
  useEffect(() => {
    if (business.name || business.address || business.description) {
      saveToSession("business", business);
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [business]);

  useEffect(() => {
    saveToSession("schedule", schedule);
  }, [schedule]);

  useEffect(() => {
    if (social.websiteLink || social.videoLink) {
      saveToSession("social", social);
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [social]);

  useEffect(() => {
    if (contact.name || contact.email || contact.number) {
      saveToSession("contact", contact);
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [contact]);

  useEffect(() => {
    if (seo.title || seo.description) {
      saveToSession("seo", seo);
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [seo]);

  useEffect(() => {
    if (selectedFacilities.length > 0) {
      saveToSession("selectedFacilities", selectedFacilities);
    }
  }, [selectedFacilities]);

  useEffect(() => {
    if (selectedServices.length > 0) {
      saveToSession("selectedServices", selectedServices);
    }
  }, [selectedServices]);

  useEffect(() => {
    if (selectedCourses.length > 0) {
      saveToSession("selectedCourses", selectedCourses);
    }
  }, [selectedCourses]);

  useEffect(() => {
    if (selectedPayment.length > 0) {
      saveToSession("selectedPayment", selectedPayment);
    }
  }, [selectedPayment]);

  useEffect(() => {
    if (selectedPlanId) {
      saveToSession("selectedPlanId", selectedPlanId);
    }
  }, [selectedPlanId]);

  useEffect(() => {
    if (listingId) {
      saveToSession("listingId", listingId);
    }
  }, [listingId]);

  // Save steps state
  useEffect(() => {
    saveToSession("steps", steps);
  }, [steps]);

  useEffect(() => {
    // Clear session when user leaves the page (refresh, close, or back)
    const handleBeforeUnload = () => {
      clearSession();
    };

    // Clear session when navigating to another page in Next.js
    const handleRouteChange = () => {
      clearSession();
    };
    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    router.events.on("routeChangeStart", handleRouteChange);
    // Cleanup on unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  const getPlans = async () => {
    try {
      const res = await get_plans();
      console.log("plan response", res);

      setPlans(res?.data?.plans);
    } catch (error) {
      console.log("error in frontend", error);
    }
  };

  const getListings = useCallback(
    async (name) => {
      try {
        const res = await get_listing_data(name);
        console.log("res of existing  listing data", res?.data?.data);
        setExistingData(res?.data?.data);
        // console.log("response of single listing i am", res);
      } catch (err) {
        console.error("Error fetching listing:", err);
      }
    },
    [name],
  );

  useEffect(() => {
    if (name) {
      getListings(name);
    }
  }, [name, getListings]);

  const formatOpeningHoursForState = (openingHoursArray) => {
    if (!openingHoursArray || !Array.isArray(openingHoursArray)) {
      return {
        Monday: { is_open: "1", open_time: "09:00", close_time: "20:00" },
        Tuesday: { is_open: "1", open_time: "09:00", close_time: "20:00" },
        Wednesday: { is_open: "1", open_time: "09:00", close_time: "20:00" },
        Thursday: { is_open: "1", open_time: "09:00", close_time: "20:00" },
        Friday: { is_open: "1", open_time: "09:00", close_time: "20:00" },
        Saturday: { is_open: null, open_time: null, close_time: null },
        Sunday: { is_open: null, open_time: null, close_time: null },
      };
    }

    const scheduleMap = {};

    openingHoursArray.forEach((hour) => {
      // Convert time from "HH:MM:SS" to "HH:MM"
      const formatTime = (timeString) => {
        if (!timeString) return null;
        return timeString.substring(0, 5); // Extract "HH:MM" from "HH:MM:SS"
      };

      scheduleMap[hour.day] = {
        // Convert is_open from number (0/1) to string ("1"/null)
        is_open: hour.is_open === 1 || hour.is_open === "1" ? "1" : null,
        open_time: hour.is_open === 1 ? formatTime(hour.open_time) : null,
        close_time: hour.is_open === 1 ? formatTime(hour.close_time) : null,
      };
    });

    return scheduleMap;
  };

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (existingData && name && !isInitialized) {
      console.log("Mapping existingData:", existingData);

      // ✅ Business Info
      setBusiness({
        name: existingData?.businessName || "",
        address: existingData?.businessAddress || "",
        description: existingData?.description || "",
        establishmentYear: existingData?.establishedYear || "",
        uenNumber: existingData?.taxNumber || "",
      });

      // ✅ Contact
      setContact({
        altNumber: existingData?.alternateMobileNumber || "",
        name: existingData?.contactPersonName || "",
        email: existingData?.email || "",
        number: existingData?.mobileNumber || "", // ✅ FIXED
        altNumber: existingData?.alternateMobileNumber || "",
        countryCode: existingData?.countryCode || "+91",
        altCountryCode: existingData?.altCountryCode || "+91",
        city: existingData?.city?.name || "",
        cityId: existingData?.city?._id || "",
        locality: existingData?.locality || "",
      });

      // ✅ Social Links
      setSocial({
        websiteLink: existingData?.socialLinks?.website || "",
        videoLink: existingData?.socialLinks?.video || "",
        facebook: existingData?.socialLinks?.facebook || "",
        instagram: existingData?.socialLinks?.instagram || "",
        twitter: existingData?.socialLinks?.twitter || "",
        linkedin: existingData?.socialLinks?.linkedin || "",
        youtube: existingData?.socialLinks?.youtube || "",
      });

      // ✅ SEO (if exists)
      setSeo({
        title: existingData?.seo?.title || "",
        description: existingData?.seo?.description || "",
      });
      // ✅ Facilities / Services / Payments
      setSelectedFacilities(existingData?.facilities?.map((f) => f._id) || []);

      setSelectedServices(existingData?.services?.map((s) => s._id) || []);

      setSelectedCourses(existingData?.courses?.map((c) => c._id) || []);

      setSelectedPayment(existingData?.paymentModes?.map((p) => p._id) || []);

      setSchedule(existingData?.workingHours);

      // ✅ Media
      setMedia({
        logo: existingData?.logo
          ? { preview: existingData.logo, isExisting: true }
          : null,
        images: (existingData?.images || []).map((img, idx) => ({
          preview: img,
          isExisting: true,
          id: idx,
        })),
      });

      // ✅ Listing ID + slug
      setListingId(existingData?._id);
      setSlug(existingData?.slug);

      setIsInitialized(true);
    }
  }, [existingData, name]);
  useEffect(() => {
    getPlans();
  }, []);

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

  // get service and facilities
  useEffect(() => {
    const getServiceAndFacility = async (categoryId) => {
      const res = await getBusinessFeatures(categoryId);
      console.log("res :", res);

      const facilities = res?.features?.facilities || [];
      const services = res?.features?.services || [];
      const courses = res?.features?.courses || [];
      const payment = res?.payment_modes || [];

      // console.log("payment data: ", payment);

      const additional_fields = res?.additionalFields || [];

      setFacility(facilities.length > 0 ? facilities : []);
      setService(services.length > 0 ? services : []);
      setCourses(courses.length > 0 ? courses : []);
      setPayment(payment.length > 0 ? payment : []);
      setadditional_fields(
        additional_fields.length > 0 ? additional_fields : [],
      );
    };

    if (categoryId) {
      getServiceAndFacility(categoryId);
    }
  }, [categoryId]);

  //get payment methods
  // useEffect(() => {
  //   const getPaymentMode = async () => {
  //     const res = await get_payment_mode();
  //     setPayment(res);
  //   };
  //   getPaymentMode();
  // }, []);

  // Scroll to first error field
  const scrollToError = (errorKey) => {
    const errorRefMap = {
      businessName: businessNameRef,
      businessAddress: businessAddressRef,
      businessDescription: businessDescriptionRef,
      establishmentYear: establishmentYearRef,
      uenNumber: uenNumberRef,
      facilities: facilitiesRef,
      services: servicesRef,
      courses: coursesRef,
      websiteLink: websiteLinkRef,
      videoLink: videoLinkRef,
      contactName: contactNameRef,
      contactEmail: contactEmailRef,
      contactNumber: contactNumberRef,
      contactAltNumber: contactAltNumberRef,
      contactCity: contactCityRef,
      contactLandmark: contactLandmarkRef,
      seoTitle: seoTitleRef,
      seoDescription: seoDescriptionRef,
      logo: logoRef,
      images: imagesRef,
      plan: planRef,
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

  const validateStep = (step) => {
    let newErrors = {};
    if (step === 1) {
      if (!business.name.trim()) {
        newErrors.businessName = "Business name is required";
      }
      if (!business.address.trim()) {
        newErrors.businessAddress = "Business address is required";
      }
      if (!business.description.trim()) {
        newErrors.businessDescription = "Description is required";
      }
      if (facility.length > 0 && selectedFacilities.length === 0) {
        newErrors.facilities = "Please select at least one facility";
      }
      if (service.length > 0 && selectedServices.length === 0) {
        newErrors.services = "Please select at least one service";
      }
      if (courses.length > 0 && selectedCourses.length === 0) {
        newErrors.courses = "Please select at least one course";
      }
    }
    if (step === 2) {
      // if (!social.websiteLink.trim()) {
      //   newErrors.websiteLink = "Website link is required";
      // }
      // if (!social.videoLink.trim()) {
      //   newErrors.videoLink = "Video link is required";
      // }
    }
    if (step === 3) {
      if (!contact.name.trim()) {
        newErrors.contactName = "Contact name is required";
      }
      if (!contact.email.trim()) {
        newErrors.contactEmail = "Email is required";
      }
      if (!contact.number.toString().trim()) {
        newErrors.contactNumber = "Mobile number is required";
      }
      // if (contact.altNumber.trim() && !/^[6-9]\d{9}$/.test(contact.altNumber)) {
      //   newErrors.contactAltNumber = "Enter a valid alternate number";
      // }
      if (!contact.cityId) {
        newErrors.contactCity = "City is required";
      }
      // if (!contact.landmark.trim()) {
      //   newErrors.contactLandmark = "Landmark is required";
      // }
    }
    if (step === 4) {
      if (!seo.title.trim()) {
        newErrors.seoTitle = "SEO title is required";
      } else if (seo.title.length < 2) {
        newErrors.seoTitle = "Title must be at least 2 characters";
      }
      if (!seo.description.trim()) {
        newErrors.seoDescription = "SEO description is required";
      } else if (seo.description.length < 10) {
        newErrors.seoDescription = "Description must be at least 10 characters";
      }
    }
    if (step === 5) {
      if (!media.logo) {
        newErrors.logo = "Logo image is required";
      } else if (media.logo.size > 2 * 1024 * 1024) {
        newErrors.logo = "Logo size must not exceed 2MB";
      }
      if (media.images.length === 0) {
        newErrors.images = "Please upload at least one image";
      } else {
        const oversized = media.images.some(
          (img) => img.size > 2 * 1024 * 1024,
        );
        if (oversized) {
          newErrors.images = "Each image must be less than 2MB";
        }
      }
    }
    if (step === 6) {
      if (!selectedPlanId) {
        newErrors.plan = "Please select a plan";
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      setTimeout(() => scrollToError(firstErrorKey), 100);
    }
    return Object.keys(newErrors).length === 0;
  };

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

  // Map API error keys to frontend error keys
  const mapApiErrorsToState = (apiErrors, stepNumber) => {
    const errorMapping = {
      1: {
        business_name: "businessName",
        business_address: "businessAddress",
        ad_description: "businessDescription",
        establishment_year: "establishmentYear",
        uen_number: "uenNumber",
        facilities: "facilities",
        services: "services",
        courses: "courses",
        payments: "payments",
        hours: "schedule",
      },
      2: {
        website_link: "websiteLink",
        video_link: "videoLink",
      },
      3: {
        name: "contactName",
        email: "contactEmail",
        countryCode: "contactCountryCode",
        altCountryCode: "contactAltCountryCode",
        mobile_number: "contactNumber",
        second_mobile_number: "contactAltNumber",
        city: "contactCity",
        locality: "contactLandmark",
      },
      4: {
        seo_title: "seoTitle",
        seo_description: "seoDescription",
      },
      5: {
        logo: "logo",
        images: "images",
      },
      6: {
        plan_id: "plan",
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
    setIsSubmitting(true);
    setErrors({});
    const formData = new FormData();
    formData.append("category_id", categoryId);
    // formData.append("step", stepNumber);

    const currentListingId = existingData?.id || listingId;

    switch (stepNumber) {
      case 1:
        formData.append("business_name", business.name);
        formData.append("business_address", business.address);
        formData.append("ad_description", business.description);
        if (business?.establishmentYear) {
          formData.append("establishment_year", business.establishmentYear);
        }
        formData.append("uen_number", business.uenNumber);

        selectedFacilities.forEach((id) => formData.append("facilities[]", id));
        selectedServices.forEach((id) => formData.append("services[]", id));
        selectedCourses.forEach((id) => formData.append("courses[]", id));
        selectedPayment.forEach((id) => formData.append("payments[]", id));

        formData.append("hours", JSON.stringify(schedule));

        // ✅ Transform additional fields
        const formattedAdditionalFields = Object.entries(
          additionalFields || {},
        ).map(([fieldId, value]) => ({
          field_id: fieldId,
          value: Array.isArray(value)
            ? value.filter((v) => typeof v === "string" && v.trim() !== "")
            : value,
        }));

        formData.append(
          "additional_fields",
          JSON.stringify(formattedAdditionalFields),
        );

        break;

      case 2:
        formData.append("website_link", social.websiteLink || "");
        formData.append("video_link", social.videoLink || "");
        formData.append("facebook", social.facebook || "");
        formData.append("instagram", social.instagram || "");
        formData.append("twitter", social.twitter || "");
        formData.append("linkedin", social.linkedin || "");
        formData.append("youtube", social.youtube || "");

        break;

      case 3:
        formData.append("name", contact.name);
        formData.append("email", contact.email);
        formData.append("country_code", contact.countryCode);
        formData.append("alt_country_code", contact.altCountryCode);
        formData.append("mobile_number", contact.number);
        // formData.append("listing_id", listingId);
        if (contact.altNumber)
          formData.append("second_mobile_number", contact.altNumber);
        formData.append("city_id", contact.cityId);
        formData.append("locality", contact.locality);
        break;

      case 4:
        // formData.append("listing_id", listingId);
        formData.append("seo_title", seo.title);
        formData.append("seo_description", seo.description);
        break;

      case 5:
        if (media.logo) {
          if (media.logo.isExisting) {
            formData.append("existing_logo", media.logo.preview);
          } else {
            formData.append("logo", media.logo.file);
          }
        }

        const newImages = media.images.filter((img) => !img.isExisting);
        const existingImages = media.images.filter((img) => img.isExisting);

        newImages.forEach((img) => {
          formData.append("images", img.file);
        });

        existingImages.forEach((img) => {
          formData.append("images", img.preview);
        });

        break;

      case 6:
        // formData.append("listing_id", listingId);
        formData.append("plan_id", selectedPlanId);
        break;

      default:
        break;
    }

    try {
      console.table("FORMDATAT ::", formData);

      const response = await add_listings(
        formData,
        stepNumber,
        slug,
        existingData?._id || listingId,
      );
      console.log(`Step ${stepNumber} submitted:`, response);
      if (!response?.success && response?.message) {
        setGlobalError(response?.message || "Something went wrong.");
      }

      if (response?.errors && Object.keys(response.errors).length > 0) {
        const mappedErrors = mapApiErrorsToState(response.errors, stepNumber);
        setErrors(mappedErrors);

        const firstErrorKey = Object.keys(mappedErrors)[0];
        setTimeout(() => scrollToError(firstErrorKey), 100);

        setIsSubmitting(false);
        return false;
      }

      // console.log("stepNumber:", stepNumber);
      // console.log("response is this :", response?.data);

      // set listing id
      if (stepNumber === 1 && response?.data?.data?.id) {
        setListingId(response.data.data.id);
        setSlug(response.data.data.slug);
      }

      // move to next step
      if (response?.data?.status === true) {
        setGlobalError(""); // ✅ CLEAR
        setActiveStep(stepNumber + 1);
      }

      if (stepNumber === 6) {
        clearSession();
        console.log("response from 6 ", response);
        setShowSuccessPopup(true);
        // if (response?.status) {
        //   router.push({
        //     pathname: `/${response?.data?.slug}`,
        //     query: { preview: true },
        //   });
        // }
        // alert("Listing completed successfully!");
      }

      setIsSubmitting(false);
      console.log("main response", response);
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
        setGlobalError("Something went wrong. Please try again.");
      }
      setIsSubmitting(false);
      return false;
    }
  };

  const currentStep = steps.find((step) => step.active)?.step || 1;
  const isEditMode = !!name;
  const currentPostingStep = BUSINESS_POSTING_TIPS.find(
    (item) => item.step === currentStep,
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="w-[72%]">
            <BusinessInfo
              category={category}
              subCategory={subCategory}
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
              selectedFacilities={selectedFacilities}
              selectedServices={selectedServices}
              setSelectedFacilities={setSelectedFacilities}
              setSelectedServices={setSelectedServices}
              selectedCourses={selectedCourses}
              setSelectedCourses={setSelectedCourses}
              business={business}
              setBusiness={setBusiness}
              facilities={facility}
              services={service}
              courses={courses}
              payment={payment}
              errors={errors}
              schedule={schedule}
              setSchedule={setSchedule}
              clearError={clearError}
              refs={{
                businessNameRef,
                businessAddressRef,
                establishmentYearRef,
                taxNumberRef,
                businessDescriptionRef,
                facilitiesRef,
                servicesRef,
                coursesRef,
              }}
            />

            {/* <AdditionalInfo
              additionalFields={additionalFields}
              category={categoryId}
              setAdditionalFields={setAdditionalFields}
              errors={errors}
              clearError={clearError}
            // refs={{ additionalFieldsRef }}
            /> */}
            {additional_fields.length > 0 ? (
              <AdditionalInfo
                additionalFields={additional_fields}
                values={additionalFields}
                setValues={setAdditionalFields}
              />
            ) : (
              ""
            )}
          </div>
        );
      case 2:
        return (
          <SocialDetails
            error={errors}
            social={social}
            setSocial={setSocial}
            clearError={clearError}
            refs={{ websiteLinkRef, videoLinkRef }}
          />
        );
      case 3:
        return (
          <ContactDetails
            contact={contact}
            setContact={setContact}
            error={errors}
            clearError={clearError}
            business={business}
            setBusiness={setBusiness}
            islistingForm={true}
            refs={{
              contactNameRef,
              contactEmailRef,
              contactNumberRef,
              contactAltNumberRef,
              contactCityRef,
              contactLandmarkRef,
            }}
          />
        );
      case 4:
        return (
          <SearchEngine
            seo={seo}
            business={business}
            setSeo={setSeo}
            error={errors}
            clearError={clearError}
            refs={{ seoTitleRef, seoDescriptionRef }}
          />
        );
      case 5:
        return (
          <section>
            <ImageUploadSections
              media={media}
              setMedia={setMedia}
              error={errors}
              clearError={clearError}
              refs={{ logoRef, imagesRef }}
              isEditMode={isEditMode}
            />
          </section>
        );
      case 6:
        return (
          <section className="w-full" ref={planRef}>
            <div className=" text-center">
              <PricingTable
                plans={plans}
                selectedPlanId={selectedPlanId}
                setSelectedPlanId={setSelectedPlanId}
                onSelect={() => clearError("plan")}
              />
              {errors.plan && (
                <p className="text-red-500 mt-2">{errors.plan}</p>
              )}
            </div>
          </section>
        );
      default:
        return <BusinessInfo />;
    }
  };

  return (
    <>
      <div className="h-screen w-full">
        <div className="bg-white md:w-[80%] max-md:w-full h-auto mx-auto flex flex-col items-center relative max-w-[2000px]">
          <div className="fixed top-0 md:w-[80%] max-w-[1400px] w-full bg-white z-40">
            {" "}
            <div className="relative group">
              {/* Button */}
              <button
                className="
      absolute 
      right-4 
      top-52 
      z-50 
      bg-white border border-gray-200 
      hover:bg-gray-50 
      text-gray-600 
      w-10 h-10 flex items-center justify-center 
      rounded-full shadow-md 
      font-semibold 
      transition-all duration-200
    "
                title="Posting Tips"
              >
                i
              </button>

              {/* Tips Panel */}
              <div
                className="
      absolute 
      right-0 
      top-64
      w-[380px] 
      z-50
      shadow-xl 
      bg-[#FFF8F3] 
      p-4 
      rounded-xl 
      text-sm 
      border border-orange-100

      opacity-0 
      invisible 
      group-hover:opacity-100 
      group-hover:visible 
      transition-all duration-200
    "
              >
                <h6 className="font-extrabold text-base mb-3">Posting Tips</h6>

                {currentPostingStep?.fields?.map((field, index) => (
                  <div key={index} className="mb-2">
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
            {showTips && (
              <div
                className="
      absolute 
      right-6 
      top-64
      z-50 
      ml-auto
      w-[340px] 
      
      shadow-xl 
      bg-[#FFF8F3] 
      p-4 
      rounded-xl 
      text-sm 
      border border-orange-100
    "
              >
                <div className="w-full">
                  <h6 className="font-extrabold text-base mb-3 flex items-center justify-between">
                    Posting Tips
                    <button
                      onClick={() => setShowTips(false)}
                      className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                      ✕
                    </button>
                  </h6>

                  {currentPostingStep?.fields?.map((field, index) => (
                    <div key={index} className="mb-2">
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
            )}
            <Navbar
              categoryName={categoryName}
              subCategoryName={subCategoryName}
            />
            {/* Auto-save indicator */}
            {/* {lastSaved && (
              <div className="text-xs text-gray-500 flex items-center justify-end gap-1 px-4 py-1">
                <svg
                  className="w-3 h-3 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Auto-saved at {lastSaved}
              </div>
            )} */}
          </div>

          <section className="mt-26 md:scale-85 max-md:scale-90 2xl:scale-95 flex max-md:mb-5 justify-center">
            <Steps steps={steps} setActiveStep={setActiveStep} />
          </section>

          <div className="flex max-md:flex-col gap-2 items-start relative 2xl:w-[95%] md:mt-14 mb-24 ">
            <section className="2xl:w-[95%] w-full   h-full max-md:px-5 md:pl-10 rounded-xl">
              {renderStepContent()}
            </section>
          </div>

          <div className="flex justify-between w-[95%] 2xl:w-[95%] mb-8">
            {currentStep > 1 && (
              <button
                onClick={() => setActiveStep(currentStep - 1)}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>
            )}

            {currentStep === 1 && <div></div>}

            <button
              onClick={async () => {
                if (validateStep(currentStep)) {
                  await handleStepSubmit(currentStep);
                }
              }}
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#FF6E04] hover:bg-[#E55A03] text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  {currentStep === 6 ? "Complete Payment" : "Next Step"}
                  {currentStep < 6 && (
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
          {globalError && (
            <div className="w-[95%] 2xl:w-[95%] mb-4">
              <div className="flex items-start gap-3 p-4 rounded-lg border border-red-200 bg-red-50 shadow-sm">
                {/* Icon */}
                <svg
                  className="w-5 h-5 text-red-500 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                  />
                </svg>

                {/* Message */}
                <div className="flex-1 text-sm text-red-700 font-medium">
                  {globalError}
                </div>

                {/* Close button */}
                <button
                  onClick={() => setGlobalError("")}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
        <SuccessModal
          open={showSuccessPopup}
          onClose={() => setShowSuccessPopup(false)}
          title="Thank You!"
          message={
            <>
              Your listing has been successfully submitted on{" "}
              <span className="font-semibold text-gray-800">
                AddressGuru.ae
              </span>
              .
              <br />
              Our team will review it shortly.
            </>
          }
          redirectTo="/dashboard"
          // autoRedirect={true}
        />
        <Footer />
        {/* <section>
          <Footer />
        </section> */}
      </div>
    </>
  );
};

export default ListingForms;
