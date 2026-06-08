import React, { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { get_job_details } from "@/api/listings";
import ApplyForJob from "@/components/Jobs/JdCardComponents/ApplyForJob";
import Description from "@/components/Jobs/JdCardComponents/Description";
import BreadCrumbs from "@/components/BreadCrumbs";
import QuickInformation from "@/components/SeeDetails/QuickInformation";
import UserInformation from "@/components/SeeDetails/UserInformation";
import { APP_URL } from "@/services/constants";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Clock,
  GraduationCap,
  Globe,
  ChevronRight,
  CheckCircle,
  X,
} from "lucide-react";

/* ─── tiny helpers ─── */
const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-zinc-100 text-zinc-600",
    orange: "bg-amber-50 text-amber-700 border border-amber-200",
    blue: "bg-sky-50 text-sky-700 border border-sky-200",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

const StatCell = ({
  icon: Icon,
  label,
  value,
  iconColor = "text-zinc-400",
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
      {label}
    </span>
    <div
      className={`flex items-center gap-1.5 text-sm font-semibold text-zinc-800`}
    >
      <Icon className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
      {value}
    </div>
  </div>
);

/* ─── main component ─── */
const JobDetails = ({ jobData }) => {
  const [apply, setApply] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const city =
    jobData?.location?.city?.name || jobData?.company?.city?.name || "";
  const country = jobData?.location?.country || "UAE";

  const seoTitle = `${jobData?.title} | ${jobData?.company?.name} | AddressGuru UAE`;
  const seoDesc = `Apply for ${jobData?.title} at ${jobData?.company?.name}. ${city ? `Location: ${city}, ` : ""}${country}. Salary: AED ${jobData?.salary?.from}–${jobData?.salary?.to}/month.`;

  const postedDate = jobData?.createdAt
    ? new Date(jobData.createdAt).toLocaleDateString("en-AE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={`${APP_URL}/jobs/${jobData?.slug}`} />
      </Head>

      <div className="max-w-[2000px] mx-auto 2xl:max-w-[80%]  sm:px-6  py-6">
        {/* Breadcrumb */}
        <div className="mb-5">
          <BreadCrumbs slug="Jobs" name={jobData?.title} />
        </div>

        <div className="flex flex-col xl:flex-row gap-6 items-start">
          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* ── Header Card ── */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
              <div className="p-6 sm:p-8">
                {/* Top row: logo + meta + apply button */}
                <div className="flex items-start gap-5">
                  {/* Logo */}
                  <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-center overflow-hidden">
                    {jobData?.company?.logo ? (
                      <Image
                        src={`${APP_URL}/${jobData.company.logo}`}
                        alt={`${jobData?.company?.name} logo`}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <Briefcase className="w-8 h-8 text-zinc-300" />
                    )}
                  </div>

                  {/* Title + company */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {jobData?.jobType && (
                        <Badge variant="orange">{jobData.jobType}</Badge>
                      )}
                      {jobData?.workMode && (
                        <Badge variant="blue">{jobData.workMode}</Badge>
                      )}
                      {jobData?.isUrgent && (
                        <Badge variant="green">Urgent</Badge>
                      )}
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-snug capitalize mb-1">
                      {jobData?.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
                      <span className="font-medium text-zinc-700">
                        {jobData?.company?.name}
                      </span>
                      {(city || country) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          {[city, country].filter(Boolean).join(", ")}
                        </span>
                      )}
                      {postedDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Posted {postedDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Apply button – desktop only */}
                  <button
                    onClick={() => {
                      document
                        .getElementById("apply-form-section")
                        ?.scrollIntoView({ behavior: "smooth" });
                      setApply(true);
                    }}
                    className="hidden sm:flex shrink-0 items-center gap-2 px-5 py-2.5 bg-[#FF6E04] hover:bg-[#E65C00] text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    Apply Now
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Stats row */}
                <div className="mt-6 pt-5 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCell
                    icon={DollarSign}
                    label="Salary"
                    value={`AED ${jobData?.salary?.from?.toLocaleString()}–${jobData?.salary?.to?.toLocaleString()}`}
                    iconColor="text-emerald-500"
                  />
                  <StatCell
                    icon={Briefcase}
                    label="Experience"
                    value={`${jobData?.noOfExperience || "—"} years`}
                    iconColor="text-sky-500"
                  />
                  <StatCell
                    icon={Users}
                    label="Vacancies"
                    value={`${jobData?.totalPositions || 1} position${jobData?.totalPositions > 1 ? "s" : ""}`}
                    iconColor="text-violet-500"
                  />
                  <StatCell
                    icon={GraduationCap}
                    label="Education"
                    value={
                      jobData?.education ? capitalize(jobData.education) : "Any"
                    }
                    iconColor="text-amber-500"
                  />
                </div>

                {/* Mobile apply button */}
                <button
                  onClick={() => {
                    document
                      .getElementById("apply-form-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                    setApply(true);
                  }}
                  className="sm:hidden mt-4 w-full py-3 bg-[#FF6E04] hover:bg-[#E65C00] text-white text-sm font-bold rounded-lg transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </div>

            {/* ── Description Card ── */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <Description
                  desc={jobData?.description}
                  roles={jobData?.responsibilities}
                  qualifications={jobData?.requirements}
                  keySkills={jobData?.skills}
                  companyName={jobData?.company?.name}
                  companyDesc={jobData?.company?.description}
                  address={jobData?.company?.address}
                  city={jobData?.company?.city?.name}
                />
              </div>
            </div>

            {/* ── Extra metadata (nationality, language, benefits) ── */}
            {(jobData?.nationality?.length > 0 ||
              jobData?.language?.length > 0 ||
              jobData?.benefits?.length > 0) && (
              <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 space-y-4">
                {jobData?.benefits?.length > 0 && (
                  <MetaGroup label="Benefits">
                    {jobData.benefits.map((b) => (
                      <Badge key={b} variant="green">
                        {capitalize(b.replace(/-/g, " "))}
                      </Badge>
                    ))}
                  </MetaGroup>
                )}
                {jobData?.language?.length > 0 && (
                  <MetaGroup label="Languages">
                    {jobData.language.map((l) => (
                      <Badge key={l}>{capitalize(l)}</Badge>
                    ))}
                  </MetaGroup>
                )}
                {jobData?.nationality?.length > 0 && (
                  <MetaGroup label="Open to Nationalities">
                    {jobData.nationality.map((n) => (
                      <Badge key={n}>{capitalize(n)}</Badge>
                    ))}
                  </MetaGroup>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="xl:w-[360px] w-full shrink-0 space-y-4 xl:sticky xl:top-6">
            <QuickInformation
              job={true}
              category={jobData?.category}
              positions={jobData?.totalPositions}
            />

            <div
              id="apply-form-section"
              className="bg-white border border-zinc-200 rounded-xl overflow-hidden"
            >
              <ApplyForJob
                highlight={apply}
                slug={jobData?.slug}
                setHighlight={setApply}
                onSuccess={() => setShowSuccess(true)}
              />
            </div>

            <UserInformation />
          </div>
        </div>
      </div>

      {/* Global Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 text-center relative shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 to-[#FF6E04] rounded-t-2xl" />

            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>

            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>

            <h3 className="text-2xl font-bold text-zinc-900 mb-3">
              Application Sent!
            </h3>
            <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
              Your application for{" "}
              <span className="font-semibold text-zinc-800">
                {jobData?.title}
              </span>{" "}
              has been successfully submitted. The hiring team will get back to
              you soon.
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              className="w-full py-3 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-[#FF6E04] transition-colors shadow-lg shadow-zinc-200"
            >
              Got it, thanks!
            </button>

            <p className="mt-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Verified by AddressGuru UAE
            </p>
          </div>
        </div>
      )}
    </>
  );
};

/* helper sub-components */
const MetaGroup = ({ label, children }) => (
  <div className="space-y-2">
    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
      {label}
    </p>
    <div className="flex flex-wrap gap-1.5">{children}</div>
  </div>
);

const capitalize = (str = "") =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export default JobDetails;

export async function getServerSideProps(context) {
  const { slug } = context.params;
  try {
    const res = await get_job_details(slug);
    if (!res?.data) return { notFound: true };
    return { props: { jobData: res?.data } };
  } catch (error) {
    console.error("Error fetching job details:", error);
    return { notFound: true };
  }
}
