import React from "react";
import Image from "next/image";
import GetMoreInfo from "@/components/SeeDetails/GetMoreInfo";
import Form from "@/components/ContactUs/Form";
import QueryCard from "@/components/ContactUs/QueryCard";

const ContactUs = () => {
  return (
    <div className="h-full w-full flex flex-col items-center ">
      <div className="h-full relative w-full max-md:w-[95%]   max-md:bg-[#FFF8F3] max-md:min-h-screen  max-md:border border-gray-200  2xl:w-[80%]">
        <Image
          src="/assets/contact/main-img.png"
          alt="phone image"
          height={1000}
          width={1000}
          className="md:h-[39rem] max-md:hidden w-full "
        />

        {/* contact section */}
        <div className="flex justify-around md:w-4xl  max-md:flex-col  absolute md:top-5  items-center md:left-20  uppercase ">
          {/* contact from */}
          <div className="">
            <span className="flex gap-2 font-semibold md:text-xl  text-lg max-md:px-3 mt-5 items-center">
              <h1>contact us</h1>
              <span className="w-30 h-[2px] bg-orange-400"> </span>
            </span>

            <div className="md:w-[31rem]  h-full   ">
              <Form />
            </div>
          </div>

          {/* or section */}
          <div className=" flex md:flex-col items-center gap-3 my-16 text-sm">
            <span className="md:h-30 md:w-[2px] w-36 h-[2px] max-md:bg-gray-300 md:bg-white"></span>
            OR
            <span className="md:h-30 md:w-[2px] w-36 h-[2px] max-md:bg-gray-300 md:bg-white"></span>
          </div>

          {/* small info cards section */}
          {/* <div className="h-full w-full max-md:max-w-[95%]   max-md:flex not-first:md:space-y-20 ">
            <QueryCard
              img={"map"}
              title={"Give your Feedback"}
              email={"contact@addressguru.in"}
              address={"Help us improve!"}
            />
            <QueryCard
              img={"message"}
              title={"Service & Support"}
              email={"Support Center"}
              address={"29, Tagore Villa, Dehradun"}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
