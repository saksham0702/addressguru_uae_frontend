"use client";

import {
  createFollowupOption,
  getFollowupConfig,
  updateFollowupOption,
} from "@/api/followupconfig";
import FollowupConfigModal from "@/components/admin/business/followupconfigmodal";
import React, { useEffect, useState } from "react";

const MODULE = "listing";

const StatusBadge = ({ active }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      padding: "3px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      background: active ? "#f0fdf4" : "#fafafa",
      color: active ? "#16a34a" : "#94a3b8",
      border: `1px solid ${active ? "#bbf7d0" : "#e2e8f0"}`,
    }}
  >
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: active ? "#22c55e" : "#cbd5e1",
        display: "inline-block",
      }}
    />
    {active ? "Active" : "Inactive"}
  </span>
);

const BoolBadge = ({ value }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 28,
      height: 28,
      borderRadius: "8px",
      fontSize: "14px",
      background: value ? "#fff7ed" : "#f8fafc",
      border: `1px solid ${value ? "#fed7aa" : "#e2e8f0"}`,
    }}
  >
    {value ? "✓" : "–"}
  </span>
);

export default function FollowupConfigPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchConfigs = async () => {
    try {
      const res = await getFollowupConfig(token);
      setConfigs(res.data.options || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleSave = async (form) => {
    try {
      if (editItem) {
        console.log(editItem._id, form, token);
        await updateFollowupOption(editItem._id, form, token);
      } else {
        await createFollowupOption(form, token);
      }
      setModalOpen(false);
      setEditItem(null);
      fetchConfigs();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { label: "Label", key: "label" },
    { label: "Has Remark", key: "hasRemark" },
    { label: "Required", key: "remarkRequired" },
    { label: "Placeholder", key: "remarkPlaceholder" },
    { label: "Status", key: "isActive" },
    { label: "Actions", key: "actions" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fc",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        padding: "36px 32px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        .config-row { transition: background 0.15s ease, box-shadow 0.15s ease; }
        .config-row:hover { background: #fffaf7 !important; box-shadow: inset 3px 0 0 #f97316; }
        .edit-btn { transition: all 0.15s ease; }
        .edit-btn:hover { background: #fff7ed !important; color: #ea580c !important; transform: translateY(-1px); }
        .add-btn { transition: all 0.18s ease; }
        .add-btn:hover { background: #ea580c !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(249,115,22,0.35) !important; }
        .skeleton { background: linear-gradient(90deg, #f1f5f9 25%, #e8edf5 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>

      {/* Header Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(249,115,22,0.3)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.4px",
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Followup Configs
            </h1>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#94a3b8",
              paddingLeft: 42,
            }}
          >
            Manage follow-up options for the{" "}
            <code
              style={{
                background: "#f1f5f9",
                padding: "1px 6px",
                borderRadius: 4,
                fontSize: 12,
                fontFamily: "'DM Mono', monospace",
                color: "#64748b",
              }}
            >
              {MODULE}
            </code>{" "}
            module
          </p>
        </div>

        <button
          className="add-btn"
          onClick={() => {
            setEditItem(null);
            setModalOpen(true);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "#f97316",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(249,115,22,0.28)",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          Add Config
        </button>
      </div>

      {/* Stats Strip */}
      {!loading && configs.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            {
              label: "Total",
              value: configs.length,
              color: "#6366f1",
              bg: "#eef2ff",
            },
            {
              label: "Active",
              value: configs.filter((c) => c.isActive).length,
              color: "#16a34a",
              bg: "#f0fdf4",
            },
            {
              label: "With Remarks",
              value: configs.filter((c) => c.hasRemark).length,
              color: "#f97316",
              bg: "#fff7ed",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: stat.bg,
                border: `1px solid ${stat.color}22`,
                borderRadius: 10,
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: stat.color,
                  lineHeight: 1,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {stat.value}
              </span>
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Table Card */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e8edf5",
          overflow: "hidden",
          boxShadow: "0 2px 16px rgba(15,23,42,0.06)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafd" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: "13px 16px",
                    textAlign:
                      col.key === "label" || col.key === "remarkPlaceholder"
                        ? "left"
                        : "center",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#94a3b8",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid #e8edf5",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ padding: "14px 16px" }}>
                      <div
                        className="skeleton"
                        style={{
                          height: 14,
                          borderRadius: 6,
                          width:
                            col.key === "label"
                              ? "60%"
                              : col.key === "remarkPlaceholder"
                                ? "80%"
                                : "40%",
                          margin:
                            col.key === "label" ||
                            col.key === "remarkPlaceholder"
                              ? "0"
                              : "0 auto",
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : configs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: "center", padding: "56px 0" }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: "#f8fafc",
                      border: "1.5px dashed #cbd5e1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        stroke="#cbd5e1"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#64748b",
                    }}
                  >
                    No configs found
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>
                    Add your first followup config to get started
                  </p>
                </td>
              </tr>
            ) : (
              configs.map((item, idx) => (
                <tr
                  key={item._id}
                  className="config-row"
                  style={{
                    borderBottom:
                      idx < configs.length - 1 ? "1px solid #f1f5f9" : "none",
                    background: "#fff",
                  }}
                >
                  {/* Label */}
                  <td
                    style={{
                      padding: "14px 16px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: item.isActive ? "#22c55e" : "#cbd5e1",
                          flexShrink: 0,
                        }}
                      />
                      {item.label}
                    </div>
                  </td>

                  {/* Has Remark */}
                  <td style={{ textAlign: "center", padding: "14px 16px" }}>
                    <BoolBadge value={item.hasRemark} />
                  </td>

                  {/* Required */}
                  <td style={{ textAlign: "center", padding: "14px 16px" }}>
                    <BoolBadge value={item.remarkRequired} />
                  </td>

                  {/* Placeholder */}
                  <td
                    style={{
                      padding: "14px 16px",
                      fontSize: 13,
                      color: item.remarkPlaceholder ? "#475569" : "#cbd5e1",
                      fontStyle: item.remarkPlaceholder ? "normal" : "italic",
                      fontFamily: item.remarkPlaceholder
                        ? "'DM Mono', monospace"
                        : "inherit",
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.remarkPlaceholder || "No placeholder"}
                  </td>

                  {/* Status */}
                  <td style={{ textAlign: "center", padding: "14px 16px" }}>
                    <StatusBadge active={item.isActive} />
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: "center", padding: "14px 16px" }}>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditItem(item);
                        setModalOpen(true);
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        color: "#64748b",
                        padding: "6px 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        {!loading && configs.length > 0 && (
          <div
            style={{
              padding: "10px 16px",
              borderTop: "1px solid #f1f5f9",
              background: "#fafbfd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 12, color: "#94a3b8" }}>
              Showing{" "}
              <strong style={{ color: "#64748b" }}>{configs.length}</strong>{" "}
              {configs.length === 1 ? "config" : "configs"}
            </span>
            <span
              style={{
                fontSize: 11,
                color: "#cbd5e1",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              module: {MODULE}
            </span>
          </div>
        )}
      </div>

      {/* Modal */}
      <FollowupConfigModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editItem}
      />
    </div>
  );
}
