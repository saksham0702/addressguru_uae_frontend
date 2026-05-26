import React, { useRef, useState, useEffect } from "react";
import { social_login } from "@/api/userAuth";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useGoogleLogin } from "@react-oauth/google";
import { user_register } from "@/api/uaeadminlogin";
import { FcGoogle } from "react-icons/fc";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa6";
import { COUNTRY_CODES } from "@/services/constants";

// ─────────────────────────────────────────────
// Reusable Input Component
// ─────────────────────────────────────────────
const FormInput = ({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full">
      <div
        className={`flex items-center bg-white border rounded-md text-sm transition-all duration-200
          ${error ? "border-red-400 ring-1 ring-red-200" : "border-gray-300 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-100"}`}
      >
        <span
          className={`pl-3 pr-2 flex-shrink-0 ${error ? "text-red-400" : "text-gray-400"}`}
        >
          {icon}
        </span>
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 py-2.5  bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="pr-3 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500 pl-1">{error}</p>}
    </div>
  );
};

// ─────────────────────────────────────────────
// Phone Input with Searchable Country Code
// ─────────────────────────────────────────────
const PhoneInput = ({
  value,
  onChange,
  countryCode,
  setCountryCode,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const triggerRef = useRef(null);
  const [dropUp, setDropUp] = useState(false);

  const selected =
    COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  const filtered = COUNTRY_CODES.filter(
    (c) =>
      c.code.includes(searchQuery) ||
      (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Detect if dropdown should open upward
  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropUp(spaceBelow < 260);
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-focus search
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  return (
    <div className="w-full">
      <div
        className={`flex items-center bg-white border rounded-md text-sm transition-all duration-200
          ${error ? "border-red-400 ring-1 ring-red-200" : "border-gray-300 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-100"}`}
      >
        {/* Phone icon */}
        <span
          className={`pl-3 pr-2 flex-shrink-0 ${error ? "text-red-400" : "text-gray-400"}`}
        >
          <FaPhone size={14} />
        </span>

        {/* Country selector */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 border-x border-gray-200 bg-gray-50 px-2.5 py-2.5 hover:bg-gray-100 transition-colors duration-150"
          >
            <span className="text-sm leading-none">{selected?.flag}</span>
            <span className="text-xs font-bold text-gray-700 tracking-tight">
              {countryCode}
            </span>
            <svg
              className={`w-2.5 h-2.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 10 6"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M1 1l4 4 4-4"
              />
            </svg>
          </button>

          {open && (
            <div
              className={`absolute left-0 z-[9999] w-60 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden
                ${dropUp ? "bottom-full mb-1" : "top-full mt-1"}`}
            >
              <div className="p-2 border-b border-gray-100">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search country or code..."
                  className="w-full text-xs px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:border-orange-400 placeholder:text-gray-400 bg-gray-50"
                />
              </div>
              <ul className="max-h-44 overflow-y-auto divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <li className="px-4 py-3 text-xs text-gray-400 text-center">
                    No results found
                  </li>
                ) : (
                  filtered.map((c) => (
                    <li
                      key={c.code + (c.name || "")}
                      onClick={() => {
                        setCountryCode(c.code);
                        setOpen(false);
                        setSearchQuery("");
                      }}
                      className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-orange-50 transition-colors duration-100
                        ${c.code === countryCode ? "bg-orange-50" : ""}`}
                    >
                      <span className="text-base leading-none flex-shrink-0">
                        {c.flag}
                      </span>
                      <span
                        className={`flex-1 truncate text-xs ${c.code === countryCode ? "text-orange-600 font-semibold" : "text-gray-700"}`}
                      >
                        {c.name || c.code}
                      </span>
                      <span className="text-xs font-bold text-gray-400 flex-shrink-0">
                        {c.code}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Number input */}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Phone number"
          className="flex-1 mr-2  py-2.5 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500 pl-1">{error}</p>}
    </div>
  );
};

// ─────────────────────────────────────────────
// Registration Form
// ─────────────────────────────────────────────
const RegistrationForm = ({ setPop, setUserId, type }) => {
  const router = useRouter();
  const recaptchaRef = useRef(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+971");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({});
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setToken, login } = useAuth();

  const handleGoogle = async (tokenData) => {
    try {
      const payload = {
        provider: "google",
        accessToken: tokenData.access_token,
      };
      const res = await social_login(payload);
      if (res?.success) {
        const authToken = res?.data?.accessToken;
        localStorage.setItem("authToken", authToken);
        if (login) login(authToken);
        setToken(authToken);
        router.push("/dashboard");
      } else {
        setErrors({
          google: res?.error || "Google login failed. Please try again.",
        });
      }
    } catch {
      setErrors({ google: "Google authentication error. Please try again." });
    }
  };

  const googleLoginTrigger = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogle(tokenResponse),
    onError: () => setErrors({ google: "Google Authentication Failed" }),
  });

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email address";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{7,15}$/.test(phone))
      newErrors.phone = "Enter a valid phone number";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Minimum 6 characters";
    if (!passwordConfirmation)
      newErrors.passwordConfirmation = "Please confirm your password";
    else if (password !== passwordConfirmation)
      newErrors.passwordConfirmation = "Passwords do not match";
    if (!captchaVerified)
      newErrors.captcha = "Please verify you are not a robot";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        phone: `${countryCode}${phone}`,
        whatsapp_same: true,
        login_type: "email",
        ...(type && { type }),
      };
      const res = await user_register(payload);
      const isError =
        typeof res === "string" ||
        (res && Object.values(res).some((val) => Array.isArray(val))) ||
        res?.status === false ||
        res?.success === false;

      if (!isError && res) {
        setPop(true);
        setUserId({ email: res?.data?.email || res?.email || email.trim() });
      } else if (res) {
        if (typeof res === "string") {
          setErrors({ general: res });
        } else {
          const backendErrors = {};
          Object.entries(res).forEach(([key, value]) => {
            backendErrors[key] = Array.isArray(value)
              ? value.join(", ")
              : value;
          });
          setErrors(backendErrors);
        }
      }
    } catch {
      setErrors({ general: "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg px-5 py-4 w-full space-y-3">
      <FormInput
        icon={<FaUser size={14} />}
        placeholder="Full Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) setErrors((p) => ({ ...p, name: "" }));
        }}
        error={errors.name}
      />

      <FormInput
        icon={<FaEnvelope size={14} />}
        placeholder="Email Address"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors((p) => ({ ...p, email: "" }));
        }}
        error={errors.email}
      />

      <PhoneInput
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
        }}
        countryCode={countryCode}
        setCountryCode={setCountryCode}
        error={errors.phone}
      />

      <FormInput
        icon={<FaLock size={14} />}
        placeholder="Create Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) setErrors((p) => ({ ...p, password: "" }));
        }}
        type="password"
        error={errors.password}
      />

      <FormInput
        icon={<FaLock size={14} />}
        placeholder="Confirm Password"
        value={passwordConfirmation}
        onChange={(e) => {
          setPasswordConfirmation(e.target.value);
          if (errors.passwordConfirmation)
            setErrors((p) => ({ ...p, passwordConfirmation: "" }));
        }}
        type="password"
        error={errors.passwordConfirmation}
      />

      {/* reCAPTCHA */}
      <div className="flex flex-col items-start gap-1">
        <div className="scale-[0.88] origin-top-left -mb-2">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6Lfw3xcsAAAAAP94VC18dOlxvN93hwgBcqpdRWTT"
            onChange={(val) => {
              if (val) {
                setCaptchaVerified(true);
                setErrors((p) => ({ ...p, captcha: "" }));
              }
            }}
            onExpired={() => {
              setCaptchaVerified(false);
              setErrors((p) => ({
                ...p,
                captcha: "Captcha expired, please verify again",
              }));
            }}
            theme="light"
          />
        </div>
        {errors.captcha && (
          <p className="text-xs text-red-500 pl-1">{errors.captcha}</p>
        )}
      </div>

      {/* General error */}
      {errors.general && (
        <p className="text-xs text-red-500 text-center bg-red-50 border border-red-100 rounded-md py-2 px-3">
          {errors.general}
        </p>
      )}

      {/* Register button */}
      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-2.5 rounded-md text-sm uppercase tracking-wide transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Registering...
          </>
        ) : (
          "Register"
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google */}
      <button
        onClick={() => googleLoginTrigger()}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-md bg-white hover:bg-orange-50 hover:border-orange-200 transition-all duration-200 active:scale-[0.98]"
      >
        <FcGoogle className="text-xl flex-shrink-0" />
        <span className="text-gray-700 text-sm font-medium">
          Continue with Google
        </span>
      </button>

      {errors.google && (
        <p className="text-xs text-red-500 text-center">{errors.google}</p>
      )}

      {/* Terms */}
      <p className="text-[10px] text-center text-gray-400 leading-relaxed">
        By continuing, you agree to our{" "}
        <u className="cursor-pointer hover:text-gray-600 transition-colors">
          Terms of Use
        </u>
        ,{" "}
        <u className="cursor-pointer hover:text-gray-600 transition-colors">
          Privacy Policy
        </u>{" "}
        &{" "}
        <u className="cursor-pointer hover:text-gray-600 transition-colors">
          Infringement Policy
        </u>
      </p>
    </div>
  );
};

export default RegistrationForm;
