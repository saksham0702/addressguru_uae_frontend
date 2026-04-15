import React, { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/CropImage";

const ASPECT = 870 / 450; // ~1.933

export default function ImageCropper({ image, onCancel, onCropDone }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleDone = async () => {
    const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
    const file = new File([croppedBlob], "cropped.jpg", { type: "image/jpeg" });
    const preview = URL.createObjectURL(croppedBlob);
    onCropDone({ file, preview, name: file.name, isExisting: false });
  };

  return (
    // Faux-viewport wrapper — uses normal flow height so it doesn't collapse
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.72)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "min(92vw, 780px)",
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #e8edf3",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Crop image
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: "#94a3b8",
                fontWeight: 500,
              }}
            >
              870 × 450 px · drag to reposition
            </p>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
              color: "#94a3b8",
              lineHeight: 1,
              padding: "4px 8px",
            }}
          >
            ×
          </button>
        </div>

        {/* Crop area */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            background: "#1e293b",
          }}
        >
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={ASPECT}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: { width: "100%", height: "100%" },
            }}
          />
        </div>

        {/* Zoom slider + actions */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid #e8edf3",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Zoom label */}
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#64748b",
              whiteSpace: "nowrap",
            }}
          >
            Zoom
          </span>

          {/* Minus */}
          <button
            onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(1)))}
            style={iconBtn}
          >
            −
          </button>

          {/* Slider */}
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(+e.target.value)}
            style={{ flex: 1, accentColor: "#2563eb", cursor: "pointer" }}
          />

          {/* Plus */}
          <button
            onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(1)))}
            style={iconBtn}
          >
            +
          </button>

          {/* Zoom readout */}
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#475569",
              minWidth: 36,
              textAlign: "right",
            }}
          >
            {zoom.toFixed(1)}×
          </span>

          {/* Spacer */}
          <div style={{ flex: "0 0 1px", background: "#e2e8f0", height: 24 }} />

          {/* Cancel */}
          <button onClick={onCancel} style={cancelBtn}>
            Cancel
          </button>

          {/* Crop & Save */}
          <button onClick={handleDone} style={saveBtn}>
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
}

const iconBtn = {
  width: 28,
  height: 28,
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  background: "#fff",
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 700,
  color: "#475569",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  padding: 0,
};

const cancelBtn = {
  padding: "8px 16px",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  background: "#fff",
  fontSize: 13,
  fontWeight: 600,
  color: "#475569",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const saveBtn = {
  padding: "8px 18px",
  border: "none",
  borderRadius: 8,
  background: "#2563eb",
  fontSize: 13,
  fontWeight: 700,
  color: "#fff",
  cursor: "pointer",
  whiteSpace: "nowrap",
};
