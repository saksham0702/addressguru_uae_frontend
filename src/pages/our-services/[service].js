import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const ServiceDetailsPage = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const service = router?.query.service;

  // Service-specific data structure - UPDATED TO GRAY THEME
  const serviceData = {
    "web-development": {
      title: "Web Development",
      gradient: "from-orange-200 to-orange-400",
      accentColor: "orange",
    },
    "app-development": {
      title: "App Development",
      gradient: "from-orange-200 to-orange-400",
      accentColor: "orange",
    },
    "digital-marketing": {
      title: "Digital Marketing",
      gradient: "from-orange-100 to-orange-200",
      accentColor: "orange",
    },
  };

  const currentService = serviceData[service] || serviceData["web-development"];

  const pricingPlans = [
    {
      name: "BASIC PLAN",
      price: "AED 1,999",
      period: "/-",
      features: [
        "Delivery within 1-2 Days",
        "Hosting",
        "100% Responsive Website",
        "AED 600/- per Additional page",
        "Virus Protection",
        "Domain",
        "2-4 Pages",
        "100% Advance Payment",
        "Search Engine Optimized",
      ],
      highlighted: false,
    },
    {
      name: "ADVANCED PLAN",
      price: "AED 2,999",
      period: "/-",
      features: [
        "Project Delivery within (Min 10 Days)",
        "Hosting",
        "100% Responsive Website",
        "AED 600/- per Additional page",
        "Virus Protection",
        "Google Analytics App Setup",
        "Youtube channel Setup",
        "Domain",
        "5-8 Pages",
        "50% Advance Payment",
        "Search Engine Optimized",
        "Google analytics Setup",
        "Social Media Account Setup",
      ],
      highlighted: true,
    },
    {
      name: "PREMIUM PLAN",
      price: "AED 4,999",
      period: "/-",
      features: [
        "Project Delivery within 15-20 Days",
        "Hosting",
        "100% Responsive Website",
        "AED 600/- per Additional page",
        "Virus Protection",
        "Google Analytics App Setup",
        "Youtube channel Setup",
        "Domain",
        "10-15 Pages",
        "40% Advance Payment",
        "Search Engine Optimized",
        "Google analytics Setup",
        "Social Media Account Setup",
        "Premium Support 24/7",
      ],
      highlighted: false,
    },
  ];

  const techStacks = {
    "web-development": [
      {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "Next.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
      },
      {
        name: "Node.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      },
      {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      },
      {
        name: "MongoDB",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
      },
      {
        name: "Express",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
      },
      {
        name: "Angular",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
      },
    ],

    "app-development": [
      {
        name: "Flutter",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
      },
      {
        name: "React Native",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "Kotlin",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
      },
      {
        name: "Swift",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
      },
      {
        name: "Firebase",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
      },
      {
        name: "Java",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      },
    ],

    "digital-marketing": [
      {
        name: "Google Ads",
        icon: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
      },
      {
        name: "Meta Ads",
        icon: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
      },
      {
        name: "SEO",
        icon: "https://cdn-icons-png.flaticon.com/512/2881/2881142.png",
      },
      {
        name: "Analytics",
        icon: "https://cdn-icons-png.flaticon.com/512/5968/5968350.png",
      },
      {
        name: "Content",
        icon: "https://cdn-icons-png.flaticon.com/512/906/906334.png",
      },
    ],
  };

  const currentStack = techStacks[service] || techStacks["web-development"];

  const { city } = useAuth();

  return (
    <div className="min-h-screen bg-white max-w-[2000px] mx-auto 2xl:max-w-[80%]">
      {/* Hero Section with Form - UPDATED DESIGN */}
      <section
        className={`relative min-h-[600px] bg-gradient-to-br white 2xl:px-10 overflow-hidden`}
      >
        {/* Simplified Background - No colorful blobs */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-400 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div
              className={`text-white transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <h1 className="text-5xl md:text-6xl font-normal text-black mb-6 leading-tight">
                Professional {currentService.title}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                  Services in {city}
                </span>
              </h1>
              <p className="text-lg text-gray-800 mb-8 leading-relaxed">
                Empowering businesses across {city} and UAE with cutting-edge
                digital solutions. 16+ years of excellence in delivering
                world-class {currentService.title.toLowerCase()} services.
              </p>

              {/* Stats or Key Points */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center p-4  backdrop-blur-sm rounded-lg border border-orange-500 bg-orange-50">
                  <div className="text-3xl font-bold text-orange-400">16+</div>
                  <div className="text-sm text-gray-800 mt-1">Years</div>
                </div>
                <div className="text-center p-4  backdrop-blur-sm rounded-lg border border-orange-500 bg-orange-50">
                  <div className="text-3xl font-bold text-orange-400">500+</div>
                  <div className="text-sm text-gray-800 mt-1">Projects</div>
                </div>
                <div className="text-center p-4  backdrop-blur-sm rounded-lg border border-orange-500 bg-orange-50">
                  <div className="text-3xl font-bold text-orange-400">24/7</div>
                  <div className="text-sm text-gray-800 mt-1">Support</div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div
              className={`transition-all duration-1000 max-w-lg delay-300 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h2 className="text-3xl font-medium text-gray-800 mb-2">
                  Get a Free Quote
                </h2>
                <p className="text-gray-600 mb-6 text-sm">
                  Fill out the form and we&apos;ll get back to you within 24
                  hours
                </p>
                <form className="space-y-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-orange-500 outline-none transition-colors bg-gray-50 rounded-t"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone No. <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Your Number"
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-orange-500 outline-none transition-colors bg-gray-50 rounded-t"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-orange-500 outline-none transition-colors bg-gray-50 rounded-t"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      placeholder="Type here..."
                      rows="4"
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-orange-500 outline-none transition-colors resize-none bg-gray-50 rounded-t"
                    ></textarea>
                  </div>
                  <div className="py-4">
                    <div className="bg-gray-100 p-4 rounded text-center text-sm text-gray-600 border border-gray-300">
                      [reCAPTCHA placeholder]
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Service Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div
            className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Left - Content */}
            <div className="order-2 lg:order-1">
              <div className="mb-4">
                <span className="text-orange-600 font-bold text-sm tracking-wider">
                  ABOUT OUR SERVICES
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Leading {currentService.title} Company in {city} & UAE
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  [Content Block 1 - Introduction paragraph about the service]
                </p>
                <p>
                  AdxVenture is a premier {currentService.title} company in
                  {city} and across the UAE, with over 16 years of expertise in
                  designing and development. We deliver world-class digital
                  solutions tailored to the Middle Eastern market.
                </p>
                <p>
                  [Content Block 2 - More details about expertise and approach]
                </p>
                <p>
                  Our qualified team at AdxVenture brings creativity,
                  innovation, and technical excellence to every project,
                  ensuring your business stands out in {city}&apos;s competitive
                  digital landscape.
                </p>
              </div>
            </div>

            {/* Right - Image Placeholder */}
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-gray-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-white p-8 rounded-lg shadow-xl">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-400 mb-2">
                        [Service Image]
                      </p>
                      <p className="text-gray-500">
                        Add relevant image for {currentService.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section - UPDATED COLORS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-bold text-sm tracking-wider">
              PRICING
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4 mt-2">
              Transparent Pricing Plans
            </h2>
            <p className="text-gray-600 text-lg">
              Choose the perfect package for your business in {city}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl transition-all duration-300 hover:scale-105 ${
                  plan.highlighted
                    ? "bg-gradient-to-br bg-white text-gray-800 transform md:-translate-y-4 border-2 border-orange-500"
                    : "bg-white text-gray-800 border-2 border-gray-200"
                } ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <h3
                    className={`text-xl font-bold mb-4 ${
                      plan.highlighted ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {plan.name}
                  </h3>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span
                        className={`text-5xl font-semibold ${plan.highlighted ? "text-orange-400" : "text-gray-00"}`}
                      >
                        {plan.price}
                      </span>
                      <span className="text-2xl ml-1">{plan.period}</span>
                    </div>
                    <p
                      className={`text-sm mt-2 ${
                        plan.highlighted ? "text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {currentService.title} Package
                    </p>
                  </div>

                  <ul className="space-y-2 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg
                          className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                            plan.highlighted
                              ? "text-orange-400"
                              : "text-orange-500"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-4 rounded-lg font-bold transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "bg-gray-800 text-white hover:bg-gray-900"
                    }`}
                  >
                    <span className="mr-2"></span> Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* tech stack stuff */}
      <section className="py-10 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Our {currentService.title} Tech Stack
          </h2>
          <p className="text-gray-600 mt-2">
            Technologies we use to build powerful solutions
          </p>
        </div>
        <div className="overflow-hidden w-full">
          <div className="flex w-max animate-marquee">
            {[
              ...currentStack,
              ...currentStack,
              ...currentStack,
              ...currentStack,
            ].map((tech, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center mx-8 min-w-[100px] flex-shrink-0"
              >
                <Image
                  src={tech.icon}
                  alt={tech.name}
                  width={500}
                  height={500}
                  className="w-12 h-12 object-contain mb-2"
                />
                <span className="text-sm text-gray-700">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Need This Service Section - UPDATED */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image Placeholder */}
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 -translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-gray-400 rounded-2xl blur-2xl opacity-10"></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-orange-50 rounded-xl flex items-center justify-center border-2 border-gray-200">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-400 mb-2">
                        [Why Need Image]
                      </p>
                      <p className="text-gray-500">Benefits illustration</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div
              className={`transition-all duration-1000 delay-200 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div className="mb-4">
                <span className="text-orange-600 font-bold text-sm tracking-wider">
                  WHY CHOOSE US
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Why Your {city} Business Needs {currentService.title}
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                [Introduction paragraph explaining the importance of this
                service in {city}&apos;s competitive digital landscape and
                growing UAE market]
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: "Online Presence", icon: "🌐" },
                  { title: "Credibility & Trust", icon: "✓" },
                  { title: "Global Reach", icon: "🌍" },
                  { title: "24/7 Accessibility", icon: "⏰" },
                  { title: "Marketing Platform", icon: "📊" },
                  { title: "Customer Engagement", icon: "💬" },
                  { title: "Data Insights", icon: "📈" },
                  { title: "Competitive Edge", icon: "⚡" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 group border border-gray-100"
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </span>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        [Brief description]
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services/Features Grid Section - UPDATED */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <span className="text-orange-600 font-bold text-sm tracking-wider">
              OUR SERVICES
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4 mt-2">
              Comprehensive {currentService.title} Solutions
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              [Description about the specific services offered under this
              category, tailored for businesses in {city} and across the UAE]
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Custom Development",
                icon: "📂",
                description:
                  "Unique solutions tailored to your business needs...",
              },
              {
                title: "Responsive Design",
                icon: "📱",
                description:
                  "Perfect experience across all devices and screens...",
              },
              {
                title: "SEO Optimization",
                icon: "📊",
                description:
                  "Enhanced visibility and search engine rankings...",
              },
              {
                title: "E-Commerce Solutions",
                icon: "🚩",
                description:
                  "Professional platforms for online business growth...",
              },
              {
                title: "Performance Enhancement",
                icon: "🖼️",
                description: "Fast loading and optimized user experience...",
              },
              {
                title: "24/7 Support",
                icon: "🎯",
                description: "Round-the-clock assistance for your business...",
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100 hover:border-orange-500 group ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
  
};

export default ServiceDetailsPage;
