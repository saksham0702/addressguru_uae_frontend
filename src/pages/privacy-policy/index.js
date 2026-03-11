import Link from "next/link";
import React from "react";

const Section = ({ title, children }) => (
  <div className="mt-6">
    <h2 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-3">
      {title}
    </h2>
    <div className="text-sm font-medium text-gray-700 leading-relaxed space-y-3">
      {children}
    </div>
  </div>
);

const PrivacyPolicy = () => {
  return (
    <div className="w-full h-full max-md:w-[94%] max-md:mx-auto max-md:mt-3 flex flex-col items-center">
      {/* Page Header */}
      <div className="flex flex-col bg-white pb-15 w-full pl-15 pr-17 2xl:pl-10 2xl:w-[80%] max-md:px-4 pt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-400 mb-6">Last reviewed — 2024</p>

        <p className="text-sm font-medium text-gray-700 leading-relaxed">
          When you visit the Site you may provide us with two types of
          information: personal information you knowingly choose to disclose
          that is collected on an individual basis, and website use information
          collected on an aggregate basis as you and others browse the Site.
        </p>

        {/* 1 */}
        <Section title="1. Personal Information You Choose to Provide">
          <p>
            You can generally visit the Site without revealing any personally
            identifiable information about yourself, and you do not need an
            account to post listings, browse listings, or respond to listings.
            If you choose to create an account and/or use our Services, we may
            collect personally identifiable information that you submit such as
            your name, contact data (address, email address, phone number) and
            other similar information.
          </p>
          <p>
            We may also collect additional personally identifiable information
            that you voluntarily include in your listings or transmit with your
            communications to us. The information that you provide when you post
            a listing is displayed in public areas and available to all
            visitors. Any information that is disclosed in these areas becomes
            public information, so please exercise caution.
          </p>
          <p>
            If you provide personal information to a buyer or seller (either
            directly or by circumventing our messaging system), we have no
            control over how that information might be used by that individual.
            We recommend using our messaging system for any communications
            between you and potential buyers and sellers.
          </p>
        </Section>

        {/* 2 */}
        <Section title="2. Website Use Information">
          <p>
            Similar to other commercial websites, the Site utilizes a standard
            technology called "cookies" and web server logs to collect
            information about how the Site is used. Information gathered through
            cookies and web server logs may include the date and time of visits,
            the pages viewed, time spent at the Site, and the websites visited
            just before and just after the Site.
          </p>
          <p>
            We, our advertisers and ad serving companies may also use small
            technology or pieces of code to determine which advertisements and
            promotions users have seen and how users responded to them.
          </p>
        </Section>

        {/* How we use */}
        <Section title="How Do We Use the Information That You Provide to Us?">
          <p>
            Broadly speaking, we use personal information for purposes of
            administering and expanding the Site and the Services. More
            specifically, we use personal information to provide the Services;
            provide customer service; troubleshoot problems; encourage safe
            buying and selling; enforce our policies; customize your experience;
            measure interest in our services; improve our services; and do other
            things for you as described when we collect the information.
          </p>
          <p>
            We do not sell or rent your personal information to third parties
            without your explicit consent. We may disclose personal information
            to respond to legal requirements, enforce our policies, respond to
            claims that a listing or other content violates the rights of
            others, or protect anyone's rights, property, or safety.
          </p>
          <p>
            We may also share personal information with service providers who
            help with our business operations, and third-party websites and
            publishers so the listings published on the Site can also be
            published on a broader array of websites.
          </p>
        </Section>

        {/* Cookies */}
        <Section title="What Are Cookies?">
          <p>
            A cookie is a very small text document, which often includes an
            anonymous unique identifier. When you visit a website, that site's
            computer asks your computer for permission to store this file in a
            part of your hard drive specifically designated for cookies. Each
            website can send its own cookie to your browser if your browser's
            preferences allow it, but your browser only permits a website to
            access the cookies it has already sent to you, not the cookies sent
            to you by other sites.
          </p>
        </Section>

        {/* How cookies used */}
        <Section title="How Do We Use Information We Collect from Cookies?">
          <p>
            As you use the Site, the website uses its cookies to differentiate
            you from other users. Cookies, in conjunction with our web server's
            log files, allow us to calculate the aggregate number of people
            visiting the Site and which parts of the Site are most popular. This
            helps us gather feedback in order to constantly improve the Site and
            better serve our customers.
          </p>
          <p>
            Cookies do not allow us to gather any personal information about you
            and we do not generally store any personal information that you
            provided to us in your cookies.
          </p>
        </Section>

        {/* Third parties */}
        <Section title="Sharing Information with Third Parties">
          <p>
            The Site contains links to other websites on the Internet. Please be
            aware that we are not responsible for the information collection and
            use and privacy practices of such other websites and third parties.
            We encourage you to read the privacy statements of each and every
            other website that may collect your personally identifiable
            information. This privacy statement applies solely to information
            collected by us from the Site.
          </p>
          <p>
            We use third party companies to serve advertisements when you visit
            the Site. These companies may use information about your visits to
            the Site in order to provide advertisements about goods and services
            that may be of interest to you. Our privacy policy does not cover
            any use of information that a third-party ad-serving company may
            collect from you.
          </p>
          <p>
            We use Google Analytics on the Site. We may also use Google AdWords
            remarketing to trigger advertisements across the Internet based on
            parts of the Site you have viewed. If you do not wish to
            participate, you can opt out by visiting{" "}
            <a
              href="https://www.google.com/settings/ads/onweb/"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Google Ads Settings
            </a>
            .
          </p>
          <p>
            In addition, we may enter into alliances, partnerships or other
            business arrangements with third parties who may be given access to
            personal information including your name, telephone number and email
            for the purpose of providing you information regarding certain
            products and services.
          </p>
          <p>
            As we develop our business, we may buy or sell assets or business
            offerings. Customer, email, and visitor information is generally one
            of the transferred business assets in these types of transactions.
          </p>
        </Section>

        {/* Protection */}
        <Section title="How Do We Protect Your Information?">
          <p>
            We may employ procedural and technological security measures that
            are reasonably designed to help protect your personally identifiable
            information from loss, unauthorized access, disclosure, alteration
            or destruction. We may use secure socket layer and other security
            measures to help prevent unauthorized access to your personally
            identifiable information.
          </p>
          <p>
            We may disclose your personal information if required to do so by
            law or subpoena or if we believe that such action is necessary to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Conform to the law or comply with legal process served on us or
              affiliated parties
            </li>
            <li>
              Protect and defend our rights and property, our site, the users of
              our site, and/or our affiliated parties
            </li>
            <li>
              Act under circumstances to protect the safety of users of our
              site, us, or third parties
            </li>
          </ul>
        </Section>

        {/* Consent */}
        <Section title="Your Consent">
          <p>
            By using the Site you consent to our collection and use of your
            personal information as described in this Privacy Policy. If we
            change our privacy policies and procedures, we will post those
            changes on the Site to keep you aware of what information we
            collect, how we use it and under what circumstances we may disclose
            it.
          </p>
          <p>
            If you have any questions, feel free to{" "}
            <Link
              href="mailto:addressgurusge@gmail.com"
              className="text-blue-600 hover:underline"
            >
              contact us
            </Link>
            .
          </p>
        </Section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
