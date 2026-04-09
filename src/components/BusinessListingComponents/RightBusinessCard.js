import { send_listings_in_mail } from "@/api/queries";
import NameNumberCard from "./NameNumberCard";
import { useState } from "react";

export default function RightBusinessCard({ name }) {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "sent"

  const sendListing = async () => {
    if (status === "sent" || status === "loading") return;

    setStatus("loading");
    const payload = {
      name: formData.name,
      email: formData.email,
      category_slug: name,
    };
    try {
      const res = await send_listings_in_mail(payload);
      if (res?.data?.status === true) {
        setStatus("sent");
      } else {
        setStatus("idle");
      }
    } catch (error) {
      console.log("error", error);
      setStatus("idle");
    }
  };

  const buttonContent = () => {
    if (status === "loading") {
      return (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Sending...
        </span>
      );
    }

    if (status === "sent") {
      return (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Sent to your mail!
        </span>
      );
    }

    return "UNLOCK TOP DEALS";
  };

  return (
    <div className="w-70 2xl:w-xs bg-[#FFF8F3] px-3 py-4 rounded-xl shadow-lg">
      <h2 className="text-md font-semibold text-gray-800 mb-1">
        Explore the Top{" "}
        <span className="text-[#FF6E04] capitalize">{name}</span>
      </h2>
      <p className="text-[13px] font-[500] tracking-tight mb-4">
        You will receive the best listings details instantly, at no cost
      </p>

      <NameNumberCard
        layout="col"
        formData={formData}
        setFormData={setFormData}
      />

      <button
        onClick={sendListing}
        disabled={status === "loading" || status === "sent"}
        className={`w-full text-[13px] text-white font-semibold py-2 rounded-lg transition
          ${status === "sent"
            ? "bg-green-500 cursor-default"
            : status === "loading"
            ? "bg-[#FF6E04] opacity-80 cursor-not-allowed"
            : "bg-[#FF6E04] hover:bg-orange-600 cursor-pointer"
          }`}
      >
        {buttonContent()}
      </button>
    </div>
  );
}