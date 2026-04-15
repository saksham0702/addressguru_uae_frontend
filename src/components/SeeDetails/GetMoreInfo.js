import React, { useRef, useState } from "react";
import Image from "next/image";
import InputWithSvg from "../InputWithSvg";
import { query } from "@/api/queries";
import ResponseAlert from "@/components/ResponseAlert";
import ReCAPTCHA from "react-google-recaptcha";

const GetMoreInfo = ({ setEnquirePop, name, type, id, slug, isPop }) => {
  const recaptchaRef = useRef(null);

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
    <div className="bg-white w-full pt-4 pb-6 md:min-w-[400px] min-w-[340px] border border-gray-100 border-b-4 border-b-orange-500 relative rounded-xl shadow-md">
      {/* Close Button */}
      {isPop && (
        <button
          onClick={() => setEnquirePop(false)}
          className="absolute right-3 top-3 cursor-pointer z-10 w-7 h-7 flex items-center justify-center rounded-full border border-orange-400 text-orange-500 hover:bg-orange-50"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M1 1l10 10M11 1L1 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      {/* Title */}
      <h3 className="font-semibold text-[15px] mt-5 max-md:text-[13px] text-center mb-3 px-3">
        Get More Information From{" "}
        <strong className="text-[#FF6E04]">{name}</strong>
      </h3>

      {/* Form */}
      <div className="px-4 flex flex-col gap-3 text-[#323232]">
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
          {" "}
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
          className="w-full bg-[#FF6E04] rounded-md text-white font-semibold py-3 hover:bg-[#FF5504] active:scale-[0.98] transition-all"
        >
          Send Enquiry
        </button>
      </div>

      {/* Bottom Image (FIXED CLICK ISSUE) */}
      {/* <div className="absolute left-0 right-0 -bottom-14 pointer-events-none">
        <Image
          src="/assets/getBottom.png"
          alt="border"
          height={500}
          width={500}
          className="w-full h-28 object-cover"
        />
      </div> */}

      {/* Response */}
      {res && (
        <div className="mx-4 mt-2 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm text-center">
          {" "}
          {res}
        </div>
      )}
    </div>
  );
};

export default GetMoreInfo;
