import React, { useState } from "react";
import InputWithSvg from "../InputWithSvg";
import Image from "next/image";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { forgot_password, social_login, user_login } from "@/api/userAuth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
// import ResponseAlert from "../ResponseAlert";
import OTPPopup from "../Register/OTPPopup";
import {
  useGoogleLogin,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";

const Login = ({ setShowLogin }) => {
  const [forgot, setforgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [resError, setResError] = useState(null);
  const [otpPop, setOtpPop] = useState(false);
  const [userId, setUserId] = useState(null);
  // const [googleCode, setGoogleCode] = useState(null);

  const { token, setToken, login, setUser } = useAuth();
  const router = useRouter();
  const handleForgot = async () => {
    if (!email.trim()) {
      return;
    }
    setLoading(true);
    const payload = { email };
    const res = await forgot_password(payload);
    // console.log("forgot password", res);
  };
  const handleLogin = async () => {
    let formErrors = {};
    if (!email.trim()) {
      formErrors.email = "Email is required";
    }
    if (!password.trim()) {
      formErrors.password = "Password is required";
    }
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    const payload = { email, password };
    setLoading(true);
    try {
      const res = await user_login(payload);
      console.log(res);
      // console.log("res status", res?.stauts);
      if (res?.status === 200) {
        login(res?.access_token);
        setToken(res?.access_token);
        router.push("/dashboard");
      } else if (res?.status === 401) {
        setResError(res?.error || "Invalid email or password");
      } else if (res?.status === 403) {
        setResError(
          res?.error || "Your account is not verified. Please verify it first."
        );
        setUserId(res?.user_id);
        setOtpPop(true);
      }
      //  else {
      //   setResError(res?.error || "Something went wrong. Please try again.");
      // }
    } catch (error) {
      console.error("Login error:", error);
      // toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (code, random) => {
    const payload = {
      auth_code: code,
      g_token: random,
    };
    const res = await social_login(payload);
    console.log("response of google", res);
    if (res?.status === 200) {
      login(res?.access_token);
      setToken(res?.access_token);
      router.push("/dashboard");
    }
  };
  // const g_login = useGoogleLogin({
  //   onSuccess: (tokenResponse) => console.log(tokenResponse),
  // });
  return (
    <GoogleOAuthProvider clientId="477872652143-tciloohp49r48l80d7j6tqituovm9nu0.apps.googleusercontent.com">
      <div className="my-12 flex flex-col gap-3 items-center max-md:mt-20 max-md:w-xs mx-auto max-md:space-y-3  relative">
        {/* title and svg section */}
        {forgot === true ? (
          <Image
            src="/assets/Login/forgot-png.png"
            alt="forgot icon"
            height={500}
            width={500}
            className="h-10 w-10"
          />
        ) : (
          <Image
            src="/assets/Login/login-png.png"
            alt="login icon"
            height={500}
            width={500}
            className="h-10 w-10"
          />
        )}
        {/* title text */}
        {forgot === false ? (
          <div className="text-center">
            <h1 className="font-semibold">
              <strong className="text-orange-500">Login </strong> To Your
              Account
            </h1>
            <p className="text-xs font-[500]">
              Welcome back, please enter your details
            </p>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="font-semibold">
              <strong className="text-orange-500">Reset Password </strong> to
              your account
            </h1>
            <p className="text-xs font-[500]">
              Please Enter your email address
            </p>
          </div>
        )}

        {/* forgot password input */}
        {forgot && (
          <div className=" mt-4 w-[80%]">
            <InputWithSvg
              field={email}
              setField={setEmail}
              icon={
                <svg
                  width="15"
                  height="11"
                  viewBox="0 0 15 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.2224 9.71825C14.141 9.91698 14.0887 10.1341 13.9723 10.3096C13.7426 10.6557 13.3907 10.8098 12.9787 10.8283C12.9505 10.8292 12.9234 10.8292 12.8953 10.8292C9.0408 10.8292 5.18534 10.8292 1.33085 10.8292C0.892666 10.8292 0.527188 10.6799 0.255745 10.3271C0.0802771 10.0983 0.00175229 9.83555 0.00175229 9.55053C0.000782854 7.06974 -0.00212525 4.58992 0.00272194 2.10912C0.00369138 1.35878 0.553363 0.831405 1.31631 0.830435C2.91298 0.828496 4.50964 0.829466 6.10631 0.829466C8.36898 0.829466 10.6316 0.829466 12.8953 0.829466C13.4382 0.829466 13.8511 1.05438 14.0954 1.54782C14.1556 1.66997 14.1808 1.80957 14.2224 1.94044C14.2224 4.53369 14.2224 7.12597 14.2224 9.71825ZM1.43943 1.66609C1.47433 1.70584 1.49081 1.7262 1.5102 1.74462C3.07196 3.29863 4.63179 4.85361 6.19646 6.40471C6.74323 6.94662 7.48969 6.94081 8.0384 6.39598C9.59241 4.8536 11.1435 3.30929 12.6946 1.76497C12.7208 1.7388 12.7431 1.70778 12.7789 1.66706C8.99329 1.66609 5.23187 1.66609 1.43943 1.66609ZM1.52183 9.98484C5.23284 9.98484 8.99814 9.98484 12.7053 9.98484C11.5575 8.81376 10.3864 7.61844 9.19785 6.40665C8.99523 6.61314 8.8091 6.80508 8.62103 6.99412C8.23713 7.37996 7.77762 7.60487 7.23085 7.63299C6.59393 7.66595 6.05396 7.44297 5.60414 6.99412C5.4151 6.80508 5.22993 6.61314 5.02732 6.40665C3.84073 7.61941 2.66868 8.81473 1.52183 9.98484ZM0.845164 2.2526C0.845164 4.65293 0.845164 7.01351 0.845164 9.41287C2.04339 8.19235 3.21738 6.99606 4.36422 5.82789C3.21447 4.65972 2.04048 3.46731 0.845164 2.2526ZM13.3839 2.25939C12.1886 3.47409 11.0126 4.66844 9.87936 5.81917C11.0243 6.98637 12.1973 8.18169 13.3839 9.39155C13.3839 7.01157 13.3839 4.65293 13.3839 2.25939Z"
                    fill="#D1D1D1"
                  />
                </svg>
              }
              placeholder={"Email"}
            />
            {errors?.email && (
              <p className="text-red-500 text-xs mt-1">{errors?.email}</p>
            )}
          </div>
        )}

        {/* login inputs */}
        {forgot === false ? (
          <>
            {resError && (
              <span className="text-xs font-medium text-center text-red-500">
                {resError}
              </span>
            )}

            <div className=" w-[80%] space-y-2">
              <InputWithSvg
                field={email}
                setField={setEmail}
                placeholder="Email"
                icon={
                  <svg
                    width="15"
                    height="11"
                    viewBox="0 0 15 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.2224 9.71825C14.141 9.91698 14.0887 10.1341 13.9723 10.3096C13.7426 10.6557 13.3907 10.8098 12.9787 10.8283C12.9505 10.8292 12.9234 10.8292 12.8953 10.8292C9.0408 10.8292 5.18534 10.8292 1.33085 10.8292C0.892666 10.8292 0.527188 10.6799 0.255745 10.3271C0.0802771 10.0983 0.00175229 9.83555 0.00175229 9.55053C0.000782854 7.06974 -0.00212525 4.58992 0.00272194 2.10912C0.00369138 1.35878 0.553363 0.831405 1.31631 0.830435C2.91298 0.828496 4.50964 0.829466 6.10631 0.829466C8.36898 0.829466 10.6316 0.829466 12.8953 0.829466C13.4382 0.829466 13.8511 1.05438 14.0954 1.54782C14.1556 1.66997 14.1808 1.80957 14.2224 1.94044C14.2224 4.53369 14.2224 7.12597 14.2224 9.71825ZM1.43943 1.66609C1.47433 1.70584 1.49081 1.7262 1.5102 1.74462C3.07196 3.29863 4.63179 4.85361 6.19646 6.40471C6.74323 6.94662 7.48969 6.94081 8.0384 6.39598C9.59241 4.8536 11.1435 3.30929 12.6946 1.76497C12.7208 1.7388 12.7431 1.70778 12.7789 1.66706C8.99329 1.66609 5.23187 1.66609 1.43943 1.66609ZM1.52183 9.98484C5.23284 9.98484 8.99814 9.98484 12.7053 9.98484C11.5575 8.81376 10.3864 7.61844 9.19785 6.40665C8.99523 6.61314 8.8091 6.80508 8.62103 6.99412C8.23713 7.37996 7.77762 7.60487 7.23085 7.63299C6.59393 7.66595 6.05396 7.44297 5.60414 6.99412C5.4151 6.80508 5.22993 6.61314 5.02732 6.40665C3.84073 7.61941 2.66868 8.81473 1.52183 9.98484ZM0.845164 2.2526C0.845164 4.65293 0.845164 7.01351 0.845164 9.41287C2.04339 8.19235 3.21738 6.99606 4.36422 5.82789C3.21447 4.65972 2.04048 3.46731 0.845164 2.2526ZM13.3839 2.25939C12.1886 3.47409 11.0126 4.66844 9.87936 5.81917C11.0243 6.98637 12.1973 8.18169 13.3839 9.39155C13.3839 7.01157 13.3839 4.65293 13.3839 2.25939Z"
                      fill="#D1D1D1"
                    />
                  </svg>
                }
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}

              <InputWithSvg
                type={"password"}
                field={password}
                setField={setPassword}
                placeholder="Password"
                icon={
                  <svg
                    width="12"
                    height="15"
                    viewBox="0 0 12 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.71586 5.76468C2.71586 5.29893 2.71765 4.85289 2.71496 4.40595C2.71228 3.92945 2.7893 3.46908 2.96485 3.02482C3.53002 1.59981 5.04281 0.690703 6.52246 0.84655C8.16065 1.01852 9.44415 2.27067 9.63313 3.81839C9.70299 4.38893 9.66896 4.97201 9.6815 5.54972C9.68329 5.616 9.6815 5.68228 9.6815 5.73065C9.95378 5.77006 10.2135 5.7826 10.458 5.84798C11.2203 6.05309 11.7863 6.77858 11.7899 7.56946C11.798 9.38589 11.8007 11.2032 11.7899 13.0196C11.7845 13.9977 10.9542 14.8208 9.97528 14.8235C7.45934 14.8316 4.94339 14.8307 2.42745 14.8235C1.43415 14.8208 0.608342 13.9905 0.604759 12.9972C0.597594 11.1996 0.59849 9.40201 0.603864 7.60529C0.607447 6.60303 1.42788 5.78349 2.43014 5.76468C2.51881 5.76289 2.60569 5.76468 2.71586 5.76468ZM6.19375 13.8947C7.40828 13.8947 8.62192 13.8947 9.83645 13.8947C10.4795 13.8947 10.862 13.514 10.8629 12.8736C10.8629 11.1593 10.8629 9.4441 10.8629 7.72979C10.8629 7.07684 10.484 6.69708 9.83287 6.69708C7.40918 6.69708 4.98639 6.69708 2.5627 6.69708C1.91961 6.69708 1.53715 7.07863 1.53715 7.71904C1.53715 9.43873 1.53715 11.1584 1.53715 12.8781C1.53715 13.5105 1.9205 13.8947 2.55195 13.8956C3.76559 13.8947 4.97922 13.8947 6.19375 13.8947ZM8.7294 5.75752C8.73567 5.74677 8.74015 5.74229 8.74015 5.73871C8.73029 5.11891 8.77687 4.49104 8.69715 3.8793C8.54399 2.70686 7.488 1.80761 6.31377 1.76999C5.07864 1.73058 3.99309 2.53668 3.72528 3.7118C3.57391 4.37729 3.66796 5.05621 3.65452 5.72975C3.65452 5.73781 3.66437 5.74588 3.67154 5.75752C5.35719 5.75752 7.04464 5.75752 8.7294 5.75752Z"
                      fill="#D1D1D1"
                    />
                    <path
                      d="M5.56728 10.8871C5.56728 10.8145 5.56459 10.7411 5.56728 10.6685C5.57534 10.4598 5.55115 10.2762 5.42218 10.0854C5.17049 9.71372 5.28693 9.2005 5.64072 8.92464C6.00078 8.64339 6.514 8.67295 6.83823 8.99271C7.16247 9.31246 7.20188 9.82837 6.91974 10.1875C6.85436 10.2708 6.83197 10.3514 6.83286 10.4527C6.83644 10.7491 6.83555 11.0456 6.83376 11.3412C6.83107 11.6806 6.64925 11.8598 6.30889 11.8624C6.22112 11.8633 6.13424 11.8642 6.04646 11.8615C5.76253 11.8535 5.57713 11.669 5.56817 11.3824C5.5628 11.2176 5.56728 11.0519 5.56728 10.8871Z"
                      fill="#D1D1D1"
                    />
                  </svg>
                }
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}

              {/* forgot password and checkbox */}
              <div className="my-4">
                <span className="flex justify-between font-[500] text-xs">
                  <span className="flex gap-1 items-center">
                    <span className="w-3.5 h-3.5 rounded-sm border border-gray-200"></span>
                    <p>Keep me logged in</p>
                  </span>
                  <p
                    onClick={() => setforgot(true)}
                    className="text-blue-600 underline cursor-pointer "
                  >
                    Forgot Password?
                  </p>
                </span>
              </div>
            </div>
          </>
        ) : null}

        <button
          onClick={forgot ? handleForgot : handleLogin}
          disabled={loading}
          className={`w-xs bg-orange-500 max-md:w-30 cursor-pointer text-white font-semibold text-sm py-2 mx-auto rounded-md flex items-center justify-center gap-2 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Processing...
            </>
          ) : forgot === false ? (
            "LOGIN"
          ) : (
            "SEND PASSWORD RESET LINK"
          )}
        </button>

        {/* OR section */}
        {forgot === false && (
          <div className="">
            <div className="flex items-center w-full gap-3 max-md:mb-3 text-sm text-gray-400">
              <span className="h-[1px] w-[45%] bg-gray-300"></span>
              <p>OR</p>
              <span className="h-[1px] w-[45%] bg-gray-300"></span>
            </div>

            {/*google login button */}
            <div className="w-fit mx-auto  flex items-center justify-center ">
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
            <span className="flex gap-1 max-md:mt-3 text-center text-xs mt-2 font-[500]">
              <p>Not Registered Yet?</p>
              <Link
                onClick={() => setShowLogin(false)}
                href="/register"
                className="text-orange-600 underline"
              >
                Create an account
              </Link>
            </span>
          </div>
        )}

        {/* back button for forgot password */}
        {forgot && (
          <button
            className="text-orange-500 hover:underline cursor-pointer font-[500] text-sm p-2 flex items-center gap-1 rounded-md capitalize"
            onClick={() => setforgot(false)}
          >
            <IoArrowBack />
            back
          </button>
        )}

        {otpPop && <OTPPopup setPop={setOtpPop} userId={userId} />}
        {/* Error Alert */}
        {/* {resError && (
        <ResponseAlert text={resError} onClose={() => setResError(null)} />
      )} */}
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
