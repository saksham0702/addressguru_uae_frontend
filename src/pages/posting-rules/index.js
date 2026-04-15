import React from "react";

const PostingRules = () => {
  return (
    <div className="mx-auto max-w-[2000px] min-h-screen bg-white 2xl:max-w-[80%]">
      <div className="max-w-7xl px-15 py-10">
        {/* Posting Rules Section */}
        <section className="mb-10">
          <h1 className="text-2xl font-medium text-gray-900">Posting Rules</h1>
          <div className="h-[3px] w-12 bg-orange-500 rounded mt-1 mb-1"></div>
          <p className="text-sm font-medium text-orange-500 mb-5">
            What is not allowed on our platform
          </p>

          <ul className="divide-y divide-gray-100">
            {[
              "Listing items that are illegal to buy, own, import, or sell in the country of your residence.",
              "Listing your business if it is not located in UAE.",
              "Listing an ad in any language other than English.",
              "Listing an incomplete ad.",
              "Listing an ad which is discriminatory based on religion, nationality or race.",
              "Listing multiple ads using different accounts or email IDs.",
              "Listing any type of adult content or ad.",
              "Listing an ad regarding any political view that may cause offence.",
              "Listing an ad containing any kind of misleading information.",
              "Listing an ad with hateful information or remarks.",
            ].map((rule, i) => (
              <li
                key={i}
                className="flex items-center gap-3 py-3 text-gray-700 text-[15px] leading-relaxed"
              >
                <span className="text-orange-500 font-medium text-sm min-w-[24px]">
                  {i + 1}.
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        <hr className="border-t border-gray-200 my-8" />

        {/* Help & Support Section */}
        <section>
          <h2 className="text-xl font-medium text-gray-900">
            Help &amp; Support
          </h2>
          <div className="h-[3px] w-12 bg-orange-500 rounded mt-1 mb-1"></div>
          <p className="text-sm font-medium text-orange-500 mb-6">
            Frequently asked questions
          </p>

          {/* FAQ 1 */}
          <div className="mb-5 border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 text-[15px] font-medium text-gray-900">
              How do I post an ad?
            </div>
            <div className="px-4 py-4 text-sm text-gray-600 leading-relaxed">
              <p className="mb-3">Follow these steps to post your ad:</p>
              <ul className="space-y-2">
                {[
                  "Click on the Post Ad button to get started.",
                  "Select the appropriate category for your listing.",
                  "Enter the details — title, description, and all other required fields.",
                  "Enter your email address and phone number.",
                  "Click on the Post Ad option to submit.",
                  "If you'd like better ranking and visibility, explore our paid plans.",
                  "Check your email for confirmation of ad approval.",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-[7px] min-w-[8px] h-2 w-2 rounded-full bg-orange-500 inline-block"></span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ 2 */}
          <div className="mb-5 border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 text-[15px] font-medium text-gray-900">
              What are the safety rules for me?
            </div>
            <div className="px-4 py-4 text-sm text-gray-600 leading-relaxed">
              <p className="mb-3">
                Tips for staying safe when buying or selling:
              </p>
              <ol className="space-y-2">
                {[
                  "Before buying or selling, always meet the person face to face and do thorough inspection of the seller or buyer.",
                  "Never send the product before receiving payment.",
                  "Never send money online.",
                  "Address Guru Singapore does not offer any customer or seller protection.",
                  "Take full care of delicate products during handling and shipping.",
                  "Never provide personal or banking information to anyone.",
                  "Be aware of common fraud and scam activities.",
                  "Report to us if you face any kind of fraudulent activity.",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-orange-500 font-medium text-xs min-w-[20px]">
                      {i + 1}.
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostingRules;
