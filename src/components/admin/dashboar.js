"use client";


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
} from "lucide-react";
import { useEffect } from "react";

export default function AdminDashboard() {

  const API_URL = "http://192.168.31.107:5001";

  useEffect(() => {
    testCookie();
  }, []);

  const stats = [
    {
      title: "Live Listings",
      value: "1,453",
      change: "+12.5%",
      trend: "up",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Active Users",
      value: "213",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Active Agents",
      value: "78",
      change: "-2.1%",
      trend: "down",
      icon: UserCheck,
      color: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-50",
      textColor: "text-violet-600",
    },
    {
      title: "Total Revenue",
      value: "$0",
      change: "0%",
      trend: "neutral",
      icon: DollarSign,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
  ];

  const testCookie = async () => {
    try {
      const res = await axios.get(`${API_URL}/test-cookie`, {
        withCredentials: true
      });

      console.log("cookie response:", res.data);
    } catch (err) {
      console.log("cookie test error", err);
    }
  };

  const managementCards = [
    {
      title: "Pending Approvals",
      value: 73,
      subtitle: "Require review",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      urgent: true,
    },
    {
      title: "Deactivated Users",
      value: 13,
      subtitle: "Suspended accounts",
      icon: UserX,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      urgent: false,
    },
    {
      title: "Inactive Listings",
      value: 101,
      subtitle: "Draft or expired",
      icon: BarChart3,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      urgent: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-3 ">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-slate-500 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-slate-700">
              System Operational
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((item, index) => {
          const Icon = item.icon;
          const TrendIcon =
            item.trend === "up"
              ? TrendingUp
              : item.trend === "down"
                ? TrendingDown
                : Activity;

          return (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 border border-slate-100 overflow-hidden"
            >
              {/* Gradient accent bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`}
              />

              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl ${item.bgColor} ${item.textColor} transition-transform group-hover:scale-110 duration-300`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${item.trend === "up"
                    ? "bg-emerald-50 text-emerald-700"
                    : item.trend === "down"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-slate-100 text-slate-600"
                    }`}
                >
                  <TrendIcon className="w-3 h-3" />
                  {item.change}
                </div>
              </div>

              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">
                  {item.title}
                </p>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {item.value}
                </h3>
              </div>

              {/* Hover indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>

      {/* Management Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Management Overview
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Quick actions and pending reviews
            </p>
          </div>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {managementCards.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-slate-300 transition-all duration-300 cursor-pointer"
              >
                {item.urgent && (
                  <div className="absolute -top-2 -right-2">
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-900 font-semibold text-base mb-0.5">
                      {item.title}
                    </p>
                    <p className="text-slate-500 text-sm">{item.subtitle}</p>
                  </div>
                  <div
                    className={`p-2.5 rounded-xl ${item.bgColor} ${item.color} transition-transform group-hover:scale-110 duration-300`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <span className="text-4xl font-bold text-slate-900 tracking-tight">
                    {item.value}
                  </span>

                  <button
                    className={`flex items-center gap-1 text-sm font-semibold ${item.color} opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0`}
                  >
                    Manage
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar background */}
                <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color.replace("text-", "bg-")} opacity-20`}
                    style={{
                      width: `${Math.min((item.value / 150) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Server Uptime", value: "99.9%" },
          { label: "Avg Response", value: "124ms" },
          { label: "Active Sessions", value: "45" },
          { label: "Pending Tasks", value: "12" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60"
          >
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className="text-slate-900 font-bold text-lg">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
