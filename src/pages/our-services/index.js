import React from "react";
import Head from "next/head";
import { Code, Globe, TrendingUp, Check, ArrowRight, Star } from "lucide-react";

const ServicesPage = () => {
  const services = [
    {
      id: 1,
      icon: <Code className="w-12 h-12" />,
      title: "App Development",
      price: "1,999",
      currency: "AED",
      description:
        "Custom mobile applications tailored to your business needs with cutting-edge technology and user-friendly interfaces.",
      features: [
        "iOS & Android Development",
        "Cross-Platform Solutions",
        "UI/UX Design Included",
        "App Store Deployment",
        "Post-Launch Support",
        "Performance Optimization",
      ],
      popular: false,
    },
    {
      id: 2,
      icon: <Globe className="w-12 h-12" />,
      title: "Web Development",
      price: "499",
      currency: "AED",
      description:
        "Professional websites that drive results, combining stunning design with powerful functionality to grow your online presence.",
      features: [
        "Responsive Design",
        "SEO-Friendly Structure",
        "Fast Loading Speed",
        "Content Management System",
        "Mobile Optimization",
        "Security Features",
      ],
      popular: true,
    },
    {
      id: 3,
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Digital Marketing",
      price: "999",
      currency: "AED",
      description:
        "Comprehensive digital marketing strategies to boost your brand visibility and drive qualified leads to your business.",
      features: [
        "SEO & SEM Campaigns",
        "Social Media Marketing",
        "Content Strategy",
        "Analytics & Reporting",
        "Email Marketing",
        "Conversion Optimization",
      ],
      popular: false,
    },
  ];

  return (
    <>
      <Head>
        <title>
          Professional Digital Services in UAE | App Development, Web
          Development & Digital Marketing - AddressGuru
        </title>
        <meta
          name="description"
          content="Transform your business with AddressGuru's professional digital services in UAE. Expert app development from AED 1,999, web development from AED 499, and digital marketing from AED 999. Serving businesses across Dubai, Abu Dhabi, and all UAE."
        />
        <meta
          name="keywords"
          content="app development UAE, web development Dubai, digital marketing Abu Dhabi, mobile app development, website design UAE, SEO services Dubai, classified website UAE, AddressGuru services"
        />

        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="Professional Digital Services in UAE - AddressGuru"
        />
        <meta
          property="og:description"
          content="Expert app development, web development, and digital marketing services in UAE. Affordable pricing starting from AED 499."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://addressguru.ae/services" />
        <meta property="og:site_name" content="AddressGuru" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Professional Digital Services in UAE - AddressGuru"
        />
        <meta
          name="twitter:description"
          content="Transform your business with expert digital services. App development, web development, and digital marketing in UAE."
        />

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="AddressGuru" />
        <meta name="geo.region" content="AE" />
        <meta name="geo.placename" content="United Arab Emirates" />
        <link rel="canonical" href="https://addressguru.ae/services" />

        {/* Schema.org Markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Digital Services",
            provider: {
              "@type": "Organization",
              name: "AddressGuru",
              url: "https://addressguru.ae",
            },
            areaServed: {
              "@type": "Country",
              name: "United Arab Emirates",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Digital Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "App Development",
                    description:
                      "Custom mobile application development for iOS and Android",
                  },
                  price: "1999",
                  priceCurrency: "AED",
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Web Development",
                    description:
                      "Professional website development and design services",
                  },
                  price: "499",
                  priceCurrency: "AED",
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Digital Marketing",
                    description:
                      "Comprehensive digital marketing and SEO services",
                  },
                  price: "999",
                  priceCurrency: "AED",
                },
              ],
            },
          })}
        </script>
      </Head>

      <div className="min-h-screen bg-gradient-to-b bg-white max-w-[2000px] mx-auto 2xl:max-w-[80%]">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>Professional Digital Services in UAE</span>
            </div>

            <h1 className="text-2xl sm:text-xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Business with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 mt-2">
                Expert Digital Solutions
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              From innovative mobile apps to powerful websites and
              results-driven marketing campaigns, we deliver excellence across
              all digital channels.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group ${
                    service.popular ? "ring-2 ring-orange-500" : ""
                  }`}
                >
                  {service.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="p-8">
                    {/* Icon */}
                    <div className="mb-6 text-orange-600 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {service.title}
                    </h2>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-sm text-gray-500">
                        Starting from
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-gray-900">
                          {service.price}
                        </span>
                        <span className="text-xl font-semibold text-orange-600">
                          {service.currency}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                      <span>Get Started</span>
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose AddressGuru?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We combine expertise, innovation, and dedication to deliver
                exceptional results for businesses across the UAE.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Expert Team",
                  description:
                    "Skilled professionals with years of industry experience",
                },
                {
                  title: "Proven Results",
                  description: "Track record of successful projects across UAE",
                },
                {
                  title: "Affordable Pricing",
                  description: "Competitive rates without compromising quality",
                },
                {
                  title: "24/7 Support",
                  description: "Dedicated support team always ready to assist",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="w-6 h-6 bg-orange-600 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ready to Elevate Your Digital Presence?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Let&apos;s discuss how our services can help your business grow and
              succeed in the digital landscape.
            </p>
            <button className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl">
              Contact Us Today
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicesPage;
