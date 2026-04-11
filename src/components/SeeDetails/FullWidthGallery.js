"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const FullWidthGallery = ({ images = [] }) => {
  const APP_URL = "https://addressguru.ae/api";
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  const openLightbox = (index) => setLightbox({ open: true, index });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });

  const prev = useCallback(() =>
    setLightbox((s) => ({ ...s, index: (s.index - 1 + images.length) % images.length })),
    [images.length]
  );
  const next = useCallback(() =>
    setLightbox((s) => ({ ...s, index: (s.index + 1) % images.length })),
    [images.length]
  );

  useEffect(() => {
    if (!lightbox.open) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox.open, prev, next]);

  if (!images?.length) return null;

  const mainImage = images[0];
  const sideImages = images.slice(1, 5); // exactly 4 for 2×2

  return (
    <>
      {/* MAIN GALLERY GRID */}
      <div className=" grid grid-cols-[65%_35%] gap-2 h-[300px]  md:h-[420px]">
        {/* LEFT — big image */}
        <div
          className="relative rounded-xl overflow-hidden   cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={`${APP_URL}/${mainImage}`}
            alt="main"
            fill
            className="object-cover group-hover:scale-[1.02]  transition-transform duration-300"
          />
        </div>

        {/* RIGHT — 2×2 grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {sideImages.map((img, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(i + 1)}
            >
              <Image
                src={`${APP_URL}/${img}`}
                alt={`side-${i}`}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
              {/* "+N more" overlay on the last tile */}
              {i === 3 && images.length > 5 && (
                <div
                  className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center rounded-xl cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); openLightbox(4); }}
                >
                  <span className="text-white text-2xl font-medium">+{images.length - 4}</span>
                  <span className="text-white/70 text-xs mt-0.5">more photos</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-5 text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
            onClick={closeLightbox}
          >
            ×
          </button>

          {/* Main image */}
          <div
            className="relative w-[85vw] max-w-4xl h-[65vh] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={`${APP_URL}/${images[lightbox.index]}`}
              alt={`gallery-${lightbox.index}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Controls */}
          <div
            className="flex items-center gap-5 mt-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="text-white w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-xl"
              onClick={prev}
            >
              ‹
            </button>
            <span className="text-white/60 text-sm min-w-[60px] text-center">
              {lightbox.index + 1} / {images.length}
            </span>
            <button
              className="text-white w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-xl"
              onClick={next}
            >
              ›
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex gap-1.5 mt-3" onClick={(e) => e.stopPropagation()}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full transition ${
                  i === lightbox.index ? "bg-white" : "bg-white/30"
                }`}
                onClick={() => setLightbox((s) => ({ ...s, index: i }))}
              />
            ))}
          </div>

          {/* Thumbnail strip */}
          <div
            className="flex gap-2 mt-4 overflow-x-auto max-w-[85vw] pb-1"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, i) => (
              <div
                key={i}
                className={`relative w-16 h-11 rounded-md overflow-hidden flex-shrink-0 cursor-pointer transition-all ${
                  i === lightbox.index
                    ? "opacity-100 ring-2 ring-white"
                    : "opacity-50 hover:opacity-75"
                }`}
                onClick={() => setLightbox((s) => ({ ...s, index: i }))}
              >
                <Image
                  src={`${APP_URL}/${img}`}
                  alt={`thumb-${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FullWidthGallery;