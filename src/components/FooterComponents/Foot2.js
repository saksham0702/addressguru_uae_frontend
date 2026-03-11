import React from "react";
import Image from "next/image";

const Foot2 = () => {
  return (
    <div className=" py-6 flex w-full px-20 justify-between items-start text-sm text-gray-800">
      {/* Section 1: Feedback */}
      <div className=" mb-4">
        <h3 className="font-semibold mb-1">Give Your Feedback</h3>
        <p className="font-bold">Addressgurusingapore@gmail.com</p>
        <p className="text-xs text-gray-500">Help us improve!</p>
      </div>

      {/* Section 2: Support */}
      <div className=" mb-4">
        <h3 className="font-semibold mb-1">Services & Support</h3>
        <p className="font-bold">Support Centre</p>
        <p className="text-xs text-gray-500">29, Tagore Villa, Dehradun</p>
      </div>

      {/* Section 3: Our Partners */}
      <div className=" mb-4">
        <h3 className="font-semibold mb-2">Our Partners</h3>
        <div className="flex gap-2 items-center">
          <Image
            src="/assets/Png/footer/adxventure.png"
            alt="AdxVenture"
            width={100}
            height={30}
          />
          <Image
            src="/assets/Png/footer/partner2.png"
            alt="Verified"
            width={40}
            height={40}
          />
          <Image
            src="/assets/Png/footer/partner3.png"
            alt="DMCA"
            width={50}
            height={40}
          />
        </div>
      </div>

      {/* Section 4: Payment Partners */}
      <div className=" mb-4">
        <h3 className="font-semibold mb-2">Payment Partners</h3>
        <div className="flex gap-2 items-center">
          <Image
            src="/assets/Png/footer/master-card.png"
            alt="MasterCard"
            width={40}
            height={25}
          />
          <Image
            src="/assets/Png/footer/maestro.png"
            alt="Maestro"
            width={40}
            height={25}
          />
          <Image
            src="/assets/Png/footer/visa-1.png"
            alt="Visa"
            width={40}
            height={25}
          />
          <Image
            src="/assets/Png/footer/visa-2.png"
            alt="Visa Electron"
            width={40}
            height={25}
          />
        </div>
      </div>
    </div>
  );
};

export default Foot2;
