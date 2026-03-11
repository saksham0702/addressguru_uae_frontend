import React from "react";
import Image from "next/image";
import Login from "./Login";

const features = [
  "1000 Free Messages.",
  "1 Video Promotion.",
  "Social sharing links.",
  "Free SEO Optimization.",
  "5 to 10 Photos for Free.",
];

const UserLogin = ({ setShowLogin }) => {
  return (
    <div className="absolute h-screen w-full  backdrop-blur-lg inset-0 z-50 flex items-center justify-center">
      {/* right cross section */}
      <div
        onClick={() => setShowLogin(false)}
        className="absolute cursor-pointer top-4 right-4 z-50"
      >
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M19 35.625C9.81825 35.625 2.375 28.1794 2.375 19C2.375 9.82063 9.81825 2.375 19 2.375C28.1817 2.375 35.625 9.82063 35.625 19C35.625 28.1794 28.1817 35.625 19 35.625ZM19 0C8.50606 0 0 8.5025 0 19C0 29.4975 8.50606 38 19 38C29.4939 38 38 29.4975 38 19C38 8.5025 29.4939 0 19 0ZM25.7889 12.2075C25.321 11.7444 24.5646 11.7444 24.0967 12.2075L18.9929 17.3137L13.9626 12.2787C13.4983 11.8156 12.7454 11.8156 12.2835 12.2787C11.8192 12.7418 11.8192 13.5019 12.2835 13.965L17.3138 18.9881L12.2479 24.0588C11.7812 24.5219 11.7812 25.2818 12.2479 25.7568C12.7158 26.2199 13.4734 26.2199 13.9412 25.7568L19.0071 20.6863L24.0374 25.7213C24.5017 26.1844 25.2545 26.1844 25.7177 25.7213C26.182 25.2582 26.182 24.4981 25.7177 24.035L20.6862 19.0119L25.7889 13.9056C26.2556 13.4306 26.2556 12.6825 25.7889 12.2075Z"
            fill="white"
          />
        </svg>
      </div>

      {/* user login register and forgot section */}
      <div className="bg-white rounded-lg w-[63%] shadow-xl h-[80%] max-h-[80vh] 2xl:max-h-[65vh] flex">
        {/* left section */}
        <div className="h-full w-[49%] ">
          <Login setShowLogin={setShowLogin} />
        </div>

        {/* right image section */}

        <div className=" w-[55%] relative h-[97%] mt-2 mr-2 ">
          <div className="absolute z-40 left-10 top-4 ">
            <h2 className="font-[500] text-xl">
              {" "}
              Listing Benefits With{" "}
              <strong className="text-orange-400">Address Guru</strong>{" "}
            </h2>

            <ul className="flex flex-wrap list-disc pl-5 w-full mt-4 gap-x-6 gap-y-2">
              {features.map((item, index) => (
                <li
                  key={index}
                  className="list-item text-[13px] w-[45%]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Image
            src="/assets/Login/laptop.png"
            alt="laptop-login-image"
            height={500}
            width={500}
            className="absolute h-full rounded-md "
          />
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
