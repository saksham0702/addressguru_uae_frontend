import React, { useEffect, useRef, useState } from "react";
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
  Loader2,
} from "lucide-react";

/* ─── tiny form input ─── */
const FormInput = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  icon,
  type = "text",
}) => (
  <div className="space-y-1">
    <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wide">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-9 pr-3 py-2.5 text-sm bg-zinc-50 border rounded-lg outline-none transition-all
          placeholder:text-zinc-300
          focus:bg-white focus:ring-2
          ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
              : "border-zinc-200 focus:border-[#FF6E04] focus:ring-amber-100"
          }`}
      />
    </div>
    {error && (
      <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wide">
        {error}
      </p>
    )}
  </div>
);

/* ─── main component ─── */
const ApplyForJob = ({ highlight, setHighlight, slug }) => {
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

  const containerRef = useRef(null);

  const validate = () => {
    const e = {};
    if (!jobQuery.name.trim()) e.name = "Required";
    if (!jobQuery.email || !/\S+@\S+\.\S+/.test(jobQuery.email))
      e.email = "Valid email required";
    if (!jobQuery.phone.trim()) e.phone = "Required";
    if (!jobQuery.experience.trim()) e.experience = "Required";
    if (!jobQuery.skills.trim()) e.skills = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setJobQuery((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await apply_for_job(slug, {
        fullName: jobQuery.name,
        email: jobQuery.email,
        phone: jobQuery.phone,
        totalExperience: jobQuery.experience,
        skills: jobQuery.skills,
        message: jobQuery.message,
      });
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
    } catch (err) {
      console.error("Apply error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (highlight && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { scale: 1 },
        {
          keyframes: [{ scale: 1.02 }, { scale: 1 }],
          duration: 0.35,
          ease: "power2.inOut",
          onComplete: () => setHighlight(false),
        },
      );
    }
  }, [highlight, setHighlight]);

  return (
    <div ref={containerRef} className="p-6">
      <div className="mb-5">
        <h2 className="text-base font-bold text-zinc-900">
          Apply for this Position
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Fill in your details and submit your application.
        </p>
      </div>

      <div className="space-y-3.5">
        <FormInput
          label="Full Name"
          placeholder="Your full name"
          value={jobQuery.name}
          onChange={(v) => handleFieldChange("name", v)}
          error={errors.name}
          icon={<User className="w-4 h-4" />}
        />
        <FormInput
          label="Email"
          placeholder="you@example.com"
          value={jobQuery.email}
          onChange={(v) => handleFieldChange("email", v)}
          error={errors.email}
          icon={<Mail className="w-4 h-4" />}
          type="email"
        />
        <FormInput
          label="Phone"
          placeholder="+971 50 000 0000"
          value={jobQuery.phone}
          onChange={(v) => handleFieldChange("phone", v)}
          error={errors.phone}
          icon={<Phone className="w-4 h-4" />}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Experience (yrs)"
            placeholder="e.g. 2"
            value={jobQuery.experience}
            onChange={(v) => handleFieldChange("experience", v)}
            error={errors.experience}
            icon={<Briefcase className="w-4 h-4" />}
          />
          <FormInput
            label="Top Skills"
            placeholder="React, SEO…"
            value={jobQuery.skills}
            onChange={(v) => handleFieldChange("skills", v)}
            error={errors.skills}
            icon={<Award className="w-4 h-4" />}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wide">
            Message (optional)
          </label>
          <textarea
            value={jobQuery.message}
            onChange={(e) => handleFieldChange("message", e.target.value)}
            placeholder="Why are you a good fit?"
            rows={3}
            className="w-full px-3 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg resize-none outline-none transition-all focus:bg-white focus:border-[#FF6E04] focus:ring-2 focus:ring-amber-100 placeholder:text-zinc-300"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 hover:bg-[#FF6E04] text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              Submit Application
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 text-center relative">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-[#FF6E04] rounded-t-2xl" />

            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>

            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>

            <h3 className="text-xl font-bold text-zinc-900 mb-2">
              Application Submitted
            </h3>
            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
              Your application has been received. The hiring team will review it
              and contact you shortly.
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              className="px-5 py-2.5 border border-zinc-200 text-zinc-700 text-sm font-semibold rounded-lg hover:bg-zinc-50 transition-colors"
            >
              Back to Job
            </button>

            <p className="mt-5 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
              Verified by AddressGuru UAE
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyForJob;
