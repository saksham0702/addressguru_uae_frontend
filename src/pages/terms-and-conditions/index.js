import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="mx-auto max-w-[2000px] min-h-screen bg-white 2xl:max-w-[80%]">
      <div className="max-w-7xl px-4 md:px-8 lg:px-16 py-10">
        <h1 className="text-2xl font-medium text-gray-900">
          Terms &amp; Conditions
        </h1>
        <div className="h-[3px] w-12 bg-orange-500 rounded mt-1 mb-1"></div>
        <p className="text-sm font-medium text-orange-500 mb-8">
          General terms of use for AddressGuru UAE
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            Acceptance of Terms
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            By accessing or using the AddressGuru UAE application and website (the &quot;Platform&quot;), you agree to be bound by these Terms and Conditions. If you do not agree to all the terms and conditions, then you may not access the Platform or use any of its services.
          </p>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            User-Generated Content (UGC) Policy
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            AddressGuru UAE enables users to post listings, reviews, and messages (collectively &quot;Content&quot;). We enforce a strict zero-tolerance policy against objectionable content and abusive users. 
          </p>
          <ul className="space-y-3 mb-4">
            <li className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
              <span className="mt-[6px] min-w-[8px] h-2 w-2 rounded-full bg-orange-400 inline-block"></span>
              <span><strong>No Objectionable Content:</strong> You may not post content that is defamatory, obscene, pornographic, harassing, threatening, discriminatory, or otherwise violates any laws of the United Arab Emirates.</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
              <span className="mt-[6px] min-w-[8px] h-2 w-2 rounded-full bg-orange-400 inline-block"></span>
              <span><strong>User Moderation:</strong> Users can flag and report any inappropriate content or abusive behavior directly through the app using the &quot;Report&quot; feature available on listings and profiles.</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
              <span className="mt-[6px] min-w-[8px] h-2 w-2 rounded-full bg-orange-400 inline-block"></span>
              <span><strong>24-Hour Action:</strong> Our moderation team actively reviews all reports. Any content deemed objectionable will be removed, and the offending user will be suspended or permanently banned from the platform within 24 hours of a report.</span>
            </li>
          </ul>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            Account Responsibilities
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Platform.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            You are responsible for safeguarding the password that you use to access the Platform and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            Limitation of Liability
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <p className="text-sm text-gray-600 leading-relaxed">
            In no event shall AddressGuru UAE, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; and (iii) unauthorized access, use or alteration of your transmissions or content.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
