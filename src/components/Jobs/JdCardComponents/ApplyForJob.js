import React, { useEffect, useRef, useState } from "react";
import InputWithSvg from "@/components/InputWithSvg";
import gsap from "gsap";
import { apply_for_job } from "@/api/uae-job-listing";
import {
  CheckCircle,
  ArrowRight,
  X,
  Mail,
  Phone,
  User,
  Briefcase,
  Award,
} from "lucide-react";
import Link from "next/link";

const ApplyForJob = ({ highlight, setHighlight, slug }) => {
  const jobSlug = slug;
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [jobQuery, setJobQuery] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    skills: "",
    message: "",
  });

  const validate = () => {
    let newErrors = {};
    if (!jobQuery.name) newErrors.name = "Full name is required";
    if (!jobQuery.email || !/\S+@\S+\.\S+/.test(jobQuery.email))
      newErrors.email = "Valid email is required";
    if (!jobQuery.phone) newErrors.phone = "Phone number is required";
    if (!jobQuery.experience) newErrors.experience = "Experience is required";
    if (!jobQuery.skills) newErrors.skills = "Enter at least one skill";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setJobQuery({ ...jobQuery, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const payload = {
      fullName: jobQuery.name,
      email: jobQuery.email,
      phone: jobQuery.phone,
      totalExperience: jobQuery.experience,
      skills: jobQuery.skills,
      message: jobQuery.message,
    };

    try {
      const res = await apply_for_job(jobSlug, payload);
      if (res?.status === true || res?.success === true) {
        setShowSuccess(true);
        setJobQuery({
          name: "",
          email: "",
          phone: "",
          experience: "",
          skills: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Apply error:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerRef = useRef(null);

  useEffect(() => {
    if (highlight && containerRef.current) {
      gsap.to(containerRef.current, {
        keyframes: [{ scale: 1.05 }, { scale: 1 }],
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => setHighlight(false),
      });
    }
  }, [highlight, setHighlight]);

  return (
    <div
      ref={containerRef}
      className="p-6 sm:p-8 bg-white h-full border border-gray-100 rounded-3xl relative overflow-hidden"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Apply for Position
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Submit your details to start your application
          </p>
        </div>

        <div className="space-y-4">
          <FormInput
            label="Full Name"
            placeholder="John Doe"
            value={jobQuery.name}
            onChange={(v) => handleFieldChange("name", v)}
            error={errors.name}
            icon={<User className="w-4 h-4" />}
          />
          <FormInput
            label="Email Address"
            placeholder="john@example.com"
            value={jobQuery.email}
            onChange={(v) => handleFieldChange("email", v)}
            error={errors.email}
            icon={<Mail className="w-4 h-4" />}
          />
          <FormInput
            label="Phone Number"
            placeholder="+971 XXX XXXX"
            value={jobQuery.phone}
            onChange={(v) => handleFieldChange("phone", v)}
            error={errors.phone}
            icon={<Phone className="w-4 h-4" />}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Exp (Years)"
              placeholder="2"
              value={jobQuery.experience}
              onChange={(v) => handleFieldChange("experience", v)}
              error={errors.experience}
              icon={<Briefcase className="w-4 h-4" />}
            />
            <FormInput
              label="Top Skills"
              placeholder="React, Figma"
              value={jobQuery.skills}
              onChange={(v) => handleFieldChange("skills", v)}
              error={errors.skills}
              icon={<Award className="w-4 h-4" />}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase ml-1">
              Message to Recruiter
            </label>
            <textarea
              value={jobQuery.message}
              onChange={(e) => handleFieldChange("message", e.target.value)}
              placeholder="Tell us why you are a good fit..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm min-h-[100px] resize-none focus:bg-white focus:border-[#FF6E04] focus:ring-4 focus:ring-orange-500/5 outline-none transition-all"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-gray-900 hover:bg-[#FF6E04] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-black/5 hover:shadow-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                Confirm Application
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Branded Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] max-w-lg w-full p-8 sm:p-12 text-center relative overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-[#FF6E04] to-rose-500" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-50 rounded-full blur-3xl opacity-50" />

            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce transition-all duration-1000">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>

            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
              Application <br />{" "}
              <span className="text-[#FF6E04]">Sent Successfully!</span>
            </h3>

            <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">
              We&apos;ve received your application. The hiring team will review
              it and get back to you shortly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/dashboard"
                className="px-6 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => setShowSuccess(false)}
                className="px-6 py-4 border-2 border-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all"
              >
                Back to Job
              </button>
            </div>

            <p className="mt-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
              Verified by AddressGuru UAE
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const FormInput = ({ label, value, onChange, placeholder, error, icon }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-gray-700 uppercase ml-1">
      {label}
    </label>
    <div className="relative group">
      <div
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF6E04] transition-colors ${error ? "text-red-400" : ""}`}
      >
        {icon}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-2xl text-sm focus:bg-white focus:ring-4 outline-none transition-all ${
          error
            ? "border-red-500 ring-red-500/5 focus:ring-red-500/5"
            : "border-gray-100 focus:border-[#FF6E04] ring-orange-500/5 focus:ring-orange-500/5"
        }`}
      />
    </div>
    {error && (
      <p className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tight">
        {error}
      </p>
    )}
  </div>
);

export default ApplyForJob;
