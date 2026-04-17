import React, { useState } from "react";
import {
  Share2,
  Facebook,
  MessageCircle,
  Twitter,
  Instagram,
  Music,
  X, // Close Icon
} from "lucide-react";
import {
  FaFacebookF,
  FaWhatsapp,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

// Share Component
export const Share = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const pageTitle =
    typeof document !== "undefined" ? document.title : "Check this out!";

  const shareLinks = [
    {
      name: "Facebook",
      icon: FaFacebookF,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      color: "bg-[#1877F2] hover:bg-[#166FE5]",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      url: `https://wa.me/?text=${encodeURIComponent(pageTitle + " " + currentUrl)}`,
      color: "bg-[#25D366] hover:bg-[#1DA851]",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(pageTitle)}`,
      color: "bg-[#1DA1F2] hover:bg-[#0d8ddb]",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      url: "https://www.instagram.com/",
      color: "bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af]",
    },
  ];

  const handleShare = (url, name) => {
    if (name === "Instagram" || name === "TikTok") {
      alert(`Please copy the link and share it on ${name}`);
    } else {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl px-4 py-5">
      {/* Close Button */}
      <button
        onClick={() => onClose(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center justify-center mb-1.5">
        <Share2 className="w-5 h-5 text-blue-600 mr-3" />
        <h2 className="text-xl font-bold text-gray-800">Share This Page</h2>
      </div>

      <p className="text-center text-sm font-medium text-gray-600 mb-4">
        Share this page with your friends and followers on social media
      </p>

      <div className="flex flex-wrap justify-around">
        {shareLinks.map((platform) => {
          const Icon = platform.icon;
          return (
            <button
              key={platform.name}
              onClick={() => handleShare(platform.url, platform.name)}
              className={`${platform.color} text-white rounded-xl flex w-10 h-10 flex-col items-center justify-center transition-all transform hover:scale-105 shadow-lg`}
            >
              <Icon className="w-7 h-7" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
