"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  Shield,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/router";
import { createUser, updateUser } from "@/api/uaeadminlogin";

export default function CreateUser({ initialData = null }) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    roles: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Editor" },
    { id: 3, name: "Agent" },
    { id: 4, name: "BDE" },
    { id: 5, name: "User" },
  ];

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "",
        confirmPassword: "",
        phone: initialData.phone || "",
        roles: initialData.roles || [],
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleRoleChange = (roleId) => {
    setForm((prev) => ({
      ...prev,
      roles: [roleId],
    }));
  };

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(form.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!isEditMode || form.password) {
      if (!form.password) newErrors.password = "Password is required";
      else if (form.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";

      if (!form.confirmPassword)
        newErrors.confirmPassword = "Confirm your password";
      else if (form.password !== form.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.roles.length) newErrors.roles = "Please select a role";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    console.log(form);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        roles: form.roles,
      };

      if (form.password) {
        payload.password = form.password;
      }

      if (isEditMode) {
        await updateUser(initialData._id, payload);
      } else {
        await createUser(payload);
      }

      router.push("/admin/users");
    } catch (err) {
      setErrors({
        api: err?.response?.data?.message || "Failed to save user",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-12">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm">
        {/* Header */}

        <div className="border-b border-gray-200 px-8 py-6">
          <button
            onClick={() => router.push("/admin/users")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft size={16} />
            Back to Users
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode ? "Update User" : "Create New User"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isEditMode
              ? "Update user information and role."
              : "Add a new user and assign a role."}
          </p>
        </div>

        <div className="px-8 py-8">
          {errors.api && (
            <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
              {errors.api}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>

              <div className="mt-1 flex items-center border border-gray-300 rounded-lg px-3 h-11 focus-within:ring-2 focus-within:ring-[#FF6E04]">
                <User size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="John Doe"
                  className="w-full outline-none text-sm"
                />
              </div>

              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Phone Number
              </label>

              <div className="mt-1 flex items-center border border-gray-300 rounded-lg px-3 h-11 focus-within:ring-2 focus-within:ring-[#FF6E04]">
                <Phone size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="9876543210"
                  className="w-full outline-none text-sm"
                />
              </div>

              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">
                Email Address
              </label>

              <div className="mt-1 flex items-center border border-gray-300 rounded-lg px-3 h-11 focus-within:ring-2 focus-within:ring-[#FF6E04]">
                <Mail size={18} className="text-gray-400 mr-2" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="example@email.com"
                  className="w-full outline-none text-sm"
                />
              </div>

              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>

              <div className="mt-1 flex items-center border border-gray-300 rounded-lg px-3 h-11 focus-within:ring-2 focus-within:ring-[#FF6E04]">
                <Lock size={18} className="text-gray-400 mr-2" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder={
                    isEditMode
                      ? "Leave blank to keep current"
                      : "Enter password"
                  }
                  className="w-full outline-none text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-gray-400" />
                  ) : (
                    <Eye size={18} className="text-gray-400" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Confirm Password
              </label>

              <div className="mt-1 flex items-center border border-gray-300 rounded-lg px-3 h-11 focus-within:ring-2 focus-within:ring-[#FF6E04]">
                <Lock size={18} className="text-gray-400 mr-2" />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm password"
                  className="w-full outline-none text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} className="text-gray-400" />
                  ) : (
                    <Eye size={18} className="text-gray-400" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">
                User Role
              </label>

              <div className="mt-1 flex items-center border border-gray-300 rounded-lg px-3 h-11 focus-within:ring-2 focus-within:ring-[#FF6E04]">
                <Shield size={18} className="text-gray-400 mr-2" />

                <select
                  value={form.roles[0] || ""}
                  onChange={(e) => handleRoleChange(Number(e.target.value))}
                  className="w-full outline-none text-sm bg-transparent"
                >
                  <option value="">Select role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              {errors.roles && (
                <p className="text-xs text-red-500 mt-1">{errors.roles}</p>
              )}
            </div>

            {/* Button */}
            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-lg bg-[#FF6E04] hover:bg-[#e55f00] text-white font-medium text-sm transition shadow-sm hover:shadow-md"
              >
                {loading
                  ? isEditMode
                    ? "Updating User..."
                    : "Creating User..."
                  : isEditMode
                    ? "Update User"
                    : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
