import React, { useState, useRef } from "react";
import { Star, X } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { rate_us } from "@/api/queries";

const RateUs = ({ onClose, id, type, setType, setThanksPop }) => {
  const recaptchaRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    review: "",
    captchaVerified: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleStarClick = (index) => {
    setRating(index);
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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

  const validateForm = () => {
    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.captchaVerified) {
      newErrors.captcha = "Please verify you are not a robot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      rating: rating,
      name: formData.fullName,
      email: formData.email,
      message: formData.review || null,
    };

    try {
      const res = await rate_us(type, id, payload);
      console.log(res);

      // Reset form
      setType("rate");
      setThanksPop(true);
      setRating(0);
      setFormData({
        fullName: "",
        email: "",
        review: "",
        captchaVerified: false,
      });
      setErrors({});

      // Reset reCAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }

      // Close modal after successful submission
      onClose();
    } catch (error) {
      alert("Failed to submit rating. Please try again.");
      console.error("Rating submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setFormData({
      fullName: "",
      email: "",
      review: "",
      captchaVerified: false,
    });
    setErrors({});

    // Reset reCAPTCHA
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }

    onClose();
  };

  return (
    <div className="max-w-140 min-w-sm  w-full bg-white rounded-xl shadow-lg p-6 relative">
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <h2 className="text-xl font-bold text-orange-600 mb-1 text-center">
        Rate Us
      </h2>
      <p className="text-sm text-gray-500 mb-3 text-center">
        Share your experience with us
      </p>

      <div className="flex justify-center gap-2 mb-2">
        {[1, 2, 3, 4, 5].map((index) => (
          <button
            key={index}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => setHoveredRating(index)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none transition-transform hover:scale-110"
            disabled={isSubmitting}
          >
            <Star
              className={`w-8 h-8 ${
                index <= (hoveredRating || rating)
                  ? "fill-orange-500 text-orange-500"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
      {errors.rating && (
        <p className="text-red-500 text-sm text-center mb-3">{errors.rating}</p>
      )}

      <div className="space-y-3 mt-5">
        <div>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name *"
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border-2 ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm`}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address *"
            disabled={isSubmitting}
            className={`w-full px-3 py-2 border-2 ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            placeholder="Write your review"
            rows="3"
            disabled={isSubmitting}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none text-sm"
          />
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

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-2.5 rounded-lg font-semibold transition-colors shadow-md ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-orange-600 hover:bg-orange-700 text-white"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Rate Us"}
        </button>
      </div>
    </div>
  );
};

export default RateUs;
