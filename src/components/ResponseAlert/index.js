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
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
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
    <div
      ref={alertRef}
      key={text}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg whitespace-pre-line text-center z-50"
    >
      {text}
    </div>
  );
};

export default ResponseAlert;
