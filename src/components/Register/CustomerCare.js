import React from "react";
import Image from "next/image";
import FeaturesForCustomer from "./FeaturesForCustomer";
import CustomButton from "../Buttons/CustomButton";

const CustomerCare = () => {
  return (
    <div className="  pb-20  w-full relative md:flex justify-between ">
      {/* heading and images  */}
      <div className=" relative h-full md:w-[600px] max-md:w-full left-0 z-10 max-md:mt-10 md:mt-35">
        <h3 className="md:text-2xl max-md:text-3xl max-md:text-[#FF6E04] max-md:text-center  font-bold  md:pl-10 ">Complete Care</h3>
        <h3 className="text-2xl  md:font-bold max-md:text-center  md:pl-10 "> Every Step of the Way</h3>
        {/* left images section */}
        <div className="flex flex-col mt-10   ">
          <Image
            src="/assets/register/customer-care-left1.png"
            alt="left image 1"
            height={500}
            width={500}
            className=" w-50 md:w-60"
          />
          <Image
            src="/assets/register/customer-care-left2.png"
            alt="left image 1"
            height={500}
            width={500}
            className=" h-70 md:w-60 w-50 absolute right-[-25px] top-40 md:top-60"
          />
          <Image
            src="/assets/register/customer-care-left3.png"
            alt="left image 1"
            height={500}
            width={500}
            className=" z-10 w-65 md:w-80 md:h-70  relative md:top-25 top-12   "
          />
        </div>
      </div>

      <div className=" md:w-2xl w-full max-md:ml-5 max-w-3xl md:max-h-[800px] relative flex flex-col items-center  mt-17 ">
        <Image
          src="/assets/register/customer-care-orangebg.png"
          alt="orange background"
          height={500}
          width={500}
          className="  md:h-full max-md:h-[670px] w-full "
        />
        <div className="flex flex-col w-auto h-auto md:top-14 top-10 text-white mx-auto  absolute md:pl-20 max-md:pl-5 gap-2 ">
          <div className="flex flex-col gap-6">
            <FeaturesForCustomer />
            <FeaturesForCustomer />
            <FeaturesForCustomer />
          </div>
          <div className="  pl-20 pt-3">
            <CustomButton
              defaultText="Call Now"
              fontSize="14px"
              icon={
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5541 12.9771C15.5541 13.232 15.4975 13.4939 15.3771 13.7488C15.2568 14.0037 15.101 14.2444 14.8957 14.4709C14.5488 14.8532 14.1665 15.1293 13.7346 15.3063C13.3098 15.4833 12.8497 15.5753 12.3541 15.5753C11.632 15.5753 10.8603 15.4054 10.0461 15.0585C9.23196 14.7116 8.4178 14.2444 7.61072 13.6568C6.79656 13.0621 6.02488 12.4037 5.28859 11.6744C4.55939 10.9382 3.90098 10.1665 3.31337 9.3594C2.73283 8.55232 2.26558 7.74523 1.92575 6.94523C1.58593 6.13815 1.41602 5.36647 1.41602 4.63018C1.41602 4.14877 1.50097 3.68859 1.67088 3.26381C1.8408 2.83195 2.10982 2.43549 2.48504 2.0815C2.93814 1.63549 3.43372 1.41602 3.95761 1.41602C4.15585 1.41602 4.35408 1.45849 4.53107 1.54345C4.71514 1.62841 4.87797 1.75584 5.0054 1.93991L6.64789 4.25496C6.77532 4.43195 6.86736 4.59478 6.93107 4.75054C6.99479 4.89921 7.03019 5.04788 7.03019 5.1824C7.03019 5.35231 6.98063 5.52222 6.88152 5.68505C6.78948 5.84788 6.65497 6.0178 6.48505 6.18771L5.947 6.747C5.86912 6.82488 5.83372 6.91691 5.83372 7.03019C5.83372 7.08683 5.84081 7.13638 5.85496 7.19302C5.8762 7.24966 5.89744 7.29213 5.9116 7.33461C6.03904 7.56824 6.2585 7.87267 6.57001 8.24081C6.88859 8.60895 7.22842 8.98417 7.59656 9.3594C7.97886 9.73462 8.34701 10.0815 8.72223 10.4001C9.09037 10.7116 9.3948 10.924 9.6355 11.0514C9.6709 11.0656 9.71338 11.0868 9.76294 11.1081C9.81958 11.1293 9.87621 11.1364 9.93993 11.1364C10.0603 11.1364 10.1523 11.0939 10.2302 11.016L10.7683 10.4851C10.9452 10.3081 11.1152 10.1736 11.278 10.0886C11.4408 9.98949 11.6037 9.93993 11.7806 9.93993C11.9152 9.93993 12.0567 9.96825 12.2125 10.032C12.3683 10.0957 12.5311 10.1877 12.7081 10.3081L15.0514 11.9718C15.2355 12.0992 15.363 12.2479 15.4408 12.4249C15.5116 12.6019 15.5541 12.7789 15.5541 12.9771Z"
                    fill="#FF6E04"
                  />
                </svg>
              }
              bgColor="#fff"
              textColor="#000000"
              width="140px"
            />
            <h3 className="font-bold uppercase mt-10  max-md:hidden text-lg">
              download our app today
            </h3>
            <span className="flex gap-5 max-md:hidden mt-1">
              <Image
                src="/assets/Png/last-banner/play-store.png"
                alt="design"
                height={1000}
                width={1000}
                className="w-30 h-10  "
              />

              <Image
                src="/assets/Png/last-banner/app-store.png"
                alt="design"
                height={1000}
                width={1000}
                className="w-30 h-10 "
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCare;
