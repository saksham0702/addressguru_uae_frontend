import React, { useState } from "react";
import {
  FiSearch,
  FiCode,
  FiSmartphone,
  FiArrowRight,
  FiMail,
  FiPhone,
  FiUser,
  FiMessageSquare,
  FiBriefcase,
} from "react-icons/fi";

const OurServices = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");

  const services = [
    {
      id: 1,
      title: "Digital Marketing",
      description:
        "Drive growth with data-driven strategies that convert. From SEO to social media, we help your brand reach the right audience.",
      price: "Starting at $800/month",
      icon: <FiSearch className="w-12 h-12" />,
      features: [
        "SEO & SEM",
        "Social Media Strategy",
        "Content Creation",
        "Analytics & Reporting",
      ],
    },
    {
      id: 2,
      title: "Web Development",
      description:
        "Scalable, high-performance websites tailored to your business goals. Modern tech stack with seamless user experience.",
      price: "Starting at $1,200",
      icon: <FiCode className="w-12 h-12" />,
      features: [
        "Responsive Design",
        "Custom Solutions",
        "E-commerce Systems",
        "Ongoing Support",
      ],
    },
    {
      id: 3,
      title: "App Development",
      description:
        "Native and cross-platform mobile apps that engage users. Built for performance, designed for growth.",
      price: "Starting at $2,500",
      icon: <FiSmartphone className="w-12 h-12" />,
      features: [
        "iOS & Android",
        "Custom UI/UX",
        "Cloud Integration",
        "App Store Launch",
      ],
    },
  ];

  const handleSubmit = (e, type) => {
    e.preventDefault();
    setPopupType(type);
    setShowPopup(true);
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-white max-w-[2000px] 2xl:w-[80%] mx-auto ">
      {/* Header */}
      <div className="bg-white ">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-4">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive digital solutions to help your business thrive in the
            modern marketplace
          </p>
        </div>
      </div>

      {/* Services Cards */}
      <div className="max-w-7xl mx-auto px-4 py-10 ">
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className=" shadow  rounded-lg p-8 hover:shadow-lg shadow-orange-200 transition-shadow"
            >
              <div className="text-orange-600 mb-6">{service.icon}</div>

              <h3 className="text-2xl font-bold text-gray-600 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                {service.description}
              </p>

              <div className="mb-6">
                <p className="text-2xl font-semibold text-gray-600">
                  {service.price}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, index) => (
                  <li key={index} className="text-gray-700 flex items-start">
                    <span className="text-orange-600 mr-3 mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full py-3 border-2 border-orange-600 text-orange-600 font-semibold rounded-lg hover:bg-orange-600 hover:text-white transition-colors flex items-center justify-center gap-2">
                Learn More <FiArrowRight />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Service Inquiry Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Image Placeholder */}
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="text-sm">Service Inquiry Image</p>
              </div>
            </div>

            {/* Right - Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Request a Quote
              </h2>
              <p className="text-gray-600 mb-8">
                Tell us about your project and we'll get back to you within 24
                hours
              </p>

              <form
                onSubmit={(e) => handleSubmit(e, "service")}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+65 1234 5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Interested In
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    <option>Digital Marketing</option>
                    <option>Web Development</option>
                    <option>App Development</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Details
                  </label>
                  <div className="relative">
                    <FiMessageSquare className="absolute left-3 top-3.5 text-gray-400" />
                    <textarea
                      rows="4"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Tell us about your project requirements..."
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Hiring Section */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Form */}
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Join Our Team
              </h2>
              <p className="text-gray-600 mb-8">
                We're looking for talented individuals to help us build amazing
                digital experiences
              </p>

              <form
                onSubmit={(e) => handleSubmit(e, "hiring")}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+65 1234 5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-3 top-3.5 text-gray-400" />
                    <select
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select position</option>
                      <option>Digital Marketing Specialist</option>
                      <option>Full Stack Developer</option>
                      <option>Mobile App Developer</option>
                      <option>UI/UX Designer</option>
                      <option>Project Manager</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    rows="4"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Tell us why you'd be a great fit..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Submit Application
                </button>
              </form>
            </div>

            {/* Right - Image Placeholder */}
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center order-1 md:order-2">
              <div className="text-center text-gray-400">
                <p className="text-sm">Hiring Image</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {popupType === "service"
                ? "Request Submitted!"
                : "Application Received!"}
            </h3>
            <p className="text-gray-600 mb-6">
              {popupType === "service"
                ? "We'll review your request and get back to you within 24 hours."
                : "Thank you for your interest. Our team will review your application shortly."}
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OurServices;
