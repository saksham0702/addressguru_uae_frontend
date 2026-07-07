import { useEffect, useMemo, useState } from "react";
import { getLogs } from "@/api/logs.js";
import {
  Search,
  X,
  Clock,
  Globe,
  Monitor,
  Smartphone,
  Cpu,
  Zap,
} from "lucide-react";

// ── Module registry ──────────────────────────────────────────────────────
// Keys must match req.baseUrl.replace("/", "") from the logger middleware.
// Add a line here the day you wire logging into a new module — nothing
// else in this file needs to change.
const MODULES = {
  "business-listing": { label: "Business", tint: "orange" },
  "jobs-listing": { label: "Jobs", tint: "stone" },
  "property-listings": { label: "Property", tint: "amber" },
  marketplace: { label: "Marketplace", tint: "orange" },
  payment: { label: "Payment", tint: "stone" },
  user: { label: "Users", tint: "amber" },
  cities: { label: "Cities", tint: "stone" },
  categories: { label: "Categories", tint: "stone" },
  "sub-categories": { label: "Sub-categories", tint: "stone" },
  blogs: { label: "Blogs", tint: "amber" },
  "google-listing": { label: "Google Listing", tint: "orange" },
};

const TINTS = {
  orange: "bg-orange-100 text-orange-800 ring-orange-200",
  amber: "bg-amber-100 text-amber-800 ring-amber-200",
  stone: "bg-stone-200 text-stone-700 ring-stone-300",
  default: "bg-stone-100 text-stone-600 ring-stone-200",
};

function moduleMeta(key) {
  const m = MODULES[key];
  if (!m) return { label: key || "—", classes: TINTS.default };
  return { label: m.label, classes: TINTS[m.tint] || TINTS.default };
}

function ModuleBadge({ value }) {
  const { label, classes } = moduleMeta(value);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ring-1 ring-inset ${classes}`}
    >
      {label}
    </span>
  );
}

function StatusBadge({ code }) {
  const tone =
    code >= 500 ? "bg-red-600" : code >= 400 ? "bg-amber-500" : "bg-orange-600";
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md text-xs font-bold text-white ${tone}`}
    >
      {code}
    </span>
  );
}

function MethodBadge({ method }) {
  const styles = {
    GET: "bg-stone-100 text-stone-700",
    POST: "bg-orange-100 text-orange-800",
    PUT: "bg-amber-100 text-amber-800",
    PATCH: "bg-stone-200 text-stone-700",
    DELETE: "bg-orange-600 text-white",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold tracking-wide ${styles[method] || "bg-stone-100 text-stone-700"}`}
    >
      {method}
    </span>
  );
}

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("");
  const [status, setStatus] = useState("");
  const [module, setModule] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const data = await getLogs();
    const logData = Array.isArray(data) ? data : data.logs || data.data || [];
    setLogs(logData);
  };

  const filteredLogs = useMemo(() => {
    let temp = [...logs];

    if (search) {
      const q = search.toLowerCase();
      temp = temp.filter(
        (item) =>
          item.endpoint?.toLowerCase().includes(q) ||
          item.ip?.includes(search) ||
          item.browser?.toLowerCase().includes(q) ||
          item.os?.toLowerCase().includes(q) ||
          item.user?.name?.toLowerCase().includes(q) ||
          item.user?.email?.toLowerCase().includes(q),
      );
    }
    if (method) temp = temp.filter((item) => item.method === method);
    if (status)
      temp = temp.filter((item) => String(item.statusCode) === status);
    if (module) temp = temp.filter((item) => item.module === module);

    return temp;
  }, [logs, search, method, status, module]);

  const activeFilterCount = [search, method, status, module].filter(
    Boolean,
  ).length;

  const clearFilters = () => {
    setSearch("");
    setMethod("");
    setStatus("");
    setModule("");
  };

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-600">System Logs</h1>
          <p className="text-sm text-black mt-0.5">
            {filteredLogs.length} of {logs.length} requests
          </p>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm font-medium text-orange-700 hover:text-orange-800"
          >
            <X size={14} /> Clear filters ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            className="w-full border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-sm text-black placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Search endpoint, user, browser, IP…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={module}
          onChange={(e) => setModule(e.target.value)}
        >
          <option value="">All Modules</option>
          {Object.entries(MODULES).map(([key, m]) => (
            <option key={key} value={key}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="">All Methods</option>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>PATCH</option>
          <option>DELETE</option>
        </select>

        <select
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option>200</option>
          <option>201</option>
          <option>400</option>
          <option>401</option>
          <option>403</option>
          <option>404</option>
          <option>500</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white overflow-hidden rounded-xl border border-stone-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-100 border-b border-stone-200">
              <th className="text-left px-4 py-3 font-semibold text-stone-600">
                Time
              </th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600">
                Module
              </th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600">
                Method
              </th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600">
                Endpoint
              </th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600">
                Status
              </th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600">
                User
              </th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600">
                Client
              </th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600">
                IP
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map((log) => (
              <tr
                key={log._id}
                className="border-t border-stone-100 hover:bg-orange-50/60 cursor-pointer transition-colors"
                onClick={() => setSelectedLog(log)}
              >
                <td className="px-4 py-3 text-black whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <ModuleBadge value={log.module} />
                </td>
                <td className="px-4 py-3">
                  <MethodBadge method={log.method} />
                </td>
                <td className="px-4 py-3 text-black font-mono text-xs max-w-[260px] truncate">
                  {log.endpoint}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge code={log.statusCode} />
                </td>
                <td className="px-4 py-3 text-black">
                  {log.user?.name || (
                    <span className="text-black/40">Guest</span>
                  )}
                </td>
                <td className="px-4 py-3 text-black">
                  {log.browser} · {log.os}
                </td>
                <td className="px-4 py-3 text-black font-mono text-xs">
                  {log.ip}
                </td>
              </tr>
            ))}

            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-black">
                  No logs match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedLog && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="bg-white rounded-xl w-[900px] max-w-full max-h-[90vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-600">
                  Log Details
                </h2>
                <ModuleBadge value={selectedLog.module} />
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-black hover:text-orange-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-black/50 font-mono mb-5">
              #{selectedLog.requestId}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-6">
              <Info
                title="Method"
                value={<MethodBadge method={selectedLog.method} />}
              />
              <Info
                title="Status"
                value={<StatusBadge code={selectedLog.statusCode} />}
              />
              <Info title="Endpoint" value={selectedLog.endpoint} mono />
              <Info
                title="User"
                value={selectedLog.user?.name}
                sub={selectedLog.user?.email}
              />
              <Info title="Role" value={selectedLog.role} />
              <Info
                title="IP"
                value={selectedLog.ip}
                icon={<Globe size={13} />}
              />
              <Info
                title="Browser"
                value={`${selectedLog.browser || "-"} ${selectedLog.browserVersion || ""}`}
                icon={<Monitor size={13} />}
              />
              <Info
                title="OS"
                value={`${selectedLog.os || "-"} ${selectedLog.osVersion || ""}`}
              />
              <Info
                title="Device"
                value={selectedLog.device}
                icon={<Smartphone size={13} />}
              />
              <Info
                title="CPU"
                value={selectedLog.cpu}
                icon={<Cpu size={13} />}
              />
              <Info
                title="Response Time"
                value={`${selectedLog.responseTime} ms`}
                icon={<Zap size={13} />}
              />
              <Info
                title="Time"
                value={new Date(selectedLog.createdAt).toLocaleString()}
                icon={<Clock size={13} />}
              />
            </div>

            <JsonBlock title="Query" data={selectedLog.query} />
            <JsonBlock title="Params" data={selectedLog.params} />
            <JsonBlock title="Request Body" data={selectedLog.body} />
            <JsonBlock title="Response" data={selectedLog.response} />

            {selectedLog.error && (
              <div className="mt-5">
                <h3 className="font-semibold text-stone-600 mb-2">Error</h3>
                <pre className="bg-orange-50 border border-orange-200 text-black p-3 rounded-lg overflow-auto text-xs">
                  {JSON.stringify(selectedLog.error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ title, value, sub, icon }) {
  return (
    <div>
      <p className="text-stone-500 text-xs font-medium uppercase tracking-wide flex items-center gap-1 mb-0.5">
        {icon}
        {title}
      </p>
      <p className="font-medium text-black break-all text-sm">{value || "-"}</p>
      {sub && <p className="text-xs text-black/50 break-all">{sub}</p>}
    </div>
  );
}

function JsonBlock({ title, data }) {
  const isEmpty = !data || Object.keys(data).length === 0;
  return (
    <div className="mt-5">
      <h3 className="font-semibold text-stone-600 mb-2">{title}</h3>
      <pre className="bg-stone-100 text-black p-3 rounded-lg overflow-auto text-xs">
        {isEmpty ? "—" : JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
