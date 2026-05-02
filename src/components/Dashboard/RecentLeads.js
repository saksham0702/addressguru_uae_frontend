import React, { useState } from "react";
import { Phone, Mail, Eye, X } from "lucide-react";

const RecentLeads = ({ queries, onStatusChange }) => {
  console.log("queries", queries);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOptions = [
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

  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleStatusChange = (leadId, status) => {
    // This will be called from parent component
    if (onStatusChange) {
      onStatusChange(leadId, status);
    }
  };

  return (
    <>
      <div className="rounded-lg shadow-md border max-md:hidden border-gray-200 mt-2">
        <div className="flex justify-between items-center bg-[#FFF8F3] px-7 py-4 w-full rounded-t-lg">
          <h2 className="text-lg font-semibold">Recent Leads</h2>
          {/* <button
            onClick={() => router.push("/all-leads")}
            className="bg-white px-3 py-1 rounded-md text-sm hover:bg-gray-50 transition-colors"
          >
            View All
          </button> */}
        </div>

        <div className="bg-white rounded-lg shadow px-2  pb-5 overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="text-gray-600 ">
              <tr>
                <th className="px-4 py-3 font-semibold">Client Details</th>
                <th className="px-4 py-3 font-semibold">Query</th>
                <th className="px-4 py-3 font-semibold">Contact Details</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {queries?.map((lead, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-bold text-gray-800">{lead?.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="line-clamp-2 max-w-xs text-gray-600">
                      {lead.message}
                    </p>
                  </td>
                  <td className="px-4 py-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone size={14} className="text-orange-500" />
                      <span className="text-gray-700">{lead?.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail size={14} className="text-blue-500" />
                      <span className="text-gray-700">{lead?.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="border border-gray-300 px-3 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
                      defaultValue=""
                      onChange={(e) =>
                        handleStatusChange(lead?._id, e.target.value)
                      }
                    >
                      {statusOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className={option.color}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
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
              ))}
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
                      {selectedLead?.name}
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
                  {selectedLead?.time && (
                    <div className="flex items-start">
                      <span className="font-medium text-gray-600 w-32">
                        Time:
                      </span>
                      <span className="text-gray-500 text-sm">
                        {selectedLead?.time}
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
                        {selectedLead?.phone}
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
              <div>
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
                <select
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
                  defaultValue=""
                  onChange={(e) =>
                    handleStatusChange(selectedLead?._id, e.target.value)
                  }
                >
                  {statusOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className={option.color}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
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
