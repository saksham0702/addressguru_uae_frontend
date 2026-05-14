import React, { useRef, useState, useEffect } from "react";
import InputWithSvg from "../InputWithSvg";
import Image from "next/image";
import { social_login } from "@/api/userAuth";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useGoogleLogin } from "@react-oauth/google";
import { user_register } from "@/api/uaeadminlogin";
import { FcGoogle } from "react-icons/fc";
import { FaUser, FaEnvelope, FaLock, FaWhatsapp } from "react-icons/fa6";
import { COUNTRY_CODES } from "@/services/constants";

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
  const [formData, setFormData] = useState({
    captchaVerified: false,
  });

  const { user, setUser, setToken, login } = useAuth();

  const handleGoogle = async (tokenData) => {
    try {
      const payload = {
        provider: "google",
        accessToken: tokenData.access_token,
      };
      const res = await social_login(payload);
      console.log("response of google", res);
      
      if (res?.success) {
        const authToken = res?.data?.accessToken;
        localStorage.setItem("authToken", authToken);
        if (login) {
          login(authToken);
        }
        setToken(authToken);
        router.push("/dashboard");
      } else {
        setErrors({ google: res?.error || "Google login failed. Please try again." });
      }
    } catch (error) {
      console.error("Google login error:", error);
      setErrors({ google: "Google authentication error. Please try again." });
    }
  };

  const googleLoginTrigger = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogle(tokenResponse),
    onError: (error) => {
      console.log("Login Failed", error);
      setErrors({ google: "Google Authentication Failed" });
    },
  });

  const validate = () => {
    let newErrors = {};

    if (!name.trim()) newErrors.name = "Full Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";

    if (!phone.trim()) newErrors.phone = "WhatsApp number is required";
    else if (!/^\d{7,15}$/.test(phone))
      newErrors.phone = "Enter valid phone number";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!passwordConfirmation) {
      newErrors.passwordConfirmation = "Confirm your password";
    } else if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = "Passwords do not match";
    }

    if (!formData.captchaVerified) {
      newErrors.captcha = "Please verify you are not a robot";
    }

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

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        phone: `${countryCode}${phone}`,
        whatsapp_same: true, // since you're using same number
        login_type: "email", // static for now
        ...(type && { type }), // keep if needed
      };

      console.log("Final Payload:", payload);

      const res = await user_register(payload);
      console.log("user response :", res);

      const isError = typeof res === 'string' || (res && Object.values(res).some(val => Array.isArray(val))) || res?.status === false || res?.success === false;

      if (!isError && res) {
        setPop(true);
        setUserId({
          email: res?.data?.email || res?.email || email.trim(),
        });
      } else if (res) {
        if (typeof res === 'string') {
          setErrors({ general: res });
        } else {
          const backendErrors = {};
          Object.entries(res).forEach(([key, value]) => {
            backendErrors[key] = Array.isArray(value) ? value.join(", ") : value;
          });
          setErrors(backendErrors);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: "Registration failed. Please try again." });
    }
  };

  return (
    <div className="bg-white rounded-lg px-4 py-3 w-full min-h-[480px] space-y-3 ">
        {/* all the inputs  */}
        <InputWithSvg
          field={name}
          error={errors.name}
          setField={setName}
          icon={<FaUser className="text-lg text-gray-400" />}
          placeholder={"Full Name"}
        />
        <InputWithSvg
          field={email}
          error={errors.email}
          setField={setEmail}
          icon={<FaEnvelope className="text-lg text-gray-400" />}
          placeholder={"Email"}
        />
        <PhoneInputWithSvg
          field={phone}
          error={errors.phone}
          setField={setPhone}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          icon={<FaWhatsapp className="text-xl text-gray-400" />}
          placeholder={"WhatsApp Number"}
        />

        <InputWithSvg
          type={"password"}
          error={errors.password}
          field={password}
          setField={setPassword}
          icon={<FaLock className="text-lg text-gray-400" />}
          placeholder={"Create Password"}
        />
        <InputWithSvg
          type={"password"}
          field={passwordConfirmation}
          error={errors.passwordConfirmation}
          setField={setPasswordConfirmation}
          icon={<FaLock className="text-lg text-gray-400" />}
          placeholder={"Confirm Password"}
        />

        {/* captcha and buttons */}
        <div className="w-full h-15 scale-80 relative bottom-3 ">
          <div className="flex flex-col items-start">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6Lfw3xcsAAAAAP94VC18dOlxvN93hwgBcqpdRWTT"
              onChange={handleCaptchaChange}
              onExpired={handleCaptchaExpired}
              theme="light"
            />
            {errors?.captcha && (
              <p className="text-red-500 text-sm z-50 ">{errors?.captcha}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleRegister}
          className="bg-orange-500 cursor-pointer text-white uppercase w-full text-center font-semibold py-2 rounded-sm"
        >
          Register
        </button>
        <div className="w-full text-center text-xs ">OR</div>
        <div className="w-full max-w-[320px] mx-auto">
          <button
            onClick={() => googleLoginTrigger()}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-orange-50 hover:border-orange-200 transition-all duration-300 group relative overflow-hidden active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <FcGoogle className="text-xl" />
            <span className="text-gray-700 text-sm font-medium whitespace-nowrap">
              Continue with Google
            </span>
          </button>
        </div>
        {errors.google && (
          <p className="text-red-500 text-[10px] text-center">{errors.google}</p>
        )}
        {errors.general && (
          <p className="text-red-500 text-[10px] text-center">{errors.general}</p>
        )}

        <div className="text-[8px] text-center flex gap-1 w-full mx-auto font-[500] whitespace-nowrap">
          By continuing, you agree to our <u>Terms of Use</u> <u>Privacy</u> &
          <u>Infringement Policy</u>
      </div>
    </div>
  );
};

const PhoneInputWithSvg = ({ icon, placeholder, field, setField, error, countryCode, setCountryCode }) => {
  const [localError, setLocalError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (error && error !== "") {
      setLocalError(error);
      setField("");
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 400);
      return () => clearTimeout(timer);
    } else {
      setLocalError("");
    }
  }, [error, setField]);

  const handleChange = (e) => {
    if (localError) setLocalError("");
    setField(e.target.value);
  };

  return (
    <div className="w-full transition-all duration-300">
      <div
        className={`flex items-center border font-[500] rounded-md overflow-hidden text-sm bg-white max-w-full md:max-w-md transition-all duration-300
          ${localError ? "border-red-500" : "border-gray-300"}
          ${isShaking ? "animate-shake" : ""}`}
      >
        <div
          className={`flex items-center justify-center px-3 transition-colors duration-300 ${
            localError ? "text-red-500" : "text-gray-700"
          }`}
        >
          {icon}
        </div>
        
        <div className="flex items-center border-l-2 border-gray-200 bg-gray-50 px-2 group">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="bg-transparent text-[#323232] text-[13px] font-bold focus:outline-none py-1.5 cursor-pointer appearance-none min-w-[65px] text-center"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code} className="text-sm font-normal">
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <div className="text-[10px] text-gray-400 ml-1">▼</div>
        </div>

        <input
          type="text"
          value={field}
          onChange={handleChange}
          placeholder={localError || placeholder}
          className={`flex-1 px-4 py-1.5 focus:outline-none border-l-2 bg-white text-[#323232] transition-all duration-300
            ${
              localError
                ? "placeholder-red-500 border-red-200 text-red-500"
                : "border-gray-200"
            }`}
        />
      </div>
    </div>
  );
};

export default RegistrationForm;
