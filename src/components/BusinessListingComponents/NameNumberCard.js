import React from "react";
import { User, Mail } from "lucide-react";
import CountryCodePhoneInput from "@/components/shared/CountryCodePhoneInput";

const NameNumberCard = ({
  layout,
  formData,
  setFormData,
  errors = {},
  countryCode = "+971",
  setCountryCode,
}) => {
  return (
    <div
      className={`${layout === "row" ? "flex gap-3 w-sm" : "flex flex-col"}`}
    >
      {/* NAME */}
      <div
        className={`mb-1 flex items-center border rounded-lg bg-white ${
          errors?.name ? "border-red-500" : "border-gray-300"
        }`}
      >
        <div
          className={`border-r p-2 ${
            errors?.name ? "border-red-500" : "border-gray-300"
          }`}
        >
          <User size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full outline-none text-sm px-3 py-2 font-medium bg-transparent"
        />
      </div>

      {/* EMAIL */}
      <div
        className={`mb-1 flex items-center border rounded-lg bg-white ${
          errors?.email ? "border-red-500" : "border-gray-300"
        }`}
      >
        <div
          className={`border-r p-2 ${
            errors?.email ? "border-red-500" : "border-gray-300"
          }`}
        >
          <Mail size={16} className="text-gray-400" />
        </div>
        <input
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full outline-none text-sm px-3 py-2 font-medium bg-transparent"
        />
      </div>

      {/* PHONE with Country Code */}
      <div className="mb-1">
        <CountryCodePhoneInput
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          countryCode={countryCode}
          setCountryCode={setCountryCode || (() => {})}
          placeholder="Enter your phone"
          variant="bordered"
        />
      </div>
    </div>
  );
};

export default NameNumberCard;
