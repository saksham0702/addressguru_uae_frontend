import React, { useRef, useState, useCallback, useEffect } from "react";

// ─── Inline SVG Icons ────────────────────────────────────────────────────────
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
const IconImage = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "100%", height: "100%" }}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
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
const IconZoomIn = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    style={{ width: "100%", height: "100%" }}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);
const IconZoomOut = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    style={{ width: "100%", height: "100%" }}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);
const IconEdit = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "100%", height: "100%" }}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconTrash = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "100%", height: "100%" }}
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const IconRotate = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "100%", height: "100%" }}
  >
    <path d="M23 4v6h-6" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

// ─── Constants ───────────────────────────────────────────────────────────────
const PREVIEW_W = 800;
const PREVIEW_H = 500;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";
const MAX_FILE_SIZE = 2 * 1024 * 1024;
function uid() {
  return Math.random().toString(36).slice(2);
}

const FIT_MODES = [
  {
    key: "contain",
    label: "Contain",
    title: "Fit entire image inside frame — no cropping",
  },
  {
    key: "cover",
    label: "Cover",
    title: "Fill the full frame — edges may crop",
  },
  {
    key: "fill",
    label: "Stretch",
    title: "Stretch image to fill frame exactly",
  },
];

// ─── Fixed 800×500 Preview Canvas ────────────────────────────────────────────
function ImagePreviewCanvas({
  image,
  zoom,
  fitMode,
  onZoomChange,
  onNavigate,
  totalCount,
  currentIdx,
}) {
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
  const onWheel = (e) => {
    e.preventDefault();
    onZoomChange((z) =>
      Math.min(3, Math.max(0.5, +(z + (e.deltaY > 0 ? -0.1 : 0.1)).toFixed(2))),
    );
  };

  const src = !image
    ? null
    : image.isExisting
      ? `${APP_URL}/${image.preview}`
      : image.editedPreview || image.preview;

  const fitStatus = {
    contain: {
      color: "#22c55e",
      dot: "#22c55e",
      text: "Image fits fully — no cropping",
    },
    cover: {
      color: "#f59e0b",
      dot: "#f59e0b",
      text: "Filling frame — some edges may crop",
    },
    fill: {
      color: "#f87171",
      dot: "#f87171",
      text: "Stretched to fill — proportions altered",
    },
  }[fitMode];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 0,
        width: "100%",
      }}
    >
      {/* ── Top label bar ── */}
      <div
        style={{
          width: "100%",
          maxWidth: PREVIEW_W,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "9px 14px",
          background: "#0f172a",
          borderRadius: "12px 12px 0 0",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 5 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#ef4444",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#f59e0b",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#22c55e",
              }}
            />
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginLeft: 4,
            }}
          >
            Preview Canvas
          </span>
          <div
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 5,
              padding: "2px 8px",
              color: "rgba(255,255,255,0.35)",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "monospace",
            }}
          >
            {PREVIEW_W} × {PREVIEW_H}
          </div>
        </div>
        {image && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: 11,
                maxWidth: 180,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {image.name}
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 5,
                padding: "2px 7px",
                color: "rgba(255,255,255,0.4)",
                fontSize: 11,
              }}
            >
              {currentIdx + 1} / {totalCount}
            </span>
          </div>
        )}
      </div>

      {/* ── The canvas — strictly PREVIEW_W × PREVIEW_H ── */}
      <div
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        style={{
          width: PREVIEW_W,
          height: PREVIEW_H,
          maxWidth: "100%",
          position: "relative",
          overflow: "hidden",
          cursor:
            zoom > 1 ? (dragRef.current ? "grabbing" : "grab") : "default",
          background: "#111827",
          // checkerboard transparency indicator
          backgroundImage:
            "linear-gradient(45deg,#1a2234 25%,transparent 25%)," +
            "linear-gradient(-45deg,#1a2234 25%,transparent 25%)," +
            "linear-gradient(45deg,transparent 75%,#1a2234 75%)," +
            "linear-gradient(-45deg,transparent 75%,#1a2234 75%)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0,0 12px,12px -12px,-12px 0",
          flexShrink: 0,
        }}
      >
        {/* Frame boundary dashes */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            border: "1.5px dashed rgba(255,255,255,0.1)",
            boxSizing: "border-box",
          }}
        />

        {/* Corner L-markers (shows exact 800×500 boundary) */}
        {[
          { top: 0, left: 0 },
          { top: 0, right: 0 },
          { bottom: 0, left: 0 },
          { bottom: 0, right: 0 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              width: 20,
              height: 20,
              zIndex: 3,
              pointerEvents: "none",
              borderTop:
                pos.top === 0 ? "2.5px solid rgba(251,191,36,0.8)" : "none",
              borderBottom:
                pos.bottom === 0 ? "2.5px solid rgba(251,191,36,0.8)" : "none",
              borderLeft:
                pos.left === 0 ? "2.5px solid rgba(251,191,36,0.8)" : "none",
              borderRight:
                pos.right === 0 ? "2.5px solid rgba(251,191,36,0.8)" : "none",
            }}
          />
        ))}

        {src ? (
          <img
            src={src}
            alt={image?.name || "preview"}
            draggable={false}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
              transformOrigin: "center",
              width: "100%",
              height: "100%",
              objectFit: fitMode,
              objectPosition: "center",
              userSelect: "none",
              pointerEvents: "none",
              transition: "object-fit 0.2s, transform 0.15s",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <div
              style={{ width: 52, height: 52, color: "rgba(255,255,255,0.08)" }}
            >
              <IconImage />
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.18)",
                fontSize: 13,
                margin: 0,
                fontWeight: 500,
              }}
            >
              Select an image from the library below to preview
            </p>
          </div>
        )}

        {/* Nav arrows */}
        {totalCount > 1 && (
          <>
            <CanvasNavBtn dir={-1} onClick={() => onNavigate(-1)} />
            <CanvasNavBtn dir={1} onClick={() => onNavigate(1)} />
          </>
        )}

        {/* Zoom badge */}
        {zoom !== 1 && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 12,
              zIndex: 5,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(6px)",
              borderRadius: 6,
              padding: "3px 9px",
              color: "#fbbf24",
              fontSize: 11,
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            {(zoom * 100).toFixed(0)}%
          </div>
        )}
      </div>

      {/* ── Status bar below canvas ── */}
      <div
        style={{
          width: "100%",
          maxWidth: PREVIEW_W,
          background: "#0f172a",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "0 0 12px 12px",
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: fitStatus.dot,
              flexShrink: 0,
            }}
          />
          <span
            style={{ fontSize: 11, color: fitStatus.color, fontWeight: 600 }}
          >
            {fitStatus.text}
          </span>
        </div>
        <span
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.25)",
            fontStyle: "italic",
          }}
        >
          Scroll to zoom · Drag to pan
        </span>
      </div>
    </div>
  );
}

function CanvasNavBtn({ dir, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [dir === -1 ? "left" : "right"]: 12,
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 6,
        padding: 0,
      }}
    >
      <span
        style={{ display: "inline-flex", width: 16, height: 16, color: "#fff" }}
      >
        {dir === -1 ? <IconChevronLeft /> : <IconChevronRight />}
      </span>
    </button>
  );
}

// ─── Controls row ─────────────────────────────────────────────────────────────
function PreviewControls({
  zoom,
  onZoomChange,
  fitMode,
  onFitMode,
  image,
  onEdit,
  onRemove,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
        padding: "10px 16px",
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
      }}
    >
      {/* Fit modes */}
      <span style={ctrlLabel}>Fit Mode</span>
      {FIT_MODES.map((m) => (
        <button
          key={m.key}
          title={m.title}
          onClick={() => onFitMode(m.key)}
          style={{
            padding: "4px 13px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            border: "1px solid",
            transition: "all 0.15s",
            borderColor: fitMode === m.key ? "#3b82f6" : "#e2e8f0",
            background: fitMode === m.key ? "#eff6ff" : "#f8fafc",
            color: fitMode === m.key ? "#2563eb" : "#64748b",
          }}
        >
          {m.label}
        </button>
      ))}

      <div style={divider} />

      {/* Zoom */}
      <span style={ctrlLabel}>Zoom</span>
      <button
        onClick={() =>
          onZoomChange((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))
        }
        style={iconBtnStyle}
      >
        <span style={{ display: "inline-flex", width: 14, height: 14 }}>
          <IconZoomOut />
        </span>
      </button>
      <input
        type="range"
        min={0.5}
        max={3}
        step={0.05}
        value={zoom}
        onChange={(e) => onZoomChange(+e.target.value)}
        style={{ width: 100, accentColor: "#3b82f6", cursor: "pointer" }}
      />
      <button
        onClick={() => onZoomChange((z) => Math.min(3, +(z + 0.1).toFixed(2)))}
        style={iconBtnStyle}
      >
        <span style={{ display: "inline-flex", width: 14, height: 14 }}>
          <IconZoomIn />
        </span>
      </button>
      <span
        style={{
          minWidth: 40,
          textAlign: "center",
          fontSize: 12,
          fontWeight: 800,
          color: "#2563eb",
          background: "#eff6ff",
          borderRadius: 6,
          padding: "2px 7px",
          fontFamily: "monospace",
        }}
      >
        {(zoom * 100).toFixed(0)}%
      </span>
      <button
        onClick={() => onZoomChange(1)}
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#64748b",
          background: "#f1f5f9",
          border: "1px solid #e2e8f0",
          borderRadius: 6,
          padding: "3px 9px",
          cursor: "pointer",
        }}
      >
        Reset
      </button>

      {/* Image actions — pushed right */}
      {image && (
        <>
          <div style={{ ...divider, marginLeft: "auto" }} />

          <button
            onClick={onRemove}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 13px",
              borderRadius: 8,
              border: "1px solid #fee2e2",
              background: "#fff5f5",
              color: "#ef4444",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <span style={{ display: "inline-flex", width: 13, height: 13 }}>
              <IconTrash />
            </span>
            Remove
          </button>
        </>
      )}
    </div>
  );
}

// ─── Thumbnail strip ──────────────────────────────────────────────────────────
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
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={ctrlLabel}>All Images</span>
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
            {images.length} / 10
          </span>
        </div>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>
          Click to preview · Hover to remove
        </span>
      </div>

      {/* Thumb row */}
      <div
        ref={ref}
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          paddingBottom: 4,
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 transparent",
        }}
      >
        {images.map((img, idx) => {
          const isActive = idx === activeIdx;
          const src = img.isExisting
            ? `${APP_URL}/${img.preview}`
            : img.editedPreview || img.preview;
          return (
            <div
              key={img.id}
              onClick={() => onSelect(idx)}
              className="img-thumb"
              style={{
                position: "relative",
                flexShrink: 0,
                width: 96,
                height: 66,
                borderRadius: 10,
                overflow: "hidden",
                cursor: "pointer",
                border: isActive
                  ? "2.5px solid #3b82f6"
                  : "2.5px solid #e2e8f0",
                boxShadow: isActive
                  ? "0 0 0 3px rgba(59,130,246,0.18), 0 4px 12px rgba(0,0,0,0.08)"
                  : "0 2px 6px rgba(0,0,0,0.05)",
                transform: "none",
                transition: "border 0.18s, box-shadow 0.18s",
                background: "#e2e8f0",
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
                  transform: img.rotation
                    ? `rotate(${img.rotation}deg) scale(1.42)`
                    : undefined,
                }}
              />

              {/* Active dot */}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 5,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#3b82f6",
                    boxShadow: "0 0 0 2px #fff",
                  }}
                />
              )}

              {/* Edited badge */}
              {(img.editedPreview || img.rotation) && (
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    left: 4,
                    background: "rgba(34,197,94,0.9)",
                    borderRadius: 4,
                    padding: "1px 5px",
                    fontSize: 9,
                    fontWeight: 800,
                    color: "#052e16",
                  }}
                >
                  EDITED
                </div>
              )}

              {/* Index */}
              <div
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "rgba(0,0,0,0.45)",
                  borderRadius: 4,
                  padding: "1px 5px",
                  fontSize: 9,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {idx + 1}
              </div>

              {/* Hover remove overlay */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(img.id);
                }}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(239,68,68,0.95)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 0,
                  zIndex: 10,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    width: 10,
                    height: 10,
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

      {/* Name labels */}
      <div
        style={{ display: "flex", gap: 10, marginTop: 7, overflowX: "hidden" }}
      >
        {images.map((img, idx) => (
          <div
            key={img.id}
            style={{
              flexShrink: 0,
              width: 96,
              fontSize: 10,
              fontWeight: idx === activeIdx ? 700 : 400,
              color: idx === activeIdx ? "#3b82f6" : "#94a3b8",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "center",
            }}
          >
            {img.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ImageUploadSections = ({
  media,
  setMedia,
  error,
  clearError,
  refs,
  isEditMode = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState({ logo: "", images: "" });
  const [activeIdx, setActiveIdx] = useState(null);

  const [zoom, setZoom] = useState(1);
  const [fitMode, setFitMode] = useState("contain");

  const logoInputRef = useRef(null);
  const multipleInputRef = useRef(null);

  useEffect(() => {
    if (media?.images?.length && activeIdx === null) setActiveIdx(0);
    if (!media?.images?.length) setActiveIdx(null);
  }, [media?.images?.length]);

  useEffect(() => {
    setZoom(1);
  }, [activeIdx]);

  const validateFileSize = (f) => f.size <= MAX_FILE_SIZE;

  // ── Logo handlers ──
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
    if (!validateFileSize(file)) {
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

  // ── Image handlers ──
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
    const oversized = imageFiles.filter((f) => !validateFileSize(f));
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
    setUploadError((p) => ({ ...p, images: "" }));
    if (clearError) clearError("images");
  };

  const navigate = (dir) => {
    if (!media?.images?.length) return;
    setActiveIdx((i) => (i + dir + media.images.length) % media.images.length);
  };

  const activeImage = (media?.images || [])[activeIdx] ?? null;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "32px 24px",
        fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .img-thumb:hover .thumb-overlay { opacity:1 !important; }
        .upload-zone:hover { border-color:#3b82f6 !important; background:rgba(59,130,246,0.03) !important; }
      `}</style>

      {/* ── Logo Upload ── */}
      <section ref={refs?.logoRef} style={{ marginBottom: 48 }}>
        <SectionLabel
          label="Upload Logo"
          required
          error={uploadError.logo || error?.logo}
        />
        <div style={uploadCard}>
          {!media?.logo ? (
            <div style={{ textAlign: "center" }}>
              <div style={iconCircle("#f0fdf4", "#dcfce7")}>
                <div style={{ width: 26, height: 26, color: "#16a34a" }}>
                  <IconImage />
                </div>
              </div>
              <p style={hint}>Upload your logo image</p>
              <p style={subhint}>Max 2MB · WebP recommended</p>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                id="logo-upload"
                style={{ display: "none" }}
              />
              <label htmlFor="logo-upload" style={chooseBtn("#16a34a")}>
                <span style={{ display: "inline-flex", width: 13, height: 13 }}>
                  <IconUpload />
                </span>
                Choose Logo
              </label>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={
                    media.logo.isExisting
                      ? `${APP_URL}/${media.logo.preview}`
                      : media.logo.preview
                  }
                  alt="Logo"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "contain",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                  }}
                />
                <button onClick={removeLogo} style={removeCircleStyle}>
                  <span
                    style={{
                      display: "inline-flex",
                      width: 10,
                      height: 10,
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
                    margin: "0 0 4px",
                  }}
                >
                  {media.logo.name || "Logo"}
                </p>
                <p
                  style={{ fontSize: 12, color: "#64748b", margin: "0 0 10px" }}
                >
                  Uploaded successfully
                </p>
                <button
                  onClick={() => logoInputRef.current?.click()}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#16a34a",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Change logo →
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
        <SectionLabel
          label="Upload Images"
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
            ...uploadCard,
            borderColor: isDragOver ? "#3b82f6" : "#e2e8f0",
            background: isDragOver ? "rgba(59,130,246,0.04)" : "#fff",
            padding: "28px 24px",
            transition: "all 0.2s",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={iconCircle("#eff6ff", "#dbeafe")}>
              <div style={{ width: 26, height: 26, color: "#2563eb" }}>
                <IconUpload />
              </div>
            </div>
            <p style={hint}>Drag & drop or click to upload</p>
            <p style={subhint}>
              Up to 10 images · Max 2MB each · WebP recommended
            </p>
            <p
              style={{
                ...subhint,
                marginBottom: 18,
                color:
                  (media?.images?.length || 0) >= 10 ? "#ef4444" : "#94a3b8",
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
            <label htmlFor="multi-upload" style={chooseBtn("#2563eb")}>
              <span style={{ display: "inline-flex", width: 13, height: 13 }}>
                <IconUpload />
              </span>
              Choose Images
            </label>
          </div>
        </div>

        {/* ═══ PREVIEW + LIBRARY — clearly separated from upload zone ═══ */}
        {media?.images?.length > 0 && (
          <div
            style={{
              marginTop: 32,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {/* ── Divider: Preview Canvas ── */}
            <SectionDivider
              label="Preview Canvas — 800 × 500 px"
              color="#f59e0b"
            />

            {/* Controls */}
            <PreviewControls
              zoom={zoom}
              onZoomChange={setZoom}
              fitMode={fitMode}
              onFitMode={setFitMode}
              image={activeImage}
              onRemove={() => activeImage && removeImage(activeImage.id)}
            />

            {/* Canvas — horizontally scrollable on small screens */}
            <div style={{ overflowX: "auto" }}>
              <ImagePreviewCanvas
                image={activeImage}
                zoom={zoom}
                fitMode={fitMode}
                onZoomChange={setZoom}
                onNavigate={navigate}
                totalCount={media.images.length}
                currentIdx={activeIdx ?? 0}
              />
            </div>

            {/* ── Divider: Image Library ── */}
            <div style={{ marginTop: 6 }}>
              <SectionDivider label="Image Library" color="#3b82f6" />
            </div>

            {/* Thumbnail strip */}
            <ThumbnailStrip
              images={media.images}
              activeIdx={activeIdx}
              onSelect={setActiveIdx}
              onRemove={removeImage}
            />
          </div>
        )}
      </section>
    </div>
  );
};

// ── Shared UI helpers ─────────────────────────────────────────────────────────
function SectionLabel({ label, required, error }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 14,
        flexWrap: "wrap",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#0f172a",
        }}
      >
        {label}
      </h3>
      {required && (
        <span style={{ color: "#ef4444", fontSize: 16, lineHeight: 1 }}>*</span>
      )}
      {error && (
        <p
          style={{ margin: 0, color: "#ef4444", fontSize: 12, fontWeight: 500 }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function SectionDivider({ label, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
      <span
        style={{
          fontSize: 10,
          fontWeight: 800,
          color,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        {label}
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
      </span>
      <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
    </div>
  );
}

const uploadCard = {
  background: "#fff",
  borderRadius: 16,
  border: "2px dashed #e2e8f0",
  padding: "36px 24px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};
const iconCircle = (bg, ring) => ({
  width: 60,
  height: 60,
  borderRadius: "50%",
  background: bg,
  border: `1px solid ${ring}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 14px",
});
const hint = {
  margin: "0 0 4px",
  fontSize: 14,
  fontWeight: 500,
  color: "#475569",
};
const subhint = { margin: "0 0 6px", fontSize: 12, color: "#94a3b8" };
const chooseBtn = (bg) => ({
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
  boxShadow: `0 4px 14px ${bg}44`,
  textDecoration: "none",
});
const removeCircleStyle = {
  position: "absolute",
  top: -6,
  right: -6,
  width: 22,
  height: 22,
  borderRadius: "50%",
  background: "#ef4444",
  border: "2px solid #fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  padding: 0,
};
const ctrlLabel = {
  fontSize: 11,
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  whiteSpace: "nowrap",
};
const divider = { width: 1, height: 22, background: "#e2e8f0", flexShrink: 0 };
const iconBtnStyle = {
  width: 28,
  height: 28,
  borderRadius: 7,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#475569",
  padding: 0,
  flexShrink: 0,
};
const edToolBtn = {
  padding: "5px 12px",
  borderRadius: 7,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
  color: "rgba(255,255,255,0.7)",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 500,
};

export default ImageUploadSections;
