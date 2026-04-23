import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Camera,
  Mail,
  Briefcase,
  Calendar,
  MapPin,
  Instagram,
  Linkedin,
  Facebook,
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
    avatar: "https://via.placeholder.com/150",
    designation: "",
    location: "",
    social: {
      linkedin: "",
      instagram: "",
      facebook: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("social.")) {
      const key = name.split(".")[1];
      setProfile({
        ...profile,
        social: {
          ...profile.social,
          [key]: value,
        },
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Updated Profile:", profile);
    setIsEditing(false);
    setImagePreview(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview(null);
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Bar */}
      <div className="bg-white border-b  border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-medium shadow-sm hover:shadow"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-medium shadow-sm hover:shadow"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto mt-5 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              {/* Avatar Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={imagePreview || profile.avatar}
                    alt="avatar"
                    className="w-32 h-32 rounded-full mx-auto border-4 border-orange-100 object-cover"
                  />
                  {isEditing && (
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-orange-500 text-white p-2.5 rounded-full cursor-pointer hover:bg-orange-600 transition-all shadow-lg"
                    >
                      <Camera size={18} />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-4">
                  {profile.name}
                </h2>

                {profile.designation && (
                  <p className="text-orange-600 font-medium mt-1">
                    {profile.designation}
                  </p>
                )}
              </div>

              {/* Quick Info */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail size={18} className="text-gray-400" />
                  <span className="text-sm">{profile.email}</span>
                </div>

                {profile.location && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin size={18} className="text-gray-400" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}

                {memberSince && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar size={18} className="text-gray-400" />
                    <span className="text-sm">Member since {memberSince}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              {user && (
                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                      {user.statistics_totalListings || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total Listings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                      {user.statistics_activeListings || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Active</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-orange-500" />
                About
              </h3>

              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">
                      Bio
                    </label>
                    <p className="text-gray-700">
                      {profile.bio || "No bio added yet."}
                    </p>
                  </div>

                  {profile.designation && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Designation
                      </label>
                      <p className="text-gray-700">{profile.designation}</p>
                    </div>
                  )}

                  {profile.location && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">
                        Location
                      </label>
                      <p className="text-gray-700">{profile.location}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={profile.designation}
                      onChange={handleChange}
                      placeholder="e.g., Software Engineer, Designer"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      placeholder="e.g., New York, USA"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      rows="4"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            {isEditing && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Social Links
              </h3>

              {!isEditing ? (
                <div className="space-y-3">
                  {profile.social.linkedin && (
                    <a
                      href={profile.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-orange-500 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Linkedin size={20} className="text-blue-600" />
                      </div>
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  )}

                  {profile.social.instagram && (
                    <a
                      href={profile.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-orange-500 transition-colors"
                    >
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                        <Instagram size={20} className="text-pink-600" />
                      </div>
                      <span className="text-sm">Instagram</span>
                    </a>
                  )}

                  {profile.social.facebook && (
                    <a
                      href={profile.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-orange-500 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Facebook size={20} className="text-blue-700" />
                      </div>
                      <span className="text-sm">Facebook</span>
                    </a>
                  )}

                  {!profile.social.linkedin &&
                    !profile.social.instagram &&
                    !profile.social.facebook && (
                      <p className="text-gray-500 text-sm">
                        No social links added yet.
                      </p>
                    )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
                      <Linkedin size={16} className="text-blue-600" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="social.linkedin"
                      value={profile.social.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
                      <Instagram size={16} className="text-pink-600" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      name="social.instagram"
                      value={profile.social.instagram}
                      onChange={handleChange}
                      placeholder="https://instagram.com/username"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-2">
                      <Facebook size={16} className="text-blue-700" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      name="social.facebook"
                      value={profile.social.facebook}
                      onChange={handleChange}
                      placeholder="https://facebook.com/username"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Activity Stats */}
            {user && !isEditing && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Activity Overview
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Jobs</p>
                    <p className="text-xl font-bold text-gray-800">
                      {user.statistics_JobsListings || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Properties</p>
                    <p className="text-xl font-bold text-gray-800">
                      {user.statistics_PropertiesListings || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Total Views</p>
                    <p className="text-xl font-bold text-gray-800">
                      {user.statistics_totalViews || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Total Calls</p>
                    <p className="text-xl font-bold text-gray-800">
                      {user.statistics_totalCalls || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Total Leads</p>
                    <p className="text-xl font-bold text-gray-800">
                      {user.statistics_totalLeads || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Rating</p>
                    <p className="text-xl font-bold text-gray-800">
                      {user.statistics_rating || 0}
                      <span className="text-sm text-gray-500">/5</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
