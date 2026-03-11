import React from "react";

const Description = ({
  desc,
  roles,
  qualifications,
  keySkills,
  companyName,
  companyDesc,
  address,
  city,
}) => {
  return (
    <section className=" space-y-5 max-md:mt-5 max-md:pb-10">
      <hr className="w-full h-[1px] my-4 text-gray-200 max-md:hidden" />{" "}
      <div className=" space-y-2 max-md:pl-2.5 md:pl-6 pr-2">
        {/* title  */}
        <h4 className="font-semibold text-lg ">Job Details</h4>
        {/* text */}
        <p className="text-[13px] font-[500]">
          {desc
            ? desc
            : "    Support social media management, content calendars, and create content for blogs, newsletters, and ads. Conduct keyword research, assist with SEO, & track campaign performance using tools like Google Analytics to improve digital reach."}
        </p>
      </div>
      <hr className="w-full h-[1px] my-4 text-gray-200 max-md:hidden" />{" "}
      <div className=" space-y-1 max-md:pl-2.5 md:pl-6 pr-2">
        {/* title  */}
        <h4 className="font-semibold text-lg ">Role</h4>
        {/* text */}
        <ul className="list-disc list-inside text-[13px] font-[500]">
          {roles?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
          {/* <li>Support management of social media platforms</li>
          <li>Content creation</li>
          <li>Conduct keywords research</li>
          <li>Monitor and analyze campaign</li> */}
        </ul>
      </div>
      <hr className="w-full h-[1px] my-4 text-gray-200 max-md:hidden" />{" "}
      <div className=" space-y-1 max-md:pl-2.5 md:pl-6 pr-2">
        {/* title  */}
        <h4 className="font-semibold text-lg "> Qualification Required</h4>
        {/* text */}
        <ul className="list-disc list-inside text-[13px] font-[500]">
          {qualifications?.map((item, index) => (
            <li key={item.id || index}>{item.level}</li>
          ))}

          {/* <li>Any Stream</li> */}
        </ul>
      </div>
      <hr className="w-full h-[1px] my-4 text-gray-200 max-md:hidden" />{" "}
      <div className=" space-y-1 max-md:pl-2.5 md:pl-6 pr-2">
        {/* title  */}
        <h4 className="font-semibold text-lg "> Key skills </h4>
        {/* text */}
        <ul className="list-disc list-inside text-[13px] font-[500]">
          {keySkills?.map((item, index) => (
            <li key={index}> {item}</li>
          ))}
          {/* <li>Multitasker</li>
          <li>Knowledge of marketing tools</li>
          <li>Manage time efficiently</li> */}
        </ul>
      </div>
      <hr className="w-full h-[1px] my-4 text-gray-200 max-md:hidden" />
      <div className=" space-y-2 max-md:pl-2.5 md:pl-6 pr-2">
        {/* title  */}
        <h4 className="font-semibold text-lg "> {companyName} </h4>
        {/* text */}
        <p className="text-[13px] font-[500]">
          {companyName} - {companyDesc}
        </p>
      </div>
      <hr className="w-full h-[1px] my-4 text-gray-200 max-md:hidden" />
      <div className=" space-y-2 max-md:pl-2.5 md:pl-6 pr-2">
        {/* title  */}
        <h4 className="font-semibold text-lg "> Contact Details</h4>
        {/* text */}
        <span className="text-[13px] font-[500]">
          <strong> Address:</strong> {address} <br />
          {/* <strong>State:</strong> Uttarakhand <br /> */}
          <strong> City : </strong>
          {city}
        </span>
      </div>
    </section>
  );
};

export default Description;
