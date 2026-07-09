import { useEffect, useMemo, useState } from "react";
import {
  getBrokenLinks,
  triggerBrokenLinkScan,
  getScanStatus,
} from "@/api/broken-link";
import { Search, X, Clock, Link2, ExternalLink, RefreshCw } from "lucide-react";

const BASE_URL = "https://addressguru.ae";

function StatusBadge({ code }) {
  const tone =
    code === 0
      ? "bg-stone-500"
      : code >= 500
        ? "bg-red-600"
        : code >= 400
          ? "bg-amber-500"
          : "bg-orange-600";
  const label = code === 0 ? "ERR" : code;
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md text-xs font-bold text-white ${tone}`}
    >
      {label}
    </span>
  );
}

function TypeBadge({ link }) {
  const isInternal = link?.startsWith(BASE_URL);
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ring-1 ring-inset ${
        isInternal
          ? "bg-orange-100 text-orange-800 ring-orange-200"
          : "bg-stone-200 text-stone-700 ring-stone-300"
      }`}
    >
      {isInternal ? <Link2 size={12} /> : <ExternalLink size={12} />}
      {isInternal ? "Internal" : "External"}
    </span>
  );
}

export default function BrokenLinksPage() {
  const [links, setLinks] = useState([]);
  const [selectedLink, setSelectedLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    loadLinks();
    checkStatus();
  }, []);

  const loadLinks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBrokenLinks();
      const linkData = Array.isArray(data) ? data : data.data || [];
      setLinks(linkData);
    } catch (err) {
      console.error("Failed to load broken links:", err);
      setError(
        err?.message ||
          "An error occurred while loading broken links. Please verify your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      const data = await getScanStatus();
      setScanning(!!data?.isScanRunning);
    } catch (err) {
      console.log("Failed to check scan status:", err);
    }
  };

  const runScan = async () => {
    setScanning(true);
    try {
      await triggerBrokenLinkScan();
    } catch (err) {
      console.log("Failed to trigger scan:", err);
    }
  };

  const statusOptions = useMemo(() => {
    const codes = new Set(links.map((l) => String(l.statusCode)));
    return [...codes].sort((a, b) => Number(a) - Number(b));
  }, [links]);

  const filteredLinks = useMemo(() => {
    let temp = [...links];

    if (search) {
      const q = search.toLowerCase();
      temp = temp.filter(
        (item) =>
          item.sourcePage?.toLowerCase().includes(q) ||
          item.brokenLink?.toLowerCase().includes(q) ||
          item.error?.toLowerCase().includes(q),
      );
    }
    if (status)
      temp = temp.filter((item) => String(item.statusCode) === status);
    if (type) {
      temp = temp.filter((item) =>
        type === "internal"
          ? item.brokenLink?.startsWith(BASE_URL)
          : !item.brokenLink?.startsWith(BASE_URL),
      );
    }

    return temp;
  }, [links, search, status, type]);

  const activeFilterCount = [search, status, type].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setType("");
  };

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-600">Broken Links</h1>
          <p className="text-sm text-black mt-0.5">
            {loading ? (
              <span className="text-stone-400 animate-pulse">
                Loading broken links…
              </span>
            ) : error ? (
              <span className="text-red-500 font-medium">
                Failed to load broken links
              </span>
            ) : (
              `${filteredLinks.length} of ${links.length} broken links`
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm font-medium text-orange-700 hover:text-orange-800"
            >
              <X size={14} /> Clear filters ({activeFilterCount})
            </button>
          )}
          <button
            onClick={runScan}
            disabled={scanning}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
          >
            <RefreshCw size={14} className={scanning ? "animate-spin" : ""} />
            {scanning ? "Scanning…" : "Run Scan"}
          </button>
        </div>
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
            placeholder="Search source page, link, error…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          {statusOptions.map((code) => (
            <option key={code} value={code}>
              {code === "0" ? "Network Error" : code}
            </option>
          ))}
        </select>

        <select
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="internal">Internal</option>
          <option value="external">External</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white overflow-hidden rounded-xl border border-stone-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-100 border-b border-stone-200">
              <th className="text-left px-4 py-3 font-semibold text-stone-600">
                Checked At
              </th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600">
                Source Page
              </th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600">
                Broken Link
              </th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600">
                Type
              </th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600">
                Status
              </th>
              <th className="text-left px-4 py-3 font-semibold text-stone-600">
                Error
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <tr
                  key={idx}
                  className="border-t border-stone-100 animate-pulse"
                >
                  <td className="px-4 py-4">
                    <div className="h-4 bg-stone-200 rounded w-28"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-stone-200 rounded w-40"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-stone-200 rounded w-56"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-5 bg-stone-200 rounded w-16"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-5 bg-stone-200 rounded w-10"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-stone-200 rounded w-32"></div>
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <p className="text-red-500 font-medium">{error}</p>
                    <button
                      onClick={loadLinks}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    >
                      Retry Loading
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLinks.map((link) => (
                <tr
                  key={link._id}
                  className="border-t border-stone-100 hover:bg-orange-50/60 cursor-pointer transition-colors"
                  onClick={() => setSelectedLink(link)}
                >
                  <td className="px-4 py-3 text-black whitespace-nowrap">
                    {new Date(
                      link.checkedAt || link.createdAt,
                    ).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-black font-mono text-xs max-w-[220px] truncate">
                    {link.sourcePage}
                  </td>
                  <td className="px-4 py-3 text-black font-mono text-xs max-w-[300px] truncate">
                    {link.brokenLink}
                  </td>
                  <td className="px-4 py-3">
                    <TypeBadge link={link.brokenLink} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge code={link.statusCode} />
                  </td>
                  <td className="px-4 py-3 text-black text-xs max-w-[220px] truncate">
                    {link.error || "-"}
                  </td>
                </tr>
              ))
            )}

            {!loading && !error && filteredLinks.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-black">
                  No broken links match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedLink && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedLink(null)}
        >
          <div
            className="bg-white rounded-xl w-[700px] max-w-full max-h-[90vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-600">
                  Broken Link Details
                </h2>
                <TypeBadge link={selectedLink.brokenLink} />
              </div>
              <button
                onClick={() => setSelectedLink(null)}
                className="text-black hover:text-orange-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-stone-500 text-xs font-medium uppercase tracking-wide mb-0.5">
                  Source Page
                </p>
                <p className="font-medium text-black break-all text-sm">
                  {selectedLink.sourcePage}
                </p>
              </div>
              <div>
                <p className="text-stone-500 text-xs font-medium uppercase tracking-wide mb-0.5">
                  Broken Link
                </p>
                <p className="font-medium text-black break-all text-sm">
                  {selectedLink.brokenLink}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-stone-500 text-xs font-medium uppercase tracking-wide mb-0.5">
                    Status
                  </p>
                  <StatusBadge code={selectedLink.statusCode} />
                </div>
                <div>
                  <p className="text-stone-500 text-xs font-medium uppercase tracking-wide mb-0.5 flex items-center gap-1">
                    <Clock size={13} /> Checked At
                  </p>
                  <p className="font-medium text-black text-sm">
                    {new Date(
                      selectedLink.checkedAt || selectedLink.createdAt,
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedLink.error && (
                <div>
                  <p className="text-stone-500 text-xs font-medium uppercase tracking-wide mb-1">
                    Error
                  </p>
                  <pre className="bg-orange-50 border border-orange-200 text-black p-3 rounded-lg overflow-auto text-xs">
                    {selectedLink.error}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
