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
  TrendingUp,
  TrendingDown,
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
  LayoutDashboard,
  Settings,
  ChevronRight,
  Building2,
  Headphones,
  Newspaper,
  CreditCard,
  User,
  ArrowUpRight,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { adminStats } from "@/api/uaeadminlogin";
import Link from "next/link";

// ─── NAV ROUTES (keep in sync with sidebar) ──────────────────────────────────
const NAV_ROUTES = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Features", href: "/admin/features", icon: Layers },
  { name: "All Categories", href: "/admin/categories", icon: Layers },
  {
    name: "Seo Content",
    href: "/admin/categories/seo-content",
    icon: FileText,
  },
  { name: "Cities", href: "/admin/cities", icon: Map },
  {
    name: "Blog Categories",
    href: "/admin/blogs/blog-categories",
    icon: Newspaper,
  },
  { name: "Blogs", href: "/admin/blogs/list", icon: Newspaper },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Leads", href: "/admin/leads", icon: Headphones },
  {
    name: "Business Listings",
    href: "/admin/business-listings",
    icon: Briefcase,
  },
  { name: "Jobs Listings", href: "/admin/jobs-listings", icon: FileText },
  {
    name: "Marketplace Listings",
    href: "/admin/marketplace-listings",
    icon: ShoppingBag,
  },
  { name: "Property Listings", href: "/admin/property-listings", icon: Home },
  { name: "Followup Configs", href: "/admin/business-configs", icon: Settings },
  { name: "Plans", href: "/admin/plans", icon: CreditCard },
  { name: "My Profile", href: "/admin/my-profile", icon: User },
  { name: "Payment History", href: "/admin/payment-history", icon: DollarSign },
];

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ data = [], color = "#6366f1" }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.count), 1);
  const W = 100,
    H = 28,
    pad = 2;
  const pts = data.map((d, i) => {
    const x = pad + (i / Math.max(data.length - 1, 1)) * (W - pad * 2);
    const y = H - pad - (d.count / max) * (H - pad * 2);
    return `${x},${y}`;
  });
  const last = pts[pts.length - 1]?.split(",") ?? ["0", "0"];
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
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} />
    </svg>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return (
    <div className={`bg-slate-100 animate-pulse rounded-xl ${className}`} />
  );
}

// ─── Stat Row item (compact list style) ──────────────────────────────────────
function StatRow({
  label,
  value,
  href,
  badge,
  badgeColor = "bg-slate-100 text-slate-600",
}) {
  const inner = (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 group transition-colors">
      <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {badge != null && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}
          >
            {badge}
          </span>
        )}
        <span className="text-sm font-semibold text-slate-800 tabular-nums">
          {value ?? "—"}
        </span>
        {href && (
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
        )}
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

// ─── Section card wrapper ─────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, href, children, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className={`h-0.5 ${accent ?? "bg-slate-200"}`} />
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-slate-400" />}
          <span className="text-sm font-semibold text-slate-700">{title}</span>
        </div>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
          >
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      <div className="px-2 pb-2">{children}</div>
    </div>
  );
}

// ─── Attention badge card ─────────────────────────────────────────────────────
function AlertCard({ label, count, sub, href, color }) {
  const colors = {
    red: {
      bar: "bg-red-500",
      bg: "bg-red-50",
      text: "text-red-600",
      badge: "bg-red-100 text-red-700",
    },
    amber: {
      bar: "bg-amber-500",
      bg: "bg-amber-50",
      text: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
    },
    violet: {
      bar: "bg-violet-500",
      bg: "bg-violet-50",
      text: "text-violet-600",
      badge: "bg-violet-100 text-violet-700",
    },
    emerald: {
      bar: "bg-emerald-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
    },
  };
  const c = colors[color] ?? colors.amber;
  return (
    <Link
      href={href}
      className="block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
    >
      <div className={`h-1 ${c.bar}`} />
      <div className="p-4">
        <div
          className={`w-8 h-8 ${c.bg} rounded-xl flex items-center justify-center mb-3`}
        >
          <AlertCircle className={`w-4 h-4 ${c.text}`} />
        </div>
        <p className="text-2xl font-bold text-slate-900">{count ?? 0}</p>
        <p className="text-sm font-medium text-slate-600 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </Link>
  );
}

// ─── Mini bar ─────────────────────────────────────────────────────────────────
function MiniBar({ value, max, color }) {
  const pct = Math.min(((value ?? 0) / Math.max(max ?? 1, 1)) * 100, 100);
  return (
    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Trend chip ───────────────────────────────────────────────────────────────
function Trend({ value }) {
  if (!value) return null;
  const up = value > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${up ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"}`}
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

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const API_URL = "https://addressguru.ae/api";
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
  }, [user]);

  const fetchStats = async (silent = false) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const res = await adminStats();
      setStats(res?.data ?? res);
    } catch {
      setError("Failed to load statistics. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/test-cookie`, { withCredentials: true })
      .catch(() => {});
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-5 space-y-4">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-slate-50 p-4 md:p-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-sm shadow-indigo-200">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">
              Admin Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
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
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-600">Live</span>
          </div>
        </div>
      </div>

      {/* ── Quick Links ── */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Quick navigation
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {NAV_ROUTES.filter((r) => r.href !== "/admin").map((link, idx) => {
            const Icon = link.icon;
            return (
              <Link
                key={idx}
                href={link.href || "#"}
                className="group flex items-center gap-2 px-3 py-2 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
              >
                {Icon && (
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 flex-shrink-0 transition-colors" />
                )}
                <span className="text-xs font-medium text-slate-600 group-hover:text-indigo-700 transition-colors truncate">
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Needs Attention ── */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Needs attention
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <AlertCard
            label="Reported listings"
            count={engagement.reportedListings?.pending ?? 0}
            sub={`${engagement.reportedListings?.total ?? 0} total reported`}
            href="/admin/business-listings?filter=reported"
            color="red"
          />
          <AlertCard
            label="Claim requests"
            count={engagement.claimRequests?.pending ?? 0}
            sub={`${engagement.claimRequests?.total ?? 0} total claims`}
            href="/admin/business-listings?filter=claims"
            color="violet"
          />
          <AlertCard
            label="Reviews pending"
            count={engagement.reviews?.pending ?? 0}
            sub={`${engagement.reviews?.total ?? 0} reviews total`}
            href="/admin/leads?tab=reviews"
            color={engagement.reviews?.pending ? "amber" : "emerald"}
          />
          <AlertCard
            label="Follow-ups pending"
            count={engagement.followUps?.pending ?? 0}
            sub={`${engagement.followUps?.total ?? 0} total follow-ups`}
            href="/admin/business-configs"
            color={engagement.followUps?.pending ? "amber" : "emerald"}
          />
        </div>
      </div>

      {/* ── Main 3-col grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Users */}
        <SectionCard
          title="Users"
          icon={Users}
          href="/admin/users"
          accent="bg-indigo-500"
        >
          <div className="px-1 pt-1 pb-2">
            <div className="flex items-baseline gap-2 px-3 mb-2">
              <span className="text-3xl font-bold text-slate-900">
                {users.total ?? 0}
              </span>
              <span className="text-sm text-slate-400">total users</span>
              <Trend value={users.newLast7Days} />
            </div>
          </div>
          <StatRow
            label="New this week"
            value={users.newLast7Days}
            href="/admin/users?filter=new7"
            badge={`+${users.newLast7Days ?? 0}`}
            badgeColor="bg-emerald-100 text-emerald-700"
          />
          <StatRow
            label="New this month"
            value={users.newLast30Days}
            href="/admin/users?filter=new30"
            badge={`+${users.newLast30Days ?? 0}`}
            badgeColor="bg-sky-100 text-sky-700"
          />
          <StatRow
            label="Activity logs (7d)"
            value={activityLogs.userLogsLast7Days}
          />
          <div className="px-3 pt-2 pb-1">
            <p className="text-xs text-slate-400 mb-1">
              New users — 7 day trend
            </p>
            <Sparkline data={trends.newUsers} color="#6366f1" />
            <div className="flex justify-between mt-0.5">
              {(trends.newUsers ?? []).map((d) => (
                <span key={d.date} className="text-[10px] text-slate-300">
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Listings */}
        <SectionCard title="Listings" icon={Layers} accent="bg-sky-500">
          <div className="px-1 pt-1 pb-2">
            <div className="flex items-baseline gap-2 px-3 mb-3">
              <span className="text-3xl font-bold text-slate-900">
                {listings.totals?.all ?? 0}
              </span>
              <span className="text-sm text-slate-400">total listings</span>
            </div>
            {[
              {
                label: "Business",
                value: listings.totals?.business,
                href: "/admin/business-listings",
                color: "bg-indigo-400",
                new30: listings.newLast30Days?.business,
              },
              {
                label: "Properties",
                value: listings.totals?.properties,
                href: "/admin/property-listings",
                color: "bg-violet-400",
                new30: listings.newLast30Days?.properties,
              },
              {
                label: "Jobs",
                value: listings.totals?.jobs,
                href: "/admin/jobs-listings",
                color: "bg-sky-400",
                new30: listings.newLast30Days?.jobs,
              },
              {
                label: "Marketplace",
                value: listings.totals?.marketplace,
                href: "/admin/marketplace-listings",
                color: "bg-amber-400",
                new30: null,
              },
            ].map(({ label, value, href, color, new30 }) => (
              <Link
                href={href}
                key={label}
                className="block px-3 py-1.5 hover:bg-slate-50 rounded-lg group transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
                    {label}
                  </span>
                  <div className="flex items-center gap-2">
                    {new30 != null && (
                      <span className="text-xs text-emerald-600 font-medium">
                        +{new30} this month
                      </span>
                    )}
                    <span className="text-sm font-semibold text-slate-800 tabular-nums">
                      {value ?? 0}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
                  </div>
                </div>
                <MiniBar
                  value={value ?? 0}
                  max={listings.totals?.all}
                  color={color}
                />
              </Link>
            ))}
          </div>
          <div className="px-3 pb-2">
            <p className="text-xs text-slate-400 mb-1">
              Business listings — 7 day trend
            </p>
            <Sparkline data={trends.newBusinessListings} color="#0ea5e9" />
            <div className="flex justify-between mt-0.5">
              {(trends.newBusinessListings ?? []).map((d) => (
                <span key={d.date} className="text-[10px] text-slate-300">
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Engagement */}
        <SectionCard
          title="Engagement"
          icon={Activity}
          href="/admin/leads"
          accent="bg-emerald-500"
        >
          <StatRow
            label="Job applications"
            value={engagement.jobApplications?.total}
            href="/admin/jobs-listings"
            badge={`+${engagement.jobApplications?.newLast7Days ?? 0} this week`}
            badgeColor="bg-sky-100 text-sky-700"
          />
          <StatRow
            label="Enquiries"
            value={engagement.enquiries?.total}
            href="/admin/leads"
            badge={`+${engagement.enquiries?.newLast7Days ?? 0} this week`}
            badgeColor="bg-indigo-100 text-indigo-700"
          />
          <StatRow
            label="Follow-ups"
            value={engagement.followUps?.total}
            href="/admin/business-configs"
            badge={`${engagement.followUps?.pending ?? 0} pending`}
            badgeColor={
              engagement.followUps?.pending
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-500"
            }
          />
          <StatRow
            label="Reviews"
            value={engagement.reviews?.total}
            href="/admin/leads?tab=reviews"
            badge={`${engagement.reviews?.pending ?? 0} pending`}
            badgeColor={
              engagement.reviews?.pending
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-500"
            }
          />
          <StatRow
            label="Reported listings"
            value={engagement.reportedListings?.total}
            href="/admin/business-listings?filter=reported"
            badge={`${engagement.reportedListings?.pending ?? 0} pending`}
            badgeColor={
              engagement.reportedListings?.pending
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-500"
            }
          />
          <StatRow
            label="Claim requests"
            value={engagement.claimRequests?.total}
            href="/admin/business-listings?filter=claims"
            badge={`${engagement.claimRequests?.pending ?? 0} pending`}
            badgeColor={
              engagement.claimRequests?.pending
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-500"
            }
          />
        </SectionCard>
      </div>

      {/* ── Listing Events + Catalogue + Google ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Listing Events */}
        <SectionCard title="Listing events" icon={Eye} accent="bg-violet-500">
          <StatRow
            label="Total views"
            value={listingEvents.totalViews?.toLocaleString()}
          />
          <StatRow label="Total calls" value={listingEvents.totalCalls} />
          <StatRow
            label="Total leads"
            value={listingEvents.totalLeads}
            href="/admin/leads"
          />
          <StatRow
            label="Website visits"
            value={listingEvents.totalWebsiteVisits}
          />
          <StatRow
            label="Reviews from events"
            value={listingEvents.totalReviews}
          />
        </SectionCard>

        {/* Catalogue */}
        <SectionCard title="Catalogue" icon={Tag} accent="bg-amber-500">
          <StatRow
            label="Categories"
            value={catalogue.categories}
            href="/admin/categories"
          />
          <StatRow
            label="Subcategories"
            value={catalogue.subcategories}
            href="/admin/categories"
          />
          <StatRow
            label="Features"
            value={catalogue.features?.toLocaleString()}
            href="/admin/features"
          />
          <StatRow
            label="Category features"
            value={catalogue.categoryFeatures}
          />
          <StatRow
            label="Cities"
            value={catalogue.cities}
            href="/admin/cities"
          />
          <StatRow label="Plans" value={catalogue.plans} href="/admin/plans" />
          <StatRow label="Templates" value={catalogue.templates} />
        </SectionCard>

        {/* Google Listings */}
        <SectionCard title="Google listings" icon={Globe} accent="bg-rose-500">
          <div className="px-3 pt-2 pb-3">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-slate-900">
                {googleListings.total ?? 0}
              </span>
              <span className="text-sm text-slate-400">total</span>
            </div>
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
              <div key={label} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-800">
                    {value ?? 0}
                  </span>
                </div>
                <MiniBar
                  value={value ?? 0}
                  max={googleListings.total}
                  color={color}
                />
              </div>
            ))}
            {googleListings.claimed === 0 && (
              <p className="text-xs text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg mt-2">
                No listings claimed yet
              </p>
            )}
          </div>
        </SectionCard>
      </div>

      {/* ── 7-Day Trends ── */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          7-day trends
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "New users",
              data: trends.newUsers,
              color: "#6366f1",
              href: "/admin/users?filter=new7",
            },
            {
              label: "Business listings",
              data: trends.newBusinessListings,
              color: "#0ea5e9",
              href: "/admin/business-listings",
            },
            {
              label: "New jobs",
              data: trends.newJobs,
              color: "#8b5cf6",
              href: "/admin/jobs-listings",
            },
            {
              label: "Job applications",
              data: trends.jobApplications,
              color: "#f59e0b",
              href: "/admin/jobs-listings?tab=applications",
            },
          ].map(({ label, data, color, href }) => {
            const total = (data ?? []).reduce((s, d) => s + d.count, 0);
            return (
              <Link
                key={label}
                href={href}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow group block"
              >
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5 mb-2">
                  {total}
                </p>
                <Sparkline data={data ?? []} color={color} />
                <div className="flex justify-between mt-1">
                  {(data ?? []).map((d) => (
                    <span key={d.date} className="text-[10px] text-slate-300">
                      {d.day}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Footer summary ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3 flex flex-wrap gap-6">
        {[
          { label: "Total users", value: users.total ?? 0 },
          { label: "Total listings", value: listings.totals?.all ?? 0 },
          { label: "Categories", value: catalogue.categories ?? 0 },
          {
            label: "Views",
            value: listingEvents.totalViews?.toLocaleString() ?? 0,
          },
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
