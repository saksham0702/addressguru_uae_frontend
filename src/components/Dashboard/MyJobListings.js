import React, { useState, useEffect } from "react";
import {
  Edit,
  Eye,
  Briefcase,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { API_URL, APP_URL } from "@/services/constants";
import {
  get_all_applications,
  update_application_status,
} from "@/api/uae-job-listing";

const MyJobListings = ({ data }) => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch applications when tab changes
  useEffect(() => {
    if (activeTab === "applications") {
      fetchApplications();
    }
  }, [activeTab]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await get_all_applications();
      setApplications(response?.data?.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await update_application_status(id, newStatus);
      if (res?.success) {
        // Update local state
        setApplications((prev) =>
          prev.map((app) =>
            app._id === id ? { ...app, status: newStatus } : app,
          ),
        );
      }
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper to get status styles
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: "bg-amber-100 text-amber-700 border-amber-200",
        icon: <Clock className="w-3 h-3" />,
        label: "Pending",
      },
      reviewing: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: <Eye className="w-3 h-3" />,
        label: "Reviewing",
      },
      shortlisted: {
        color: "bg-[#FFF8F3] text-orange-600 border-orange-200",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Shortlisted",
      },
      interview: {
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: <Briefcase className="w-3 h-3" />,
        label: "Interview",
      },
      offered: {
        color: "bg-indigo-100 text-indigo-700 border-indigo-200",
        icon: <DollarSign className="w-3 h-3" />,
        label: "Offered",
      },
      hired: {
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Job Given",
      },
      rejected: {
        color: "bg-rose-100 text-rose-700 border-rose-200",
        icon: <XCircle className="w-3 h-3" />,
        label: "Rejected",
      },
      withdrawn: {
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: <XCircle className="w-3 h-3" />,
        label: "Withdrawn",
      },
    };
    return configs[status] || configs.pending;
  };

  // Status options for the dropdown
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "reviewing", label: "Reviewing" },
    { value: "shortlisted", label: "Shortlist" },
    { value: "interview", label: "Interview" },
    { value: "hired", label: "Job Given (Final)" },
    { value: "rejected", label: "Reject" },
  ];

  // Helper function to parse JSON strings safely
  const parseJSON = (jsonString) => {
    if (!jsonString) return [];
    if (Array.isArray(jsonString)) return jsonString;
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return [];
    }
  };

  // Helper function to format salary
  const formatSalary = (from, to) => {
    if (from && to) {
      return `AED ${from.toLocaleString()} - ${to.toLocaleString()}`;
    }
    return "Not Specified";
  };

  // Helper function to get job type label
  const getJobTypeLabel = (jobType) => {
    const jobTypes = {
      "full-time": "Full Time",
      "part-time": "Part Time",
      contract: "Contract",
      internship: "Internship",
    };
    return jobTypes[jobType] || "Not Specified";
  };

  return (
    <div className="bg-white shadow-sm border w-full max-sm:w-full rounded-xl border-gray-100 min-h-[600px] flex flex-col overflow-hidden">
      {/* Header with Tabs */}
      <div className="px-6 py-5 border-b bg-white border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight uppercase">
              {activeTab === "jobs" ? "My Job Listings" : "Job Applications"}
            </h2>
            <p className="text-sm text-gray-500">
              Manage your posted jobs and active applicants
            </p>
          </div>
          <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-200 w-fit">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "jobs"
                  ? "bg-white text-[#FF6E04] shadow-sm ring-1 ring-black/5"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Jobs ({data?.total || 0})
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "applications"
                  ? "bg-white text-[#FF6E04] shadow-sm ring-1 ring-black/5"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Applications
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "jobs" ? (
          // Job Cards
          <div className="p-4 sm:p-6 space-y-5">
            {data?.jobs?.map((job) => {
              const skills = parseJSON(job?.skills);

              return (
                <div
                  key={job?._id}
                  className="group relative bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#FF6E04]/30 hover:shadow-xs hover:shadow-orange-500/5 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Logo Section */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center p-3 shrink-0 group-hover:scale-105 transition-transform">
                      <Image
                        src={`${APP_URL}/${job?.company?.logo}`}
                        alt="Company Logo"
                        width={500}
                        height={500}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-[#FF6E04] transition-colors">
                          {job?.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                              job?.status === "approved"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}
                          >
                            {job?.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                          <Briefcase className="w-3.5 h-3.5 text-[#FF6E04]" />
                          {getJobTypeLabel(job?.jobType)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                          <Users className="w-3.5 h-3.5 text-[#FF6E04]" />
                          {job?.totalPositions} Positions
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                          <DollarSign className="w-3.5 h-3.5 text-[#FF6E04]" />
                          {formatSalary(job?.salary?.from, job?.salary?.to)}
                        </div>
                      </div>

                      {/* Skills */}
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {skills.slice(0, 4).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-50 text-gray-600 text-[11px] font-semibold rounded-lg border border-gray-100 group-hover:bg-[#FFF8F3] group-hover:text-orange-600 transition-colors"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-50">
                        <Link
                          href={`/dashboard/jobs-listing?jobId=${job?.slug}&edit=true`}
                          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-[#FF6E04] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-black/10"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          {job?.stepCompleted < 2
                            ? "Complete Listing"
                            : "Edit Details"}
                        </Link>
                        <Link
                          href={`/jobs/${job?.slug}`}
                          className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 hover:border-[#FF6E04] hover:text-[#FF6E04] text-gray-700 text-xs font-bold rounded-xl transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Preview Publicly
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {data?.jobs?.length === 0 && (
              <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h4 className="text-lg font-bold text-gray-900">
                  No Job Listings Yet
                </h4>
                <p className="text-gray-500 text-sm max-w-[280px] mx-auto mt-1">
                  Start by posting your first job to attract quality candidates
                </p>
                <Link
                  href="/dashboard/jobs-listing"
                  className="mt-6 inline-flex px-6 py-3 bg-[#FF6E04] text-white rounded-xl font-bold shadow-xs shadow-orange-500/30"
                >
                  Post a Job Now
                </Link>
              </div>
            )}
          </div>
        ) : (
          // Applications Content
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center gap-4 text-gray-400">
                <div className="animate-spin h-10 w-10 border-4 border-[#FF6E04] border-t-transparent rounded-full" />
                <p className="font-semibold tracking-wide">
                  Syncing Applications...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/30">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white border-b border-gray-100 text-left">
                        <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Candidate
                        </th>
                        <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Applied Job
                        </th>
                        <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Experience
                        </th>
                        <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Status
                        </th>
                        <th className="px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                      {applications.map((app) => (
                        <tr
                          key={app?._id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900">
                                {app?.fullName}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                  <Mail className="w-2.5 h-2.5" />
                                  {app?.email}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                  <Phone className="w-2.5 h-2.5" />
                                  {app?.phone}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm font-semibold text-gray-700">
                              {app?.job?.title || "Direct Application"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-gray-600">
                            {app?.totalExperience || 0} Years
                          </td>
                          <td className="px-5 py-4">
                            <div
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase transition-all ${getStatusConfig(app?.status).color}`}
                            >
                              {getStatusConfig(app?.status).icon}
                              {getStatusConfig(app?.status).label}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="relative group/status inline-block">
                              <select
                                disabled={updatingId === app._id}
                                value={app.status}
                                onChange={(e) =>
                                  handleStatusUpdate(app._id, e.target.value)
                                }
                                className="appearance-none pr-8 pl-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer outline-none transition-all disabled:opacity-50"
                              >
                                {statusOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile/Small Screen Card Layout */}
                <div className="lg:hidden space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app?._id}
                      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                          <h4 className="text-base font-bold text-gray-900">
                            {app?.fullName}
                          </h4>
                          <span className="text-xs font-semibold text-[#FF6E04] mt-0.5">
                            {app?.job?.title}
                          </span>
                        </div>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[9px] font-black uppercase ${getStatusConfig(app?.status).color}`}
                        >
                          {getStatusConfig(app?.status).icon}
                          {getStatusConfig(app?.status).label}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-5 p-3 bg-gray-50 rounded-xl">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">
                            Experience
                          </span>
                          <span className="text-xs font-bold text-gray-700">
                            {app?.totalExperience || 0} Years
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">
                            Applied On
                          </span>
                          <span className="text-xs font-bold text-gray-700">
                            {new Date(app?.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex gap-2">
                          <a
                            href={`mailto:${app?.email}`}
                            className="p-2.5 bg-gray-50 rounded-xl text-gray-600 hover:text-[#FF6E04]"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          <a
                            href={`tel:${app?.phone}`}
                            className="p-2.5 bg-gray-50 rounded-xl text-gray-600 hover:text-[#FF6E04]"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>

                        <div className="relative flex-1 max-w-[150px]">
                          <select
                            disabled={updatingId === app._id}
                            value={app.status}
                            onChange={(e) =>
                              handleStatusUpdate(app._id, e.target.value)
                            }
                            className="w-full appearance-none pr-8 pl-4 py-2.5 bg-gray-900 text-white border-0 rounded-xl text-xs font-bold cursor-pointer outline-none transition-all disabled:opacity-50"
                          >
                            {statusOptions.map((opt) => (
                              <option
                                className="bg-white text-gray-900 font-medium"
                                key={opt.value}
                                value={opt.value}
                              >
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {applications.length === 0 && (
                  <div className="py-24 text-center">
                    <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                      <Users className="w-10 h-10 text-gray-300" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">
                      No Applications Received
                    </h4>
                    <p className="text-gray-500 text-sm max-w-[280px] mx-auto mt-2">
                      Active campaigns will attract candidates here for you to
                      review and manage
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobListings;
