import React from "react";
import { User, Mail, Phone } from "lucide-react";

const NameNumberCard = ({ layout, formData, setFormData, errors = {} }) => {
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

      {/* PHONE (OPTIONAL - no mention) */}
      <div className="mb-1 flex items-center border rounded-lg bg-white border-gray-300">
        <div className="border-r p-2 border-gray-300">
          <Phone size={16} className="text-gray-400" />
        </div>
        <input
          type="tel"
          placeholder="Enter your phone"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full outline-none text-sm px-3 py-2 font-medium bg-transparent"
        />
      </div>
    </div>
  );
};

export default NameNumberCard;
