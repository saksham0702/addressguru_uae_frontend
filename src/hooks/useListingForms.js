import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { add_listings, get_listing_data } from "@/api/listing-form";
import { get_plans } from "@/api/plans";
import { getBusinessFeatures } from "@/api/uaeAdminCategories";
import { saveToSession, getFromSession, clearSession } from "@/utils/sessionStorage";

const DEFAULT_SCHEDULE = {
  Monday:    { is_open: "1", open_time: "09:00", close_time: "20:00" },
  Tuesday:   { is_open: "1", open_time: "09:00", close_time: "20:00" },
  Wednesday: { is_open: "1", open_time: "09:00", close_time: "20:00" },
  Thursday:  { is_open: "1", open_time: "09:00", close_time: "20:00" },
  Friday:    { is_open: "1", open_time: "09:00", close_time: "20:00" },
  Saturday:  { is_open: null, open_time: null, close_time: null },
  Sunday:    { is_open: null, open_time: null, close_time: null },
};

const INITIAL_STEPS = [
  { step: 1, title: "Business Information",   description: "Update your business details & info",        active: true,  completed: false },
  { step: 2, title: "Social Details",         description: "Add links of your social profiles",          active: false, completed: false },
  { step: 3, title: "Contact Details",        description: "Add your contact details for buyers",        active: false, completed: false },
  { step: 4, title: "Search Engine Friendly", description: "Update SEO friendly keywords & description", active: false, completed: false },
  { step: 5, title: "Upload Images",          description: "Upload relevant images of your business",    active: false, completed: false },
  { step: 6, title: "Payment",                description: "Proceed for payment",                        active: false, completed: false },
];

// ─── Validation ───────────────────────────────────────────────────────────────

function validateStep(step, {
  business, contact, seo, media, selectedPlanId,
  facility, service, courses,
  selectedFacilities, selectedServices, selectedCourses,
}) {
  const errors = {};

  if (step === 1) {
    if (!business.name?.trim())        errors.businessName        = "Business name is required";
    if (!business.address?.trim())     errors.businessAddress     = "Business address is required";
    if (!business.description?.trim()) errors.businessDescription = "Description is required";
    if (facility.length > 0 && selectedFacilities.length === 0) errors.facilities = "Please select at least one facility";
    if (service.length  > 0 && selectedServices.length  === 0) errors.services   = "Please select at least one service";
    if (courses.length  > 0 && selectedCourses.length   === 0) errors.courses    = "Please select at least one course";
  }

  if (step === 3) {
    if (!contact.name?.trim())              errors.contactName   = "Contact name is required";
    if (!contact.email?.trim())             errors.contactEmail  = "Email is required";
    if (!contact.number?.toString().trim()) errors.contactNumber = "Mobile number is required";
    if (!contact.cityId)                    errors.contactCity   = "City is required";
  }

  if (step === 4) {
    if (!seo.title?.trim())           errors.seoTitle       = "SEO title is required";
    else if (seo.title.length < 2)    errors.seoTitle       = "Title must be at least 2 characters";
    if (!seo.description?.trim())     errors.seoDescription = "SEO description is required";
    else if (seo.description.length < 10) errors.seoDescription = "Description must be at least 10 characters";
  }

  if (step === 5) {
    if (!media.logo)                                                    errors.logo   = "Logo image is required";
    else if (media.logo.size > 2 * 1024 * 1024)                        errors.logo   = "Logo size must not exceed 2MB";
    if (media.images.length === 0)                                      errors.images = "Please upload at least one image";
    else if (media.images.some(img => img.size > 2 * 1024 * 1024))     errors.images = "Each image must be less than 2MB";
  }

  if (step === 6) {
    if (!selectedPlanId) errors.plan = "Please select a plan";
  }

  return errors;
}

// ─── FormData builder ─────────────────────────────────────────────────────────

function buildPayload(step, state) {
  const {
    business, social, contact, seo, media, schedule,
    selectedFacilities, selectedServices, selectedCourses,
    selectedPayment, selectedPlanId,
    additionalFields, categoryId,
  } = state;

  const fd = new FormData();
  fd.append("category_id", categoryId);

  if (step === 1) {
    fd.append("business_name",    business.name);
    fd.append("business_address", business.address);
    fd.append("ad_description",   business.description);
    if (business.establishmentYear) fd.append("establishment_year", business.establishmentYear);
    fd.append("uen_number", business.uenNumber || "");
    selectedFacilities.forEach(id => fd.append("facilities[]", id));
    selectedServices.forEach(id   => fd.append("services[]",   id));
    selectedCourses.forEach(id    => fd.append("courses[]",    id));
    selectedPayment.forEach(id    => fd.append("payments[]",   id));
    fd.append("hours", JSON.stringify(schedule));
    const formatted = Object.entries(additionalFields || {}).map(([fieldId, value]) => ({
      field_id: fieldId,
      value: Array.isArray(value)
        ? value.filter(v => typeof v === "string" && v.trim() !== "")
        : value,
    }));
    fd.append("additional_fields", JSON.stringify(formatted));
  }

  if (step === 2) {
    fd.append("website_link", social.websiteLink || "");
    fd.append("video_link",   social.videoLink   || "");
    fd.append("facebook",     social.facebook    || "");
    fd.append("instagram",    social.instagram   || "");
    fd.append("twitter",      social.twitter     || "");
    fd.append("linkedin",     social.linkedin    || "");
    fd.append("youtube",      social.youtube     || "");
  }

  if (step === 3) {
    fd.append("name",                 contact.name);
    fd.append("email",                contact.email);
    fd.append("country_code",         contact.countryCode);
    fd.append("alt_country_code",     contact.altCountryCode);
    fd.append("mobile_number",        contact.number);
    if (contact.altNumber) fd.append("second_mobile_number", contact.altNumber);
    fd.append("city_id",  contact.cityId);
    fd.append("locality", contact.locality || "");
  }

  if (step === 4) {
    fd.append("seo_title",       seo.title);
    fd.append("seo_description", seo.description);
  }

  if (step === 5) {
    if (media.logo) {
      media.logo.isExisting
        ? fd.append("existing_logo", media.logo.preview)
        : fd.append("logo", media.logo.file);
    }
    media.images.filter(i =>  i.isExisting).forEach(i => fd.append("images", i.preview));
    media.images.filter(i => !i.isExisting).forEach(i => fd.append("images", i.file));
  }

  if (step === 6) {
    fd.append("plan_id", selectedPlanId);
  }

  return fd;
}

// ─── API error key mapper ─────────────────────────────────────────────────────

const API_ERROR_MAP = {
  1: {
    business_name:    "businessName",
    business_address: "businessAddress",
    ad_description:   "businessDescription",
    establishment_year: "establishmentYear",
    uen_number:       "uenNumber",
    facilities:       "facilities",
    services:         "services",
    courses:          "courses",
  },
  2: {
    website_link: "websiteLink",
    video_link:   "videoLink",
  },
  3: {
    name:                 "contactName",
    email:                "contactEmail",
    mobile_number:        "contactNumber",
    second_mobile_number: "contactAltNumber",
    city:                 "contactCity",
    locality:             "contactLandmark",
  },
  4: {
    seo_title:       "seoTitle",
    seo_description: "seoDescription",
  },
  5: {
    logo:   "logo",
    images: "images",
  },
  6: {
    plan_id: "plan",
  },
};

function mapApiErrors(apiErrors, step) {
  const map = API_ERROR_MAP[step] || {};
  return Object.fromEntries(
    Object.entries(apiErrors).map(([key, val]) => [
      map[key] || key,
      Array.isArray(val) ? val[0] : val,
    ])
  );
}

// ─── Main hook ────────────────────────────────────────────────────────────────

export function useListingForm({ categoryId, name: listingSlugName }) {
  const router = useRouter();

  // ── Form state ───────────────────────────────────────────────────────────
  const [business, setBusiness] = useState({
    name: "", address: "", description: "", establishmentYear: "", uenNumber: "",
  });
  const [social, setSocial] = useState({
    websiteLink: "", videoLink: "", facebook: "", instagram: "", twitter: "", linkedin: "", youtube: "",
  });
  const [contact, setContact] = useState({
    name: "", email: "", number: "", countryCode: "+971", altCountryCode: "+971",
    altNumber: "", city: "", cityId: "", landmark: "", locality: "",
  });
  const [seo,      setSeo]      = useState({ title: "", description: "" });
  const [media,    setMedia]    = useState({ logo: null, images: [] });
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [additionalFields, setAdditionalFields] = useState({});

  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedServices,   setSelectedServices]   = useState([]);
  const [selectedCourses,    setSelectedCourses]    = useState([]);
  const [selectedPayment,    setSelectedPayment]    = useState([]);
  const [selectedPlanId,     setSelectedPlanId]     = useState(null);

  // ── API data ─────────────────────────────────────────────────────────────
  const [plans,              setPlans]             = useState(null);
  const [facility,           setFacility]          = useState([]);
  const [service,            setService]           = useState([]);
  const [courses,            setCourses]           = useState([]);
  const [payment,            setPayment]           = useState([]);
  const [additionalFieldDefs, setAdditionalFieldDefs] = useState([]); // renamed from additional_fields for clarity
  const [existingData,       setExistingData]      = useState(null);
  const [isInitialized,      setIsInitialized]     = useState(false);

  // ── Wizard state ─────────────────────────────────────────────────────────
  const [steps,        setSteps]       = useState(INITIAL_STEPS);
  const [listingId,    setListingId]   = useState(null);
  const [slug,         setSlug]        = useState(null);
  const [errors,       setErrors]      = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError,  setGlobalError] = useState("");
  const [showSuccess,  setShowSuccess] = useState(false);

  // ── Mount guard — prevents save effects from firing before session loads ─
  const [isMounted, setIsMounted] = useState(false);

  // ── Refs — stable object, never recreated ────────────────────────────────
  // FIX 1: was a plain object literal inside render = new object every render.
  // Now a single useRef container so the reference is always the same object.
  const refsContainer = useRef({
    businessNameRef:        null,
    businessAddressRef:     null,
    businessDescriptionRef: null,
    establishmentYearRef:   null,
    uenNumberRef:           null,
    facilitiesRef:          null,
    servicesRef:            null,
    coursesRef:             null,
    websiteLinkRef:         null,
    videoLinkRef:           null,
    contactNameRef:         null,
    contactEmailRef:        null,
    contactNumberRef:       null,
    contactAltNumberRef:    null,
    contactCityRef:         null,
    contactLandmarkRef:     null,
    seoTitleRef:            null,
    seoDescriptionRef:      null,
    logoRef:                null,
    imagesRef:              null,
    planRef:                null,
  });
  const refs = refsContainer.current;

  // ── setActiveStep — defined FIRST so effects below can safely call it ────
  // FIX 2: was defined after the useEffects that called it. const arrows are
  // not hoisted so that caused a runtime crash. Now it lives at the top.
  const setActiveStep = (stepNumber) => {
    setSteps(prev => prev.map(s => ({
      ...s,
      active:    s.step === stepNumber,
      completed: s.step < stepNumber ? true : s.completed,
    })));
    saveToSession("currentStep", stepNumber);
  };

  // ── Session: load on mount ───────────────────────────────────────────────
  // FIX 3: skip session restore entirely in edit mode.
  // Before, session data from a previous add-listing session could overwrite
  // the API data fetched for the listing being edited.
  useEffect(() => {
    if (listingSlugName) {
      // edit mode — data comes from API, not session
      setIsMounted(true);
      return;
    }

    const s = getFromSession();
    if (s.business)           setBusiness(s.business);
    if (s.schedule)           setSchedule(s.schedule);
    if (s.social)             setSocial(s.social);
    if (s.contact)            setContact(s.contact);
    if (s.seo)                setSeo(s.seo);
    if (s.selectedFacilities) setSelectedFacilities(s.selectedFacilities);
    if (s.selectedServices)   setSelectedServices(s.selectedServices);
    if (s.selectedCourses)    setSelectedCourses(s.selectedCourses);
    if (s.selectedPayment)    setSelectedPayment(s.selectedPayment);
    if (s.selectedPlanId)     setSelectedPlanId(s.selectedPlanId);
    if (s.listingId)          setListingId(s.listingId);
    if (s.steps)              setSteps(s.steps);
    if (s.currentStep > 1)    setActiveStep(s.currentStep);

    setIsMounted(true);
  }, []);

  // ── Session: save on change ──────────────────────────────────────────────
  // FIX 4: all save effects are gated on isMounted.
  // Before, schedule and steps had no guard so they fired immediately on mount
  // with default values, overwriting whatever session had just restored.
  useEffect(() => { if (!isMounted) return; if (business.name || business.address || business.description) saveToSession("business", business); },    [isMounted, business]);
  useEffect(() => { if (!isMounted) return; saveToSession("schedule", schedule); },                                                                    [isMounted, schedule]);
  useEffect(() => { if (!isMounted) return; if (social.websiteLink || social.videoLink || social.facebook) saveToSession("social", social); },         [isMounted, social]);
  useEffect(() => { if (!isMounted) return; if (contact.name || contact.email || contact.number) saveToSession("contact", contact); },                 [isMounted, contact]);
  useEffect(() => { if (!isMounted) return; if (seo.title || seo.description) saveToSession("seo", seo); },                                            [isMounted, seo]);
  useEffect(() => { if (!isMounted) return; if (selectedFacilities.length > 0) saveToSession("selectedFacilities", selectedFacilities); },             [isMounted, selectedFacilities]);
  useEffect(() => { if (!isMounted) return; if (selectedServices.length > 0)   saveToSession("selectedServices",   selectedServices); },               [isMounted, selectedServices]);
  useEffect(() => { if (!isMounted) return; if (selectedCourses.length > 0)    saveToSession("selectedCourses",    selectedCourses); },                [isMounted, selectedCourses]);
  useEffect(() => { if (!isMounted) return; if (selectedPayment.length > 0)    saveToSession("selectedPayment",    selectedPayment); },                [isMounted, selectedPayment]);
  useEffect(() => { if (!isMounted) return; if (selectedPlanId)                saveToSession("selectedPlanId",     selectedPlanId); },                 [isMounted, selectedPlanId]);
  useEffect(() => { if (!isMounted) return; if (listingId)                     saveToSession("listingId",          listingId); },                      [isMounted, listingId]);
  useEffect(() => { if (!isMounted) return; saveToSession("steps", steps); },                                                                          [isMounted, steps]);

  // ── Session: clear on leave ──────────────────────────────────────────────
  useEffect(() => {
    const clear = () => clearSession();
    window.addEventListener("beforeunload", clear);
    router.events.on("routeChangeStart", clear);
    return () => {
      window.removeEventListener("beforeunload", clear);
      router.events.off("routeChangeStart", clear);
    };
  }, []);

  // ── Fetch plans ──────────────────────────────────────────────────────────
  useEffect(() => {
    get_plans()
      .then(res => setPlans(res?.data?.plans))
      .catch(console.error);
  }, []);

  // ── Fetch features by category ───────────────────────────────────────────
  useEffect(() => {
    if (!categoryId) return;
    getBusinessFeatures(categoryId)
      .then(res => {
        setFacility(res?.features?.facilities || []);
        setService(res?.features?.services    || []);
        setCourses(res?.features?.courses     || []);
        setPayment(res?.payment_modes         || []);
        setAdditionalFieldDefs(res?.additionalFields || []);
      })
      .catch(console.error);
  }, [categoryId]);

  // ── Fetch existing listing (edit mode) ───────────────────────────────────
  // FIX 5: removed listingSlugName from useCallback deps — it's passed as an
  // argument so it was never actually closed over. Stale dep = unnecessary recreation.
  const getListings = useCallback(async (name) => {
    try {
      const res = await get_listing_data(name);
      setExistingData(res?.data?.data);
    } catch (err) {
      console.error(err);
    }
  }, []); // no deps needed — only uses its argument + stable setter

  useEffect(() => {
    if (listingSlugName) getListings(listingSlugName);
  }, [listingSlugName, getListings]);

  // ── Map existing data into state (edit mode) ─────────────────────────────
  useEffect(() => {
    if (!existingData || !listingSlugName || isInitialized) return;

    setBusiness({
      name:              existingData.businessName    || "",
      address:           existingData.businessAddress || "",
      description:       existingData.description     || "",
      establishmentYear: existingData.establishedYear || "",
      uenNumber:         existingData.taxNumber       || "",
    });

    setContact({
      name:           existingData.contactPersonName      || "",
      email:          existingData.email                  || "",
      number:         existingData.mobileNumber           || "",
      altNumber:      existingData.alternateMobileNumber  || "",
      countryCode:    existingData.countryCode            || "+91",
      altCountryCode: existingData.altCountryCode         || "+91",
      city:           existingData.city?.name             || "",
      cityId:         existingData.city?._id              || "",
      locality:       existingData.locality               || "",
    });

    setSocial({
      websiteLink: existingData.socialLinks?.website   || "",
      videoLink:   existingData.socialLinks?.video     || "",
      facebook:    existingData.socialLinks?.facebook  || "",
      instagram:   existingData.socialLinks?.instagram || "",
      twitter:     existingData.socialLinks?.twitter   || "",
      linkedin:    existingData.socialLinks?.linkedin  || "",
      youtube:     existingData.socialLinks?.youtube   || "",
    });

    setSeo({
      title:       existingData.seo?.title       || "",
      description: existingData.seo?.description || "",
    });

    setSelectedFacilities(existingData.facilities?.map(f  => f._id) || []);
    setSelectedServices(existingData.services?.map(s    => s._id)   || []);
    setSelectedCourses(existingData.courses?.map(c      => c._id)   || []);
    setSelectedPayment(existingData.paymentModes?.map(p => p._id)   || []);

    setSchedule(existingData.workingHours || DEFAULT_SCHEDULE);

    setMedia({
      logo: existingData.logo
        ? { preview: existingData.logo, isExisting: true }
        : null,
      images: (existingData.images || []).map((img, i) => ({
        preview: img, isExisting: true, id: i,
      })),
    });

    setListingId(existingData._id);
    setSlug(existingData.slug);
    setIsInitialized(true);
  }, [existingData, listingSlugName]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const currentStep = steps.find(s => s.active)?.step || 1;

  const clearError = (key) => {
    setErrors(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const scrollToError = (key) => {
    // refs are plain DOM nodes now (callback ref pattern), not { current } objects
    const el = refs[`${key}Ref`];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => el.querySelector("input, textarea")?.focus(), 500);
  };

  // ── Step submit ──────────────────────────────────────────────────────────
  const handleStepSubmit = async (stepNumber) => {
    const validationErrors = validateStep(stepNumber, {
      business, contact, seo, media, selectedPlanId,
      facility, service, courses,
      selectedFacilities, selectedServices, selectedCourses,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTimeout(() => scrollToError(Object.keys(validationErrors)[0]), 100);
      return false;
    }

    setIsSubmitting(true);
    setErrors({});

    const formData = buildPayload(stepNumber, {
      business, social, contact, seo, media, schedule,
      selectedFacilities, selectedServices, selectedCourses,
      selectedPayment, selectedPlanId,
      additionalFields, categoryId,
    });

    try {
      const response = await add_listings(
        formData,
        stepNumber,
        slug,
        existingData?._id || listingId,
      );

      if (response?.errors && Object.keys(response.errors).length > 0) {
        const mapped = mapApiErrors(response.errors, stepNumber);
        setErrors(mapped);
        setTimeout(() => scrollToError(Object.keys(mapped)[0]), 100);
        setIsSubmitting(false);
        return false;
      }

      if (!response?.success && response?.message) {
        setGlobalError(response.message);
      }

      if (stepNumber === 1 && response?.data?.data?.id) {
        setListingId(response.data.data.id);
        setSlug(response.data.data.slug);
      }

      if (response?.data?.status === true) {
        setGlobalError("");
        setActiveStep(stepNumber + 1);
      }

      if (stepNumber === 6) {
        clearSession();
        setShowSuccess(true);
      }

      setIsSubmitting(false);
      return true;

    } catch (error) {
      if (error?.response?.data?.errors) {
        const mapped = mapApiErrors(error.response.data.errors, stepNumber);
        setErrors(mapped);
        setTimeout(() => scrollToError(Object.keys(mapped)[0]), 100);
      } else {
        setGlobalError("Something went wrong. Please try again.");
      }
      setIsSubmitting(false);
      return false;
    }
  };

  // ── Return ───────────────────────────────────────────────────────────────
  return {
    // form state
    business,  setBusiness,
    social,    setSocial,
    contact,   setContact,
    seo,       setSeo,
    media,     setMedia,
    schedule,  setSchedule,
    additionalFields,    setAdditionalFields,

    // selections
    selectedFacilities,  setSelectedFacilities,
    selectedServices,    setSelectedServices,
    selectedCourses,     setSelectedCourses,
    selectedPayment,     setSelectedPayment,
    selectedPlanId,      setSelectedPlanId,

    // api data
    plans,
    facility,
    service,
    courses,
    payment,
    additionalFieldDefs, // use this instead of additional_fields in your component

    // wizard
    steps,
    currentStep,
    setActiveStep,
    clearError,
    errors,
    isSubmitting,
    globalError,   setGlobalError,
    showSuccess,   setShowSuccess,
    slug,

    // refs — assign in JSX like: ref={el => refs.businessNameRef = el}
    refs,
    handleStepSubmit,
  };
}