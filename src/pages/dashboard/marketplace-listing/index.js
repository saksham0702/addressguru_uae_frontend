import { get_marketplace_subcategories } from "@/api/Categories";

import { get_plans } from "@/api/plans";
import { create_order, verify_payment } from "@/api/payment";
import Script from "next/script";

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
import {
  saveToSession,
  getFromSession,
  clearSession,
} from "@/utils/sessionStorage";
import ContactDetails from "@/components/Forms/FormSections/ContactDetails";
import { APP_URL, CURRENCY_OPTIONS } from "@/services/constants";
import ImageUploadSections from "@/components/Forms/FormSections/ImageUploadSections";
import {
  add_marketplace_listing,
  get_marketplace_by_slug,
  get_marketplace_category_info,
} from "@/api/uae-marketplace";
import AdditionalInfo from "@/components/Forms/FormSections/AdditionalInfo";
import SuccessModal from "@/components/Forms/sucesspopup";

const MarketPlaceListing = () => {
  const router = useRouter();
  const categoryId = router?.query.item;
  console.log(categoryId);

  // ── Edit mode ──
  const isEditMode = router?.query?.edit === "true";
  const editSlug = router?.query?.productId;

  const [isDragOver, setIsDragOver] = useState(false);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [plans, setPlans] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [listingId, setListingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [lastSaved, setLastSaved] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [slug, setSlug] = useState(null);
  const [editcategory, seteditcategory] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [additionalFieldsList, setAdditionalFieldsList] = useState([]);
  const [additionalFieldsValues, setAdditionalFieldsValues] = useState({});
  // Refs for error scrolling
  const conditionRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const priceRef = useRef(null);
  const imagesRef = useRef(null);
  const contactNameRef = useRef(null);
  const contactEmailRef = useRef(null);
  const contactNumberRef = useRef(null);
  const contactAltNumberRef = useRef(null);
  const contactCityRef = useRef(null);
  const contactLandmarkRef = useRef(null);
  const seoTitleRef = useRef(null);
  const seoDescriptionRef = useRef(null);
  const planRef = useRef(null);

  const getCategoryInfo = async (id) => {
    const data = await get_marketplace_category_info(id);
    if (data) {
      setSubSubCategories(data.subCategories || []);
      setAdditionalFieldsList(data.additionalFields || []);
    }
  };

  const getPlansData = async () => {
    try {
      const res = await get_plans("marketplace");
      setPlans(res?.data?.plans);
    } catch (error) {
      console.log("error in fetching plans", error);
    }
  };

  useEffect(() => {
    if (categoryId) getCategoryInfo(categoryId);
    getPlansData();
  }, [categoryId]);

  // Section 1: Ad Information
  const [adInfo, setAdInfo] = useState({
    condition: "",
    subcategoryId: "",
    title: "",
    description: "",
    priceType: "amount",
    amount: "",
    currency: "AED",
  });

  // Section 2: Media (Images)
  const [media, setMedia] = useState({
    images: [],
  });

  // Section 3: Contact Details
  const [contact, setContact] = useState({
    name: "",
    email: "",
    number: "",
    countryCode: "+971",
    altCountryCode: "+971",
    altNumber: "",
    cityId: "",
    locality: "",
    address: "",
  });

  // Section 4: SEO Details
  const [seo, setSeo] = useState({
    title: "",
    description: "",
  });

  const multipleInputRef = useRef(null);

  // Steps state
  const [steps, setSteps] = useState([
    {
      step: 1,
      title: "Add Information",
      description: "Update your Ad details and info",
      active: true,
      completed: false,
    },
    {
      step: 2,
      title: "Add Photos",
      description: "Add your product images",
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
        const res = await get_marketplace_by_slug(editSlug);
        const d = res?.data;
        console.log("response of market place existing data will be: ", d);
        setListingId(res?.data?._id);
        setSlug(res?.data?.slug);
        seteditcategory(res?.data?.category?._id);

        if (!d) return;

        // Set listing ID so all step submits include listing_id

        // Pre-fill step 1 — Ad Info
        setAdInfo({
          condition: d.condition || "",
          subcategoryId: d.subCategory?._id || "", // FIXED
          title: d.title || "",
          description: d.description || "",

          // 🔥 PRICE MAPPING (IMPORTANT)
          priceType: d.price?.isFree
            ? "free"
            : d.price?.isNegotiable
              ? "contact_for_sale"
              : d.price?.isFixed
                ? "amount"
                : "amount",

          amount: d.price?.amount ? String(d.price.amount) : "",
          currency: d.price?.currency || "AED",
        });

        // Pre-fill step 2 — Images
        // Existing images come as URL strings; wrap them so the UI can render them.
        // They don't have a .file, so on submit step 2 will only send newly added files.
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
          images: existingImages.map((url, idx) => ({
            id: `existing-${idx}-${Date.now()}`,
            file: null, // no File object for existing images
            preview: url.startsWith("http")
              ? url
              : `https://addressguru.ae/api/${url}`,
            name: url.split("/").pop(),
            isExisting: true, // flag to distinguish from newly uploaded
          })),
        });

        // Pre-fill step 3 — Contact
        setContact({
          name: d.contactPersonName || "", // ✅ FIXED
          email: d.email || "",
          number: d.mobileNumber || "", // ✅ FIXED
          countryCode: d.countryCode || "+971",
          altCountryCode: d.altCountryCode || "+971",
          altNumber: d.alternateMobileNumber || "", // ✅ FIXED
          cityId: d.city?._id || "", // ✅ FIXED
          locality: d.locality || "",
          address: d.address || "",
        });
        // Pre-fill step 4 — SEO
        setSeo({
          title: d.seo?.title || "",
          description: d.seo?.description || "",
        });

        // If the listing has a category, fetch its subcategories and additional fields
        if (d.category?._id || d.category) {
          getCategoryInfo(d.category?._id || d.category);
        }

        // Pre-fill additional fields values
        if (Array.isArray(d.additionalFields)) {
          const mappedValues = {};
          d.additionalFields.forEach((item) => {
            const fieldId = item.field_id?._id || item.field_id;
            if (fieldId) {
              mappedValues[fieldId] = item.value;
            }
          });
          setAdditionalFieldsValues(mappedValues);
        }
      } catch (err) {
        console.error("Error fetching edit data:", err);
      } finally {
        setEditLoading(false);
      }
    };

    prefillEditData();
  }, [router.isReady, isEditMode, editSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load data from session storage on mount (only for non-edit mode)
  useEffect(() => {
    if (isEditMode) return; // skip session restore in edit mode

    const savedData = getFromSession();

    if (savedData.adInfo) {
      setAdInfo(savedData.adInfo);
    }
    if (savedData.contact) {
      setContact(savedData.contact);
    }
    if (savedData.seo) {
      setSeo(savedData.seo);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save adInfo to session storage whenever it changes (non-edit mode)
  useEffect(() => {
    if (isEditMode) return;
    if (adInfo.title || adInfo.description || adInfo.condition) {
      saveToSession("adInfo", adInfo);
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [adInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save contact details to session storage (non-edit mode)
  useEffect(() => {
    if (isEditMode) return;
    if (contact.name || contact.email || contact.number) {
      saveToSession("contact", contact);
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [contact]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save SEO details to session storage (non-edit mode)
  useEffect(() => {
    if (isEditMode) return;
    if (seo.title || seo.description) {
      saveToSession("seo", seo);
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [seo]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save selected plan (non-edit mode)
  useEffect(() => {
    if (isEditMode) return;
    if (selectedPlanId) {
      saveToSession("selectedPlanId", selectedPlanId);
    }
  }, [selectedPlanId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save listing ID (non-edit mode)
  useEffect(() => {
    if (isEditMode) return;
    if (listingId) {
      saveToSession("listingId", listingId);
    }
  }, [listingId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save steps state (non-edit mode)
  useEffect(() => {
    if (isEditMode) return;
    saveToSession("steps", steps);
  }, [steps]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear session when user leaves the page (non-edit mode)
  useEffect(() => {
    if (isEditMode) return;

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
  }, [router, isEditMode]);

  const currentStep = steps.find((step) => step.active)?.step || 1;

  const setActiveStep = (stepNumber) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => ({
        ...step,
        active: step.step === stepNumber,
        completed: step.step < stepNumber ? true : step.completed,
      })),
    );
    if (!isEditMode) saveToSession("currentStep", stepNumber);
  };

  // Dropdown options
  const conditionOptions = [
    { value: "used", label: "Used" },
    { value: "new", label: "New" },
  ];

  const priceOptions = [
    { value: "amount", label: "Amount" },
    { value: "free", label: "Free" },
    { value: "swap_trade", label: "Swap/Trade" },
    { value: "contact_for_sale", label: "Contact For Sale" },
  ];

  // Handle multiple images upload
  const handleMultipleUpload = (files) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (media.images.length + imageFiles.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMedia((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            {
              id: Date.now() + Math.random(),
              file: file,
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

  // Drag & Drop handlers
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

  // Remove single image
  const removeImage = (id) => {
    setMedia((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== id),
    }));
  };

  // Handler functions
  const handleAdInfoChange = (field, value) => {
    setAdInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
    clearError(field);
  };

  const handleContactDetailsChange = (field, value) => {
    setContact((prev) => ({
      ...prev,
      [field]: value,
    }));
    clearError(field);
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

  // Scroll to first error field
  const scrollToError = (errorKey) => {
    const errorRefMap = {
      condition: conditionRef,
      title: titleRef,
      description: descriptionRef,
      amount: priceRef,
      images: imagesRef,
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

  // Map API error keys to frontend error keys
  const mapApiErrorsToState = (apiErrors, stepNumber) => {
    const errorMapping = {
      1: {
        condition: "condition",
        title: "title",
        description: "description",
        price_type: "priceType",
        amount: "amount",
        sub_category_id: "subcategoryId",
      },
      2: {
        images: "images",
      },
      3: {
        name: "contactName",
        email: "contactEmail",
        city: "contactCity",
        mobile_number: "contactNumber",
        second_mobile_number: "contactAltNumber",
        locality: "contactLandmark",
      },
      4: {
        seo_title: "seoTitle",
        seo_description: "seoDescription",
      },
      5: {
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

  // Validation function
  const validateStep = (step) => {
    let newErrors = {};

    if (step === 1) {
      if (!adInfo.condition) {
        newErrors.condition = "Please select condition";
      }
      if (!adInfo.title.trim()) {
        newErrors.title = "Title is required";
      }
      if (!adInfo.description.trim()) {
        newErrors.description = "Description is required";
      }
      if (subSubCategories.length > 0 && !adInfo.subcategoryId) {
        newErrors.subcategoryId = "Please select a sub-category";
      }
      if (adInfo.priceType === "amount" && !adInfo.amount) {
        newErrors.amount = "Price amount is required";
      }

      // additional fields validation
      additionalFieldsList.forEach((field) => {
        if (
          field.is_required &&
          (!additionalFieldsValues[field._id] ||
            (field.field_type === "price" &&
              !additionalFieldsValues[field._id]?.amount) ||
            (field.field_type === "checkbox" &&
              additionalFieldsValues[field._id]?.length === 0))
        ) {
          newErrors[field._id] = `${field.field_label} is required`;
        }
      });
    }

    if (step === 2) {
      const hasExistingImages = media.images.some((img) => img.isExisting);

      if (!hasExistingImages && media.images.length === 0) {
        newErrors.images = "Please upload at least one image";
      }
    }

    if (step === 3) {
      if (!contact.name) {
        newErrors.contactName = "Contact name is required";
      }

      if (!contact.email) {
        newErrors.contactEmail = "Email is required";
      }

      if (!contact.number) {
        newErrors.contactNumber = "Mobile number is required";
      } else if (!/^\d{5,12}$/.test(contact.number)) {
        newErrors.contactNumber = "Mobile number must be 5 to 12 digits";
      }

      // if (!contact.cityId) {
      //   newErrors.contactCity = "City is required";
      // }

      if (!contact.address) {
        newErrors.contactAddress = "Address is required";
      }
    }

    if (step === 4) {
      if (!seo.title.trim()) {
        newErrors.seoTitle = "SEO title is required";
      } else if (seo.title.length < 4) {
        newErrors.seoTitle = "Title must be at least 4 characters";
      }
      if (!seo.description.trim()) {
        newErrors.seoDescription = "SEO description is required";
      } else if (seo.description.length < 10) {
        newErrors.seoDescription = "Description must be at least 10 characters";
      }
    }

    if (step === 5) {
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

  // Submit handler for each step
  const handleStepSubmit = async (stepNumber) => {
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData();

    // In edit mode, always send the listing_id and skip category_id step dependency
    if (isEditMode) {
      formData.append("listing_id", listingId);
    } else {
      // formData.append("category_id", categoryId);
    }

    // formData.append("step", stepNumber);

    // if (!isEditMode && listingId) {
    //   formData.append("listing_id", listingId);
    // }

    switch (stepNumber) {
      case 1:
        formData.append("condition", adInfo.condition);
        formData.append("category_id", isEditMode ? editcategory : categoryId);
        formData.append("title", adInfo.title);
        formData.append("description", adInfo.description);

        if (adInfo.subcategoryId) {
          formData.append("sub_category_id", adInfo.subcategoryId);
        }

        // ===== Price handling =====
        formData.append("price_currency", adInfo.currency);

        if (adInfo.priceType === "amount") {
          formData.append("price_amount", adInfo.amount);
          formData.append("price_fixed", true);
          formData.append("price_negotiable", false);
          formData.append("price_free", false);
        }

        if (adInfo.priceType === "free") {
          formData.append("price_amount", 0);
          formData.append("price_fixed", false);
          formData.append("price_negotiable", false);
          formData.append("price_free", true);
        }

        if (adInfo.priceType === "contact_for_sale") {
          formData.append("price_amount", 0);
          formData.append("price_fixed", false);
          formData.append("price_negotiable", true);
          formData.append("price_free", false);
        }

        if (adInfo.priceType === "swap_trade") {
          formData.append("price_amount", 0);
          formData.append("price_fixed", false);
          formData.append("price_negotiable", true);
          formData.append("price_free", false);
        }

        // additional fields
        const formattedFields = Object.entries(additionalFieldsValues).map(
          ([id, val]) => ({
            field_id: id,
            value: val,
          }),
        );
        formData.append("additional_fields", JSON.stringify(formattedFields));

        break;
      case 2: {
        formData.append("step", stepNumber);

        const newImages = media.images.filter((img) => !img.isExisting);
        const existingImages = media.images.filter((img) => img.isExisting);

        console.log("STEP 2 DEBUG:", {
          newImages,
          existingImages,
        });

        // 🚨 EDIT MODE FIX (MOST IMPORTANT)
        if (isEditMode && newImages.length === 0 && existingImages.length > 0) {
          console.log("Skipping Step 2 API (only existing images)");

          setActiveStep(3);
          setIsSubmitting(false);
          return true;
        }

        // ❌ No images at all
        if (newImages.length === 0 && existingImages.length === 0) {
          setErrors({ images: "Please upload at least one image" });
          setIsSubmitting(false);
          return false;
        }

        // ✅ Upload only NEW images
        newImages.forEach((img) => {
          if (img.file) {
            formData.append("images", img.file);
          }
        });

        break;
      }

      case 3:
        formData.append("name", contact.name);
        formData.append("email", contact.email);
        // formData.append("step", stepNumber);
        formData.append("country_code", contact.countryCode);
        formData.append("mobile_number", contact.number);

        if (contact.altNumber) {
          formData.append("second_mobile_number", contact.altNumber);
        }

        formData.append("alt_country_code", contact.altCountryCode);
        formData.append("locality", contact.locality);
        formData.append("address", contact.address);
        formData.append("city_id", contact.cityId);

        break;
      case 4:
        // formData.append("listing_id", listingId);
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
      const response = await add_marketplace_listing({
        payload: formData,
        step: stepNumber,
        slug: slug,
        listingId: listingId,
      });

      console.log(`Step ${stepNumber} submitted:`, response);

      // if (!response?.success && response?.message) {
      //   alert(response?.message || "Error Occured");
      // }

      if (response?.errors && Object.keys(response.errors).length > 0) {
        const mappedErrors = mapApiErrorsToState(response.errors, stepNumber);
        setErrors(mappedErrors);

        const firstErrorKey = Object.keys(mappedErrors)[0];
        setTimeout(() => scrollToError(firstErrorKey), 100);

        setIsSubmitting(false);
        return false;
      }
      console.log("response of step 1 is :", response?.data);

      if (stepNumber == 1 && response?.data) {
        setListingId(response.data.id);
      }
      if (stepNumber == 1 && response?.data) {
        setSlug(response.data.slug);
      }

      if (stepNumber == 5) {
        clearSession();
        setShowSuccessPopup(true);
      } else {
        if (response?.data) {
          setActiveStep(stepNumber + 1);
        }
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
        alert(`Error submitting step ${stepNumber}. Please try again.`);
      }

      setIsSubmitting(false);
      return false;
    }
  };

  const handlePayment = async () => {
    try {
      if (!selectedPlanId) {
        setErrors({ plan: "Please select a plan" });
        return;
      }

      setIsSubmitting(true);

      const orderResponse = await create_order({
        plan_id: selectedPlanId,
        listing_id: listingId,
      });

      if (orderResponse.free_plan) {
        const formData = new FormData();
        formData.append("plan_id", selectedPlanId);

        const finalResponse = await add_marketplace_listing({
          payload: formData,
          step: 5,
          slug: slug,
          listingId: listingId,
        });
        console.log("MARKETPLACE FINAL RESPONSE", finalResponse);

        if (finalResponse?.status) {
          clearSession();
          setShowSuccessPopup(true);
        }
        setIsSubmitting(false);
        return;
      }

      const { payment_id, order_id, amount, currency, key } = orderResponse.data;

      const options = {
        key,
        amount,
        currency,
        name: "AddressGuru",
        description: "Marketplace Plan Purchase",
        order_id,
        handler: async function (response) {
          try {
            const verifyResponse = await verify_payment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: payment_id,
            });

            if (verifyResponse.success) {
              const formData = new FormData();
              formData.append("plan_id", selectedPlanId);

              const finalResponse = await add_marketplace_listing({
                payload: formData,
                step: 5,
                slug: slug,
                listingId: listingId,
              });

              if (finalResponse?.status) {
                clearSession();
                setShowSuccessPopup(true);
              }
            }
          } catch (error) {
            console.log("verify payment error", error);
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: contact?.name || "",
          email: contact?.email || "",
          contact: contact?.number || "",
        },
        theme: {
          color: "#FF6E04",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", function () {
        alert("Payment failed. Please try again.");
        setIsSubmitting(false);
      });
    } catch (error) {
      console.log("handlePayment error", error);
      alert("Something went wrong while initiating payment.");
      setIsSubmitting(false);
    }
  };
  const renderStepContent = () => {
    // Show loader while fetching edit data
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
            Loading listing data...
          </span>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <section className="space-y-4">
            {/* condition and category selection */}
            <div className="flex w-full items-center gap-2">
              <div
                ref={conditionRef}
                className={subSubCategories.length > 0 ? "w-1/2" : "w-full"}
              >
                <h4 className="font-semibold text-gray-500 mb-1">
                  Condition *
                </h4>

                <DropDown
                  placeholder="Select condition"
                  options={conditionOptions}
                  // Pass current value so dropdown shows pre-filled selection in edit mode
                  value={
                    adInfo.condition
                      ? conditionOptions.find(
                          (o) => o.value === adInfo.condition,
                        )
                      : null
                  }
                  onChange={(selected) =>
                    handleAdInfoChange("condition", selected.value)
                  }
                />

                {errors.condition && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.condition}
                  </p>
                )}
              </div>

              {subSubCategories.length > 0 && (
                <div className="w-1/2">
                  <h4 className="font-semibold text-gray-500 mb-1">
                    Sub Category *
                  </h4>

                  <DropDown
                    placeholder="Select Sub Category"
                    options={subSubCategories.map((item) => ({
                      value: item._id, // FIXED: use _id
                      label: item.name,
                    }))}
                    value={
                      adInfo.subcategoryId
                        ? subSubCategories
                            .map((item) => ({
                              value: item._id, // FIXED: use _id
                              label: item.name,
                            }))
                            .find((o) => o.value === adInfo.subcategoryId)
                        : null
                    }
                    onChange={(selected) =>
                      handleAdInfoChange("subcategoryId", selected.value)
                    }
                  />
                </div>
              )}
            </div>
            {errors.subcategoryId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subcategoryId}
              </p>
            )}

            <div ref={titleRef}>
              <InputWithTitle
                title={"Add Title "}
                required={true}
                value={adInfo.title}
                onChange={(e) => handleAdInfoChange("title", e.target.value)}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            <div ref={descriptionRef}>
              <InputWithTitle
                title={"Ad Description"}
                required={true}
                isTextarea={true}
                rows={5}
                maxLength={700}
                value={adInfo.description}
                onChange={(e) =>
                  handleAdInfoChange("description", e.target.value)
                }
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
            <div className="md:flex gap-3 w-full items-center">
              <div className="w-full">
                <h4 className="font-semibold text-gray-500 mb-1">
                  Price Type *
                </h4>
                <DropDown
                  placeholder="Select price type"
                  options={priceOptions}
                  value={
                    adInfo.priceType
                      ? priceOptions.find((o) => o.value === adInfo.priceType)
                      : null
                  }
                  onChange={(selected) =>
                    handleAdInfoChange("priceType", selected.value)
                  }
                />
              </div>
              {adInfo.priceType === "amount" && (
                <div className="w-full" ref={priceRef}>
                  <label className="text-black font-medium text-sm mb-1 block capitalize">
                    Amount <span className="text-red-600">*</span>
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-orange-500 focus-within:border-orange-500 transition-all">
                    {/* Currency Selector */}
                    <div className="relative group min-w-[80px]">
                      <select
                        value={adInfo.currency}
                        onChange={(e) =>
                          handleAdInfoChange("currency", e.target.value)
                        }
                        className="w-full h-full bg-gray-50 border-r border-gray-200 px-3 py-[9px] text-sm font-bold text-gray-700 outline-none cursor-pointer appearance-none hover:bg-gray-100 transition-colors"
                      >
                        {CURRENCY_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.value}
                          </option>
                        ))}
                      </select>
                      {/* Custom Arrow */}
                      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400 group-hover:text-gray-600">
                        <svg
                          className="w-4 h-4 fill-current"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>

                    {/* Amount Input */}
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter amount"
                      value={adInfo.amount}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9]/g, "");
                        handleAdInfoChange("amount", val);
                      }}
                      className="w-full px-4 py-2 text-sm font-medium outline-none placeholder:text-gray-400"
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                  )}
                </div>
              )}
            </div>
            {additionalFieldsList.length > 0 && (
              <AdditionalInfo
                additionalFields={additionalFieldsList}
                values={additionalFieldsValues}
                setValues={setAdditionalFieldsValues}
              />
            )}
          </section>
        );

      case 2:
        return (
          <section ref={imagesRef}>
            <ImageUploadSections
              media={media}
              setMedia={setMedia}
              error={errors}
              clearError={clearError}
              refs={{ imagesRef }}
              showLogo={false}
            />
          </section>
        );

      case 3:
        return (
          <>
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
          </>
        );

      case 4:
        return (
          <SearchEngine
            seo={seo}
            business={{
              name: adInfo.title,
              description: adInfo.description,
              address: contact.locality + ", " + contact.address,
            }}
            setSeo={setSeo}
            error={errors}
            clearError={clearError}
            refs={{ seoTitleRef, seoDescriptionRef }}
          />
        );

      case 5:
        return (
          <section className="w-full" ref={planRef}>
            <div className=" text-center">
              <PricingTable
                plans={plans}
                selectedPlanId={selectedPlanId}
                setSelectedPlanId={setSelectedPlanId}
                onSelect={() => {
                  setErrors((prev) => ({ ...prev, plan: "" }));
                }}
                title="Marketplace Ad Plans"
                subTitle="Reach more buyers with our marketplace promotion plans"
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
            <Navbar />
            {/* Auto-save indicator (non-edit mode only) */}
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
            {/* Edit mode indicator */}
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
            {currentStep == 5 ? (
              <div> </div>
            ) : (
              <div className="md:w-[420px] mx-2 h-fit shadow-md mt-7 bg-[#FFF8F3] p-3 rounded-xl text-sm">
                <div className="w-full">
                  <h6 className="font-extrabold text-base my-2">
                    Posting Tips
                  </h6>
                  <p>
                    <strong>Condition: </strong>Select whether your item is new
                    or used.
                    <br />
                    <strong>Title: </strong>Create a clear, descriptive title
                    for your ad.
                    <br />
                    <strong>Description: </strong>Provide detailed information
                    about your item.
                    <br />
                    <strong>Price: </strong>Set a fair price or choose
                    alternative options.
                    <br />
                    <strong>Images: </strong>Upload clear photos showing your
                    item from multiple angles.
                    <br />
                    <strong>Contact: </strong>Provide accurate contact
                    information for buyers to reach you.
                    <br />
                    <strong>SEO: </strong>Optimize your listing with relevant
                    keywords for better visibility.
                  </p>
                </div>
              </div>
            )}
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
                  if (currentStep === 5) {
                    await handlePayment();
                  } else {
                    await handleStepSubmit(currentStep);
                  }
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
            autoRedirect={true}
          />
          <Footer />
        </section>
      </div>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
    </>
  );
};

export default MarketPlaceListing;
