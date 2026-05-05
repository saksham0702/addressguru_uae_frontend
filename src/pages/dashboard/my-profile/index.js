import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  User,
  Lock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/api/userAuth";
import Image from "next/image";
import { API_URL, APP_URL, COUNTRY_CODES } from "@/services/constants";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryDropdownRef = useRef(null);

  const { user } = useAuth();
  console.log("user", user?.data);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const filteredCountries = COUNTRY_CODES.filter((c) =>
    `${c.country} ${c.code}`
      .toLowerCase()
      .includes(countrySearch.toLowerCase()),
  );
  const [userData, setUserData] = useState(null);

  const [formData, setFormData] = useState({
    hobbies: [],
    socialLinks: {
      facebook: "",
      linkedin: "",
      instagram: "",
      telegram: "",
    },
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [newHobby, setNewHobby] = useState("");

  useEffect(() => {
    if (user?.data) {
      const data = user.data;

      setUserData({
        ...data,
        socialLinks: data.socialLinks || {},
      });

      setFormData({
        ...data,
        hobbies: Array.isArray(data.hobbies) ? data.hobbies : [],
        socialLinks: data.socialLinks || {
          facebook: "",
          linkedin: "",
          instagram: "",
          telegram: "",
        },
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addHobby = () => {
    if (newHobby.trim() && (formData?.hobbies?.length || 0) < 10) {
      setFormData((prev) => ({
        ...prev,
        hobbies: [...prev.hobbies, newHobby.trim()],
      }));
      setNewHobby("");
    }
  };

  const removeHobby = (index) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file, // actual file for backend
      avatar: URL.createObjectURL(file), // preview only
    }));
  };

  const handleSave = async () => {
    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "socialLinks") {
          // Remove _id before sending
          const { _id, ...cleanLinks } = formData.socialLinks || {};
          data.append("socialLinks", JSON.stringify(cleanLinks));
        } else if (key === "hobbies") {
          data.append("hobbies", JSON.stringify(formData.hobbies || []));
        } else if (key === "image") {
          // Only append if there's a new image file
          if (formData?.image && formData.image instanceof File) {
            data.append("image", formData.image);
          }
        } else if (key === "avatar") {
          // Skip avatar (it's just for preview)
          return;
        } else if (formData[key] !== undefined && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const response = await updateProfile(data);

      if (response?.success || response?.status) {
        setIsEditing(false);

        const updated = response.data;

        // Update both states
        setUserData({
          ...updated,
          socialLinks: updated.socialLinks || {
            facebook: "",
            linkedin: "",
            instagram: "",
            telegram: "",
          },
        });

        setFormData({
          ...updated,
          hobbies: Array.isArray(updated.hobbies) ? updated.hobbies : [],
          socialLinks: updated.socialLinks || {
            facebook: "",
            linkedin: "",
            instagram: "",
            telegram: "",
          },
        });

        // Close editing mode
        setIsEditing(false);

        // Clear password fields
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        alert("Profile updated successfully");
      } else {
        alert(response?.message || "Update failed");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const data = new FormData();
      data.append("oldPassword", passwordData.oldPassword);
      data.append("newPassword", passwordData.newPassword);

      const response = await updateProfile(data);

      if (response?.success || response?.status === 200) {
        alert("Password updated successfully");

        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert(response?.message || "Password update failed");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleCancel = () => {
    setFormData({ ...userData });
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <section className="w-full">
        <div className="w-full">
          {/* Header */}
          <div className="flex  justify-end  sticky top-0 z-30 mb-8">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-2.5   bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl overflow-hidden">
            {/* Avatar Section */}
            <div className="px-8 pb-8">
              <div className="relative  mb-6">
                <div className="relative inline-block">
                  <Image
                    src={`${APP_URL}/${formData?.avatar}` || "/assets/default-avatar.png"}
                    alt="Profile"
                    width={500}
                    height={500}
                    className="w-32 h-32 rounded-full border-4 border-gray-200  object-contain"
                  />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 p-2.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                      <Camera size={18} className="text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData?.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className={`font-medium px-4 py-2.5 ${userData?.name ? 'text-gray-900' : 'text-gray-400'}`}>
                      {userData?.name || "Not Updated"}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData?.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className={`font-medium px-4 py-2.5 ${userData?.email ? 'text-gray-900' : 'text-gray-400'}`}>
                      {userData?.email || "Not Updated"}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Phone Number
                  </label>

                  {isEditing ? (
                    <div className="flex gap-2 relative">
                      {/* Searchable Country Dropdown */}
                      <div className="relative w-36" ref={countryDropdownRef}>
                        <div
                          onClick={() =>
                            setShowCountryDropdown(!showCountryDropdown)
                          }
                          className="px-3 py-2.5 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-between"
                        >
                          <span>
                            {
                              COUNTRY_CODES.find(
                                (c) => c.code === formData?.country_code,
                              )?.flag
                            }{" "}
                            {formData?.country_code || "+971"}
                          </span>
                        </div>

                        {showCountryDropdown && (
                          <div className="absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {/* Search Input */}
                            <input
                              type="text"
                              placeholder="Search country..."
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              className="w-full px-3 py-2 border-b border-gray-200 outline-none"
                            />

                            {/* Options */}
                            {filteredCountries.map((c, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    country_code: c.code,
                                  }));
                                  setShowCountryDropdown(false);
                                  setCountrySearch("");
                                }}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                              >
                                {c.flag} {c.code} ({c.country})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Phone Input */}
                      <input
                        type="tel"
                        name="phone"
                        value={formData?.phone || ""}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <p className={`font-medium px-4 py-2.5 ${userData?.phone ? 'text-gray-900' : 'text-gray-400'}`}>
                      {userData?.phone ? `${userData?.country_code || '+971'} ${userData?.phone}` : "Not Updated"}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dob"
                      value={formData?.dob ? new Date(formData.dob).toISOString().split('T')[0] : ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : !userData?.dob ? (
                    <p className="text-gray-400 font-medium px-4 py-2.5">
                      Not Updated
                    </p>
                  ) : (
                    <p className="text-gray-900 font-medium px-4 py-2.5">
                      {new Date(userData?.dob).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    City
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData?.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className={`font-medium px-4 py-2.5 ${userData?.city ? 'text-gray-900' : 'text-gray-400'}`}>
                      {userData?.city || "Not Updated"}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Me
                </label>
                {isEditing ? (
                  <textarea
                    name="profile_bio"
                    value={formData?.profile_bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className={`px-4 py-2.5 rounded-lg ${userData?.profile_bio ? 'text-gray-700 bg-gray-50' : 'text-gray-400 bg-gray-50'}`}>
                    {userData?.profile_bio || "Not Updated"}
                  </p>
                )}
              </div>

              {/* Hobbies */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Hobbies & Interests
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {Array.isArray(formData?.hobbies) &&
                    formData.hobbies.map((hobby, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {hobby}
                        {isEditing && (
                          <button
                            onClick={() => removeHobby(index)}
                            className="hover:text-blue-900"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </span>
                    ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newHobby}
                      onChange={(e) => setNewHobby(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addHobby()}
                      placeholder="Add a hobby..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={addHobby}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <LinkIcon size={16} className="inline mr-2" />
                  Social Links
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Facebook */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Facebook
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={formData?.socialLinks?.facebook || ""}
                        onChange={(e) =>
                          handleSocialLinkChange("facebook", e.target.value)
                        }
                        placeholder="https://facebook.com/username"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    ) : userData?.socialLinks?.facebook ? (
                      <a
                        href={userData?.socialLinks?.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm block px-4 py-2 break-all"
                      >
                        {userData?.socialLinks?.facebook}
                      </a>
                    ) : (
                      <p className="text-gray-400 text-sm px-4 py-2">
                        Not provided
                      </p>
                    )}
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      LinkedIn
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={formData?.socialLinks?.linkedin || ""}
                        onChange={(e) =>
                          handleSocialLinkChange("linkedin", e.target.value)
                        }
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    ) : userData?.socialLinks?.linkedin ? (
                      <a
                        href={userData.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm block px-4 py-2 break-all"
                      >
                        {userData.socialLinks.linkedin}
                      </a>
                    ) : (
                      <p className="text-gray-400 text-sm px-4 py-2">
                        Not provided
                      </p>
                    )}
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Instagram
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={formData?.socialLinks?.instagram || ""}
                        onChange={(e) =>
                          handleSocialLinkChange("instagram", e.target.value)
                        }
                        placeholder="https://instagram.com/username"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    ) : userData?.socialLinks?.instagram ? (
                      <a
                        href={userData.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm block px-4 py-2 break-all"
                      >
                        {userData.socialLinks.instagram}
                      </a>
                    ) : (
                      <p className="text-gray-400 text-sm px-4 py-2">
                        Not provided
                      </p>
                    )}
                  </div>

                  {/* Telegram */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Telegram
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData?.socialLinks?.telegram || ""}
                        onChange={(e) =>
                          handleSocialLinkChange("telegram", e.target.value)
                        }
                        placeholder="@username"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    ) : userData?.socialLinks?.telegram ? (
                      <p className="text-gray-900 text-sm px-4 py-2">
                        {userData.socialLinks.telegram}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm px-4 py-2">
                        Not provided
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password Change Section */}
              {isEditing && (
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lock size={20} />
                    Change Password
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="oldPassword"
                          value={passwordData.oldPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handlePasswordUpdate}
                    className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default ProfilePage;
