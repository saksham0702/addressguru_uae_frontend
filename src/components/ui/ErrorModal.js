"use client";

import { useEffect, useState } from "react";
import { X, XCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

export default function ErrorModal({
  message,
  type = "error",
  onClose,
  duration = 4000,
}) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) return 0;
        return prev - 100 / (duration / 16); // 60fps
      });
    }, 16);

    // Auto close timer
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(), 300); // Wait for exit animation
  };

  const config = {
    error: {
      icon: XCircle,
      title: "Error",
      description: "Something went wrong",
      colors: {
        border: "border-red-500",
        bg: "bg-white",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        progress: "bg-red-500",
        shadow: "shadow-red-500/20",
      },
    },
    warning: {
      icon: AlertTriangle,
      title: "Warning",
      description: "Please review",
      colors: {
        border: "border-amber-500",
        bg: "bg-white",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        progress: "bg-amber-500",
        shadow: "shadow-amber-500/20",
      },
    },
    info: {
      icon: Info,
      title: "Information",
      description: "Update available",
      colors: {
        border: "border-blue-500",
        bg: "bg-white",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        progress: "bg-blue-500",
        shadow: "shadow-blue-500/20",
      },
    },
    success: {
      icon: CheckCircle2,
      title: "Success",
      description: "Completed successfully",
      colors: {
        border: "border-emerald-500",
        bg: "bg-white",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        progress: "bg-emerald-500",
        shadow: "shadow-emerald-500/20",
      },
    },
  };

  const current = config[type] || config.error;
  const Icon = current.icon;

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] transition-all duration-300 ease-out ${
        isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <div
        className={`w-[400px] rounded-lg border-l-4 ${current.colors.border} ${current.colors.bg} 
          shadow-lg ${current.colors.shadow} overflow-hidden backdrop-blur-sm`}
      >
        {/* Progress bar */}
        <div className="h-1 w-full bg-gray-100">
          <div
            className={`h-full ${current.colors.progress} transition-all duration-75 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* Icon container */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full ${current.colors.iconBg} 
                flex items-center justify-center ${current.colors.iconColor}`}
            >
              <Icon size={20} strokeWidth={2} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  {current.title}
                </h3>
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 
                    hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Close notification"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
