import { useState, useRef } from "react";
import { X } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { claim_business } from "@/api/queries";

export const Claim = ({ onClose, type, id, setThanksPop, setType }) => {
  const recaptchaRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    reason: "",
    agreeTerms: false,
    captchaVerified: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }
    if (!formData.reason.trim())
      newErrors.reason = "Please provide a reason for ownership claim";
    if (!formData.agreeTerms)
      newErrors.agreeTerms = "You must agree to terms and conditions";
    if (!formData.captchaVerified)
      newErrors.captcha = "Please verify you are not a robot";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCaptchaChange = (value) => {
    if (value) {
      setFormData((prev) => ({ ...prev, captchaVerified: true }));
      if (errors.captcha) {
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

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);

      const payload = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.mobile,
        message: formData.reason,
      };

      try {
        const res = await claim_business(payload, type, id);
        console.log(res?.data);

        setFormData({
          fullName: "",
          email: "",
          mobile: "",
          reason: "",
          agreeTerms: false,
          captchaVerified: false,
        });

        // Reset reCAPTCHA
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }

        setThanksPop(true);
        setType("claim");
        onClose();
      } catch (error) {
        alert("Failed to submit claim. Please try again.");
        console.error("Claim submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isFormValid =
    formData.fullName &&
    formData.email &&
    formData.mobile &&
    formData.reason &&
    formData.agreeTerms &&
    formData.captchaVerified;

  return (
    <div className="relative max-w-120  w-full  bg-white rounded-2xl shadow-xl p-6">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="mb-2">
        <h2 className="text-lg font-bold border-b pb-3 border-gray-200 text-gray-800 mb-2">
          Claim This Business
        </h2>
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-[2px]">
            Full Name <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-1.5 border-1 ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-[2px]">
            Email Address <span className="text-orange-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-1.5 border-1 ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-[2px]">
            Mobile Number <span className="text-orange-500">*</span>
          </label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className={`w-full px-4 py-1.5 border-1 ${
              errors.mobile ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
            placeholder="1234567890"
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-[2px]">
            Reason for Ownership Claim{" "}
            <span className="text-orange-500">*</span>
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            className={`w-full px-4 py-1.5 border-1 ${
              errors.reason ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none`}
            placeholder="Please explain why you are claiming ownership of this business..."
          />
          {errors.reason && (
            <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
          )}
        </div>

        <div className="flex flex-col items-start">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6Lfw3xcsAAAAAP94VC18dOlxvN93hwgBcqpdRWTT"
            onChange={handleCaptchaChange}
            onExpired={handleCaptchaExpired}
            theme="light"
          />
          {errors.captcha && (
            <p className="text-red-500 text-sm mt-2">{errors.captcha}</p>
          )}
        </div>

        <div className="my-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-xs text-gray-700">
              I agree to the{" "}
              <span className="text-blue-600 font-semibold hover:underline">
                Terms and Conditions
              </span>{" "}
              and confirm that the information provided is accurate.{" "}
              <span className="text-orange-500">*</span>
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-red-500 text-sm mt-1">{errors.agreeTerms}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className={`w-full py-3 rounded-lg font-bold text-sm transition-all transform ${
            isFormValid && !isSubmitting
              ? "bg-blue-500 text-white hover:scale-[1.02] shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Claim Business"}
        </button>
      </div>
    </div>
  );
};

export default Claim;
