import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const ResponseAlert = ({ text, onClose }) => {
  const alertRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!text) return;

    // kill any previous animations
    gsap.killTweensOf(alertRef.current);
    clearTimeout(timeoutRef.current);

    // fade in
    gsap.fromTo(
      alertRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
    );

    // auto hide after 2.5s
    timeoutRef.current = setTimeout(() => {
      gsap.to(alertRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => onClose && onClose(),
      });
    }, 2500);

    return () => {
      clearTimeout(timeoutRef.current);
      gsap.killTweensOf(alertRef.current);
    };
  }, [text, onClose]);

  if (!text) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={alertRef} key={text}>
      <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
        {/* Icon */}
        <span className="text-red-500">⚠️</span>

        {/* Message */}
        <p className="text-sm font-medium flex-1">{text}</p>

        {/* Close */}
        <button onClick={onClose} className="text-red-400 hover:text-red-600">
          ✕
        </button>
      </div>
    </div>
  );
};

export default ResponseAlert;
