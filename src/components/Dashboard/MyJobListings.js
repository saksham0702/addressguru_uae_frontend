import React, { useState, useEffect } from "react";
import { Edit, Eye, Briefcase, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/services/constants";
import { get_all_applications } from "@/api/uae-job-listing";

const MyJobListings = ({ data }) => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

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
      console.log("applications", response);
      setApplications(response?.data?.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse JSON strings safely
  const parseJSON = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return [];
    }
  };

  // Helper function to format salary
  const formatSalary = (from, to) => {
    if (from && to) {
      return `₹${from.toLocaleString()} - ₹${to.toLocaleString()}`;
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
    <div className="bg-white shadow-sm border w-full max-md:w-[98%] max-md:mx-auto rounded-md border-gray-200 h-[600px] flex flex-col">
      {" "}
      {/* Header with Tabs */}
      <div className="px-6 py-4 border-b bg-[#FFF8F3] border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            {activeTab === "jobs" ? "MY JOB LISTINGS" : "JOB APPLICATIONS"}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                activeTab === "jobs"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Jobs ({data?.total || 0})
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                activeTab === "applications"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Applications
            </button>
          </div>
        </div>
      </div>
      {/* Content */}
   <div className="flex-1 overflow-y-auto min-h-0">

      {activeTab === "jobs" ? (
        // Job Cards
        <div className="md:p-4 p-2 space-y-4">
          {data?.jobs?.map((job) => {
            const skills = parseJSON(job?.skills);

            return (
              <div
                key={job?._id}
                className="border border-gray-200 rounded-lg md:p-4 p-2.5 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between gap-6">
                  {/* Left Section - Job Info and Buttons */}
                  <div className="flex md:gap-4 gap-2 flex-1">
                    {/* Job Icon */}
                    <div className="w-20 h-20 max-md:w-13 max-md:h-13 flex items-center justify-center rounded-lg">
                      <Image
                        src={`${API_URL}/${job?.company?.logo}`}
                        alt="job"
                        width={500}
                        height={500}
                        className="w-20 h-10 max-md:w-6 object-contain max-md:h-6"
                      />
                    </div>

                    {/* Job Info and Buttons */}
                    <div className="flex-1 max-md:max-w-[60%]">
                      <span className="font-semibold text-base max-w-xs max-md:text-sm text-gray-900 md:mb-1">
                        <p className="line-clamp-2 leading-5 capitalize">
                          {job?.title}
                        </p>
                      </span>

                      {/* Job Details */}
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-gray-600 md:mb-3 mb-2">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {getJobTypeLabel(job?.jobType)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {job?.totalPositions} Openings
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatSalary(job?.salary?.from, job?.salary?.to)}
                        </span>
                      </div>

                      {/* Skills Preview */}
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2 max-md:hidden">
                          {skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {skills.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded">
                              +{skills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex gap-2 whitespace-nowrap max-md:mt-1">
                        <Link
                          href={`/dashboard/jobs-listing?jobId=${job?._id}&edit=true`}
                          className="inline-flex items-center gap-2 px-4 max-md:px-2 py-1.5 max-md:text-[10px] max-md:border-1 max-md:border-blue-500 max-md:text-blue-400 md:bg-blue-600 md:hover:bg-blue-700 text-white text-xs font-semibold rounded-sm transition-colors"
                        >
                          <svg
                            className="max-md:p-[1px] text-[#0876FE] md:text-white"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.356 4.5739L8.75696 12.1729C8.00024 12.9297 5.75395 13.2801 5.25212 12.7783C4.7503 12.2765 5.09281 10.0302 5.84954 9.2735L13.4566 1.66647C13.6442 1.4618 13.8713 1.29728 14.1243 1.18282C14.3772 1.06835 14.6507 1.0063 14.9283 1.00045C15.2058 0.994616 15.4818 1.04507 15.7393 1.14879C15.9968 1.25251 16.2307 1.40736 16.4267 1.60394C16.6227 1.80053 16.7769 2.0348 16.8799 2.29261C16.9829 2.55043 17.0327 2.82643 17.0261 3.10399C17.0195 3.38155 16.9566 3.65492 16.8415 3.90754C16.7264 4.16017 16.5612 4.38686 16.356 4.5739Z"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8.16894 2.66211H4.1862C3.34116 2.66211 2.53079 2.99779 1.93326 3.59532C1.33574 4.19285 1 5.00327 1 5.84831V13.8138C1 14.6589 1.33574 15.4693 1.93326 16.0668C2.53079 16.6643 3.34116 17 4.1862 17H12.9482C14.7086 17 15.3379 15.5662 15.3379 13.8138V9.83105"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {job?.stepCompleted < 3
                            ? "COMPLETE LISTING"
                            : "EDIT JOB"}
                        </Link>

                        <Link
                          href={`/jobs/${job?.slug}`}
                          className="inline-flex items-center gap-2 max-md:px-2 px-4 py-1.5 max-md:text-[10px] uppercase text-orange-600 border border-orange-600 text-xs font-semibold rounded-sm transition-colors hover:bg-orange-50"
                        >
                          <Eye className="w-3 h-3" />
                          PREVIEW
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info on Mobile */}
                <div className="md:hidden mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {job?.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {(!data?.jobs || data.jobs.length === 0) && (
            <div className="p-12 text-center text-gray-500">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No job listings found</p>
              <p className="text-sm">
                Create your first job listing to get started.
              </p>
            </div>
          )}
        </div>
      ) : (
        // Applications Table
        <div className="md:p-4 p-2">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <p>Loading applications...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Full Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Experience 
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Job Applied
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                        Phone No.
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {applications.map((app, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {app?.fullName || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {app?.email || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex flex-wrap gap-1">
                            {app?.totalExperience || "N/A"} years
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {app?.job?.title || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <p className="line-clamp-2">
                            {app?.phone|| "No message"}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {applications.map((app, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="font-semibold text-sm text-gray-900 mb-1">
                      {app?.fullName || "N/A"}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {app?.email || "N/A"}
                    </div>
                    <div className="text-xs text-gray-700 mb-1">
                      <span className="font-medium">Job:</span>{" "}
                      {app?.jobTitle || "N/A"}
                    </div>
                    {app?.skills && app.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {app.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    {app?.message && (
                      <div className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-100">
                        <p className="line-clamp-2">{app.message}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {applications.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">
                    No applications yet
                  </p>
                  <p className="text-sm">
                    Applications will appear here once candidates apply.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
      </div>
    </div>

  );
};

export default MyJobListings;
