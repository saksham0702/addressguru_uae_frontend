import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="mx-auto max-w-[2000px] min-h-screen bg-white 2xl:max-w-[80%]">
      <div className="max-w-7xl px-15 py-10">
        <h1 className="text-2xl font-medium text-gray-900">Privacy Policy</h1>
        <div className="h-[3px] w-12 bg-orange-500 rounded mt-1 mb-1"></div>
        <p className="text-sm font-medium text-orange-500 mb-8">
          How AddressGuru UAE collects, uses, and protects your information
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            What information do we collect?
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            When you visit the site you may provide us with two types of
            information: personal information you knowingly choose to disclose,
            and website use information collected on an aggregate basis as you
            and others browse the site.
          </p>

          <h3 className="text-[15px] font-medium text-gray-800 mb-2">
            1. Personal information you choose to provide
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            You can generally visit the site without revealing any personally
            identifiable information, and you do not need an account to post,
            browse, or respond to listings. If you choose to create an account
            and/or use our services, we may collect personally identifiable
            information such as your name, contact details (address, email
            address, phone number), and other similar information.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Information you provide when posting a listing is displayed publicly
            and available to all visitors. Please exercise caution about what
            you share. If you provide personal information directly to a buyer
            or seller (or by circumventing our messaging system), we have no
            control over how that information may be used. We recommend using
            our messaging system for all communications.
          </p>

          <h3 className="text-[15px] font-medium text-gray-800 mb-2">
            2. Website use information
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Similar to other commercial websites, the site uses standard
            technology called &quot;cookies&quot; and web server logs to collect
            information about how the site is used. Information gathered may
            include the date and time of visits, pages viewed, time spent on the
            site, and websites visited just before and after. We, our
            advertisers, and ad-serving companies may also use small pieces of
            code to determine which advertisements users have seen and how they
            responded.
          </p>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            How do we use the information you provide?
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            We use personal information to administer and expand the site and
            our services — including providing customer service, troubleshooting
            problems, encouraging safe buying and selling, enforcing our
            policies, customising your experience, measuring interest in our
            services, and improving our services. Occasionally, we may use the
            information we collect to notify you about important changes to the
            site and/or our services.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            We do not sell or rent your personal information to third parties
            without your explicit consent. We may disclose personal information
            to respond to legal requirements, enforce our policies, respond to
            claims that a listing violates the rights of others, or protect
            anyone&apos;s rights, property, or safety. We may also share personal
            information with service providers who help with our business
            operations, and third-party websites so listings published on the
            site can also be published on a broader array of platforms.
          </p>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            What are cookies?
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            A cookie is a very small text document, which often includes an
            anonymous unique identifier. When you visit a website, that site&apos;s
            computer asks your computer for permission to store this file in a
            part of your hard drive specifically designated for cookies. Each
            website can send its own cookie to your browser if your browser&apos;s
            preferences allow it, but your browser only permits a website to
            access the cookies it has already sent to you &mdash; not cookies sent to
            you by other sites.
          </p>
          <h3 className="text-[15px] font-medium text-gray-800 mb-2">
            How do we use information collected from cookies?
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            The site uses cookies to differentiate you from other users.
            Cookies, in conjunction with our web server logs, allow us to
            calculate the aggregate number of people visiting the site and
            identify which parts are most popular. This helps us constantly
            improve the site and better serve our users. Cookies do not allow us
            to gather any personal information about you and we do not generally
            store personal information in cookies.
          </p>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            Sharing information with third parties
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            The site contains links to other websites on the Internet. We are
            not responsible for the privacy practices of such other websites. We
            encourage you to read the privacy statements of every website that
            may collect your personally identifiable information. This privacy
            statement applies solely to information collected by us from the
            site.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            We use third-party companies to serve advertisements when you visit
            the site. These companies may use information about your visits to
            provide advertisements about goods and services that may be of
            interest to you. We use Google Analytics on the site; information on
            how this collects and processes data can be found at{" "}
            <a
              href="https://www.google.com/policies/privacy/partners/"
              className="text-orange-500 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              google.com/policies/privacy/partners
            </a>
            . You can opt out of Google advertising features at{" "}
            <a
              href="https://www.google.com/settings/u/0/ads"
              className="text-orange-500 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              google.com/settings/ads
            </a>
            .
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            We may use Google AdWords remarketing to display relevant ads across
            the Internet based on parts of the site you have viewed. This cookie
            does not identify you or give access to your computer. If you do not
            wish to participate, you can opt out at{" "}
            <a
              href="https://www.google.com/settings/ads/onweb/"
              className="text-orange-500 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              google.com/settings/ads/onweb
            </a>
            .
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            We may also enter into alliances or partnerships with third parties
            who may be given access to personal information including your name,
            phone number, and email for the purpose of providing information
            regarding products and services relevant to your inquiry. When you
            make an inquiry about certain listings (e.g., used car listings from
            dealers in the UAE), you are opting in to have us transfer your
            personally identifiable information to our third-party service
            partners. As we develop our business, customer, email, and visitor
            information may be transferred as part of business asset
            transactions, mergers, or corporate divestitures.
          </p>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            How do we protect your information?
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            We employ procedural and technological security measures that are
            reasonably designed to help protect your personally identifiable
            information from loss, unauthorised access, disclosure, alteration,
            or destruction. We may use secure socket layer (SSL) and other
            security measures to help prevent unauthorised access to your
            personally identifiable information.
          </p>
          <h3 className="text-[15px] font-medium text-gray-800 mb-2">
            Certain disclosures
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            We may disclose your personal information if required to do so by
            law or subpoena, or if we believe such action is necessary to
            conform to the law or legal process, protect and defend our rights
            and property or those of our users, or act to protect the safety of
            users, us, or third parties.
          </p>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            Your consent
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <p className="text-sm text-gray-600 leading-relaxed">
            By using the site you consent to our collection and use of your
            personal information as described in this Privacy Policy. If we
            change our privacy policies and procedures, we will post those
            changes on the site to keep you informed. If you have any questions,
            feel free to contact us.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
