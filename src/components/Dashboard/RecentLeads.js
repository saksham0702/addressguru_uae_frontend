import React from "react";

const leads = [
  {
    name: "Tariq Ahmed",
    org: "Dehradun School of Online Marketing",
    time: "2 days ago | 12:32PM",
    query:
      "Hi. DSOM - Dehradun School of Online Marketing. I am looking for best Coaching Institute in Dun.",
    phone: "+91-7983356237",
    email: "dsom123vikashsharma@gmail.com",
  },
  {
    name: "Tariq Ahmed",
    org: "Dehradun School of Online Marketing",
    time: "2 days ago | 12:32PM",
    query:
      "Hi. DSOM - Dehradun School of Online Marketing. I am looking for best Coaching Institute in Dun.",
    phone: "+91-7983356237",
    email: "dsom123vikashsharma@gmail.com",
  },
  {
    name: "Tariq Ahmed",
    org: "Dehradun School of Online Marketing",
    time: "2 days ago | 12:32PM",
    query:
      "Hi. DSOM - Dehradun School of Online Marketing. I am looking for best Coaching Institute in Dun.",
    phone: "+91-7983356237",
    email: "dsom123vikashsharma@gmail.com",
  },
  // Repeat or map more entries as needed
];

const RecentLeads = ({queries}) => {
console.log("queries",queries)  

  return (
    <div className=" rounded-lg  shadow-md border max-md:hidden  border-gray-200 mt-2">
      <div className="flex justify-between items-center bg-[#FFF8F3] px-7 py-4 w-full  rounded-t-lg ">
        <h2 className="text-lg font-semibold">Recent Leads</h2>
        <button
          onClick={() => router.push("/all-leads")}
          className="bg-white px-3 py-1 rounded-md text-sm"
        >
          View All
        </button>
      </div>

      <div className="bg-white rounded-lg shadow px-10  pb-5 overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className=" text-gray-600">
            <tr>
              <th className="px-4 py-3">Client Details</th>
              <th className="px-4 py-3">Query</th>
              <th className="px-4 py-3">Contact Details</th>
              <th className="px-4 py-3">Stage</th>
            </tr>
          </thead>
          <tbody>
            {queries?.map((lead, idx) => (
              <tr key={idx} className="border-b border-gray-200 mb-4">
                <td className="px-4 py-3">
                  <p className="font-bold">{lead?.name}</p>
                  {/* <p className="text-gray-500 text-xs">({lead.org})</p> */}
                  {/* <p className="text-gray-400 text-xs">{lead.time}</p> */}
                </td>
                <td className="px-4 py-3">
                  <p className="line-clamp-2 max-w-50 ">{lead.message}</p>
                </td>
                <td className="px-4 py-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className=" text-white  rounded-full text-xs">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.1381 11.9771C14.1381 12.232 14.0814 12.4939 13.9611 12.7488C13.8407 13.0037 13.685 13.2444 13.4797 13.4709C13.1328 13.8532 12.7505 14.1293 12.3186 14.3063C11.8938 14.4833 11.4337 14.5753 10.9381 14.5753C10.216 14.5753 9.44427 14.4054 8.63011 14.0585C7.81595 13.7116 7.00179 13.2444 6.19471 12.6568C5.38054 12.0621 4.60886 11.4037 3.87258 10.6744C3.14337 9.93816 2.48496 9.16648 1.89735 8.3594C1.31682 7.55232 0.84956 6.74523 0.509736 5.94523C0.169912 5.13815 0 4.36647 0 3.63018C0 3.14877 0.0849559 2.68859 0.254868 2.26381C0.42478 1.83195 0.693807 1.43549 1.06903 1.0815C1.52213 0.635485 2.0177 0.416016 2.5416 0.416016C2.73983 0.416016 2.93806 0.458494 3.11505 0.54345C3.29912 0.628406 3.46196 0.755839 3.58939 0.939911L5.23187 3.25496C5.3593 3.43195 5.45134 3.59478 5.51506 3.75054C5.57877 3.89921 5.61417 4.04788 5.61417 4.1824C5.61417 4.35231 5.56462 4.52222 5.4655 4.68505C5.37346 4.84788 5.23895 5.0178 5.06904 5.18771L4.53098 5.747C4.45311 5.82488 4.41771 5.91691 4.41771 6.03019C4.41771 6.08683 4.42479 6.13638 4.43895 6.19302C4.46019 6.24966 4.48143 6.29213 4.49559 6.33461C4.62302 6.56824 4.84249 6.87267 5.15399 7.24081C5.47258 7.60895 5.8124 7.98417 6.18055 8.3594C6.56285 8.73462 6.93099 9.08152 7.30621 9.40011C7.67435 9.71161 7.97878 9.924 8.21949 10.0514C8.25489 10.0656 8.29736 10.0868 8.34692 10.1081C8.40356 10.1293 8.4602 10.1364 8.52391 10.1364C8.64427 10.1364 8.7363 10.0939 8.81418 10.016L9.35223 9.48506C9.52923 9.30807 9.69914 9.17356 9.86197 9.0886C10.0248 8.98949 10.1876 8.93993 10.3646 8.93993C10.4991 8.93993 10.6407 8.96825 10.7965 9.03196C10.9522 9.09568 11.1151 9.18772 11.2921 9.30807L13.6354 10.9718C13.8195 11.0992 13.9469 11.2479 14.0248 11.4249C14.0956 11.6019 14.1381 11.7789 14.1381 11.9771Z"
                          fill="#FF6E04"
                        />
                      </svg>
                    </span>
                    <span>{lead?.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className=" text-white  rounded-full text-xs">
                      <svg
                        width="18"
                        height="12"
                        viewBox="0 0 18 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.0594 6.70874L9.63003 8.14305C9.0504 8.72476 8.03052 8.7373 7.43835 8.14305L6.00891 6.70874L0.875 11.8597C1.0661 11.948 1.2768 12.0008 1.5008 12.0008H15.5676C15.7916 12.0008 16.0022 11.9481 16.1933 11.8597L11.0594 6.70874Z"
                          fill="#0876FE"
                        />
                        <path
                          d="M15.5675 0H1.50074C1.27674 0 1.06603 0.0527374 0.875 0.141111L6.36094 5.64563C6.36131 5.646 6.36174 5.64606 6.36211 5.64643C6.36248 5.6468 6.36254 5.6473 6.36254 5.6473L8.14632 7.4371C8.33579 7.62658 8.73253 7.62658 8.922 7.4371L10.7054 5.6476C10.7054 5.6476 10.7058 5.6468 10.7062 5.64643C10.7062 5.64643 10.707 5.646 10.7074 5.64563L16.1932 0.141078C16.0022 0.0526708 15.7915 0 15.5675 0Z"
                          fill="#0876FE"
                        />
                        <path
                          d="M0.159535 0.840454C0.0606671 1.0404 0 1.26235 0 1.5001V10.5008C0 10.7385 0.0606005 10.9605 0.159501 11.1604L5.30231 6.00062L0.159535 0.840454Z"
                          fill="#0876FE"
                        />
                        <path
                          d="M16.9084 0.840576L11.7656 6.0008L16.9084 11.1607C17.0072 10.9608 17.0679 10.7388 17.0679 10.501V1.50029C17.0679 1.26248 17.0072 1.04052 16.9084 0.840576Z"
                          fill="#0876FE"
                        />
                      </svg>
                    </span>
                    <span>{lead.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select className="border px-2 py-1 rounded">
                    <option>Select the Status</option>
                    <option>New</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentLeads;
