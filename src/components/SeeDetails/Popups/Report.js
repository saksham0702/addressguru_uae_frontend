import React, { useState, useRef } from "react";
import { X, AlertTriangle } from "lucide-react";
import { report } from "@/api/queries";
import ReCAPTCHA from "react-google-recaptcha";

const Report = ({ onClose, id, type, setType, setThanksPop }) => {
  const recaptchaRef = useRef(null);

  const [selectedReason, setSelectedReason] = useState("");
  const [otherText, setOtherText] = useState("");
  const [formData, setFormData] = useState({
    captchaVerified: false,
    captchaToken: "",
  });

  const [errors, setErrors] = useState({});

  const reportReasons = [
    "Illegal/Fraudulent",
    "Spam Ad",
    "Duplicate Ad",
    "Ad is in the wrong category",
    "Against Posting Rules",
    "Adult Content",
    "Other",
  ];

  const handleRadioChange = (reason) => {
    setSelectedReason(reason);
    // Clear other text if switching away from "Other"
    if (reason !== "Other") {
      setOtherText("");
    }
  };

  const handleCaptchaChange = (value) => {
    if (value) {
      setFormData((prev) => ({
        ...prev,
        captchaVerified: true,
        captchaToken: value, // <-- store token
      }));

      if (errors.captcha) {
        setErrors((prev) => ({ ...prev, captcha: "" }));
      }
    }
  };

  const handleCaptchaExpired = () => {
    setFormData((prev) => ({
      ...prev,
      captchaVerified: false,
      captchaToken: "",
    }));

    setErrors((prev) => ({
      ...prev,
      captcha: "Captcha expired, please verify again",
    }));
  };

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert("Please select a reason for reporting!");
      return;
    }

    if (selectedReason === "Other" && !otherText.trim()) {
      alert("Please provide details for your report!");
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
      report: selectedReason === "Other" ? otherText.trim() : selectedReason,
      grc_response: formData.captchaToken, // <-- Send token here
    };

    try {
      const res = await report(type, id, payload);
      setType("report");
      setThanksPop(true);
      handleClose();
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setOtherText("");
    setFormData({
      captchaVerified: false,
    });
    setErrors({});

    setFormData({
      captchaVerified: false,
      captchaToken: "",
    });
    // Reset reCAPTCHA
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }

    onClose();
  };

  const isFormValid =
    selectedReason &&
    (selectedReason !== "Other" || otherText.trim()) &&
    formData.captchaVerified;

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 relative">
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center justify-center gap-2 mb-1">
        <AlertTriangle className="w-6 h-6 text-orange-500" />
        <h2 className="text-xl font-bold text-gray-800">Report Ad</h2>
      </div>
      <p className="text-sm text-gray-500 mb-3 text-center">
        Help us maintain quality by reporting issues
      </p>

      <div className="mb-2">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Select reason for reporting:
        </p>
        {reportReasons.map((reason) => (
          <div key={reason}>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors">
              <input
                type="radio"
                name="reportReason"
                checked={selectedReason === reason}
                onChange={() => handleRadioChange(reason)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-gray-700">
                {reason}
              </span>
            </label>

            {/* Show text input when "Other" is selected */}
            {reason === "Other" && selectedReason === "Other" && (
              <div className="ml-6 mt-2 mb-2">
                <textarea
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="Please describe the issue..."
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {otherText.length}/500 characters
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-start mb-4">
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

      <button
        onClick={handleSubmit}
        disabled={!isFormValid}
        className={`w-full py-2.5 rounded-lg font-semibold transition-colors shadow-md ${
          isFormValid
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Submit Report
      </button>
    </div>
  );
};

export default Report;
