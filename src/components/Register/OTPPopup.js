"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { resend_otp, verify_otp } from "@/api/userAuth";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

const OTPPopup = ({ setPop, userId }) => {
  const otpLength = 6;
  const [otp, setOtp] = useState(Array(otpLength).fill(""));
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(60);
  const [resendAvailable, setResendAvailable] = useState(false);
  // Focus on the first OTP input when component mounts
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  const router = useRouter();
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setResendAvailable(true);
    }
  }, [timer]);
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handleResend = async (userId) => {
    setOtp(Array(otpLength).fill(""));
    const res = await resend_otp(userId);
    console.log("res", res);
    if (res?.status === 200) {
    } else {
    }
    setTimer(60);
    setResendAvailable(false);
  };

  const handleSubmit = async (userId) => {
    const code = otp.join("");
    if (code.length === otpLength) {
      const res = await verify_otp(userId, code);
      console.log("response of user after otp", res);
      if (res?.status === 200) {
        setPop(false); // ✅ correct action
        router.push("/dashboard");
      } else {
        // show some error message here
      }
    }
  };

  return (
    <div className="inset-0 h-full w-full fixed z-50 bg-gradient-to-r from-white/20 to-orange-300/90 backdrop-blur-[2px] flex items-center justify-center">
      <div className="w-full max-w-[400px] 2xl:scale-105 bg-white text-center p-5 rounded-4xl pb-15 shadow-xl">
        <button
          onClick={() => {
            setPop(false);
          }}
          className="text-orange-500 cursor-pointer mb-4 text-xs hover:underline text-start relative w-full"
        >
          ← Back to Register
        </button>

        <div className="flex justify-center mb-4">
          <Image
            src="/assets/register/otp.svg"
            alt="otp image"
            height={500}
            width={500}
            className="h-20 w-20 mt-2"
          />
        </div>

        <h2 className="text-xl font-bold mb-2">OTP Verification</h2>
        <p className="text-gray-600 mb-4">
          Enter OTP Code sent to Your E-mail <br />
          {/* <span className="font-semibold text-black">+91-7983356237</span> */}
        </p>

        <div className="flex justify-center gap-3 mb-4">
          {otp?.map((value, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-12 h-12 border rounded-md text-center text-lg font-semibold focus:outline-none focus:ring-2 ring-orange-500"
              value={value}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>

        <span className="text-sm text-gray-600  mb-6 flex flex-col font-semibold items-center">
          {"  Didn`t receive OTP Code? "}
          <section className="flex my-1 gap-2 ">
            <div className="text-gray-400 text-sm mb-2">
              {timer > 0 ? `00:${timer.toString().padStart(2, "0")} sec` : ""}
            </div>
            <span
              className={`font-[500] ${
                resendAvailable
                  ? "text-orange-500 hover:underline"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              onClick={() => resendAvailable && handleResend(userId)}
              disabled={!resendAvailable}
            >
              Resend Code
            </span>
          </section>
        </span>

        <button
          onClick={() => handleSubmit(userId)}
          className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-white font-bold py-2 px-6 w-xs rounded-lg mx-auto"
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
};

export default OTPPopup;
