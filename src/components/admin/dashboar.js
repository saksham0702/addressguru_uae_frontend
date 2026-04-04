"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import {
  Users,
  UserCheck,
  FileText,
  DollarSign,
  CheckCircle,
  UserX,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Activity,
  Shield,
  Clock,
  Briefcase,
  Home,
  ShoppingBag,
  Eye,
  PhoneCall,
  Mail,
  Star,
  Globe,
  Tag,
  Layers,
  Map,
  LayoutTemplate,
  UserPlus,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { adminStats } from "@/api/uaeadminlogin";

// ─── tiny reusable components ────────────────────────────────────────────────

function Trend({ value }) {
  if (value === 0 || value == null)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
        <Activity className="w-3 h-3" /> —
      </span>
    );
  const up = value > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
        up ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
      }`}
    >
      {up ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {up ? "+" : ""}
      {value}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, accent, sub, trend }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className={`h-1 ${accent}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl bg-slate-50`}>
            <Icon className="w-5 h-5 text-slate-600" />
          </div>
          {trend !== undefined && <Trend value={trend} />}
        </div>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">
          {value ?? "—"}
        </p>
        <p className="text-sm text-slate-500 mt-0.5 font-medium">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function MiniBar({ value, max, color }) {
  const pct = Math.min((value / (max || 1)) * 100, 100);
  return (
    <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Spark line (pure CSS / SVG, no deps) ────────────────────────────────────
function Sparkline({ data }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const W = 80,
    H = 28,
    pad = 2;
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - (d.count / maxVal) * (H - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="overflow-visible"
    >
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-indigo-400"
      />
      {/* last dot */}
      {(() => {
        const last = pts[pts.length - 1].split(",");
        return (
          <circle
            cx={last[0]}
            cy={last[1]}
            r="2.5"
            className="text-indigo-500"
            fill="currentColor"
          />
        );
      })()}
    </svg>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return (
    <div className={`bg-slate-100 animate-pulse rounded-xl ${className}`} />
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const API_URL = "https://addressguru.ae/api";
  const { user } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // ── auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
  }, [user]);

  // ── fetch stats (with optional silent refresh)
  const fetchStats = async (silent = false) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const res = await adminStats();
      setStats(res?.data ?? res);
    } catch (err) {
      setError("Failed to load statistics. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ── test cookie (kept from original)
  useEffect(() => {
    axios
      .get(`${API_URL}/test-cookie`, { withCredentials: true })
      .catch(() => {});
  }, []);

  // ── derived helpers
  const d = stats ?? {};
  const users = d.users ?? {};
  const listings = d.listings ?? {};
  const engagement = d.engagement ?? {};
  const catalogue = d.catalogue ?? {};
  const listingEvents = d.listingEvents ?? {};
  const googleListings = d.googleListings ?? {};
  const activityLogs = d.activityLogs ?? {};
  const trends = d.trends ?? {};

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ── loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 space-y-6">
        <Skeleton className="h-14 w-72" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      </div>
    );
  }

  // ── error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-8 max-w-sm text-center">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <p className="text-slate-700 font-medium mb-4">{error}</p>
          <button
            onClick={() => fetchStats()}
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-white p-4 md:p-6 font-sans">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-sm shadow-indigo-200">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">
              Admin Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {today}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-all"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-600">Live</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 1 · Users
      ══════════════════════════════════════════ */}
      <SectionHeader title="Users" subtitle="Registered accounts overview" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <StatCard
          icon={Users}
          label="Total Users"
          value={users.total}
          accent="bg-indigo-500"
        />
        {/* <StatCard
          icon={UserCheck}
          label="Active Users"
          value={users.active}
          accent="bg-emerald-500"
        />
        <StatCard
          icon={UserX}
          label="Inactive Users"
          value={users.inactive}
          accent="bg-rose-400"
        /> */}
        <StatCard
          icon={UserPlus}
          label="New (Last 7 Days)"
          value={users.newLast7Days}
          accent="bg-sky-500"
          trend={users.newLast7Days}
        />
        <StatCard
          icon={UserPlus}
          label="New (Last 30 Days)"
          value={users.newLast30Days}
          accent="bg-violet-500"
          trend={users.newLast30Days}
        />
      </div>

      {/* ══════════════════════════════════════════
          SECTION 2 · Listings
      ══════════════════════════════════════════ */}
      <SectionHeader
        title="Listings"
        subtitle="All listing types across the platform"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {/* Totals card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">
              Total Listings
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-4">
            {listings.totals?.all ?? 0}
          </p>
          {[
            {
              label: "Business",
              value: listings.totals?.business,
              color: "bg-indigo-400",
            },
            {
              label: "Jobs",
              value: listings.totals?.jobs,
              color: "bg-sky-400",
            },
            {
              label: "Properties",
              value: listings.totals?.properties,
              color: "bg-violet-400",
            },
            {
              label: "Marketplace",
              value: listings.totals?.marketplace,
              color: "bg-amber-400",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="mb-2">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{label}</span>
                <span className="font-semibold text-slate-700">
                  {value ?? 0}
                </span>
              </div>
              <MiniBar
                value={value ?? 0}
                max={listings.totals?.all || 1}
                color={color}
              />
            </div>
          ))}
        </div>

        <StatCard
          icon={Briefcase}
          label="Active Business"
          value={listings.active?.business}
          accent="bg-indigo-500"
          sub={`${listings.totals?.business ?? 0} total`}
        />
        <StatCard
          icon={FileText}
          label="Active Jobs"
          value={listings.active?.jobs}
          accent="bg-sky-500"
          sub={`${listings.totals?.jobs ?? 0} total`}
        />
        <StatCard
          icon={Home}
          label="Active Properties"
          value={listings.active?.properties}
          accent="bg-violet-500"
          sub={`${listings.totals?.properties ?? 0} total`}
        />

        <StatCard
          icon={ShoppingBag}
          label="Marketplace (Active)"
          value={listings.active?.marketplace}
          accent="bg-amber-500"
        />
        <StatCard
          icon={Briefcase}
          label="Business (Last 30d)"
          value={listings.newLast30Days?.business}
          accent="bg-indigo-300"
          trend={listings.newLast30Days?.business}
        />
        <StatCard
          icon={FileText}
          label="Jobs (Last 30d)"
          value={listings.newLast30Days?.jobs}
          accent="bg-sky-300"
          trend={listings.newLast30Days?.jobs}
        />
        <StatCard
          icon={Home}
          label="Properties (Last 30d)"
          value={listings.newLast30Days?.properties}
          accent="bg-violet-300"
          trend={listings.newLast30Days?.properties}
        />
      </div>

      {/* ══════════════════════════════════════════
          SECTION 3 · Engagement + Listing Events
      ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Engagement */}
        <div>
          <SectionHeader
            title="Engagement"
            subtitle="User interactions & moderation"
          />
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={FileText}
              label="Job Applications"
              value={engagement.jobApplications?.total}
              accent="bg-sky-500"
              sub={`+${engagement.jobApplications?.newLast7Days ?? 0} this week`}
            />
            <StatCard
              icon={Mail}
              label="Enquiries"
              value={engagement.enquiries?.total}
              accent="bg-indigo-500"
              sub={`+${engagement.enquiries?.newLast7Days ?? 0} this week`}
            />
            <StatCard
              icon={CheckCircle}
              label="Follow-ups"
              value={engagement.followUps?.total}
              accent="bg-emerald-500"
              sub={`${engagement.followUps?.pending ?? 0} pending`}
            />
            <StatCard
              icon={Star}
              label="Reviews"
              value={engagement.reviews?.total}
              accent="bg-amber-500"
              sub={`${engagement.reviews?.pending ?? 0} pending`}
            />
            <StatCard
              icon={AlertCircle}
              label="Claim Requests"
              value={engagement.claimRequests?.total}
              accent="bg-violet-500"
              sub={`${engagement.claimRequests?.pending ?? 0} pending`}
            />
            <StatCard
              icon={AlertCircle}
              label="Reported Listings"
              value={engagement.reportedListings?.total}
              accent="bg-rose-500"
              sub={`${engagement.reportedListings?.pending ?? 0} pending`}
            />
          </div>
        </div>

        {/* Listing Events */}
        <div>
          <SectionHeader
            title="Listing Events"
            subtitle="Visitor interactions on listings"
          />
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Eye}
              label="Total Views"
              value={listingEvents.totalViews}
              accent="bg-indigo-500"
            />
            <StatCard
              icon={PhoneCall}
              label="Total Calls"
              value={listingEvents.totalCalls}
              accent="bg-emerald-500"
            />
            <StatCard
              icon={Activity}
              label="Total Leads"
              value={listingEvents.totalLeads}
              accent="bg-amber-500"
            />
            <StatCard
              icon={Globe}
              label="Website Visits"
              value={listingEvents.totalWebsiteVisits}
              accent="bg-sky-500"
            />
            <div className="col-span-2">
              <StatCard
                icon={Star}
                label="Reviews via Listing Events"
                value={listingEvents.totalReviews}
                accent="bg-violet-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 4 · Catalogue + Google + Activity
      ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Catalogue */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">
              Catalogue
            </span>
          </div>
          <div className="space-y-3">
            {[
              { label: "Categories", value: catalogue.categories },
              { label: "Subcategories", value: catalogue.subcategories },
              { label: "Category Features", value: catalogue.categoryFeatures },
              { label: "Features", value: catalogue.features },
              { label: "Cities", value: catalogue.cities, icon: Map },
              { label: "Plans", value: catalogue.plans },
              {
                label: "Templates",
                value: catalogue.templates,
                icon: LayoutTemplate,
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-500">{label}</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {value ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Google Listings */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">
              Google Listings
            </span>
          </div>
          <p className="text-4xl font-bold text-slate-900 mb-6">
            {googleListings.total ?? 0}
          </p>
          <div className="space-y-3">
            {[
              {
                label: "Claimed",
                value: googleListings.claimed,
                color: "bg-emerald-400",
              },
              {
                label: "Unclaimed",
                value: googleListings.unclaimed,
                color: "bg-rose-400",
              },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{label}</span>
                  <span className="font-semibold text-slate-700">
                    {value ?? 0}
                  </span>
                </div>
                <MiniBar
                  value={value ?? 0}
                  max={googleListings.total || 1}
                  color={color}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">
              Activity
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-1">User logs (last 7 days)</p>
          <p className="text-4xl font-bold text-slate-900 mb-4">
            {activityLogs.userLogsLast7Days ?? 0}
          </p>
          {trends.newUsers && (
            <div className="mt-2">
              <p className="text-xs text-slate-400 mb-2">New user trend</p>
              <Sparkline data={trends.newUsers} />
              <div className="flex justify-between mt-1">
                {trends.newUsers.map((d) => (
                  <span key={d.date} className="text-[9px] text-slate-300">
                    {d.day}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 5 · Trends Sparklines
      ══════════════════════════════════════════ */}
      {trends && (
        <>
          <SectionHeader
            title="7-Day Trends"
            subtitle="Activity over the past week"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              {
                label: "New Users",
                data: trends.newUsers,
                color: "text-indigo-400",
              },
              {
                label: "Business Listings",
                data: trends.newBusinessListings,
                color: "text-sky-400",
              },
              {
                label: "New Jobs",
                data: trends.newJobs,
                color: "text-violet-400",
              },
              {
                label: "Job Applications",
                data: trends.jobApplications,
                color: "text-amber-400",
              },
            ].map(({ label, data, color }) => {
              const total = (data ?? []).reduce((s, d) => s + d.count, 0);
              return (
                <div
                  key={label}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4"
                >
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    {label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mb-3">
                    {total}
                  </p>
                  <div className={color}>
                    <Sparkline data={data ?? []} />
                  </div>
                  <div className="flex justify-between mt-1">
                    {(data ?? []).map((d) => (
                      <span key={d.date} className="text-[9px] text-slate-300">
                        {d.day}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Footer strip ── */}
      <div className="mt-2 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3 flex flex-wrap gap-6">
        {[
          { label: "Total Users", value: users.total ?? 0 },
          { label: "Total Listings", value: listings.totals?.all ?? 0 },
          { label: "Categories", value: catalogue.categories ?? 0 },
          {
            label: "Activity (7d)",
            value: activityLogs.userLogsLast7Days ?? 0,
          },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              {label}
            </p>
            <p className="text-base font-bold text-slate-800">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
