import React from "react";
import InputWithTitle from "../InputWithTitle";

const SocialDetails = ({ social, setSocial, error, clearError, refs }) => {
  const handleChange = (field, value, errorKey) => {
    setSocial((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (clearError && errorKey) {
      clearError(errorKey);
    }
  };

  const fields = [
    {
      key: "websiteLink",
      title: "Website Link",
      placeholder: "https://yourwebsite.com",
      ref: refs?.websiteLinkRef,
      errorKey: "websiteLink",
    },
    {
      key: "videoLink",
      title: "Video Link",
      placeholder: "https://youtube.com/watch?v=...",
      ref: refs?.videoLinkRef,
      errorKey: "videoLink",
    },
    {
      key: "facebook",
      title: "Facebook",
      placeholder: "https://facebook.com/yourpage",
      ref: refs?.facebookRef,
      errorKey: "facebook",
    },
    {
      key: "instagram",
      title: "Instagram",
      placeholder: "https://instagram.com/yourprofile",
      ref: refs?.instagramRef,
      errorKey: "instagram",
    },
    {
      key: "twitter",
      title: "Twitter / X",
      placeholder: "https://twitter.com/yourprofile",
      ref: refs?.twitterRef,
      errorKey: "twitter",
    },
    {
      key: "linkedin",
      title: "LinkedIn",
      placeholder: "https://linkedin.com/company/...",
      ref: refs?.linkedinRef,
      errorKey: "linkedin",
    },
    {
      key: "youtube",
      title: "Youtube Channel",
      placeholder: "https://youtube.com/...",
      ref: refs?.youtubeRef,
      errorKey: "youtube",
    },
  ];

  return (
    <section className="mt-8">
      <span className="flex items-center">
        <h3 className="text-xl font-semibold uppercase text-gray-800">
          Social Details
        </h3>
      </span>

      <p className="text-sm text-gray-500 mt-1">
        Add your business website and social media links.
      </p>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {fields.map((field) => (
          <div key={field.key} ref={field.ref}>
            <InputWithTitle
              title={field.title}
              header=""
              isTextarea={false}
              placeholder={field.placeholder}
              error={error?.[field.errorKey]}
              value={social[field.key] || ""}
              onChange={(e) =>
                handleChange(field.key, e.target.value, field.errorKey)
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SocialDetails;