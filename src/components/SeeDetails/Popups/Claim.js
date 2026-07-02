import { useState, useRef } from "react";
import { X, Upload, FileText, XCircle, CheckCircle, Info } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { claim_business } from "@/api/queries";
import RegistrationForm from "../../Register/RegistrationForm";
import OTPPopup from "../../Register/OTPPopup";

export const Claim = ({ onClose, type, id, slug, setThanksPop, setType }) => {
  const recaptchaRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    reason: "",
    agreeTerms: false,
    captchaVerified: false,
    idProofImage: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const [showRegister, setShowRegister] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");
  const [pop, setPop] = useState(false);
  const [userId, setUserId] = useState(null);

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

    if (!formData.idProofImage) {
      newErrors.idProofImage = "ID proof image is required";
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

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobileNumber", formData.mobile);
      formDataToSend.append("reasonForClaim", formData.reason);
      formDataToSend.append("idProofImage", formData.idProofImage);
      const listingType = type === "listing" ? "business" : type;

      try {
        setStatusMessage(null);
        const res = await claim_business(formDataToSend, listingType, slug);
        console.log(res);

        setFormData({
          fullName: "",
          email: "",
          mobile: "",
          reason: "",
          agreeTerms: false,
          captchaVerified: false,
          idProofImage: null,
        });

        // Reset reCAPTCHA
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }

        setThanksPop(true);
        setType("claim");
        onClose();
      } catch (error) {
        const errMsg = error?.message?.toLowerCase() || "";
        if (errMsg.includes("register")) {
          setRegisterMessage("Please register first to submit a claim.");
          setShowRegister(true);
        } else {
          setStatusMessage({
            type: "error",
            text: error?.message || "Failed to submit claim. Please try again.",
          });
        }
        console.error("Claim submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: "",
      email: "",
      mobile: "",
      reason: "",
      agreeTerms: false,
      captchaVerified: false,
      idProofImage: null,
    });
    setErrors({});
    setShowRegister(false);

    // Reset reCAPTCHA
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }

    onClose();
  };

  const isFormValid =
    formData.fullName &&
    formData.email &&
    formData.mobile &&
    formData.reason &&
    formData.agreeTerms &&
    formData.captchaVerified;

  return (
    <div className="relative max-w-2xl w-full bg-white rounded-2xl shadow-xl p-6 overflow-y-auto max-h-[95vh] custom-scrollbar">
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition z-50"
      >
        <X className="w-5 h-5" />
      </button>

      {showRegister ? (
        <div className="mt-2 text-center">
          <h2 className="text-xl font-bold text-orange-600 mb-2">
            {registerMessage}
          </h2>
          <div className="max-h-[70vh] overflow-y-auto p-1 custom-scrollbar">
            <RegistrationForm
              setPop={setPop}
              setUserId={setUserId}
              initialData={{
                name: formData.fullName,
                email: formData.email,
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-bold border-b pb-3 border-gray-200 text-gray-800">
              Claim This Business
            </h2>
          </div>

          {statusMessage && (
            <div
              className={`mb-6 p-4 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                statusMessage.type === "error"
                  ? "bg-red-50 border-red-100 text-red-700"
                  : statusMessage.type === "success"
                    ? "bg-green-50 border-green-100 text-green-700"
                    : "bg-blue-50 border-blue-100 text-blue-700"
              }`}
            >
              <div className="mt-0.5">
                {statusMessage.type === "error" ? (
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                ) : statusMessage.type === "success" ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <Info className="w-5 h-5 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm font-medium leading-relaxed">
                {statusMessage.text}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-1 ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address <span className="text-orange-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-1 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mobile Number <span className="text-orange-500">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className={`w-full px-4 py-2 border-1 ${
                  errors.mobile ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                placeholder="1234567890"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Reason for Ownership Claim{" "}
                <span className="text-orange-500">*</span>
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="3"
                className={`w-full px-4 py-2 border-1 ${
                  errors.reason ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none`}
                placeholder="Please explain why you are claiming ownership of this business..."
              />
              {errors.reason && (
                <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Upload ID Proof <span className="text-orange-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Please upload a valid identity proof (e.g., Driving License,
                Passport, Emirates ID). Max size: 200KB.
              </p>

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center py-4">
                  {formData.idProofImage ? (
                    <>
                      <FileText className="w-8 h-8 text-blue-500 mb-2" />
                      <p className="text-sm font-medium text-gray-700 truncate max-w-[250px]">
                        {formData.idProofImage.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Click to change file
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 font-medium text-center">
                        <span className="text-blue-600">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG, GIF (Max 200KB)
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  name="idProofImage"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (!file) return;

                    // ✅ 200KB validation (frontend only as you wanted)
                    if (file.size > 200 * 1024) {
                      setErrors((prev) => ({
                        ...prev,
                        idProofImage: "Image must be less than 200KB",
                      }));
                      return;
                    }

                    setFormData((prev) => ({
                      ...prev,
                      idProofImage: file,
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      idProofImage: "",
                    }));
                  }}
                />
              </label>

              {errors.idProofImage && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {errors.idProofImage}
                </p>
              )}
            </div>

            <div className="md:col-span-2 flex flex-col items-start">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6Lfw3xcsAAAAAP94VC18dOlxvN93hwgBcqpdRWTT"
                onChange={handleCaptchaChange}
                onExpired={handleCaptchaExpired}
                theme="light"
              />
              {errors?.captcha && (
                <p className="text-red-500 text-sm mt-2">{errors?.captcha}</p>
              )}
            </div>

            <div className="md:col-span-2 mb-2">
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

            <div className="md:col-span-2">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-3 rounded-lg font-bold text-sm transition-all transform ${
                  isFormValid && !isSubmitting
                    ? "bg-blue-500 text-white hover:scale-[1.01] shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Claim Business"}
              </button>
            </div>
          </div>
        </>
      )}

      {pop && (
        <OTPPopup
          setPop={setPop}
          userId={userId}
          onSuccess={() => {
            setShowRegister(false);
          }}
        />
      )}
    </div>
  );
};

export default Claim;
