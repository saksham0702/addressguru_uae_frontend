import React, { useEffect, useState, useRef } from "react";

const Toggle = ({ checked, onChange, label, description }) => (
  <label
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 14px",
      borderRadius: 10,
      border: `1.5px solid ${checked ? "#fed7aa" : "#e8edf5"}`,
      background: checked ? "#fff7ed" : "#f8fafc",
      cursor: "pointer",
      transition: "all 0.18s ease",
      userSelect: "none",
    }}
  >
    <div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: checked ? "#c2410c" : "#374151",
        }}
      >
        {label}
      </div>
      {description && (
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>
          {description}
        </div>
      )}
    </div>
    <div
      style={{
        width: 38,
        height: 22,
        borderRadius: 11,
        background: checked ? "#f97316" : "#e2e8f0",
        position: "relative",
        transition: "background 0.2s ease",
        flexShrink: 0,
        marginLeft: 12,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 19 : 3,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
          transition: "left 0.2s ease",
        }}
      />
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
      />
    </div>
  </label>
);

const FollowupConfigModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState({
    label: "",
    hasRemark: false,
    remarkRequired: false,
    remarkPlaceholder: "",
  });
  const [visible, setVisible] = useState(false);
  const labelRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        label: "",
        hasRemark: false,
        remarkRequired: false,
        remarkPlaceholder: "",
        isActive: true,
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (open) {
      setTimeout(() => setVisible(true), 10);
      setTimeout(() => labelRef.current?.focus(), 120);
    } else {
      setVisible(false);
    }
  }, [open]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 180);
  };

  if (!open) return null;

  const isEdit = Boolean(initialData);

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.45)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.18s ease",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .fc-input { transition: border-color 0.15s, box-shadow 0.15s; }
        .fc-input:focus { outline: none; border-color: #f97316 !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.12) !important; }
        .fc-cancel:hover { background: #f1f5f9 !important; color: #374151 !important; }
        .fc-save:hover { background: #ea580c !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(249,115,22,0.35) !important; }
        .fc-close:hover { background: #f1f5f9 !important; }
        @keyframes slideUp { from { transform: translateY(14px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes expandDown { from { opacity: 0; transform: scaleY(0.92); } to { opacity: 1; transform: scaleY(1); } }
        .remark-field { animation: expandDown 0.18s ease; transform-origin: top; }
      `}</style>

      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: 440,
          borderRadius: 18,
          boxShadow:
            "0 24px 60px rgba(15,23,42,0.18), 0 4px 16px rgba(15,23,42,0.08)",
          overflow: "hidden",
          animation: visible ? "slideUp 0.22s ease" : "none",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "20px 22px 18px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: isEdit
                  ? "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)"
                  : "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isEdit
                  ? "0 4px 12px rgba(99,102,241,0.3)"
                  : "0 4px 12px rgba(249,115,22,0.3)",
              }}
            >
              {isEdit ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "-0.2px",
                }}
              >
                {isEdit ? "Edit Config" : "Create Config"}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: "#94a3b8",
                  marginTop: 1,
                }}
              >
                {isEdit
                  ? "Update the followup option details"
                  : "Add a new followup option"}
              </p>
            </div>
          </div>

          <button
            className="fc-close"
            onClick={handleClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              transition: "background 0.15s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "20px 22px" }}>
          {/* Label Field */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "#64748b",
                marginBottom: 6,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Label <span style={{ color: "#f97316" }}>*</span>
            </label>
            <input
              ref={labelRef}
              className="fc-input"
              type="text"
              placeholder="e.g. Not Interested, Call Later..."
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              style={{
                width: "100%",
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                padding: "10px 13px",
                fontSize: 14,
                color: "#1e293b",
                background: "#f8fafc",
                boxSizing: "border-box",
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
          </div>

          {/* Status Toggle */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "#64748b",
                marginBottom: 8,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Status
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: 10,
                border: `1.5px solid ${form.isActive ? "#bbf7d0" : "#e8edf5"}`,
                background: form.isActive ? "#f0fdf4" : "#f8fafc",
                cursor: "pointer",
                transition: "all 0.18s ease",
                userSelect: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: form.isActive ? "#dcfce7" : "#f1f5f9",
                    border: `1px solid ${form.isActive ? "#86efac" : "#e2e8f0"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.18s ease",
                  }}
                >
                  {form.isActive ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="#16a34a"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="7"
                        stroke="#94a3b8"
                        strokeWidth="2"
                      />
                      <path
                        d="M9 9l6 6M15 9l-6 6"
                        stroke="#94a3b8"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: form.isActive ? "#15803d" : "#64748b",
                    }}
                  >
                    {form.isActive ? "Active" : "Inactive"}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>
                    {form.isActive
                      ? "This option is visible to agents"
                      : "This option is hidden from agents"}
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: 38,
                  height: 22,
                  borderRadius: 11,
                  background: form.isActive ? "#22c55e" : "#e2e8f0",
                  position: "relative",
                  transition: "background 0.2s ease",
                  flexShrink: 0,
                  marginLeft: 12,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: form.isActive ? 19 : 3,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                    transition: "left 0.2s ease",
                  }}
                />
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  style={{
                    position: "absolute",
                    opacity: 0,
                    width: 0,
                    height: 0,
                  }}
                />
              </div>
            </label>
          </div>

          {/* Toggles */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "#64748b",
                marginBottom: 8,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Options
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Toggle
                checked={form.hasRemark}
                onChange={(e) =>
                  setForm({ ...form, hasRemark: e.target.checked })
                }
                label="Has Remark"
                description="Allow agents to add a remark for this option"
              />
              <Toggle
                checked={form.remarkRequired}
                onChange={(e) =>
                  setForm({ ...form, remarkRequired: e.target.checked })
                }
                label="Remark Required"
                description="Force agents to fill in a remark before saving"
              />
            </div>
          </div>

          {/* Remark Placeholder — animated */}
          {form.hasRemark && (
            <div className="remark-field" style={{ marginBottom: 4 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#64748b",
                  marginBottom: 6,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Remark Placeholder
              </label>
              <input
                className="fc-input"
                type="text"
                placeholder="e.g. Enter reason for not being interested..."
                value={form.remarkPlaceholder}
                onChange={(e) =>
                  setForm({ ...form, remarkPlaceholder: e.target.value })
                }
                style={{
                  width: "100%",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "10px 13px",
                  fontSize: 13,
                  color: "#1e293b",
                  background: "#f8fafc",
                  boxSizing: "border-box",
                  fontFamily: "'DM Mono', monospace",
                }}
              />
              <p style={{ margin: "5px 0 0", fontSize: 11, color: "#94a3b8" }}>
                This text appears inside the remark input field as a hint.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "14px 22px",
            borderTop: "1px solid #f1f5f9",
            background: "#fafbfd",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            alignItems: "center",
          }}
        >
          <button
            className="fc-cancel"
            onClick={handleClose}
            style={{
              padding: "9px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "#64748b",
              background: "transparent",
              border: "1.5px solid #e2e8f0",
              borderRadius: 9,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.15s",
            }}
          >
            Cancel
          </button>
          <button
            className="fc-save"
            onClick={() => onSave(form)}
            disabled={!form.label.trim()}
            style={{
              padding: "9px 20px",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              background: form.label.trim() ? "#f97316" : "#e2e8f0",
              border: "none",
              borderRadius: 9,
              cursor: form.label.trim() ? "pointer" : "not-allowed",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.18s",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: form.label.trim()
                ? "0 4px 14px rgba(249,115,22,0.28)"
                : "none",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isEdit ? "Save Changes" : "Create Config"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowupConfigModal;
