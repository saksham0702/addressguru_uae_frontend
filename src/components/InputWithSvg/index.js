import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputWithSvg = ({ icon, placeholder, field, setField, error, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const isPassword = type === "password";

  useEffect(() => {
    // Trigger every time error changes (even if same text)
    if (error && error !== "") {
      setLocalError(error);
      setField(""); // clear field value on every error
      setIsShaking(true);

      const timer = setTimeout(() => setIsShaking(false), 400);
      return () => clearTimeout(timer);
    } else {
      // clear local error when error prop becomes empty/null
      setLocalError("");
    }
  }, [error]);

  // Clear error and allow retyping
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
        {/* Left Icon */}
        <div
          className={`flex items-center justify-center px-3 transition-colors duration-300 ${
            localError ? "text-red-500" : "text-gray-700"
          }`}
        >
          {icon}
        </div>

        {/* Input Field */}
        <input
          type={isPassword && !showPassword ? "password" : "text"}
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

        {/* Eye Icon for password field */}
        {isPassword && (
          <div
            className={`px-3 cursor-pointer transition-colors duration-300 ${
              localError ? "text-red-400" : "text-gray-600 hover:text-black"
            }`}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputWithSvg;
