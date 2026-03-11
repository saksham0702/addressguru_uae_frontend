import React, { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

const Loader = () => {
  const logoRef = useRef(null);
  const dotsRef = useRef([]);

  useLayoutEffect(() => {
    // Logo fade-in with scale
    gsap.fromTo(
      logoRef.current,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        ease: "power2.out",
      }
    );

    // Bouncing dots animation
    dotsRef.current.forEach((dot, i) => {
      gsap.to(dot, {
        y: -10,
        duration: 0.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.2, // Stagger each dot
      });
    });
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white  ">
      {/* Logo */}
      <div ref={logoRef}>
        <Image
          src="/assets/addressguru_logo.png"
          height={180}
          width={180}
          alt="logo"
          priority
        />
      </div>

      {/* Animated Dots */}
      <div className="mt-6 flex space-x-2">
        {[0, 1, 2].map((_, i) => (
          <div
            key={i}
            ref={(el) => (dotsRef.current[i] = el)}
            className="w-3 h-3 rounded-full bg-orange-500"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
