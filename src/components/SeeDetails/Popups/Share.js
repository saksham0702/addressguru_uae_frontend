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

// Share Component
export const Share = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const pageTitle =
    typeof document !== "undefined" ? document.title : "Check this out!";

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}`,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(
        pageTitle + " " + currentUrl
      )}`,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl
      )}&text=${encodeURIComponent(pageTitle)}`,
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/",
      color:
        "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
    },
    {
      name: "TikTok",
      icon: Music,
      url: "https://www.tiktok.com/",
      color: "bg-black hover:bg-gray-900",
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
