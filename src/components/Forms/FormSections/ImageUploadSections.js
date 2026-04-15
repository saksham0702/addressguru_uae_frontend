import React, { useRef, useState, useEffect } from "react";
import ImageCropper from "./ImageCrop";

const APP_URL = "https://addressguru.ae/api";
const MAX_FILE_SIZE = 2 * 1024 * 1024;

function uid() {
  return Math.random().toString(36).slice(2);
}

const isInvalidFormat = (file) => file.type === "image/avif";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconUpload = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "100%", height: "100%" }}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const IconX = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    style={{ width: "100%", height: "100%" }}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconChevronLeft = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "100%", height: "100%" }}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconChevronRight = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "100%", height: "100%" }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconImage = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "100%", height: "100%" }}
  >
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const IconCrop = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "100%", height: "100%" }}
  >
    <path d="M6 2v14a2 2 0 0 0 2 2h14" />
    <path d="M18 22V8a2 2 0 0 0-2-2H2" />
  </svg>
);

// ─── Image Preview ────────────────────────────────────────────────────────────
// Shows the image inside a 870×450 simulated frame so the user sees exactly
// how it will be displayed on the site.
function ImagePreview({ image, onNavigate, totalCount, currentIdx, onRecrop }) {
  const src = !image
    ? null
    : image.isExisting
      ? `${APP_URL}/${image.preview}`
      : image.preview;

  return (
    <div>
      {/* Frame label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#94a3b8",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Preview · 870 × 450 px
        </span>
        {image && (
          <button
            onClick={() => onRecrop(image)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontWeight: 700,
              color: "#2563eb",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 6,
              padding: "3px 10px",
              cursor: "pointer",
            }}
          >
            <span style={{ display: "inline-flex", width: 12, height: 12 }}>
              <IconCrop />
            </span>
            Re-crop
          </button>
        )}
      </div>

      {/* The 870:450 ratio frame */}
      <div
        style={{
          width: "100%",
          // 450/870 ≈ 51.72%
          aspectRatio: "870 / 450",
          borderRadius: 12,
          overflow: "hidden",
          position: "relative",
          background: "#f1f5f9",
          border: "1px dashed #cbd5e1",
        }}
      >
        {src ? (
          <img
            src={src}
            alt={image?.name}
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // fill the frame — matches how site will show it
              pointerEvents: "none",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <div style={{ width: 40, height: 40, color: "#cbd5e1" }}>
              <IconImage />
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#94a3b8",
                fontWeight: 500,
              }}
            >
              Select an image to preview
            </p>
          </div>
        )}

        {totalCount > 1 && (
          <>
            <button onClick={() => onNavigate(-1)} style={navBtnStyle("left")}>
              <span
                style={{
                  display: "inline-flex",
                  width: 14,
                  height: 14,
                  color: "#fff",
                }}
              >
                <IconChevronLeft />
              </span>
            </button>
            <button onClick={() => onNavigate(1)} style={navBtnStyle("right")}>
              <span
                style={{
                  display: "inline-flex",
                  width: 14,
                  height: 14,
                  color: "#fff",
                }}
              >
                <IconChevronRight />
              </span>
            </button>
          </>
        )}

        {image && totalCount > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.5)",
              borderRadius: 20,
              padding: "3px 10px",
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {currentIdx + 1} / {totalCount}
          </div>
        )}
      </div>
    </div>
  );
}

const navBtnStyle = (side) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  [side]: 10,
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: "rgba(0,0,0,0.45)",
  border: "1px solid rgba(255,255,255,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  padding: 0,
  zIndex: 4,
});

// ─── Thumbnail Strip ──────────────────────────────────────────────────────────
function ThumbnailStrip({ images, activeIdx, onSelect, onRemove, onRecrop }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && activeIdx !== null) {
      const el = ref.current.children[activeIdx];
      if (el)
        el.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
    }
  }, [activeIdx]);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        paddingBottom: 4,
        scrollbarWidth: "thin",
        scrollbarColor: "#cbd5e1 transparent",
      }}
    >
      {images.map((img, idx) => {
        const isActive = idx === activeIdx;
        const src = img.isExisting ? `${APP_URL}/${img.preview}` : img.preview;
        return (
          <div
            key={img.id}
            style={{
              position: "relative",
              flexShrink: 0,
              width: 72,
              height: 52,
              borderRadius: 8,
              overflow: "hidden",
              border: isActive ? "2px solid #3b82f6" : "2px solid #e8edf3",
              boxShadow: isActive ? "0 0 0 2px rgba(59,130,246,0.15)" : "none",
              transition: "all 0.15s",
              background: "#e8edf3",
            }}
          >
            <img
              src={src}
              alt={img.name}
              draggable={false}
              onClick={() => onSelect(idx)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                pointerEvents: "auto",
                cursor: "pointer",
              }}
            />

            {/* Index badge */}
            <div
              style={{
                position: "absolute",
                bottom: 2,
                left: 2,
                background: "rgba(0,0,0,0.45)",
                borderRadius: 3,
                padding: "1px 4px",
                fontSize: 9,
                fontWeight: 700,
                color: "#fff",
                pointerEvents: "none",
              }}
            >
              {idx + 1}
            </div>

            {/* Crop icon (bottom-right) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRecrop(img);
              }}
              title="Re-crop"
              style={{
                position: "absolute",
                bottom: 2,
                right: 18,
                width: 15,
                height: 15,
                borderRadius: 3,
                border: "none",
                background: "rgba(37,99,235,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  width: 9,
                  height: 9,
                  color: "#fff",
                }}
              >
                <IconCrop />
              </span>
            </button>

            {/* Remove (top-right) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(img.id);
              }}
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                width: 16,
                height: 16,
                borderRadius: "50%",
                border: "none",
                background: "rgba(239,68,68,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  width: 8,
                  height: 8,
                  color: "#fff",
                }}
              >
                <IconX />
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ImageUploadSections = ({ media, setMedia, error, clearError, refs }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState({ logo: "", images: "" });
  const [activeIdx, setActiveIdx] = useState(null);

  // Crop state
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [cropType, setCropType] = useState(null); // "logo" | "images"
  const [recropId, setRecropId] = useState(null); // id of image being re-cropped (null = new)

  const logoInputRef = useRef(null);
  const multipleInputRef = useRef(null);

  useEffect(() => {
    if (media?.images?.length && activeIdx === null) setActiveIdx(0);
    if (!media?.images?.length) setActiveIdx(null);
  }, [media?.images?.length]);

  const validate = (f) => f.size <= MAX_FILE_SIZE;

  // ── Logo ──
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || isInvalidFormat(file)) {
      setUploadError((p) => ({
        ...p,
        logo: "AVIF format is not supported. Use PNG, JPG or WebP.",
      }));
      return;
    }
    if (!validate(file)) {
      setUploadError((p) => ({ ...p, logo: "File size must be 2MB or less." }));
      if (logoInputRef.current) logoInputRef.current.value = "";
      return;
    }
    setUploadError((p) => ({ ...p, logo: "" }));
    if (clearError) clearError("logo");
    const reader = new FileReader();
    reader.onload = (ev) => {
      setMedia((prev) => ({
        ...prev,
        logo: {
          id: uid(),
          file,
          preview: ev.target.result,
          name: file.name,
          isExisting: false,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setMedia((p) => ({ ...p, logo: null }));
    if (logoInputRef.current) logoInputRef.current.value = "";
    setUploadError((p) => ({ ...p, logo: "" }));
    if (clearError) clearError("logo");
  };

  // ── Images ──
  const handleMultipleUpload = (files) => {
    const allowedCount = 10 - (media.images?.length || 0);
    if (allowedCount <= 0) {
      setUploadError((p) => ({ ...p, images: "Maximum 10 images allowed." }));
      return;
    }
    const invalidFiles = Array.from(files).filter((f) => isInvalidFormat(f));
    if (invalidFiles.length) {
      setUploadError((p) => ({
        ...p,
        images: "AVIF images are not supported.",
      }));
      return;
    }
    const imageFiles = Array.from(files)
      .filter((f) => f.type.startsWith("image/") && !isInvalidFormat(f))
      .slice(0, allowedCount);
    if (!imageFiles.length) {
      setUploadError((p) => ({
        ...p,
        images: "Please upload valid image files.",
      }));
      return;
    }
    const oversized = imageFiles.filter((f) => !validate(f));
    if (oversized.length) {
      setUploadError((p) => ({
        ...p,
        images: `${oversized.length} file(s) exceed 2MB limit.`,
      }));
      return;
    }
    setUploadError((p) => ({ ...p, images: "" }));
    if (clearError) clearError("images");

    // Open cropper for the first file
    const file = imageFiles[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCropImageSrc(ev.target.result);
      setCropType("images");
      setRecropId(null);
    };
    reader.readAsDataURL(file);

    // Remaining files: add without crop
    imageFiles.slice(1).forEach((f) => {
      const r = new FileReader();
      r.onload = (ev) =>
        setMedia((p) => ({
          ...p,
          images: [
            ...(p.images || []),
            {
              id: uid(),
              file: f,
              preview: ev.target.result,
              name: f.name,
              isExisting: false,
            },
          ],
        }));
      r.readAsDataURL(f);
    });
  };

  // ── Re-crop an existing image ──
  const handleRecrop = (img) => {
    const src = img.isExisting ? `${APP_URL}/${img.preview}` : img.preview;
    setCropImageSrc(src);
    setCropType("images");
    setRecropId(img.id); // track which image we're replacing
  };

  // ── Crop done ──
  const handleCropDone = (cropped) => {
    if (cropType === "logo") {
      setMedia((p) => ({ ...p, logo: cropped }));
    } else if (recropId) {
      // Replace the existing image in-place, keep same id & position
      setMedia((p) => ({
        ...p,
        images: (p.images || []).map((img) =>
          img.id === recropId ? { ...img, ...cropped } : img,
        ),
      }));
    } else {
      setMedia((p) => ({
        ...p,
        images: [...(p.images || []), { id: uid(), ...cropped }],
      }));
    }
    setCropImageSrc(null);
    setCropType(null);
    setRecropId(null);
  };

  const removeImage = (id) => {
    setMedia((p) => {
      const next = (p.images || []).filter((img) => img.id !== id);
      setActiveIdx((prev) =>
        next.length ? Math.min(prev ?? 0, next.length - 1) : null,
      );
      return { ...p, images: next };
    });
  };

  const navigate = (dir) => {
    if (!media?.images?.length) return;
    setActiveIdx((i) => (i + dir + media.images.length) % media.images.length);
  };

  const activeImage = (media?.images || [])[activeIdx] ?? null;
  const imageCount = media?.images?.length || 0;
  const atLimit = imageCount >= 10;

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "10px 60px",
        padding: "24px 20px",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* ── Logo Upload ── */}
      <section ref={refs?.logoRef} style={{ marginBottom: 28 }}>
        <Label
          label="Logo / Feature Image"
          required
          error={uploadError.logo || error?.logo}
        />
        <div style={card}>
          {!media?.logo ? (
            <div style={{ textAlign: "center" }}>
              <div style={iconCircle("#f0fdf4", "#16a34a")}>
                <IconImage />
              </div>
              <p
                style={{
                  margin: "8px 0 2px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#475569",
                }}
              >
                Upload your logo
              </p>
              <p style={{ margin: "0 0 14px", fontSize: 12, color: "#94a3b8" }}>
                PNG, JPG, WebP · Max 2MB
              </p>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleLogoUpload}
                id="logo-upload"
                style={{ display: "none" }}
              />
              <label htmlFor="logo-upload" style={uploadBtn("#16a34a")}>
                <span style={{ display: "inline-flex", width: 13, height: 13 }}>
                  <IconUpload />
                </span>
                Choose File
              </label>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={
                    media.logo.isExisting
                      ? `${APP_URL}/${media.logo.preview}`
                      : media.logo.preview
                  }
                  alt="Logo"
                  style={{
                    width: 96,
                    height: 96,
                    objectFit: "contain",
                    borderRadius: 12,
                    border: "1px solid #e8edf3",
                    background: "#f8fafc",
                    padding: 6,
                  }}
                />
                <button onClick={removeLogo} style={removeBtn}>
                  <span
                    style={{
                      display: "inline-flex",
                      width: 9,
                      height: 9,
                      color: "#fff",
                    }}
                  >
                    <IconX />
                  </span>
                </button>
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#0f172a",
                    margin: "0 0 2px",
                  }}
                >
                  {media.logo.name || "Logo"}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#22c55e",
                    margin: "0 0 8px",
                    fontWeight: 600,
                  }}
                >
                  ✓ Uploaded
                </p>
                <button
                  onClick={() => logoInputRef.current?.click()}
                  style={textBtn("#16a34a")}
                >
                  Change →
                </button>
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleLogoUpload}
                style={{ display: "none" }}
              />
            </div>
          )}
        </div>
      </section>

      {/* ── Images Upload ── */}
      <section ref={refs?.imagesRef}>
        <Label
          label="Images"
          required
          error={uploadError.images || error?.images}
        />

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            handleMultipleUpload(e.dataTransfer.files);
          }}
          style={{
            ...card,
            borderColor: isDragOver ? "#3b82f6" : "#e2e8f0",
            background: isDragOver ? "#eff6ff" : "#fff",
            transition: "all 0.2s",
            opacity: atLimit ? 0.7 : 1,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={iconCircle("#eff6ff", "#2563eb")}>
              <IconUpload />
            </div>
            <p
              style={{
                margin: "8px 0 2px",
                fontSize: 14,
                fontWeight: 500,
                color: "#475569",
              }}
            >
              {atLimit
                ? "Image limit reached"
                : "Drag & drop or click to upload"}
            </p>
            <p
              style={{
                margin: "0 0 14px",
                fontSize: 12,
                fontWeight: 600,
                color: atLimit ? "#ef4444" : "#94a3b8",
              }}
            >
              {imageCount} / 10 uploaded{atLimit && " · Limit reached"}
            </p>
            <input
              ref={multipleInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              multiple
              onChange={(e) => handleMultipleUpload(e.target.files)}
              id="multi-upload"
              style={{ display: "none" }}
              disabled={atLimit}
            />
            <label
              htmlFor="multi-upload"
              style={{
                ...uploadBtn("#2563eb"),
                opacity: atLimit ? 0.5 : 1,
                pointerEvents: atLimit ? "none" : "auto",
              }}
            >
              <span style={{ display: "inline-flex", width: 13, height: 13 }}>
                <IconUpload />
              </span>
              Choose Images
            </label>
          </div>
        </div>

        {/* Preview section */}
        {imageCount > 0 && (
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <ImagePreview
              image={activeImage}
              onNavigate={navigate}
              totalCount={imageCount}
              currentIdx={activeIdx ?? 0}
              onRecrop={handleRecrop}
            />

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e8edf3",
                borderRadius: 12,
                padding: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Gallery
                  </span>
                  <span
                    style={{
                      background: "#e2e8f0",
                      borderRadius: 20,
                      padding: "1px 8px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#475569",
                    }}
                  >
                    {imageCount}
                  </span>
                </div>
                {activeImage && (
                  <button
                    onClick={() => removeImage(activeImage.id)}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#ef4444",
                      background: "#fff5f5",
                      border: "1px solid #fee2e2",
                      borderRadius: 6,
                      padding: "3px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Remove selected
                  </button>
                )}
              </div>
              <ThumbnailStrip
                images={media.images}
                activeIdx={activeIdx}
                onSelect={setActiveIdx}
                onRemove={removeImage}
                onRecrop={handleRecrop}
              />
            </div>
          </div>
        )}
      </section>

      {/* ── Cropper Modal ── */}
      {cropImageSrc && (
        <ImageCropper
          image={cropImageSrc}
          onCancel={() => {
            setCropImageSrc(null);
            setCropType(null);
            setRecropId(null);
          }}
          onCropDone={handleCropDone}
        />
      )}
    </div>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function Label({ label, required, error }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "#0f172a",
        }}
      >
        {label}
      </h3>
      {required && <span style={{ color: "#ef4444", fontSize: 14 }}>*</span>}
      {error && (
        <span style={{ color: "#ef4444", fontSize: 12, fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
}

const iconCircle = (bg, color) => ({
  width: 40,
  height: 40,
  color,
  margin: "0 auto 4px",
  background: bg,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 9,
  boxSizing: "border-box",
});

const removeBtn = {
  position: "absolute",
  top: -5,
  right: -5,
  width: 20,
  height: 20,
  borderRadius: "50%",
  background: "#ef4444",
  border: "2px solid #fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  padding: 0,
};

const textBtn = (color) => ({
  background: "none",
  border: "none",
  color,
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  padding: 0,
});

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "2px dashed #e2e8f0",
  padding: "24px 20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

const uploadBtn = (bg) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 18px",
  borderRadius: 9,
  background: bg,
  color: "#fff",
  fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
  border: "none",
  textDecoration: "none",
});

export default ImageUploadSections;
