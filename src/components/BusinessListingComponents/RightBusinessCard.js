import { send_listings_in_mail } from "@/api/queries";
import NameNumberCard from "./NameNumberCard";
import { useState } from "react";

export default function RightBusinessCard({ name }) {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({ name: false, email: false });
  const [status, setStatus] = useState("idle");

  const sendListing = async () => {
    const newErrors = {
      name: !formData.name.trim(),
      email: !formData.email.trim(),
    };

    if (newErrors.name || newErrors.email) {
      setErrors(newErrors);
      return;
    }

    setErrors({ name: false, email: false });

    if (status === "sent" || status === "loading") return;

    setStatus("loading");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        category_slug: name,
      };

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
    if (status === "loading") return "Sending...";
    if (status === "sent") return "Check your email ✓";
    return "Get Top Listings";
  };

  return (
    <div className="w-80 2xl:w-96 bg-blue-50 border border-gray-100  px-5 py-6 rounded-md">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 leading-snug">
          Get Top <span className="text-[#FF6E04] capitalize">{name}</span>
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Receive the most relevant listings directly in your inbox
        </p>
      </div>

      {/* FORM */}
      <div className="mb-3">
        <NameNumberCard
          layout="col"
          formData={formData}
          setFormData={(data) => {
            setFormData(data);
            setErrors({ name: false, email: false });
          }}
          errors={errors}
        />
      </div>

      {/* VALUE DETAILS */}
      <div className="bg-white  mt-4 rounded-xs p-3 mb-4">
        <ul className="text-xs text-gray-700 space-y-1.5">
          <li>✔ Verified & trusted businesses</li>
          <li>✔ Best pricing & offers available</li>
          <li>✔ Quick comparison of top options</li>
        </ul>
      </div>

      {/* CTA */}
      <button
        onClick={sendListing}
        disabled={status === "loading" || status === "sent"}
        className={`w-full text-sm text-white font-semibold py-2.5 rounded-lg transition
          ${
            status === "sent"
              ? "bg-green-500 cursor-default"
              : status === "loading"
                ? "bg-[#FF6E04] opacity-80 cursor-not-allowed"
                : "bg-[#FF6E04] hover:bg-orange-600"
          }`}
      >
        {buttonContent()}
      </button>

      <div className="flex items-start gap-2 mt-3">
        <input
          type="checkbox"
          checked
          readOnly
          className="mt-0.5 h-3.5 w-3.5 accent-[#FF6E04] cursor-default"
        />
        <p className="text-[11px] text-gray-500 leading-tight">
          I agree to the{" "}
          <a
            href="/privacy-policy"
            target="_blank"
            className="text-[#FF6E04] hover:underline"
          >
            Privacy Policy
          </a>
        </p>
      </div>

      {/* TRUST NOTE */}
      <p className="text-xs text-gray-500 text-center mt-3">
        No spam. Only relevant listings.
      </p>
    </div>
  );
}
