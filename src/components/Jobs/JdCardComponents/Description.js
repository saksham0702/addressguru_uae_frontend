import React from "react";

const Description = ({
  desc,
  roles = [],
  qualifications = [],
  keySkills = [],
  companyName,
  companyDesc,
  address,
  city,
}) => {
  console.log("responses", qualifications, roles, keySkills);

  return (
    <section className="space-y-5 max-md:mt-5 max-md:pb-10">
      {/* Job Details */}
      <hr className="w-full h-[1px] my-4 text-gray-200 max-md:hidden" />
      <div className="space-y-2 max-md:pl-2.5 md:pl-6 pr-2">
        <h4 className="font-semibold text-lg">Job Details</h4>
        <p className="text-[13px] font-[500]">
          {desc || "No job description available."}
        </p>
      </div>

      {/* Roles */}
      <hr className="w-full h-[1px] my-4 text-gray-200 max-md:hidden" />
      <div className="space-y-1 max-md:pl-2.5 md:pl-6 pr-2">
        <h4 className="font-semibold text-lg">Role</h4>
        <ul className="list-disc list-inside text-[13px] font-[500]">
          {roles.length > 0 ? (
            roles.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <li>No roles provided</li>
          )}
        </ul>
      </div>

      {/* Qualifications */}
      <hr className="w-full h-[1px] my-4 text-gray-200 max-md:hidden" />
      <div className="space-y-1 max-md:pl-2.5 md:pl-6 pr-2">
        <h4 className="font-semibold text-lg">Qualification Required</h4>
        <ul className="list-disc list-inside text-[13px] font-[500]">
          {qualifications.length > 0 ? (
            qualifications.map((item, index) => (
              <li key={index}>
                {/* handles both string OR object */}
                {typeof item === "string" ? item : item?.level || "N/A"}
              </li>
            ))
          ) : (
            <li>No qualifications specified</li>
          )}
        </ul>
      </div>

      {/* Skills */}
      <hr className="w-full h-[1px] my-4 text-gray-200 max-md:hidden" />
      <div className="space-y-1 max-md:pl-2.5 md:pl-6 pr-2">
        <h4 className="font-semibold text-lg">Key Skills</h4>
        <ul className="list-disc list-inside text-[13px] font-[500]">
          {keySkills.length > 0 ? (
            keySkills.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <li>No skills listed</li>
          )}
        </ul>
      </div>

      {/* Company */}
      <hr className="w-full h-[1px] my-4 text-gray-200 max-md:hidden" />
      <div className="space-y-2 max-md:pl-2.5 md:pl-6 pr-2">
        <h4 className="font-semibold text-lg">{companyName || "Company"}</h4>
        <p className="text-[13px] font-[500]">
          {companyDesc || "No company description available"}
        </p>
      </div>

      {/* Contact */}
      <hr className="w-full h-[1px] my-4 text-gray-200 max-md:hidden" />
      <div className="space-y-2 max-md:pl-2.5 md:pl-6 pr-2">
        <h4 className="font-semibold text-lg">Contact Details</h4>
        <span className="text-[13px] font-[500]">
          <strong>Address:</strong> {address || "Not provided"} <br />
          <strong>City:</strong> {city || "Not provided"}
        </span>
      </div>
    </section>
  );
};

export default Description;
