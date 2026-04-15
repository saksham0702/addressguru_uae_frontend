import React from "react";

const InfringementPolicy = () => {
  return (
    <div className="mx-auto max-w-[2000px] min-h-screen bg-white 2xl:max-w-[80%]">
      <div className="max-w-7xl px-15 py-10">
        <h1 className="text-2xl font-medium text-gray-900">
          Infringement Policy
        </h1>
        <div className="h-[3px] w-12 bg-orange-500 rounded mt-1 mb-1"></div>
        <p className="text-sm font-medium text-orange-500 mb-8">
          Protecting intellectual property rights on AddressGuru UAE
        </p>

        <section className="mb-8">
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            All trademarks, logos, service names, and other marks are the
            property of AddressGuru UAE and the vendors. AddressGuru uses the
            marks and information of vendors for the distribution of information
            and has no intention to falsely claim any property owned by the
            vendors.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            All property provided on the website is owned by the vendors and
            users providing information on the website in compliance with
            AddressGuru&apos;s posting rules. If you find any information is
            violating any intellectual property, you can report the infringement
            at{" "}
            <a
              href="mailto:contact@addressguru.ae"
              className="text-orange-500 hover:underline"
            >
              contact@addressguru.ae
            </a>
            .
          </p>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            How to report listing infringement
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            Your infringement email should include the following:
          </p>

          <ul className="space-y-3">
            {[
              "Identification of the infringed property.",
              "Description of the information or material that has been infringed.",
              "Your address, contact number and email.",
              "A written statement confirming that the information provided by you is correct and you hold the utmost right to the property and act as the rightful owner of the property.",
              "Brand name (in case of trademark infringement).",
              "Details of the property infringed.",
              "Documents for legal proceedings against the party infringing the property.",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm text-gray-600 leading-relaxed"
              >
                <span className="mt-[3px] min-w-[8px] h-2 w-2 rounded-full bg-orange-400 inline-block"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default InfringementPolicy;
