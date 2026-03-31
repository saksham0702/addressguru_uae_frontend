import React from "react";
import BusinessHours from "./BusinessHours";
import { Target } from "lucide-react";

const QuickInformation = ({
  handlePop,
  category,
  businesshours,
  job,
  link,
  handleWebsiteClick,
  id,
}) => {
  const date = category?.updated_at;
  console.log("business hours", businesshours);

  return (
    <div className=" w-full max-md:hidden  rounded-t-lg ">
      <div className="bg-[#323232] text-white text-center rounded-t-lg py-2 font-semibold">
        Quick Information
      </div>
      <div className="bg-[#EEEEEE] px-4 py-6 text-sm border-b">
        <p>
          <span className="font-medium text-[#5B5B5B]">Category :</span>{" "}
          <span className="font-bold">
            {job ? category?.category_name : category?.name}
          </span>
        </p>
        {/* <p>
          <span className="font-medium text-[#5B5B5B] ">Starting Price :</span>
          <span className="font-bold">
            {" "}
            <span>&#x20B9;</span> 1200
          </span>
        </p> */}
        <p>
          {/* <span className="font-medium text-[#5B5B5B]">Posted At :</span>{" "} */}
          <span className="font-bold">
            {/* {new Date(date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })} */}
          </span>
        </p>
        {!job && BusinessHours && (
          <BusinessHours openingHours={businesshours} mobile={""} />
        )}

        <p className="text-right text-xs  mt-2 text-[#5B5B5B]">
          Ad Id : <span className="text-black">R1074662</span>
        </p>
      </div>
      <div className="flex justify-between items-center bg-white  max-md:p-3 p-1 border border-t-0 border-gray-200 rounded-b-lg">
        <a
          onClick={() => handleWebsiteClick(id, "website")}
          href={link}
          target="_blank"
          className="bg-white border border-[#EEEEEE] text-[#838383] px-2 py-1 text-sm rounded"
        >
          Visit Website
        </a>
        <button
          onClick={() => handlePop("report")}
          className="border  text-[#E06C5E] px-2 py-1 text-sm rounded"
        >
          Report
        </button>
        <button
          className="bg-[#EEEEEE] text-[#838383]  px-2 py-1 text-sm rounded cursor-not-allowed"
          onClick={() => handlePop("claim")}
        >
          Claim this Business
        </button>
      </div>
    </div>
  );
};

export default QuickInformation;
