import React, { useState } from "react";
import Image from "next/image";
import HowDoesItWork from "@/components/Register/HowDoesItWork";
import ReviewSlider from "@/components/Register/ReviewSlider";
import CustomerCare from "@/components/Register/CustomerCare";
import RegistrationForm from "@/components/Register/RegistrationForm";
import NeedSupport from "@/components/Register/NeedSupport";
import FAQ from "@/components/Register/FAQ";
import NumberCards from "@/components/Register/NumberCards";
import OTPPopup from "@/components/Register/OTPPopup";
import BannerLast from "@/components/BannerLast";

const Register = () => {
  const [pop, setPop] = useState(false);
  const [userId, setUserId] = useState(null);
  return (
    <div className="h-full w-full  flex flex-col items-center overflow-hidden">
      <div className=" md:w-[80%] max-md:w-full  bg-white">
        <div className="relative max-md:h-[500px] overflow-hidden bg-[#FFF8F3] max-md:mt-3 max-md:p-4 md:p-8">
          <span className="">
            <p className="font-bold md:text-3xl max-md:font-extrabold max-md:text-xl  ">
              List Your Business in 2 Min{" "}
              <strong className="text-orange-500 max-md:hidden">
                - Absolutely Free!
              </strong>{" "}
            </p>
            <strong className="text-orange-500 md:hidden max-md:text-2xl">
              {" "}
              Absolutely Free!
            </strong>{" "}
            <p className="font-[500] md:text-xl max-md:text-lg ">
              Trusted by Millions Across India
            </p>
          </span>
          <div>
            <div className=" mt-10 md:w-[350px]  2xl:scale-110 max-md:hidden  2xl:ml-10 2xl:mt-10 ">
              <RegistrationForm setPop={setPop} setUserId={setUserId} />
            </div>
          </div>
          <Image
            src="/assets/register/man-phone.png"
            alt="man"
            height={1000}
            width={1000}
            className="  w-fit md:h-[63%]  absolute bottom-0  right-0 z-10 "
          />
          {/* custom orange section */}
          <div className="rounded-full md:h-[700px] max-md:w-[500px] max-md:[500px]  md:w-[700px] absolute bg-orange-500 md:-right-25  md:top-25">
            {/* number cards around it   */}
            <section className="max-md:absolute max-md:left-0 z-50  flex flex-col gap-3">
              <span className=" md:absolute  md:top-20 md:left-2  ">
                <NumberCards
                  img={"leads"}
                  color={"#FFF1BF"}
                  number={"5 Lack"}
                  text={"Lead Generated"}
                />
              </span>
              <span className=" md:absolute  md:top-30 md:right-30">
                <NumberCards
                  img={"daily-calls"}
                  color={"#FCE1C4"}
                  number={"10k"}
                  text={"Direct Call Daily"}
                />
              </span>
              <span className=" md:absolute  md:-top-7 md:left-55">
                <NumberCards
                  img={"verified-business"}
                  color={"#F8D4FC"}
                  number={"45k"}
                  text={"Verified Business Listed"}
                />
              </span>
              <span className=" md:absolute  md:top-60 md:-left-7">
                <NumberCards
                  img={"whatsapp"}
                  color={"#C4F4D2"}
                  number={"45k"}
                  text={"Whatsapp Leads"}
                />
              </span>
              <span className=" md:absolute  md:top-105 md:-left-0">
                <NumberCards
                  img={"live"}
                  color={"#9FD4FF"}
                  number={"Live"}
                  text={"chat"}
                />
              </span>
            </section>
            <svg
              className="absolute z-10 md:-top-7 max-md:scale-50 max-md:right-40 md:ight-50"
              width="180"
              height="250"
              viewBox="0 0 143 269"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M134.958 15.0407C136.054 15.1737 136.835 16.1705 136.702 17.267C136.569 18.3635 135.572 19.1446 134.476 19.0116L134.958 15.0407ZM22.8801 254.237L20.8858 254.387C17.8487 214.212 34.7408 153.173 57.884 102.997C69.4715 77.8743 82.6938 55.3233 95.9026 39.3583C102.505 31.3784 109.161 24.9729 115.672 20.7245C122.173 16.4827 128.701 14.2816 134.958 15.0407L134.717 17.0261L134.476 19.0116C129.499 18.4078 123.921 20.118 117.858 24.0743C111.805 28.024 105.442 34.1035 98.9845 41.9081C86.0746 57.512 73.0214 79.7281 61.5163 104.672C38.4745 154.629 21.9137 214.921 24.8744 254.086L22.8801 254.237Z"
                fill="black"
              />
              <path
                d="M14.5302 247.664C15.1825 248.944 15.9237 250.179 16.7942 251.404C17.7399 252.734 18.7286 254.145 19.8498 255.364C20.9791 256.593 22.0869 257.448 23.1815 257.818C23.22 257.831 23.3055 257.844 23.4374 257.81C23.5727 257.775 23.7026 257.702 23.7948 257.616C23.8464 257.568 23.8707 257.53 23.8821 257.509C23.8783 257.499 23.8735 257.485 23.8645 257.468L23.8641 257.469C23.2756 256.382 22.3593 255.419 21.186 254.364C20.0988 253.386 18.6342 252.203 17.4707 250.958C16.4799 249.898 15.4937 248.795 14.5302 247.664Z"
                fill="black"
                stroke="black"
                stroke-width="4"
                stroke-linecap="round"
              />
              <path
                d="M22.4431 255.973C21.9967 256.413 21.9435 256.748 21.9486 256.928C21.9548 257.146 22.0569 257.396 22.2751 257.606C22.4938 257.817 22.7609 257.92 23.0001 257.921C23.1754 257.922 23.4518 257.869 23.7905 257.568L23.9398 257.423C27.3106 253.853 30.6786 250.473 33.4537 246.749C29.493 249.227 25.9517 252.524 22.4422 255.973L22.4431 255.973Z"
                fill="black"
                stroke="black"
                stroke-width="4"
                stroke-linecap="round"
              />
              <path
                d="M140.059 18.1955L140.059 18.3981C140.052 18.3931 140.044 18.3895 140.038 18.3846C139.959 18.323 139.935 18.2719 139.927 18.2551L139.927 18.2529M140.059 18.1955L139.927 18.2529M140.059 18.1955L139.912 18.0579M140.059 18.1955L140.058 18.1167C140.043 18.1016 140.024 18.0851 140 18.0684C139.972 18.0489 139.944 18.0338 139.918 18.0227C139.916 18.035 139.913 18.0466 139.912 18.0579M140.059 18.1955L139.927 18.2529M140.059 18.1955L139.912 18.0579M139.927 18.2529C139.919 18.2342 139.899 18.1812 139.908 18.0837C139.908 18.0755 139.91 18.0668 139.912 18.0579M140.06 18.1183L140.061 18.3988C140.07 18.4051 140.079 18.4119 140.089 18.4182C140.099 18.3916 140.108 18.3617 140.113 18.328C140.127 18.2275 140.104 18.1686 140.107 18.1755C140.109 18.1807 140.096 18.1545 140.06 18.1183Z"
                fill="black"
                stroke="black"
                stroke-width="4"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="w-full flex md:items-center max-md:justify-start md:py-20 max-md:pb-7 justify-center">
          <HowDoesItWork />
        </div>

        {/* review section */}
        <div className="md:w-full bg-[#E8F4FF] h-auto md:flex w-[96%] mx-auto max-md:rounded-3xl max-md:mt-5 justify-between md:py-8 p-2 md:px-10">
          {/* left section */}
          <div className=" md:w-[20rem] w-full  space-y-2  md:space-y-3">
            {/* qoute icon */}
            <span>
              <svg
                className="max-md:w-16"
                width="100"
                height="100"
                viewBox="0 0 119 119"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M75.8711 118.779V72.486C75.8711 26.7258 90.2518 2.5638 119 0V24.839C108.614 29.2083 103.423 38.9174 103.423 53.9706H119V118.779H75.8711Z"
                  fill="#FF6E04"
                />
                <path
                  d="M0 118.779V72.486C0 26.7258 14.3808 2.5638 43.1287 0V24.839C32.7426 29.2083 27.5473 38.9174 27.5473 53.9706H43.1287V118.779H0Z"
                  fill="#FF6E04"
                />
              </svg>
            </span>
            <h4 className="md:text-2xl text-xl  text-[#323232]  md:mt-4 max-md:text-center md:tracking-widest font-extrabold">
              Our Customer Success Stories
            </h4>
            <p className=" font-[500] max-md:font-bold text-xs  max-md:text-center  ">
              <strong className="md:font-bold  md:text-lg  text-lg text-orange-500">
                {" "}
                45,000+
              </strong>{" "}
              businesses trusts Address Guru to bring them closer to their
              customers & grow their reach..
            </p>

            <button className="text-[11px] font-[500] max-md:hidden bg-orange-500 px-3 py-2 rounded-sm  text-white uppercase cursor-pointer">
              see more stories
            </button>
            <h5 className="text-xl font-[1000] max-md:text-center text-orange-500">
              {" "}
              Hurry, be one of them!
            </h5>
          </div>
          {/* right slider section */}
          <div className="max-w-xl  2xl:max-w-3xl">
            <ReviewSlider />
          </div>
        </div>
        {/* customer care section */}
        <div className=" h-auto">
          <CustomerCare />
        </div>

        {/* FAQ section */}

        <div className="md:flex justify-between md:px-3 md:py-10 gap-2 w-full h-full ">
          <NeedSupport />

          <FAQ />
        </div>
      </div>

      {pop && <OTPPopup setPop={setPop} userId={userId} />}

      <div className="w-full max-w-[1365px] mx-auto">
        <BannerLast />
      </div>
    </div>
  );
};

export default Register;
