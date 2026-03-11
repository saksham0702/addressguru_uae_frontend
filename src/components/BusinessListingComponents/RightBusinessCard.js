import { send_listings_in_mail } from "@/api/queries";
import NameNumberCard from "./NameNumberCard";
import CustomRadioGroup from "./OnlineOflineButtons";
import OnlineOflineButtons from "./OnlineOflineButtons";
import { useState } from "react";

export default function RightBusinessCard({ name }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const sendListing = async () => {
    const payload = {
      name: formData.name,
      email: formData.email,
      category: name,
    };
    try {
      const res = await send_listings_in_mail(payload);
      console.log("send listings in mail response:", res);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="w-70 2xl:w-xs bg-[#FFF8F3] px-3  py-4 rounded-xl shadow-lg ">
      <h2 className="text-md font-bold text-gray-800 mb-1">
        Explore the Top{" "}
        <span className="text-[#FF6E04] capitalize">{name}</span>
      </h2>
      <p className="text-[13px] font-[500] tracking-tight mb-4">
        You will receive the best listings details instantly, at no cost
      </p>

      {/* <p className="text-sm font-[500] capitalize pr-3 mb-2">
        Tell us the type of {name} you need?
      </p>

      <div className="mt-4 mb-10 px-3">
        <CustomRadioGroup />
      </div> */}

      <NameNumberCard
        layout="col"
        formData={formData}
        setFormData={setFormData}
      />
      <button
        onClick={sendListing}
        className="w-full bg-[#FF6E04] cursor-pointer text-[13px] text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition"
      >
        UNLOCK TOP DEALS
      </button>
    </div>
  );
}
