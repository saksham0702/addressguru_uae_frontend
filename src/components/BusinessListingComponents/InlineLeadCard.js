import { useState } from "react";
import { send_listings_in_mail } from "@/api/queries";
import { useRouter } from "next/router";
import { User, Mail } from "lucide-react";

export default function InlineLeadCard({ category}) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    mobile: false,
    consent: false,
  });

  const [consent, setConsent] = useState(true);
  const [status, setStatus] = useState("idle");

  const handleSubmit = async () => {
    const newErrors = {
      name: !formData.name.trim(),
      mobile: !formData.mobile.trim(),
      consent: !consent,
    };

    if (newErrors.name || newErrors.mobile || newErrors.consent) {
      setErrors(newErrors);
      return;
    }

    setErrors({ name: false, mobile: false, consent: false });

    if (status === "loading" || status === "sent") return;

    setStatus("loading");

    try {
      const payload = {
        name: formData.name,
        email: formData.mobile,
        category_slug: category,
      };

      const res = await send_listings_in_mail(payload);

      if (res?.data?.status) {
        setStatus("sent");
      } else {
        setStatus("idle");
      }
    } catch (err) {
      console.log(err);
      setStatus("idle");
    }
  };

  return (
    <div className="w-full bg-orange-50 border border-orange-50 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* LEFT */}
      <div className="flex-1 flex items-start gap-3">
        {/* CATEGORY ICON */}
        {/* {iconSvg && (
          <div
            className="w-10 h-10 flex items-center justify-center bg-white rounded-md border"
            dangerouslySetInnerHTML={{ __html: iconSvg }}
          />
        )} */}

        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">
            Get the List of Top 10 {" "} 
            <span className="text-[#FF6E04] capitalize">{category}</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            We&apos;ll send you contact details instantly, 100% free
          </p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="bg-white border-gray-50 border rounded-lg p-3 md:p-4 flex flex-col gap-2 w-full md:w-auto min-h-[110px]">
        <div className="flex flex-col md:flex-row gap-2">
          {/* NAME INPUT */}
          <div className="relative w-full md:w-[160px]">
            <User className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: false });
              }}
              className={`border pl-8 pr-3 py-2 rounded-md text-sm w-full ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          {/* MOBILE / EMAIL INPUT */}
          <div className="relative w-full md:w-[160px]">
            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={(e) => {
                setFormData({ ...formData, mobile: e.target.value });
                setErrors({ ...errors, mobile: false });
              }}
              className={`border pl-8 pr-3 py-2 rounded-md text-sm w-full ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={status === "loading" || status === "sent"}
            className={`px-4 py-2 text-white rounded-md text-sm font-semibold transition ${
              status === "sent"
                ? "bg-green-500 cursor-default"
                : status === "loading"
                  ? "bg-[#FF6E04] opacity-80 cursor-not-allowed"
                  : "bg-[#FF6E04] hover:bg-orange-600"
            }`}
          >
            {status === "loading"
              ? "Sending..."
              : status === "sent"
                ? "Sent!"
                : "Get Best Deal"}
          </button>
        </div>

        {/* CONSENT */}
        <div className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              setErrors({ ...errors, consent: false });
            }}
            className="accent-[#FF6E04]"
          />

          <p className="text-xs text-gray-500">
            I agree to{" "}
            <span
              onClick={() => router.push("/privacy-policy")}
              className="text-[#FF6E04] cursor-pointer hover:underline"
            >
              T&amp;Cs & Privacy Policy
            </span>
          </p>
        </div>

        {errors.consent && (
          <span className="text-[11px] text-red-500">
            Please accept terms to continue
          </span>
        )}
      </div>
    </div>
  );
}
