import { add_properties_listing, get_service_facility } from "@/api/forms";
import { get_plans } from "@/api/plans";
import { get_property_by_slug } from "@/api/showlistings";
import CheckBox from "@/components/Forms/CheckBox";
import DropDown from "@/components/Forms/DropDown";
import InputWithTitle from "@/components/Forms/InputWithTitle";
import Navbar from "@/components/Forms/Navbar";
import Steps from "@/components/Forms/Steps";
import SearchEngine from "@/components/Forms/FormSections/SearchEngine";
import PricingTable from "@/components/Plans/PricingTable";
import Footer from "@/layout/footer";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ContactDetails from "@/components/Forms/FormSections/ContactDetails";
import {
  saveToSession,
  getFromSession,
  clearSession,
} from "@/utils/sessionStorage";
import AdditionalPropertyFields, {
  FIELD_CONFIG as FIELD_CONFIG_REF,
} from "@/components/Forms/FormSections/AdditionalPropertyFields";
import { APP_URL } from "@/services/constants";

import axios from "axios";
import { add_property_listing } from "@/api/uae-property";

const PropertiesListing = () => {
  const router = useRouter();
  const categoryId = router?.query?.id;
  const type = router?.query?.type;
  const category = router?.query?.category;

  // ── Edit mode ──
  const isEditMode = router?.query?.edit === "true";
  const editSlug = router?.query?.propertyId;

  // ── Edit mode resolved values (from API, used instead of query params) ──
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editType, setEditType] = useState(null);
  const [editCategory, setEditCategory] = useState(null);

  // Derived: use API values in edit mode, query params in create mode
  const resolvedCategoryId = isEditMode ? editCategoryId : categoryId;
  const resolvedType = isEditMode ? editType : type;
  const resolvedCategory = isEditMode ? editCategory : category;

  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [service, setService] = useState([]);
  const [facility, setFacility] = useState([]);
  const [plans, setPlans] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [listingId, setListingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [lastSaved, setLastSaved] = useState(null);
  const [additionalFields, setAdditionalFields] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Refs
  const rentByRef = useRef(null);
  const availableRef = useRef(null);
  const sizeRef = useRef(null);
  const caeRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const priceRef = useRef(null);
  const facilitiesRef = useRef(null);
  const imageFilesRef = useRef({});
  const contactNameRef = useRef(null);
  const contactEmailRef = useRef(null);
  const contactNumberRef = useRef(null);
  const contactAltNumberRef = useRef(null);
  const contactCityRef = useRef(null);
  const contactLandmarkRef = useRef(null);
  const seoTitleRef = useRef(null);
  const seoDescriptionRef = useRef(null);
  const planRef = useRef(null);

  // Section 1: Property Information
  const [propertyInfo, setPropertyInfo] = useState({
    rentBy: "",
    size: "",
    caeNumber: "",
    title: "",
    description: "",
    priceType: "amount",
    amount: "",
  });

  // Section 2: Media
  const [media, setMedia] = useState({ images: [] });

  // Section 3: Contact
  const [contact, setContact] = useState({
    name: "",
    email: "",
    number: "",
    countryCode: "+65",
    altCountryCode: "+65",
    altNumber: "",
    city: "",
    landmark: "",
  });

  // Section 4: SEO
  const [seo, setSeo] = useState({ title: "", description: "" });

  const multipleInputRef = useRef(null);

  const [steps, setSteps] = useState([
    {
      step: 1,
      title: "Property Information",
      description: "Update your property details and info",
      active: true,
      completed: false,
    },
    {
      step: 2,
      title: "Add Photos",
      description: "Add your property images",
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
      title: "Payment",
      description: "Proceed for payment",
      active: false,
      completed: false,
    },
  ]);

  // ── Fetch and pre-fill data for edit mode ──
  useEffect(() => {
    if (!router.isReady) return;
    if (!isEditMode || !editSlug) return;

    const prefillEditData = async () => {
      setEditLoading(true);
      try {
        const res = await get_property_by_slug(editSlug);
        const d = res?.data || res;
        if (!d) return;

        console.log("Edit property data:", d); // check field names here

        setListingId(d.id);

        // ── Resolve category/type from API so we don't need query params ──
        setEditCategoryId(d.category_id || "");
        setEditType(d.type || d.sale_by || "sale");
        setEditCategory(d.category_slug || d.category?.slug || "");

        // Pre-fill step 1 — Property Info
        setPropertyInfo({
          rentBy: d.sale_by || "",
          size: d.size ? String(d.size) : "",
          caeNumber: d.cae_number || "",
          title: d.title || "",
          description: d.description || "",
          priceType: d.price_type || "amount",
          amount: d.amount ? String(d.amount) : "",
        });

        // Pre-fill available date
        if (d.available) {
          const parsedDate = new Date(d.available);
          if (!isNaN(parsedDate)) setStartDate(parsedDate);
        }

        // Pre-fill facilities & services
        if (d.facilities_id && Array.isArray(d.facilities_id)) {
          setSelectedFacilities(d.facilities_id);
        }
        if (d.services_id && Array.isArray(d.services_id)) {
          setSelectedServices(d.services_id);
        }

        // Pre-fill additional property fields
        setAdditionalFields({
          bedrooms: d.bedrooms || "",
          bathrooms: d.bathrooms || "",
          floor_number: d.floor_number ? String(d.floor_number) : "",
          total_floors: d.total_floors ? String(d.total_floors) : "",
          furnishing: d.furnishing || "",
          facing: d.facing || "",
          parking: d.parking || "",
          age_of_property: d.age_of_property ? String(d.age_of_property) : "",
          plot_type: d.plot_type || "",
          length: d.length ? String(d.length) : "",
          width: d.width ? String(d.width) : "",
          road_facing_width: d.road_facing_width
            ? String(d.road_facing_width)
            : "",
          boundary_wall: d.boundary_wall || "",
          corner_plot: d.corner_plot || "",
          room_type: d.room_type || "",
          total_rooms: d.total_rooms ? String(d.total_rooms) : "",
          meal_included: d.meal_included || "",
          gender_preference: d.gender_preference || "",
          property_subtype: d.property_subtype || "",
        });

        // Pre-fill step 2 — Images
        const existingImages = Array.isArray(d.images)
          ? d.images
          : (() => {
              try {
                return JSON.parse(d.images);
              } catch {
                return [];
              }
            })();

        setMedia({
          images: existingImages?.map((url, idx) => ({
            id: `existing-${idx}-${Date.now()}`,
            file: null,
            preview: url.startsWith("http") ? url : `${APP_URL}/${url}`,
            name: url.split("/").pop(),
            isExisting: true,
          })),
        });

        // Pre-fill step 3 — Contact
        setContact({
          name: d.name || "",
          email: d.email || "",
          number: d.mobile_number || "",
          countryCode: d.country_code || "+65",
          altCountryCode: d.alt_country_code || "+65",
          altNumber: d.second_mobile_number || "",
          city: d.city || "",
          landmark: d.locality || "",
        });

        // Pre-fill step 4 — SEO
        setSeo({
          title: d.seo_title || "",
          description: d.seo_description || "",
        });

        // Fetch facilities/services using category_id from API
        if (d.category_id) {
          getServiceAndFacility(d.category_id);
        }
      } catch (err) {
        console.error("Error fetching property edit data:", err);
      } finally {
        setEditLoading(false);
      }
    };

    prefillEditData();
  }, [router.isReady, isEditMode, editSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load from session (non-edit only)
  useEffect(() => {
    if (isEditMode) return;
    const savedData = getFromSession();
    if (savedData.propertyInfo) setPropertyInfo(savedData.propertyInfo);
    if (savedData.contact) setContact(savedData.contact);
    if (savedData.seo) setSeo(savedData.seo);
    if (savedData.selectedPlanId) setSelectedPlanId(savedData.selectedPlanId);
    if (savedData.listingId) setListingId(savedData.listingId);
    if (savedData.selectedFacilities)
      setSelectedFacilities(savedData.selectedFacilities);
    if (savedData.selectedServices)
      setSelectedServices(savedData.selectedServices);
    if (savedData.startDate) setStartDate(new Date(savedData.startDate));
    if (savedData.currentStep && savedData.currentStep > 1)
      setActiveStep(savedData.currentStep);
    if (savedData.steps) setSteps(savedData.steps);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Session saves (non-edit only)
  useEffect(() => {
    if (isEditMode) return;
    if (propertyInfo.title || propertyInfo.description || propertyInfo.rentBy) {
      saveToSession("propertyInfo", propertyInfo);
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [propertyInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isEditMode) return;
    if (contact.name || contact.email || contact.number) {
      saveToSession("contact", contact);
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [contact]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isEditMode) return;
    if (seo.title || seo.description) {
      saveToSession("seo", seo);
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [seo]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isEditMode) return;
    if (selectedPlanId) saveToSession("selectedPlanId", selectedPlanId);
  }, [selectedPlanId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isEditMode) return;
    if (listingId) saveToSession("listingId", listingId);
  }, [listingId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isEditMode) return;
    if (selectedFacilities.length > 0)
      saveToSession("selectedFacilities", selectedFacilities);
  }, [selectedFacilities]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isEditMode) return;
    if (selectedServices.length > 0)
      saveToSession("selectedServices", selectedServices);
  }, [selectedServices]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isEditMode) return;
    if (startDate) saveToSession("startDate", startDate.toISOString());
  }, [startDate]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isEditMode) return;
    saveToSession("steps", steps);
  }, [steps]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear session on leave (non-edit only)
  useEffect(() => {
    if (isEditMode) return;
    const handleBeforeUnload = () => clearSession();
    const handleRouteChange = () => clearSession();
    window.addEventListener("beforeunload", handleBeforeUnload);
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, isEditMode]);

  // ── Fetch facilities when resolvedCategoryId is available (create mode) ──
  useEffect(() => {
    if (isEditMode) return; // edit mode handles this inside prefillEditData
    if (resolvedCategoryId) getServiceAndFacility(resolvedCategoryId);
    getPlansData();
  }, [resolvedCategoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Always fetch plans ──
  useEffect(() => {
    if (!isEditMode) return; // create mode fetches plans in above effect
    getPlansData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const currentStep = steps.find((step) => step.active)?.step || 1;

  const setActiveStep = (stepNumber) => {
    setSteps((prevSteps) =>
      prevSteps?.map((step) => ({
        ...step,
        active: step.step === stepNumber,
        completed: step.step < stepNumber ? true : step.completed,
      })),
    );
    if (!isEditMode) saveToSession("currentStep", stepNumber);
  };

  const rentByOptions = [
    { value: "owner", label: "Owner" },
    { value: "broker", label: "Broker" },
    { value: "agency", label: "Agency" },
  ];

  const priceOptions = [
    { value: "amount", label: "Amount" },
    { value: "contact_for_sale", label: "Contact For Sale" },
  ];

  const getServiceAndFacility = async (id) => {
    const res = await get_service_facility(id);
    if (res?.success === true) {
      const facilities = res?.data?.facilitis || [];
      const services = res?.data?.service || [];
      setFacility(facilities.length > 0 ? facilities : []);
      setService(services.length > 0 ? services : []);
    }
  };

  const getPlansData = async () => {
    try {
      const res = await get_plans();
      setPlans(res?.data);
    } catch (error) {
      console.log("error in fetching plans", error);
    }
  };

  const handleMultipleUpload = (files) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (media.images.length + imageFiles.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }
    imageFiles.forEach((file) => {
      const id = Date.now() + Math.random();
      imageFilesRef.current[id] = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        setMedia((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            {
              id,
              file: null,
              preview: e.target.result,
              name: file.name,
              isExisting: false,
            },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleMultipleUpload(e.dataTransfer.files);
  };

  const removeImage = (id) => {
    delete imageFilesRef.current[id];
    setMedia((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== id),
    }));
  };

  const handlePropertyInfoChange = (field, value) => {
    setPropertyInfo((prev) => ({ ...prev, [field]: value }));
    clearError(field);
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
      rentBy: rentByRef,
      available: availableRef,
      size: sizeRef,
      caeNumber: caeRef,
      title: titleRef,
      description: descriptionRef,
      amount: priceRef,
      facilities: facilitiesRef,
      images: imageFilesRef,
      contactName: contactNameRef,
      contactEmail: contactEmailRef,
      contactCity: contactCityRef,
      contactNumber: contactNumberRef,
      contactLandmark: contactLandmarkRef,
      seoTitle: seoTitleRef,
      seoDescription: seoDescriptionRef,
      plan: planRef,
    };
    const ref = errorRefMap[errorKey];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      if (ref.current.querySelector("input, textarea")) {
        setTimeout(
          () => ref.current.querySelector("input, textarea")?.focus(),
          500,
        );
      }
    }
  };

  const mapApiErrorsToState = (apiErrors, stepNumber) => {
    const errorMapping = {
      1: {
        rent_by: "rentBy",
        sale_by: "rentBy",
        available_date: "available",
        available: "available",
        size: "size",
        cae_number: "caeNumber",
        title: "title",
        description: "description",
        price_type: "priceType",
        amount: "amount",
        facilities: "facilities",
        services: "services",
      },
      2: { images: "images" },
      3: {
        name: "contactName",
        email: "contactEmail",
        city: "contactCity",
        mobile_number: "contactNumber",
        second_mobile_number: "contactAltNumber",
        locality: "contactLandmark",
      },
      4: { seo_title: "seoTitle", seo_description: "seoDescription" },
      5: { plan_id: "plan" },
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

  const validateStep = (step) => {
    let newErrors = {};

    if (step === 1) {
      // Additional fields — optional but must be valid numbers if entered
      const fields =
        FIELD_CONFIG_REF[resolvedCategory] || FIELD_CONFIG_REF["other"];
      fields.forEach((field) => {
        const val = additionalFields[field.key];
        if (val !== "" && val !== undefined && val !== null) {
          if (field.inputType === "number" && !/^\d*\.?\d*$/.test(val)) {
            newErrors[field.key] = `${field.label} must be a valid number`;
          }
        }
      });

      if (!propertyInfo.rentBy)
        newErrors.rentBy = "Please select who is listing the property";
      if (!startDate) newErrors.available = "Available date is required";
      if (!propertyInfo.size.trim()) newErrors.size = "Size is required";
      if (!propertyInfo.title.trim()) newErrors.title = "Title is required";
      if (!propertyInfo.description.trim())
        newErrors.description = "Description is required";
      if (propertyInfo.priceType === "amount" && !propertyInfo.amount.trim())
        newErrors.amount = "Amount is required";
      if (propertyInfo.rentBy === "agency" && !propertyInfo.caeNumber.trim())
        newErrors.caeNumber = "CEA number is required for agency";
      if (facility.length > 0 && selectedFacilities.length === 0)
        newErrors.facilities = "Please select at least one facility";
    }

    if (step === 2) {
      if (media.images.length === 0)
        newErrors.images = "Please upload at least one image";
    }

    if (step === 3) {
      if (!contact.name.trim())
        newErrors.contactName = "Contact name is required";
      if (!contact.email.trim()) newErrors.contactEmail = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
        newErrors.contactEmail = "Enter a valid email";
      if (!contact.city.trim()) newErrors.contactCity = "City is required";
      if (!contact.number.trim())
        newErrors.contactNumber = "Mobile number is required";
    }

    if (step === 4) {
      if (!seo.title.trim()) newErrors.seoTitle = "SEO title is required";
      else if (seo.title.length < 10)
        newErrors.seoTitle = "Title must be at least 10 characters";
      if (!seo.description.trim())
        newErrors.seoDescription = "SEO description is required";
      else if (seo.description.length < 30)
        newErrors.seoDescription = "Description must be at least 30 characters";
    }

    if (step === 5) {
      if (!selectedPlanId) newErrors.plan = "Please select a plan";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      setTimeout(() => scrollToError(firstErrorKey), 100);
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleStepSubmit = async (stepNumber) => {
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData();

    if (isEditMode) {
      formData.append("property_id", listingId);
    } else {
      // formData.append("category_id", categoryId);
      formData.append("type", type);
      if (listingId) formData.append("property_id", listingId);
    }

    formData.append("step", stepNumber);

    switch (stepNumber) {
      case 1:
        // Required
        formData.append("category_id", resolvedCategoryId);

        // OPTIONAL: only if you actually have subcategory state
        if (contact.subCategoryId) {
          formData.append("sub_category_id", contact.subCategoryId);
        }

        // MUST BE ID (not name)
        formData.append("city_id", contact.city);

        // Basic Info
        formData.append("title", propertyInfo.title);
        formData.append("description", propertyInfo.description);

        // Purpose (sale | rent | lease)
        formData.append("purpose", resolvedType);

        // PRICE
        if (propertyInfo.priceType === "amount") {
          formData.append("price_amount", propertyInfo.amount);
        }

        formData.append("price_currency", "AED"); // can make dynamic later
        formData.append("price_negotiable", "false"); // string required
        formData.append("price_period", "one-time"); // or monthly/yearly

        // AREA
        formData.append("area_size", propertyInfo.size);
        formData.append("area_unit", "sqft"); // TODO: make dynamic if needed

        // formData.append("area_unit", propertyInfo.areaUnit || "sqft");

        // PAYMENTS (plan)
        if (selectedPlanId) {
          formData.append("payments", selectedPlanId);
        }

        // FACILITIES & SERVICES (if backend supports)
        selectedFacilities.forEach((id) => formData.append("facilities[]", id));

        selectedServices.forEach((id) => formData.append("services[]", id));

        // ADDITIONAL FIELDS (IMPORTANT FORMAT)
        if (additionalFields && Object.keys(additionalFields).length > 0) {
          const formattedFields = Object.entries(additionalFields)
            .filter(([_, value]) => value !== "" && value !== null)
            .map(([field_id, value]) => ({
              field_id,
              value: String(value),
            }));

          formData.append("additional_fields", JSON.stringify(formattedFields));
        }

        break;

      case 2:
        formData.append("listing_id", listingId);
        media.images
          .filter((img) => !img.isExisting)
          .forEach((img) => {
            const file = imageFilesRef.current[img.id];
            if (file) formData.append("images[]", file);
          });
        break;

      case 3:
        formData.append("listing_id", listingId);
        formData.append("name", contact.name);
        formData.append("email", contact.email);
        formData.append("city", contact.city);
        formData.append("country_code", contact.countryCode);
        formData.append("alt_country_code", contact.altCountryCode);
        formData.append("mobile_number", contact.number);
        if (contact.altNumber)
          formData.append("second_mobile_number", contact.altNumber);
        formData.append("locality", contact.landmark);
        break;

      case 4:
        formData.append("listing_id", listingId);
        formData.append("seo_title", seo.title);
        formData.append("seo_description", seo.description);
        break;

      case 5:
        formData.append("listing_id", listingId);
        formData.append("plan_id", selectedPlanId);
        break;

      default:
        break;
    }

    try {
      const response = await add_property_listing({
        payload: formData,
        step: stepNumber,
        listingId,
      });
      console.log(`Step ${stepNumber} submitted:`, response);
      console.log("response of step 1", response);

      if (!response?.status) {
        alert(response?.message || "Error Occurred");
      }

      if (response?.errors && Object.keys(response.errors).length > 0) {
        const mappedErrors = mapApiErrorsToState(response.errors, stepNumber);
        setErrors(mappedErrors);
        const firstErrorKey = Object.keys(mappedErrors)[0];
        setTimeout(() => scrollToError(firstErrorKey), 100);
        setIsSubmitting(false);
        return false;
      }

      if (stepNumber === 1 && response?.data?._id) {
        setListingId(response.data._id);
      }

      if (stepNumber === 5) {
        clearSession();
        if (response?.success) {
          router.push({
            pathname: `/property/${response?.data?.slug}`,
            query: { preview: true },
          });
        }
      } else {
        if (response?.success) setActiveStep(stepNumber + 1);
      }

      setIsSubmitting(false);
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
      } else if (error?.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert(`Error submitting step ${stepNumber}. Please try again.`);
      }
      setIsSubmitting(false);
      return false;
    }
  };

  const renderStepContent = () => {
    if (editLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <svg
            className="animate-spin h-8 w-8 text-[#FF6E04]"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="ml-3 text-gray-500 font-medium">
            Loading property data...
          </span>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <section className="space-y-4">
            <div className="flex justify-between gap-5 w-full items-center">
              <div className="w-1/2" ref={rentByRef}>
                <h4 className="font-semibold text-gray-500 capitalize mb-1">
                  {resolvedType} BY *
                </h4>
                <DropDown
                  placeholder={`Select ${resolvedType} by`}
                  options={rentByOptions}
                  value={
                    propertyInfo.rentBy
                      ? rentByOptions.find(
                          (o) => o.value === propertyInfo.rentBy,
                        )
                      : null
                  }
                  onChange={(selected) =>
                    handlePropertyInfoChange("rentBy", selected.value)
                  }
                />
                {errors.rentBy && (
                  <p className="text-red-500 text-sm mt-1">{errors.rentBy}</p>
                )}
              </div>
              <div className="min-w-1/2" ref={availableRef}>
                <p className="text-md font-semibold text-gray-500 capitalize mb-2">
                  Available *
                </p>
                <span className="border p-2.5 border-gray-200 rounded-md">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      clearError("available");
                    }}
                    className="outline-none"
                    minDate={new Date()}
                  />
                </span>
                {errors.available && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.available}
                  </p>
                )}
              </div>
            </div>

            <div ref={sizeRef}>
              <InputWithTitle
                title={"Size (sqft)"}
                required={true}
                value={propertyInfo.size}
                onChange={(e) =>
                  handlePropertyInfoChange("size", e.target.value)
                }
              />
              {errors.size && (
                <p className="text-red-500 text-sm mt-1">{errors.size}</p>
              )}
            </div>

            {propertyInfo.rentBy === "agency" && (
              <div ref={caeRef}>
                <InputWithTitle
                  title={"CEA Number *"}
                  value={propertyInfo.caeNumber}
                  onChange={(e) =>
                    handlePropertyInfoChange("caeNumber", e.target.value)
                  }
                />
                {errors.caeNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.caeNumber}
                  </p>
                )}
              </div>
            )}

            <div ref={titleRef}>
              <InputWithTitle
                title={"Title"}
                required={true}
                value={propertyInfo.title}
                onChange={(e) =>
                  handlePropertyInfoChange("title", e.target.value)
                }
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div ref={descriptionRef}>
              <InputWithTitle
                title={"Property Description"}
                required={true}
                isTextarea={true}
                rows={5}
                value={propertyInfo.description}
                onChange={(e) =>
                  handlePropertyInfoChange("description", e.target.value)
                }
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="md:flex gap-3 w-full">
              <div className="w-full">
                <h4 className="font-semibold text-gray-500 mb-1">
                  Price Type *
                </h4>
                <DropDown
                  placeholder="Select price type"
                  options={priceOptions}
                  value={
                    propertyInfo.priceType
                      ? priceOptions.find(
                          (o) => o.value === propertyInfo.priceType,
                        )
                      : null
                  }
                  onChange={(selected) =>
                    handlePropertyInfoChange("priceType", selected.value)
                  }
                />
              </div>
              {propertyInfo.priceType === "amount" && (
                <div className="w-full" ref={priceRef}>
                  <InputWithTitle
                    title="Amount"
                    required={true}
                    value={propertyInfo.amount}
                    onChange={(e) =>
                      handlePropertyInfoChange("amount", e.target.value)
                    }
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                  )}
                </div>
              )}
            </div>

            {facility.length > 0 && (
              <div ref={facilitiesRef}>
                <CheckBox
                  heading="Select Facilities *"
                  options={facility}
                  selectedIds={selectedFacilities}
                  onChange={(ids) => {
                    setSelectedFacilities(ids);
                    clearError("facilities");
                  }}
                />
                {errors.facilities && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.facilities}
                  </p>
                )}
              </div>
            )}

            {service.length > 0 && (
              <div>
                <CheckBox
                  heading="Select Services"
                  options={service}
                  selectedIds={selectedServices}
                  onChange={(ids) => setSelectedServices(ids)}
                />
              </div>
            )}

            {/* <AdditionalPropertyFields
              categorySlug={resolvedCategory}
              values={additionalFields}
              onChange={setAdditionalFields}
              errors={errors}
              clearError={clearError}
              setErrors={setErrors}
            /> */}
          </section>
        );

      case 2:
        return (
          <section ref={imageFilesRef}>
            <h3 className="text-xl font-semibold mb-6 uppercase text-gray-800">
              Upload Images *
            </h3>
            <div
              className={`bg-white rounded-lg border-2 border-dashed p-8 ${isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaUpload className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2">
                  Drag and drop images here, or click to select
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Maximum 10 images ({media.images.length}/10 uploaded)
                </p>
                <input
                  ref={multipleInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleMultipleUpload(e.target.files)}
                  className="hidden"
                  id="multiple-upload"
                />
                <label
                  htmlFor="multiple-upload"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
                >
                  <FaUpload className="w-4 h-4 mr-2" /> Choose Images
                </label>
              </div>
            </div>

            {errors.images && (
              <p className="text-red-500 text-sm mt-2">{errors.images}</p>
            )}

            {media?.images?.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">
                  Uploaded Images
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {media?.images?.map((img) => (
                    <div key={img.id} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          height={500}
                          width={500}
                          src={img.preview}
                          alt={img.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {img.isExisting && (
                        <span className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                          Existing
                        </span>
                      )}
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
                      >
                        <MdCancel className="w-7 h-7 text-white rounded-full bg-red-500" />
                      </button>
                      <p
                        className="mt-1 text-xs text-gray-600 truncate"
                        title={img.name}
                      >
                        {img.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        );

      case 3:
        return (
          <ContactDetails
            contact={contact}
            setContact={setContact}
            error={errors}
            clearError={clearError}
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
            business={{
              name: propertyInfo.title,
              description: propertyInfo.description,
              address: contact.city + ", " + contact.landmark,
            }}
            setSeo={setSeo}
            error={errors}
            clearError={clearError}
            refs={{ seoTitleRef, seoDescriptionRef }}
          />
        );

      case 5:
        return (
          <section className="mx-auto w-full" ref={planRef}>
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Payment Section</h2>
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
        return null;
    }
  };

  return (
    <>
      <div className="h-screen w-full">
        <div className="bg-white md:w-[80%] max-md:w-full h-auto mx-auto flex flex-col items-center relative max-w-[2000px]">
          <div className="fixed top-0 md:w-[80%] max-w-[1400px] w-full bg-white z-40">
            <Navbar categoryName={resolvedCategory} />
            {!isEditMode && lastSaved && (
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
            )}
            {isEditMode && (
              <div className="text-xs text-blue-600 flex items-center justify-end gap-1 px-4 py-1 font-medium">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editing existing listing
              </div>
            )}
          </div>

          <section className="mt-26 md:scale-85 max-md:scale-90 2xl:scale-95 flex max-md:mb-5 justify-center">
            <Steps steps={steps} setActiveStep={setActiveStep} />
          </section>

          <div className="flex max-md:flex-col gap-2 2xl:w-[95%] md:mt-14 mb-24">
            <section className="2xl:w-[95%] w-full h-full max-md:px-5 md:pl-10 rounded-xl">
              {renderStepContent()}
            </section>

            <div className="md:w-[420px] mx-2 h-fit shadow-md mt-7 bg-[#FFF8F3] p-3 rounded-xl text-sm">
              <div className="w-full">
                <h6 className="font-extrabold text-base my-2">Posting Tips</h6>
                <p>
                  <strong>Property Type: </strong>Specify whether you&apos;re
                  the owner, broker, or agency.
                  <br />
                  <strong>Availability: </strong>Mention when the property will
                  be available.
                  <br />
                  <strong>Size: </strong>Provide accurate property size in
                  square feet.
                  <br />
                  <strong>Title: </strong>Create a clear, descriptive title for
                  your property.
                  <br />
                  <strong>Description: </strong>Describe key features,
                  amenities, and location benefits.
                  <br />
                  <strong>Price: </strong>Set a competitive price or choose
                  alternative pricing options.
                  <br />
                  <strong>Images: </strong>Upload high-quality images showing
                  property interior and exterior.
                  <br />
                  <strong>Facilities: </strong>Select available facilities to
                  attract potential buyers/renters.
                  <br />
                  <strong>Contact: </strong>Provide accurate contact information
                  for buyers to reach you.
                  <br />
                  <strong>SEO: </strong>Optimize your listing with relevant
                  keywords for better visibility.
                </p>
              </div>
            </div>
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
                if (validateStep(currentStep))
                  await handleStepSubmit(currentStep);
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  {currentStep === 5 ? "Complete Payment" : "Next Step"}
                  {currentStep < 5 && (
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
        <section>
          <Footer />
        </section>
      </div>
    </>
  );
};

export default PropertiesListing;
