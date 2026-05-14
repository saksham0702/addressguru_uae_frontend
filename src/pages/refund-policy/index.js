import React from "react";

const RefundPolicy = () => {
  return (
    <div className="mx-auto max-w-[2000px] min-h-screen bg-white 2xl:max-w-[80%]">
      <div className="max-w-7xl px-4 md:px-8 lg:px-16 py-10">
        <h1 className="text-2xl font-medium text-gray-900">
          Refund & Payment Policy
        </h1>
        <div className="h-[3px] w-12 bg-orange-500 rounded mt-1 mb-1"></div>
        <p className="text-sm font-medium text-orange-500 mb-2">
          Last Updated: May 2026
        </p>
        <p className="text-sm text-gray-600 mb-8">
          Welcome to AddressGuru AE. By using our platform, website, and mobile
          applications, you agree to the following payment and refund terms.
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            1. Payments
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            AddressGuru AE may offer paid services including but not limited to:
          </p>
          <ul className="space-y-3 mb-4">
            {[
              "Featured business listings",
              "Premium advertisements",
              "Sponsored promotions",
              "Subscription plans",
              "Marketplace boosts",
              "Property listing upgrades",
              "Job posting packages",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm text-gray-600 leading-relaxed"
              >
                <span className="min-w-[8px] h-2 w-2 rounded-full bg-orange-400 inline-block"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600 leading-relaxed">
            All payments are processed securely through trusted third-party
            payment providers.
          </p>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">2. Pricing</h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <ul className="space-y-3">
            {[
              "All prices are displayed in AED (United Arab Emirates Dirham) unless otherwise stated.",
              "Prices may change without prior notice.",
              "Applicable taxes or payment gateway charges may apply.",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm text-gray-600 leading-relaxed"
              >
                <span className="min-w-[8px] h-2 w-2 rounded-full bg-orange-400 inline-block"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            3. Strict No Refund Policy
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            All payments made to AddressGuru AE are{" "}
            <strong>final and non-refundable</strong>.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Once a listing, advertisement, subscription, promotion, or digital
            service has been activated, published, processed, or delivered, no
            refund, cancellation, or exchange will be provided under any
            circumstances.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            This includes but is not limited to:
          </p>

          <ul className="space-y-3 mb-4">
            {[
              "Published advertisements",
              "Featured listings",
              "Promotional campaigns",
              "Subscription services",
              "Marketplace boosts",
              "Property or job listing upgrades",
              "Any digital or advertising services",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm text-gray-600 leading-relaxed"
              >
                <span className="min-w-[8px] h-2 w-2 rounded-full bg-orange-400 inline-block"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-sm text-gray-600 leading-relaxed">
            Users are advised to review all details carefully before making
            payment.
          </p>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            4. Exceptions
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Refund requests may only be reviewed in exceptional cases such as:
          </p>

          <ul className="space-y-3 mb-4">
            {[
              "Duplicate payment caused by a technical error",
              "Unauthorized transaction verified after investigation",
              "Payment deducted but service not delivered due to a system failure",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm text-gray-600 leading-relaxed"
              >
                <span className="min-w-[8px] h-2 w-2 rounded-full bg-orange-400 inline-block"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            AddressGuru AE reserves the sole right to approve or reject any
            refund request.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            If approved, refunds may take 7–14 business days depending on the
            payment provider or banking institution.
          </p>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            5. Subscription Cancellation
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Users may cancel future subscription renewals at any time through
            their account settings or the respective app store platform.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Cancellation only prevents future billing and does not provide
            refunds for current or previous subscription periods.
          </p>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            6. Google Play Store Purchases
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-gray-600 leading-relaxed">
              <span className="min-w-[8px] h-2 w-2 rounded-full bg-orange-400 inline-block"></span>
              <span>
                Payments are processed according to{" "}
                <a
                  href="https://support.google.com/googleplay/answer/2479637"
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-500 hover:underline"
                >
                  Google Play Payments Policy
                </a>
              </span>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600 leading-relaxed">
              <span className="min-w-[8px] h-2 w-2 rounded-full bg-orange-400 inline-block"></span>
              <span>
                Refund handling may also be subject to Google Play policies and
                procedures.
              </span>
            </li>
          </ul>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            7. Apple App Store Purchases
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-gray-600 leading-relaxed">
              <span className="min-w-[8px] h-2 w-2 rounded-full bg-orange-400 inline-block"></span>
              <span>Billing and refund handling are managed by Apple</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600 leading-relaxed">
              <span className="min-w-[8px] h-2 w-2 rounded-full bg-orange-400 inline-block"></span>
              <span>
                Users may request support through{" "}
                <a
                  href="https://reportaproblem.apple.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-500 hover:underline"
                >
                  Apple Report a Problem
                </a>
              </span>
            </li>
          </ul>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        {/* Section 8 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            8. Fraud & Abuse
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            AddressGuru AE reserves the right to suspend accounts, remove
            listings, or restrict services in cases involving:
          </p>

          <ul className="space-y-3">
            {[
              "Fraudulent transactions",
              "Payment abuse",
              "Policy violations",
              "Unauthorized activities",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm text-gray-600 leading-relaxed"
              >
                <span className="min-w-[8px] h-2 w-2 rounded-full bg-orange-400 inline-block"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <hr className="border-t border-gray-100 my-6" />

        {/* Section 9 */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            9. Contact Us
          </h2>
          <div className="h-[2px] w-8 bg-orange-400 rounded mb-4"></div>

          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-gray-600 leading-relaxed">
              <span className="min-w-[8px] h-2 w-2 rounded-full bg-orange-400 inline-block"></span>
              <span>
                Email:{" "}
                <a
                  href="mailto:support@addressguru.ae"
                  className="text-orange-500 hover:underline"
                >
                  support@addressguru.ae
                </a>
              </span>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600 leading-relaxed">
              <span className="min-w-[8px] h-2 w-2 rounded-full bg-orange-400 inline-block"></span>
              <span>
                Website:{" "}
                <a
                  href="https://www.addressguru.ae"
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-500 hover:underline"
                >
                  AddressGuru AE
                </a>
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy;
