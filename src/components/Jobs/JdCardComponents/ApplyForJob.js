import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { apply_for_job } from "@/api/uae-job-listing";
import CountryCodePhoneInput from "@/components/shared/CountryCodePhoneInput";
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

const NAME_MAX_LENGTH = 50;
const PHONE_MAX_LENGTH = 10;

/* ─── tiny form input ─── */
const FormInput = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  icon,
  type = "text",
  name,
  autoComplete,
  maxLength,
  inputMode,
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
        name={name}
        autoComplete={autoComplete}
        maxLength={maxLength}
        inputMode={inputMode}
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
const ApplyForJob = ({ highlight, setHighlight, slug, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [countryCode, setCountryCode] = useState("+971");
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
    else if (jobQuery.name.trim().length > NAME_MAX_LENGTH)
      e.name = `Max ${NAME_MAX_LENGTH} characters`;

    if (!jobQuery.email || !/\S+@\S+\.\S+/.test(jobQuery.email))
      e.email = "Valid email required";

    if (!jobQuery.phone.trim()) e.phone = "Required";
    else if (jobQuery.phone.trim().length !== PHONE_MAX_LENGTH)
      e.phone = `Enter a valid ${PHONE_MAX_LENGTH}-digit number`;

    if (!jobQuery.experience.trim()) e.experience = "Required";
    if (!jobQuery.skills.trim()) e.skills = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setJobQuery((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Name: letters/spaces only, capped at NAME_MAX_LENGTH
  const handleNameChange = (value) => {
    const trimmed = value.slice(0, NAME_MAX_LENGTH);
    handleFieldChange("name", trimmed);
  };

  // Phone: digits only, capped at PHONE_MAX_LENGTH
  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value
      .replace(/\D/g, "")
      .slice(0, PHONE_MAX_LENGTH);
    handleFieldChange("phone", digitsOnly);
  };

  const handleExperienceChange = (value) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 2);
    handleFieldChange("experience", digitsOnly);
  };
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await apply_for_job(slug, {
        fullName: jobQuery.name,
        email: jobQuery.email,
        phone: `${countryCode}${jobQuery.phone}`,
        totalExperience: jobQuery.experience,
        skills: jobQuery.skills,
        message: jobQuery.message,
      });
      if (res?.status === true || res?.success === true) {
        if (onSuccess) onSuccess();
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
          name="fullName"
          autoComplete="name"
          maxLength={NAME_MAX_LENGTH}
          placeholder="Your full name"
          value={jobQuery.name}
          onChange={handleNameChange}
          error={errors.name}
          icon={<User className="w-4 h-4" />}
        />
        <FormInput
          label="Email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={jobQuery.email}
          onChange={(v) => handleFieldChange("email", v)}
          error={errors.email}
          icon={<Mail className="w-4 h-4" />}
          type="email"
        />

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wide">
            Phone
          </label>
          <CountryCodePhoneInput
            value={jobQuery.phone}
            onChange={handlePhoneChange}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            error={errors.phone}
            placeholder="Mobile number"
            variant="bordered"
            maxLength={PHONE_MAX_LENGTH}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Experience (yrs)"
            placeholder="e.g. 2"
            value={jobQuery.experience}
            onChange={handleExperienceChange}
            error={errors.experience}
            icon={<Briefcase className="w-4 h-4" />}
            inputMode="numeric"
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
    </div>
  );
};

export default ApplyForJob;
