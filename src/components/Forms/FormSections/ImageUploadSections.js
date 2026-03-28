import React, { useRef, useState, useEffect } from "react";

const APP_URL = "https://addressguru.ae/api";
const MAX_FILE_SIZE = 2 * 1024 * 1024;

function uid() {
  return Math.random().toString(36).slice(2);
}

// ─── Icons ───────────────────────────────────────────────────────────────────
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
const IconMinus = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    style={{ width: "100%", height: "100%" }}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconPlus = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    style={{ width: "100%", height: "100%" }}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ─── Image Preview ────────────────────────────────────────────────────────────
function ImagePreview({ image, zoom, onNavigate, totalCount, currentIdx }) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

  useEffect(() => {
    setPan({ x: 0, y: 0 });
  }, [image?.id]);

  const onMouseDown = (e) => {
    if (zoom <= 1) return;
    dragRef.current = { sx: e.clientX - pan.x, sy: e.clientY - pan.y };
  };
  const onMouseMove = (e) => {
    if (!dragRef.current) return;
    setPan({
      x: e.clientX - dragRef.current.sx,
      y: e.clientY - dragRef.current.sy,
    });
  };
  const onMouseUp = () => {
    dragRef.current = null;
  };

  const src = !image
    ? null
    : image.isExisting
      ? `${APP_URL}/${image.preview}`
      : image.preview;

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{
        width: "100%",
        aspectRatio: "16/9",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        background: "#f1f5f9",
        cursor: zoom > 1 ? "grab" : "default",
        userSelect: "none",
      }}
    >
      {src ? (
        <img
          src={src}
          alt={image?.name}
          draggable={false}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
            transformOrigin: "center",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transition: "transform 0.15s ease",
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
            gap: 10,
          }}
        >
          <div style={{ width: 48, height: 48, color: "#cbd5e1" }}>
            <IconImage />
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#94a3b8",
              fontWeight: 500,
            }}
          >
            Select an image to preview
          </p>
        </div>
      )}

      {/* Nav arrows */}
      {totalCount > 1 && (
        <>
          <button onClick={() => onNavigate(-1)} style={navBtnStyle("left")}>
            <span
              style={{
                display: "inline-flex",
                width: 16,
                height: 16,
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
                width: 16,
                height: 16,
                color: "#fff",
              }}
            >
              <IconChevronRight />
            </span>
          </button>
        </>
      )}

      {/* Counter badge */}
      {image && totalCount > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(6px)",
            borderRadius: 20,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.04em",
          }}
        >
          {currentIdx + 1} / {totalCount}
        </div>
      )}

      {/* Zoom badge */}
      {zoom !== 1 && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(6px)",
            borderRadius: 8,
            padding: "3px 9px",
            fontSize: 11,
            fontWeight: 800,
            color: "#fbbf24",
            fontFamily: "monospace",
          }}
        >
          {(zoom * 100).toFixed(0)}%
        </div>
      )}

      {/* Drag hint */}
      {zoom > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(6px)",
            borderRadius: 6,
            padding: "3px 8px",
            fontSize: 10,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Drag to pan
        </div>
      )}
    </div>
  );
}

const navBtnStyle = (side) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  [side]: 12,
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "rgba(0,0,0,0.45)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  padding: 0,
  zIndex: 4,
});

// ─── Zoom Control ─────────────────────────────────────────────────────────────
function ZoomControl({ zoom, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#f8fafc",
        border: "1px solid #e8edf3",
        borderRadius: 12,
        padding: "10px 14px",
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          whiteSpace: "nowrap",
        }}
      >
        Zoom
      </span>

      <button
        onClick={() => onChange((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}
        style={zoomBtnStyle}
      >
        <span style={{ display: "inline-flex", width: 12, height: 12 }}>
          <IconMinus />
        </span>
      </button>

      <input
        type="range"
        min={0.5}
        max={3}
        step={0.05}
        value={zoom}
        onChange={(e) => onChange(+e.target.value)}
        style={{
          flex: 1,
          accentColor: "#3b82f6",
          cursor: "pointer",
          height: 4,
        }}
      />

      <button
        onClick={() => onChange((z) => Math.min(3, +(z + 0.1).toFixed(2)))}
        style={zoomBtnStyle}
      >
        <span style={{ display: "inline-flex", width: 12, height: 12 }}>
          <IconPlus />
        </span>
      </button>

      <span
        style={{
          minWidth: 42,
          textAlign: "center",
          fontSize: 12,
          fontWeight: 800,
          color: zoom !== 1 ? "#2563eb" : "#94a3b8",
          background: zoom !== 1 ? "#eff6ff" : "#f1f5f9",
          border: `1px solid ${zoom !== 1 ? "#bfdbfe" : "#e2e8f0"}`,
          borderRadius: 7,
          padding: "2px 7px",
          fontFamily: "monospace",
          transition: "all 0.2s",
        }}
      >
        {(zoom * 100).toFixed(0)}%
      </span>

      {zoom !== 1 && (
        <button
          onClick={() => onChange(1)}
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#64748b",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 7,
            padding: "4px 10px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Reset
        </button>
      )}
    </div>
  );
}

const zoomBtnStyle = {
  width: 28,
  height: 28,
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  background: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#475569",
  padding: 0,
  flexShrink: 0,
};

// ─── Thumbnail Strip ──────────────────────────────────────────────────────────
function ThumbnailStrip({ images, activeIdx, onSelect, onRemove }) {
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
            onClick={() => onSelect(idx)}
            style={{
              position: "relative",
              flexShrink: 0,
              width: 80,
              height: 58,
              borderRadius: 10,
              overflow: "hidden",
              cursor: "pointer",
              border: isActive ? "2.5px solid #3b82f6" : "2.5px solid #e8edf3",
              boxShadow: isActive ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
              transition: "all 0.18s",
              background: "#e8edf3",
            }}
          >
            <img
              src={src}
              alt={img.name}
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                pointerEvents: "none",
              }}
            />

            {/* Index */}
            <div
              style={{
                position: "absolute",
                bottom: 3,
                left: 3,
                background: "rgba(0,0,0,0.45)",
                borderRadius: 4,
                padding: "1px 5px",
                fontSize: 9,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {idx + 1}
            </div>

            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(img.id);
              }}
              style={{
                position: "absolute",
                top: 3,
                right: 3,
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: "none",
                background: "rgba(239,68,68,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
                opacity: 0,
                transition: "opacity 0.15s",
              }}
              className="thumb-remove"
            >
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
  const [zoom, setZoom] = useState(1);

  const logoInputRef = useRef(null);
  const multipleInputRef = useRef(null);

  useEffect(() => {
    if (media?.images?.length && activeIdx === null) setActiveIdx(0);
    if (!media?.images?.length) setActiveIdx(null);
  }, [media?.images?.length]);

  useEffect(() => {
    setZoom(1);
  }, [activeIdx]);

  const validate = (f) => f.size <= MAX_FILE_SIZE;

  // Logo handlers
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError((p) => ({
        ...p,
        logo: "Please upload a valid image file",
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
    reader.onload = (ev) =>
      setMedia((p) => ({
        ...p,
        logo: {
          file,
          preview: ev.target.result,
          name: file.name,
          isExisting: false,
        },
      }));
    reader.readAsDataURL(file);
  };
  const removeLogo = () => {
    setMedia((p) => ({ ...p, logo: null }));
    if (logoInputRef.current) logoInputRef.current.value = "";
    setUploadError((p) => ({ ...p, logo: "" }));
    if (clearError) clearError("logo");
  };

  // Image handlers
  const handleMultipleUpload = (files) => {
    const imageFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (!imageFiles.length) {
      setUploadError((p) => ({
        ...p,
        images: "Please upload valid image files",
      }));
      return;
    }
    if ((media.images?.length || 0) + imageFiles.length > 10) {
      setUploadError((p) => ({ ...p, images: "Maximum 10 images allowed" }));
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
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setMedia((p) => ({
          ...p,
          images: [
            ...(p.images || []),
            {
              id: uid(),
              file,
              preview: ev.target.result,
              name: file.name,
              isExisting: false,
            },
          ],
        }));
      reader.readAsDataURL(file);
    });
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

  return (
    <div
      style={{
        maxWidth: 820,
        margin: "10px 60px",
        padding: "32px 20px",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .thumb-wrap:hover .thumb-remove { opacity: 1 !important; }
      `}</style>

      {/* ── Logo Upload ── */}
      <section ref={refs?.logoRef} style={{ marginBottom: 36 }}>
        <Label
          label="Logo / Feature image"
          required
          error={uploadError.logo || error?.logo}
        />
        <div style={card}>
          {!media?.logo ? (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  color: "#16a34a",
                  margin: "0 auto 12px",
                  background: "#f0fdf4",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  boxSizing: "border-box",
                }}
              >
                <IconImage />
              </div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#475569",
                }}
              >
                Upload your logo
              </p>
              <p style={{ margin: "0 0 16px", fontSize: 12, color: "#94a3b8" }}>
                PNG, SVG, WebP · Max 2MB
              </p>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
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
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={
                    media.logo.isExisting
                      ? `${APP_URL}/${media.logo.preview}`
                      : media.logo.preview
                  }
                  alt="Logo"
                  style={{
                    width: 72,
                    height: 72,
                    objectFit: "contain",
                    borderRadius: 12,
                    border: "1px solid #e8edf3",
                    background: "#f8fafc",
                  }}
                />
                <button
                  onClick={removeLogo}
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
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
                    <IconX />
                  </span>
                </button>
              </div>
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#0f172a",
                    margin: "0 0 3px",
                  }}
                >
                  {media.logo.name}
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
                  style={{
                    background: "none",
                    border: "none",
                    color: "#16a34a",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Change →
                </button>
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
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
          className="upload-zone"
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
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 44,
                height: 44,
                color: "#2563eb",

                background: "#eff6ff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                boxSizing: "border-box",
              }}
            >
              <IconUpload />
            </div>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 14,
                fontWeight: 500,
                color: "#475569",
              }}
            >
              Drag & drop or click to upload
            </p>
            <p style={{ margin: "0 0 4px", fontSize: 12, color: "#94a3b8" }}>
              Up to 10 images · Max 2MB each
            </p>
            <p
              style={{
                margin: "0 0 16px",
                fontSize: 12,
                color:
                  (media?.images?.length || 0) >= 10 ? "#ef4444" : "#94a3b8",
                fontWeight: 600,
              }}
            >
              {media?.images?.length || 0} / 10 uploaded
            </p>
            <input
              ref={multipleInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleMultipleUpload(e.target.files)}
              id="multi-upload"
              style={{ display: "none" }}
            />
            <label htmlFor="multi-upload" style={uploadBtn("#2563eb")}>
              <span style={{ display: "inline-flex", width: 13, height: 13 }}>
                <IconUpload />
              </span>
              Choose Images
            </label>
          </div>
        </div>

        {/* Preview section */}
        {media?.images?.length > 0 && (
          <div
            style={{
              marginTop: 24,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* Image preview */}
            <ImagePreview
              image={activeImage}
              zoom={zoom}
              onNavigate={navigate}
              totalCount={media.images.length}
              currentIdx={activeIdx ?? 0}
            />

            {/* Zoom control */}
            <ZoomControl zoom={zoom} onChange={setZoom} />

            {/* Thumbnails */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e8edf3",
                borderRadius: 14,
                padding: "14px 14px 10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Gallery
                  </span>
                  <span
                    style={{
                      background: "#e2e8f0",
                      borderRadius: 20,
                      padding: "1px 9px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#475569",
                    }}
                  >
                    {media.images.length}
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
                      borderRadius: 7,
                      padding: "4px 10px",
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
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function Label({ label, required, error }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginBottom: 10,
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "#0f172a",
        }}
      >
        {label}
      </h3>
      {required && <span style={{ color: "#ef4444", fontSize: 15 }}>*</span>}
      {error && (
        <span style={{ color: "#ef4444", fontSize: 12, fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
}

const card = {
  background: "#fff",
  borderRadius: 16,
  border: "2px dashed #e2e8f0",
  padding: "28px 20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

const uploadBtn = (bg) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  padding: "9px 20px",
  borderRadius: 10,
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
