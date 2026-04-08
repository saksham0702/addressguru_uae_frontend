import React, { useRef, useState } from "react";
import InputWithSvg from "../InputWithSvg";
import Image from "next/image";
import { social_login } from "@/api/userAuth";
import ReCAPTCHA from "react-google-recaptcha";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { user_register } from "@/api/uaeadminlogin";

const RegistrationForm = ({ setPop, setUserId, type }) => {
  const router = useRouter();
  const recaptchaRef = useRef(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    captchaVerified: false,
  });

  const { user, setUser, setToken, login } = useAuth();

  const handleGoogle = async (code, random) => {
    try {
      const payload = {
        auth_code: code,
        g_token: random,
      };
      const res = await social_login(payload);
      console.log("response of google", res);
      if (res?.status === 200) {
        if (login) {
          login(res?.access_token);
        }
        setToken(res?.access_token);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setErrors({ google: "Google login failed. Please try again." });
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!name.trim()) newErrors.name = "Full Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";

    if (!phone.trim()) newErrors.phone = "WhatsApp number is required";
    else if (!/^\d{10}$/.test(phone))
      newErrors.phone = "Enter valid 10 digit number";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!passwordConfirmation) {
      newErrors.passwordConfirmation = "Confirm your password";
    } else if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = "Passwords do not match";
    }

    if (!formData.captchaVerified) {
      newerrors?.captcha = "Please verify you are not a robot";
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
        phone,
        whatsapp_same: true, // since you're using same number
        login_type: "email", // static for now
        ...(type && { type }), // keep if needed
      };

      console.log("Final Payload:", payload);

      const res = await user_register(payload);
      console.log("user response :", res);

      setPop(true);
      if (res?.data) {
        if (res?.data?.email) {
          setUserId({
            email: res?.data?.email,
          });
        }
      } else if (res) {
        const backendErrors = {};
        Object.entries(res).forEach(([key, value]) => {
          backendErrors[key] = Array.isArray(value) ? value.join(", ") : value;
        });
        setErrors(backendErrors);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: "Registration failed. Please try again." });
    }
  };

  return (
    <GoogleOAuthProvider clientId="477872652143-tciloohp49r48l80d7j6tqituovm9nu0.apps.googleusercontent.com">
      <div className=" bg-white rounded-lg px-4 py-3 w-full min-h-[480px] space-y-3 ">
        {/* all the inputs  */}
        <InputWithSvg
          field={name}
          error={errors.name}
          setField={setName}
          icon={
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 11C12.6569 11 14 9.65685 14 8C14 6.34315 12.6569 5 11 5C9.34315 5 8 6.34315 8 8C8 9.65685 9.34315 11 11 11Z"
                stroke="#D1D1D1"
              />
              <path
                d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
                stroke="#D1D1D1"
              />
              <path
                d="M16.9696 19C16.8105 16.1085 15.9252 14 11.0004 14C6.0757 14 5.1904 16.1085 5.03125 19"
                stroke="#D1D1D1"
                stroke-linecap="round"
              />
            </svg>
          }
          placeholder={"Full Name"}
        />
        <InputWithSvg
          field={email}
          error={errors.email}
          setField={setEmail}
          icon={
            <svg
              width="20"
              height="15"
              viewBox="0 0 20 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 12.8397C19.8855 13.1268 19.8119 13.4404 19.6483 13.6939C19.3252 14.1938 18.8303 14.4164 18.2509 14.443C18.2114 14.4444 18.1732 14.4444 18.1337 14.4444C12.7134 14.4444 7.29177 14.4444 1.87148 14.4444C1.25529 14.4444 0.741347 14.2288 0.359636 13.7191C0.112888 13.3886 0.00246412 13.0091 0.00246412 12.5974C0.00110087 9.01408 -0.00298859 5.43211 0.00382767 1.84875C0.00519092 0.764914 0.778154 0.00315056 1.85103 0.00175026C4.09631 -0.00105034 6.34158 0.000350192 8.58686 0.000350192C11.7687 0.000350192 14.9505 0.000350192 18.1337 0.000350192C18.8971 0.000350192 19.4779 0.32522 19.8214 1.03797C19.9059 1.21441 19.9414 1.41605 20 1.60509C20 5.3509 20 9.0953 20 12.8397ZM2.02417 1.20881C2.07324 1.26622 2.09642 1.29563 2.12368 1.32223C4.31988 3.56691 6.51335 5.813 8.71364 8.05348C9.48252 8.83624 10.5322 8.82784 11.3038 8.04087C13.4891 5.813 15.6703 3.58232 17.8515 1.35164C17.8883 1.31383 17.9197 1.26902 17.9701 1.21021C12.6466 1.20881 7.35721 1.20881 2.02417 1.20881ZM2.14004 13.2248C7.35857 13.2248 12.6534 13.2248 17.8665 13.2248C16.2524 11.5332 14.6056 9.80665 12.9343 8.05628C12.6493 8.35454 12.3876 8.6318 12.1231 8.90486C11.5833 9.46218 10.9371 9.78705 10.1682 9.82766C9.27257 9.87527 8.51324 9.5532 7.88069 8.90486C7.61486 8.6318 7.35448 8.35454 7.06956 8.05628C5.40094 9.80805 3.75277 11.5346 2.14004 13.2248ZM1.18849 2.05599C1.18849 5.52313 1.18849 8.93286 1.18849 12.3986C2.87347 10.6356 4.52437 8.90766 6.1371 7.2203C4.52028 5.53294 2.86938 3.81057 1.18849 2.05599ZM18.8208 2.06579C17.1399 3.82037 15.4863 5.54554 13.8926 7.20769C15.5026 8.89366 17.1522 10.6202 18.8208 12.3678C18.8208 8.93006 18.8208 5.52313 18.8208 2.06579Z"
                fill="#D1D1D1"
              />
            </svg>
          }
          placeholder={"Email"}
        />
        <InputWithSvg
          field={phone}
          error={errors.phone}
          setField={setPhone}
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5145 20C10.176 20 9.83744 20 9.49892 20C9.4425 19.9881 9.38607 19.9673 9.32965 19.9644C7.73352 19.856 6.24875 19.3868 4.8783 18.5627C4.76546 18.4959 4.67489 18.4944 4.55314 18.5375C3.74245 18.833 2.9288 19.118 2.11663 19.4105C1.58062 19.6036 1.0461 19.8025 0.511586 20C0.446256 20 0.380926 20 0.315596 20C-0.0140231 19.7877 -0.0511424 19.6659 0.0943653 19.2858C0.566523 18.0609 1.0372 16.8345 1.51678 15.6125C1.57765 15.4566 1.56578 15.3438 1.47966 15.1997C0.100304 12.8968 -0.334734 10.4202 0.259175 7.80408C1.48708 2.39802 6.74466 -0.929355 12.1656 0.230252C16.0794 1.06766 19.1574 4.2718 19.8522 8.23318C19.9131 8.58358 19.9562 8.93844 20.0081 9.29033C20.0081 9.75952 20.0081 10.2287 20.0081 10.6979C19.9784 10.928 19.9517 11.1597 19.9161 11.3898C19.6043 13.4685 18.7505 15.2933 17.3088 16.8256C15.7751 18.4558 13.8983 19.464 11.689 19.8426C11.3014 19.9109 10.9065 19.948 10.5145 20ZM1.12925 18.882C1.22576 18.8538 1.28218 18.8419 1.33415 18.8226C2.38685 18.4469 3.44104 18.0757 4.48929 17.6897C4.72686 17.6021 4.91542 17.6244 5.12923 17.7565C7.22721 19.0557 9.49446 19.4833 11.9072 18.9725C16.7995 17.9391 19.9324 13.2443 19.0401 8.3282C18.2606 4.04018 14.5115 0.86425 10.1537 0.815252C8.08987 0.791496 6.18787 1.35423 4.55759 2.62222C1.56281 4.95034 0.380927 8.02382 1.01047 11.7714C1.20794 12.9458 1.67565 14.0253 2.33192 15.0201C2.45812 15.2116 2.49227 15.3898 2.39428 15.6051C2.29183 15.8293 2.21462 16.0654 2.12554 16.2955C1.80037 17.1433 1.47223 17.9926 1.12925 18.882Z"
                fill="#D1D1D1"
              />
              <path
                d="M7.54736 5.0128C8.02843 4.8762 8.28975 5.1301 8.47089 5.57702C8.63719 5.98533 8.84802 6.37731 9.06183 6.76483C9.28009 7.16127 9.27861 7.5577 9.0648 7.9378C8.90741 8.21843 8.704 8.47678 8.50504 8.73216C8.43377 8.8257 8.40556 8.88954 8.45456 9.00387C8.96235 10.2021 9.81461 11.0484 11.0128 11.5547C11.1257 11.6022 11.188 11.571 11.2667 11.4983C11.5993 11.1909 11.9542 10.9222 12.407 10.8108C12.6505 10.7514 12.8851 10.7708 13.1093 10.8821C13.6513 11.1509 14.1962 11.4137 14.7292 11.6987C14.8421 11.7581 14.9772 11.9007 14.9831 12.012C15.0128 12.5094 15.0514 13.0068 14.8361 13.4894C14.358 14.5554 13.0752 15.3646 11.5949 14.8123C9.24 13.9333 7.32613 12.5079 6.0715 10.2793C5.66319 9.55175 5.26527 8.82124 5.0767 7.99868C4.77084 6.6609 5.64537 5.29342 6.99354 5.01726C7.16281 4.98311 7.34395 5.0128 7.54736 5.0128ZM7.44046 5.8027C6.80795 5.82646 6.39963 6.10856 6.10119 6.56142C5.75376 7.09148 5.76564 7.65718 5.98984 8.22437C6.77974 10.214 7.94528 11.9051 9.82204 13.0306C10.56 13.473 11.3024 13.8992 12.1427 14.1204C13.188 14.3966 14.2986 13.5072 14.1932 12.4842C14.1813 12.3713 14.1487 12.309 14.0492 12.2615C13.6513 12.0684 13.2533 11.8754 12.8643 11.6676C12.7069 11.5844 12.56 11.571 12.4248 11.669C12.1427 11.8754 11.8636 12.0863 11.6023 12.3179C11.4315 12.4693 11.2712 12.5198 11.0544 12.4426C9.35582 11.8368 8.19324 10.695 7.57854 8.99496C7.485 8.7381 7.53548 8.55992 7.7196 8.36542C7.94528 8.12637 8.1383 7.85466 8.33132 7.5874C8.4308 7.44783 8.42338 7.29341 8.33429 7.13009C8.14721 6.78859 7.96904 6.43967 7.8072 6.08629C7.71366 5.88733 7.61715 5.74331 7.44046 5.8027Z"
                fill="#D1D1D1"
              />
            </svg>
          }
          placeholder={"Whatsap Number"}
        />

        <InputWithSvg
          type={"password"}
          error={errors.password}
          field={password}
          setField={setPassword}
          icon={
            <svg
              width="16"
              height="19"
              viewBox="0 0 16 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.47166 6.69812C3.47166 6.06604 3.47409 5.46069 3.47045 4.85413C3.4668 4.20745 3.57134 3.58266 3.80959 2.97974C4.5766 1.0458 6.62967 -0.187992 8.63777 0.0235146C10.861 0.256901 12.6029 1.95625 12.8594 4.05673C12.9542 4.83103 12.908 5.62236 12.925 6.40639C12.9275 6.49634 12.925 6.58629 12.925 6.65193C13.2946 6.70542 13.6471 6.72244 13.9789 6.81117C15.0134 7.08953 15.7816 8.07413 15.7864 9.14747C15.7974 11.6126 15.801 14.079 15.7864 16.5441C15.7792 17.8715 14.6523 18.9886 13.3237 18.9922C9.90924 19.0032 6.49475 19.002 3.08025 18.9922C1.7322 18.9886 0.611461 17.8618 0.606599 16.5137C0.596874 14.0741 0.59809 11.6345 0.605383 9.19609C0.610246 7.83588 1.72369 6.72365 3.0839 6.69812C3.20424 6.69569 3.32215 6.69812 3.47166 6.69812ZM8.19166 17.7317C9.83995 17.7317 11.487 17.7317 13.1353 17.7317C14.0081 17.7317 14.5271 17.2151 14.5283 16.346C14.5283 14.0194 14.5283 11.6916 14.5283 9.36505C14.5283 8.47891 14.0142 7.96352 13.1305 7.96352C9.84117 7.96352 6.55309 7.96352 3.2638 7.96352C2.39103 7.96352 1.87199 8.48134 1.87199 9.35046C1.87199 11.6843 1.87199 14.0182 1.87199 16.3521C1.87199 17.2102 2.39225 17.7317 3.24921 17.7329C4.89629 17.7317 6.54337 17.7317 8.19166 17.7317ZM11.6329 6.6884C11.6414 6.67381 11.6475 6.66774 11.6475 6.66287C11.6341 5.82171 11.6973 4.96961 11.5891 4.13938C11.3813 2.54822 9.94814 1.3278 8.35454 1.27675C6.67829 1.22327 5.20504 2.31727 4.84159 3.91207C4.63616 4.81523 4.7638 5.73662 4.74556 6.65072C4.74556 6.66166 4.75893 6.6726 4.76866 6.6884C7.05633 6.6884 9.34644 6.6884 11.6329 6.6884Z"
                fill="#D1D1D1"
              />
              <path
                d="M7.34083 13.6496C7.34083 13.5511 7.33719 13.4514 7.34083 13.353C7.35177 13.0698 7.31895 12.8206 7.14391 12.5617C6.80234 12.0572 6.96036 11.3607 7.44051 10.9863C7.92916 10.6046 8.62567 10.6447 9.0657 11.0787C9.50574 11.5126 9.55922 12.2128 9.17632 12.7002C9.08758 12.8133 9.0572 12.9227 9.05841 13.06C9.06327 13.4624 9.06206 13.8647 9.05963 14.2659C9.05598 14.7266 8.80922 14.9697 8.34731 14.9733C8.22819 14.9745 8.11028 14.9757 7.99115 14.9721C7.60582 14.9612 7.3542 14.7108 7.34205 14.3218C7.33475 14.0981 7.34083 13.8732 7.34083 13.6496Z"
                fill="#D1D1D1"
              />
            </svg>
          }
          placeholder={"Create Password"}
        />
        <InputWithSvg
          type={"password"}
          field={passwordConfirmation}
          error={errors.passwordConfirmation}
          setField={setPasswordConfirmation}
          icon={
            <svg
              width="16"
              height="19"
              viewBox="0 0 16 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.47166 6.69812C3.47166 6.06604 3.47409 5.46069 3.47045 4.85413C3.4668 4.20745 3.57134 3.58266 3.80959 2.97974C4.5766 1.0458 6.62967 -0.187992 8.63777 0.0235146C10.861 0.256901 12.6029 1.95625 12.8594 4.05673C12.9542 4.83103 12.908 5.62236 12.925 6.40639C12.9275 6.49634 12.925 6.58629 12.925 6.65193C13.2946 6.70542 13.6471 6.72244 13.9789 6.81117C15.0134 7.08953 15.7816 8.07413 15.7864 9.14747C15.7974 11.6126 15.801 14.079 15.7864 16.5441C15.7792 17.8715 14.6523 18.9886 13.3237 18.9922C9.90924 19.0032 6.49475 19.002 3.08025 18.9922C1.7322 18.9886 0.611461 17.8618 0.606599 16.5137C0.596874 14.0741 0.59809 11.6345 0.605383 9.19609C0.610246 7.83588 1.72369 6.72365 3.0839 6.69812C3.20424 6.69569 3.32215 6.69812 3.47166 6.69812ZM8.19166 17.7317C9.83995 17.7317 11.487 17.7317 13.1353 17.7317C14.0081 17.7317 14.5271 17.2151 14.5283 16.346C14.5283 14.0194 14.5283 11.6916 14.5283 9.36505C14.5283 8.47891 14.0142 7.96352 13.1305 7.96352C9.84117 7.96352 6.55309 7.96352 3.2638 7.96352C2.39103 7.96352 1.87199 8.48134 1.87199 9.35046C1.87199 11.6843 1.87199 14.0182 1.87199 16.3521C1.87199 17.2102 2.39225 17.7317 3.24921 17.7329C4.89629 17.7317 6.54337 17.7317 8.19166 17.7317ZM11.6329 6.6884C11.6414 6.67381 11.6475 6.66774 11.6475 6.66287C11.6341 5.82171 11.6973 4.96961 11.5891 4.13938C11.3813 2.54822 9.94814 1.3278 8.35454 1.27675C6.67829 1.22327 5.20504 2.31727 4.84159 3.91207C4.63616 4.81523 4.7638 5.73662 4.74556 6.65072C4.74556 6.66166 4.75893 6.6726 4.76866 6.6884C7.05633 6.6884 9.34644 6.6884 11.6329 6.6884Z"
                fill="#D1D1D1"
              />
              <path
                d="M7.34083 13.6496C7.34083 13.5511 7.33719 13.4514 7.34083 13.353C7.35177 13.0698 7.31895 12.8206 7.14391 12.5617C6.80234 12.0572 6.96036 11.3607 7.44051 10.9863C7.92916 10.6046 8.62567 10.6447 9.0657 11.0787C9.50574 11.5126 9.55922 12.2128 9.17632 12.7002C9.08758 12.8133 9.0572 12.9227 9.05841 13.06C9.06327 13.4624 9.06206 13.8647 9.05963 14.2659C9.05598 14.7266 8.80922 14.9697 8.34731 14.9733C8.22819 14.9745 8.11028 14.9757 7.99115 14.9721C7.60582 14.9612 7.3542 14.7108 7.34205 14.3218C7.33475 14.0981 7.34083 13.8732 7.34083 13.6496Z"
                fill="#D1D1D1"
              />
            </svg>
          }
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
        <div className="w-45  h-11  ">
          <GoogleLogin
            onSuccess={(res) => {
              // console.log(res);
              const code = res?.credential;
              const random = crypto.randomUUID(); // or any random string generator
              // setGoogleCode(code);
              handleGoogle(code, random); // <-- CALL THE FUNCTION HERE
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>

        <div className="text-[8px] text-center flex gap-1 w-full mx-auto font-[500] whitespace-nowrap">
          By continuing, you agree to our <u>Terms of Use</u> <u>Privacy</u> &
          <u>Infringement Policy</u>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default RegistrationForm;
