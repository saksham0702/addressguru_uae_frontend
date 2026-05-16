import React, { useEffect, useState } from "react";
import { getAllBusinessEnquiries } from "@/api/listing-features";

const Leads = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);

      const res = await getAllBusinessEnquiries({
        page,
        limit,
        search,
      });
      console.log(res, "res");
      setEnquiries(res?.data);
      setTotalPages(res?.data?.pagination?.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [page, search]);

  return (
    <div className="bg-white p-2">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Business Enquiries</h2>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Post Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Mobile
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Message
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Query At
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-gray-600 text-sm">Loading...</p>
                    </div>
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-300 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p className="text-gray-600 font-medium">
                        No enquiries found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                enquiries.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-blue-600 font-medium hover:text-blue-700 cursor-pointer">
                        {item.listingId?.slug}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-gray-800 font-medium">
                        {item.fullName}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-gray-600">{item.email}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-gray-600">
                        +{item.countryCode} {item.mobileNumber}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-gray-600 truncate max-w-[200px]">
                        {item.message}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-gray-500 text-sm">
                        {new Date(item.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && enquiries.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page <span className="font-medium">{page}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </p>

              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    page === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400"
                  }`}
                >
                  Previous
                </button>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    page === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 rounded-t-xl">
              <h3 className="text-lg font-bold text-white">Enquiry Details</h3>
            </div>

            {/* Modal Body */}
            <div className="px-5 py-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Full Name
                  </p>
                  <p className="text-gray-800 font-medium">
                    {selected.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Status
                  </p>
                  <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    {selected.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Email Address
                </p>
                <p className="text-gray-800">{selected.email}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Phone Number
                </p>
                <p className="text-gray-800">
                  +{selected.countryCode} {selected.mobileNumber}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Listing
                </p>
                <p className="text-blue-600 font-medium">
                  {selected.listingId?.slug}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Message
                </p>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg text-sm">
                  {selected.message}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Received At
                </p>
                <p className="text-gray-600 text-sm">
                  {new Date(selected.createdAt).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-gray-50 rounded-b-xl flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
