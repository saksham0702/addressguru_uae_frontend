import React, { useRef, useState } from "react";
import Image from "next/image";
import InputWithSvg from "../InputWithSvg";
import { query } from "@/api/queries";
import ResponseAlert from "@/components/ResponseAlert";
import ReCAPTCHA from "react-google-recaptcha";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const GetMoreInfo = ({
  setEnquirePop,
  name,
  type,
  id,
  slug,
  isPop,
  address,
  image, // Can be a single image URL or array of URLs
  logo,
}) => {
  const recaptchaRef = useRef(null);

  // Handle both single image and array of images
  const images = Array.isArray(image) ? image : image ? [image] : [];

  const [res, setRes] = useState(null);
  const [errors, setErrors] = useState({});
  const [infoQuery, setInfoQuery] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formData, setFormData] = useState({
    captchaVerified: false,
  });

  const handleCaptchaChange = (value) => {
    if (value) {
      setFormData((prev) => ({ ...prev, captchaVerified: true }));
      if (errors?.captcha) {
        setErrors((prev) => ({ ...prev, captcha: "" }));
      }
    }
  };

  const handleCaptchaExpired = () => {
    setFormData((prev) => ({ ...prev, captchaVerified: false }));
    setErrors((prev) => ({
      ...prev,
      captcha: "Captcha expired, please verify again",
    }));
  };

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name should only contain letters";
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return "Phone number is required";
    if (!/^\d+$/.test(phone)) return "Phone number should only contain digits";
    if (phone.length < 10) return "Phone number must be at least 10 digits";
    if (phone.length > 15) return "Phone number is too long";
    return "";
  };

  const validateMessage = (message) => {
    if (!message.trim()) return "Message is required";
    if (message.trim().length < 10)
      return "Message must be at least 10 characters";
    return "";
  };

  // Handle field changes with validation
  const handleFieldChange = (field, value) => {
    setInfoQuery({ ...infoQuery, [field]: value });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = {
      name: validateName(infoQuery.name),
      email: validateEmail(infoQuery.email),
      phone: validatePhone(infoQuery.phone),
      message: validateMessage(infoQuery.message),
    };

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const sendEnquiry = async () => {
    console.log("i am hit ");
    // Validate before submitting
    if (!validateAllFields()) {
      return;
    }

    if (!formData.captchaVerified) {
      setErrors((prev) => ({
        ...prev,
        captcha: "Please verify you are not a robot",
      }));
      return;
    }

    const payload = {
      fullName: infoQuery.name,
      email: infoQuery.email,
      mobileNumber: infoQuery.phone,
      message: infoQuery.message,
    };

    // Map "listing" type to "business" for backend resolver
    const listingType = type === "listing" ? "business" : type;

    try {
      const res = await query(listingType, slug, payload);
      console.log("response of query in frontend", res);
      setRes(res?.message || "Enquiry sent successfully!");

      // Reset form
      setInfoQuery({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setFormData((prev) => ({ ...prev, captchaVerified: false }));
      // Reset reCAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } catch (error) {
      console.error("Enquiry error:", error);
      alert(error?.message || "Failed to send enquiry. Please try again.");
    }
  };

  return (
    <div
      className={`bg-white w-full pb-6 md:min-w-[400px] min-w-[340px] border border-gray-100 border-b-4 border-b-orange-500 relative rounded-xl shadow-md overflow-hidden ${isPop ? "pt-0" : "pt-4"}`}
    >
      {isPop ? (
        <div className="flex flex-col md:flex-row w-full">
          {/* Close Button */}
          <button
            onClick={() => setEnquirePop(false)}
            className="absolute top-3 right-3 z-20 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-lg transition-all hover:scale-110 active:scale-95 group"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
          </button>

          {/* LEFT SIDE */}
          <div className="md:w-[40%] w-full border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-between bg-gradient-to-b from-gray-50 to-white">
            <div className="p-5 flex flex-col items-center md:items-start text-center md:text-left">
              {/* Logo */}
              {logo && (
                <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-orange-100 bg-white mb-4 shadow-sm">
                  <Image
                    src={logo}
                    alt={name}
                    width={200}
                    height={200}
                    className="object-contain w-full h-full"
                  />
                </div>
              )}

              {/* Name */}
              <h2 className="font-semibold text-[18px] text-gray-900 leading-tight">
                {name}
              </h2>

              {/* Address */}
              {address && (
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {address}
                </p>
              )}

              {/* Enquiry Info */}
              <div className="mt-5 w-full bg-orange-50 border border-orange-100 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  You are enquiring about{" "}
                  <span className="font-semibold text-orange-600">{name}</span>.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Fill the form and we will connect you shortly.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (FORM) */}
          <div className="md:w-[60%] w-full flex flex-col">
            {/* Header */}
            <div className="p-4 pb-3 bg-gradient-to-b from-orange-50 to-white border-b border-orange-100">
              <h3 className="font-semibold text-[16px] text-gray-900 flex items-center justify-center gap-2">
                <span className="text-orange-500">✉️</span> Send an Enquiry
              </h3>
            </div>

            {/* Form */}
            <div className="px-4 md:px-5 py-4 overflow-y-auto max-h-[500px] md:max-h-none">
              <div className="flex flex-col gap-3 text-[#323232]">
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={infoQuery.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-all ${
                      errors.name
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1.5">
                      ⚠️ {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={infoQuery.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-all ${
                      errors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5">
                      ⚠️ {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={infoQuery.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    placeholder="10-15 digit mobile number"
                    className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-all ${
                      errors.phone
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1.5">
                      ⚠️ {errors.phone}
                    </p>
                  )}
                </div>

                {/* Message (AUTO-FILLED) */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={
                      infoQuery.message ||
                      `I want to enquire about ${name}. Please share more details.`
                    }
                    onChange={(e) =>
                      handleFieldChange("message", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg text-sm h-24 resize-none transition-all ${
                      errors.message
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1.5">
                      ⚠️ {errors.message}
                    </p>
                  )}
                </div>

                {/* CAPTCHA */}
                <div className="flex justify-center md:justify-start">
                  <div className="scale-[0.85] origin-left md:scale-100">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey="6Lfw3xcsAAAAAP94VC18dOlxvN93hwgBcqpdRWTT"
                      onChange={handleCaptchaChange}
                      onExpired={handleCaptchaExpired}
                    />
                  </div>
                </div>
                {errors?.captcha && (
                  <p className="text-red-500 text-xs -mt-2">
                    ⚠️ {errors?.captcha}
                  </p>
                )}

                {/* Submit */}
                <button
                  onClick={sendEnquiry}
                  className="w-full bg-gradient-to-r from-[#FF6E04] to-[#FF5504] rounded-lg text-white font-semibold py-3.5 hover:shadow-lg hover:shadow-orange-200 active:scale-[0.98] transition-all"
                >
                  Send Enquiry →
                </button>

                {/* Success */}
                {res && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 text-sm">✓ {res}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* NORMAL CARD VIEW (non-popup) - Keep as is */}
          <h3 className="font-semibold text-[15px] max-md:text-[13px] text-center mb-3 px-3 mt-4">
            Get More Information From{" "}
            <strong className="text-[#FF6E04]">{name}</strong>
          </h3>

          <div className="px-4 md:px-5">
            <div className="px-4 md:px-5 flex flex-col gap-3 mt-2 text-[#323232]">
              {/* Name */}
              <div>
                <input
                  value={infoQuery.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  placeholder="Full Name"
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-200 focus:border-orange-500"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  value={infoQuery.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  placeholder="Email"
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-200 focus:border-orange-500"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <input
                  value={infoQuery.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  placeholder="Mobile Number"
                  className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors ${
                    errors.phone
                      ? "border-red-500"
                      : "border-gray-200 focus:border-orange-500"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <textarea
                  value={infoQuery.message}
                  onChange={(e) => handleFieldChange("message", e.target.value)}
                  placeholder="Type Your Message..."
                  className={`w-full px-3 py-2 border rounded-lg text-sm h-20 resize-none ${
                    errors.message
                      ? "border-red-500"
                      : "border-[#E0E3E5] focus:border-orange-500"
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              {/* CAPTCHA */}
              <div className="scale-[0.85] origin-left md:scale-100">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6Lfw3xcsAAAAAP94VC18dOlxvN93hwgBcqpdRWTT"
                  onChange={handleCaptchaChange}
                  onExpired={handleCaptchaExpired}
                />
                {errors?.captcha && (
                  <p className="text-red-500 text-sm mt-2">{errors?.captcha}</p>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={sendEnquiry}
                className="w-full bg-[#FF6E04] rounded-md text-white font-semibold py-3.5 md:py-3 hover:bg-[#FF5504] active:scale-[0.98] transition-all"
              >
                Send Enquiry
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GetMoreInfo;
