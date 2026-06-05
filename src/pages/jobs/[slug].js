import IconKeyValue from "@/components/Jobs/JdCardComponents/IconKeyValue";
import React, { useState } from "react";
import Image from "next/image";
import Description from "@/components/Jobs/JdCardComponents/Description";
import { get_job_details } from "@/api/listings";
import ApplyForJob from "@/components/Jobs/JdCardComponents/ApplyForJob";
import { APP_URL } from "@/services/constants";
import BreadCrumbs from "@/components/BreadCrumbs";
import Head from "next/head";
import QuickInformation from "@/components/SeeDetails/QuickInformation";
import UserInformation from "@/components/SeeDetails/UserInformation";
import { Briefcase, MapPin, DollarSign, Calendar, Users, CheckCircle2 } from "lucide-react";

const JobDetails = ({ jobData }) => {
  const [apply, setApply] = useState(false);

  const seoTitle = `${jobData?.title} Jobs in ${jobData?.location?.city?.name || 'UAE'} | ${jobData?.company?.name} | AddressGuru UAE`;
  const seoDesc = `Apply for ${jobData?.title} at ${jobData?.company?.name}. Location: ${jobData?.location?.city?.name}, ${jobData?.location?.country}. Salary: AED ${jobData?.salary?.from}-${jobData?.salary?.to}. ${jobData?.noOfExperience} options available.`;

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={`${APP_URL}/jobs/${jobData?.slug}`} />
      </Head>

      <div className="w-full min-h-screen bg-[#F8F9FA] pb-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="py-4">
            <BreadCrumbs slug={"Jobs"} name={jobData?.title} />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content Column */}
            <div className="flex-1">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Hero Header Section */}
                <div className="p-6 sm:p-10 border-b border-gray-50">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-orange-100">
                          {jobData?.jobType}
                        </span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-blue-100">
                          {jobData?.workMode}
                        </span>
                      </div>
                      
                      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
                        {jobData?.title}
                      </h1>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <span className="text-lg font-bold text-gray-700">{jobData?.company?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 font-medium italic">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          {jobData?.location?.city?.name}, {jobData?.location?.country}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-center md:items-end gap-6">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-2xl border border-gray-100 p-4 flex items-center justify-center shadow-inner">
                        <Image
                          src={`${APP_URL}/${jobData?.company?.logo}`}
                          alt="Company Logo"
                          height={120}
                          width={120}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <button
                        onClick={() => {
                           const el = document.getElementById('apply-form-section');
                           el?.scrollIntoView({ behavior: 'smooth' });
                           setApply(true);
                        }}
                        className="w-full md:w-auto px-8 py-4 bg-[#FF6E04] hover:bg-[#E65F00] text-white text-base font-bold rounded-2xl transition-all shadow-xl shadow-orange-500/20 active:scale-95"
                      >
                        Apply for this position
                      </button>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 bg-gray-50/50 p-6 rounded-2xl border border-gray-50">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Offered Salary</p>
                      <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm sm:text-base">
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                        AED {jobData?.salary?.from}-{jobData?.salary?.to}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experience</p>
                      <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm sm:text-base">
                        <Briefcase className="w-4 h-4 text-blue-500" />
                        {jobData?.noOfExperience} Years
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vacancies</p>
                      <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm sm:text-base">
                        <Users className="w-4 h-4 text-purple-500" />
                        {jobData?.totalPositions} Positions
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Post Date</p>
                      <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm sm:text-base">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        {new Date(jobData?.createdAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Description Component */}
                <div className="p-6 sm:p-10 prose prose-slate max-w-none">
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
            </div>

            {/* Sidebar column */}
            <div className="lg:w-[400px] flex flex-col gap-6">
              <div className="sticky top-24 space-y-6">
                <QuickInformation
                  job={true}
                  category={jobData?.category}
                  positions={jobData?.totalPositions}
                />
                
                <div id="apply-form-section" className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transform transition-transform">
                   <ApplyForJob
                    highlight={apply}
                    slug={jobData?.slug}
                    setHighlight={setApply}
                  />
                </div>

                <UserInformation />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

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
