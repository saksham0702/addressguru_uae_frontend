import React, { useState } from "react";
import { Phone, Mail, Eye, X, CheckCircle } from "lucide-react";
import { update_leads_status } from "@/api/uae-dashboard";

const STATUS_OPTIONS = [
  { value: "", label: "Select Status", color: "text-gray-500" },
  { value: "interested", label: "Interested", color: "text-green-600" },
  { value: "by_mistake", label: "By Mistake", color: "text-yellow-600" },
  { value: "not_interested", label: "Not Interested", color: "text-red-600" },
  { value: "converted", label: "Converted", color: "text-green-600" },
  { value: "fake", label: "Fake", color: "text-red-600" },
  {
    value: "wrong_information",
    label: "Wrong Information",
    color: "text-yellow-600",
  },
];

const RecentLeads = ({ queries, onStatusChange }) => {
  console.log("queries", queries);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Track per-lead API state: { [leadId]: "loading" | "success" | "error" | null }
  const [statusState, setStatusState] = useState({});
  // Track current status per lead so the select reflects it
  const [localStatuses, setLocalStatuses] = useState({});

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleStatusChange = async (leadId, status) => {
    if (!status || !leadId) return;

    setStatusState((prev) => ({ ...prev, [leadId]: "loading" }));

    try {
      const res = await update_leads_status(leadId, status);
      if (res) {
        setLocalStatuses((prev) => ({ ...prev, [leadId]: status }));
        setStatusState((prev) => ({ ...prev, [leadId]: "success" }));
        // Clear success indicator after 2s
        setTimeout(
          () => setStatusState((prev) => ({ ...prev, [leadId]: null })),
          2000,
        );
        if (onStatusChange) onStatusChange(leadId, status);
      } else {
        throw new Error("No response");
      }
    } catch (err) {
      console.error("Status update failed:", err);
      setStatusState((prev) => ({ ...prev, [leadId]: "error" }));
      setTimeout(
        () => setStatusState((prev) => ({ ...prev, [leadId]: null })),
        3000,
      );
    }
  };

  return (
    <>
      <div className="rounded-lg shadow-md border max-md:hidden border-gray-200 mt-2">
        <div className="flex justify-between items-center bg-[#FFF8F3] px-7 py-4 w-full rounded-t-lg">
          <h2 className="text-lg font-semibold">Recent Leads</h2>
        </div>

        <div className="bg-white rounded-lg shadow px-2 pb-5 overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="text-gray-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Client Details</th>
                <th className="px-4 py-3 font-semibold">Query</th>
                <th className="px-4 py-3 font-semibold">Contact Details</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {queries?.map((lead, idx) => {
                const currentStatus =
                  localStatuses[lead?._id] ?? lead?.status ?? "";
                const state = statusState[lead?._id];

                return (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-800">
                        {lead?.fullName || lead?.name}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="line-clamp-2 max-w-xs text-gray-600">
                        {lead.message}
                      </p>
                    </td>
                    <td className="px-4 py-3 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone size={14} className="text-orange-500" />
                        <span className="text-gray-700">
                          {lead?.mobileNumber || lead?.phone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail size={14} className="text-blue-500" />
                        <span className="text-gray-700">{lead?.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          className="border border-gray-300 px-3 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
                          value={currentStatus}
                          disabled={state === "loading"}
                          onChange={(e) =>
                            handleStatusChange(lead?._id, e.target.value)
                          }
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              className={option.color}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>

                        {/* Feedback indicators */}
                        {state === "loading" && (
                          <span className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin inline-block" />
                        )}
                        {state === "success" && (
                          <CheckCircle
                            size={16}
                            className="text-green-500 flex-shrink-0"
                          />
                        )}
                        {state === "error" && (
                          <span
                            title="Failed"
                            className="text-red-500 text-xs font-semibold"
                          >
                            ✕
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleViewDetails(lead)}
                        className="p-2 hover:bg-blue-50 rounded-full transition-colors group"
                        title="View Details"
                      >
                        <Eye
                          size={18}
                          className="text-blue-600 group-hover:text-blue-700"
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center rounded-t-xl">
              <h3 className="text-xl font-bold text-white">Lead Details</h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Client Information */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Client Information
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start">
                    <span className="font-medium text-gray-600 w-32">
                      Name:
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {selectedLead?.fullName || selectedLead?.name}
                    </span>
                  </div>
                  {selectedLead?.org && (
                    <div className="flex items-start">
                      <span className="font-medium text-gray-600 w-32">
                        Organization:
                      </span>
                      <span className="text-gray-800">{selectedLead?.org}</span>
                    </div>
                  )}
                  {selectedLead?.createdAt && (
                    <div className="flex items-start">
                      <span className="font-medium text-gray-600 w-32">
                        Received:
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(selectedLead.createdAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Details */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Contact Details
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 bg-orange-50 p-3 rounded-lg">
                    <Phone
                      size={18}
                      className="text-orange-500 flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Phone Number
                      </p>
                      <p className="text-gray-800 font-semibold">
                        {selectedLead?.mobileNumber || selectedLead?.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg">
                    <Mail size={18} className="text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Email Address
                      </p>
                      <p className="text-gray-800 font-semibold break-all">
                        {selectedLead?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Query/Message */}
              <div className="border-b pb-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Query Message
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedLead?.message}
                  </p>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Update Status
                </h4>
                <div className="flex items-center gap-3">
                  <select
                    className="flex-1 border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
                    value={
                      localStatuses[selectedLead?._id] ??
                      selectedLead?.status ??
                      ""
                    }
                    disabled={statusState[selectedLead?._id] === "loading"}
                    onChange={(e) =>
                      handleStatusChange(selectedLead?._id, e.target.value)
                    }
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className={option.color}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {statusState[selectedLead?._id] === "loading" && (
                    <span className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin inline-block" />
                  )}
                  {statusState[selectedLead?._id] === "success" && (
                    <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                      <CheckCircle size={16} /> Saved
                    </span>
                  )}
                  {statusState[selectedLead?._id] === "error" && (
                    <span className="text-red-500 text-sm font-medium">
                      Failed — try again
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-xl border-t">
              <button
                onClick={closeModal}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecentLeads;
