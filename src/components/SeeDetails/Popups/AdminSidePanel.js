import Link from "next/link";

const AdminSidePanel = ({
  data,
  status,
  statusCfg,
  isAdmin,
  router,
  setConfirmAction,
  setRejectModalData,
}) => {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[9999] flex flex-col items-end gap-2 pr-0 max-md:hidden">
      {/* Action icon strip */}
      <div className="flex flex-col items-center gap-1 mr-1">
        {/* Edit */}
        <Link
          href={`/dashboard/listing-forms?category=${data?.category?._id}&categoryName=${encodeURIComponent(data?.businessName ?? "")}&name=${encodeURIComponent(data?.slug ?? "")}`}
          className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-300 transition"
          title="Edit"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path
              d="M11 2L14 5L5 14H2V11L11 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition"
          title="Back"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Approve */}
        {isAdmin && status !== "approved" && (
          <button
            onClick={() => setConfirmAction("approve")}
            className="w-9 h-9 rounded-full bg-white border border-green-200 shadow flex items-center justify-center text-green-600 hover:bg-green-50 transition"
            title="Approve"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 8L6 12L14 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Reject */}
        {isAdmin && status !== "rejected" && (
          <button
            onClick={() => setRejectModalData(data)}
            className="w-9 h-9 rounded-full bg-white border border-red-200 shadow flex items-center justify-center text-red-500 hover:bg-red-50 transition"
            title="Reject"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Info card */}
      <div className="bg-[#f0f0f0] border border-gray-200 shadow-lg rounded-l-xl w-56 overflow-hidden">
        {/* Status bar */}
        <div
          className={`flex items-center gap-2 px-3 py-2 border-b border-gray-200 ${statusCfg.bg}`}
        >
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${statusCfg.dot}`}
          />
          <span
            className={`text-xs font-bold uppercase tracking-wide ${statusCfg.text}`}
          >
            {statusCfg.label}
          </span>
        </div>

        {/* Contact rows */}
        <div className="px-3 py-3 flex flex-col gap-2.5">
          {data?.mobileNumber && (
            <div className="flex items-center gap-2 text-[12.5px] text-gray-700">
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                className="flex-shrink-0 text-gray-400"
              >
                <path
                  d="M3 2h3l1.5 3.5-1.75 1.05A9.07 9.07 0 0 0 9.45 9.25L10.5 7.5 14 9v3c0 1.1-1 2-2 1.93C5.6 13.4 2.6 10.4 2.07 4 2 3 2.9 2 4 2z"
                  fill="currentColor"
                />
              </svg>
              <span className="truncate">
                {data?.countryCode} {data?.mobileNumber}
              </span>
            </div>
          )}
          {data?.alternateMobileNumber && (
            <div className="flex items-center gap-2 text-[12.5px] text-gray-700">
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                className="flex-shrink-0 text-gray-400"
              >
                <path
                  d="M3 2h3l1.5 3.5-1.75 1.05A9.07 9.07 0 0 0 9.45 9.25L10.5 7.5 14 9v3c0 1.1-1 2-2 1.93C5.6 13.4 2.6 10.4 2.07 4 2 3 2.9 2 4 2z"
                  fill="currentColor"
                />
              </svg>
              <span className="truncate">
                {data?.altCountryCode} {data?.alternateMobileNumber}
              </span>
            </div>
          )}
          {data?.email && (
            <div className="flex items-center gap-2 text-[12.5px] text-gray-700">
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                className="flex-shrink-0 text-gray-400"
              >
                <path
                  d="M2 4h12v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4zm0 0l6 5 6-5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="truncate">{data?.email}</span>
            </div>
          )}
          {data?.websiteLink && (
            <div className="flex items-center gap-2 text-[12.5px] text-[#2563eb]">
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                className="flex-shrink-0"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M8 2c-1.5 2-2 3.5-2 6s.5 4 2 6M8 2c1.5 2 2 3.5 2 6s-.5 4-2 6M2 8h12"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
              </svg>
              <a
                href={data?.websiteLink}
                target="_blank"
                rel="noreferrer noopener"
                className="truncate hover:underline"
              >
                Visit Website
              </a>
            </div>
          )}
          {data?.category?.name && (
            <div className="flex items-center gap-2 text-[12.5px] text-gray-700">
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                className="flex-shrink-0 text-gray-400"
              >
                <path
                  d="M2 4a1 1 0 0 1 1-1h2l1 2H3a1 1 0 0 1-1-1zM2 4v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H7L6 3H3a1 1 0 0 0-1 1z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="truncate">{data?.category?.name}</span>
            </div>
          )}
          {data?.contactPersonName && (
            <div className="flex items-center gap-2 text-[12.5px] text-gray-700">
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                className="flex-shrink-0 text-gray-400"
              >
                <circle
                  cx="8"
                  cy="5"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <span className="truncate">{data?.contactPersonName}</span>
            </div>
          )}
        </div>

        {/* Views badge */}
        <div className="px-3 pb-3">
          <div className="inline-flex items-center gap-1.5 bg-[#e8a020] text-white text-xs font-semibold px-2.5 py-1 rounded-md">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path
                d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
                stroke="white"
                strokeWidth="1.4"
              />
              <circle cx="8" cy="8" r="2" fill="white" />
            </svg>
            Views&nbsp;
            <span className="bg-white text-[#e8a020] rounded px-1 font-bold text-[11px]">
              {data?.views ?? 0}
            </span>
          </div>
        </div>

        {/* Transfer Ownership (admin only) */}
        {isAdmin && (
          <div className="px-3 pb-3">
            <button className="w-full bg-[#e8363a] hover:bg-red-600 text-white text-xs font-semibold py-2 rounded-md transition">
              Transfer Ownership
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidePanel;
