import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import Image from "next/image";
// import {
//   getBlogs,
//   getCategories,
//   getRecentBlogs,
//   getMostViewedBlogs,
//   getBlogsByCategory,
// } from "@/api/blogs";

import Head from "next/head";
import {
  getBlogs,
  getBlogsByCategory,
  getCategories,
  getMostViewedBlogs,
  getRecentBlogs,
} from "@/api/uae-blogs";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [mostViewedBlogs, setMostViewedBlogs] = useState([]);
  const [blogsByCategory, setBlogsByCategory] = useState([]);
  const APP_URL = "https://addressguru.ae/api";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getBlogs();
        console.log("blog response:", response);

        setBlogs(response);
      } catch (error) {
        console.log("Error fetching blogs:", error);
      }
    };
    fetchBlogs();

    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        console.log(response);

        if (response?.status == true) {
          setBlogCategories(response?.data);
        }
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };
    fetchCategories();

    const fetchRecentBlogs = async () => {
      try {
        const response = await getRecentBlogs();
        console.log("recent blog response", response);

        if (response) {
          setRecentBlogs(response?.data?.blogs);
        }
      } catch (error) {
        console.log("Error fetching recent blogs:", error);
      }
    };
    fetchRecentBlogs();

    const fetchMostViewedBlogs = async () => {
      try {
        const response = await getMostViewedBlogs();
        if (response?.status == true) {
          setMostViewedBlogs(response?.data?.blogs);
        }
      } catch (error) {
        console.log("Error fetching most viewed blogs:", error);
      }
    };
    fetchMostViewedBlogs();

    const fetchBlogsByCategory = async () => {
      try {
        const response = await getBlogsByCategory();
        if (response?.success) {
          setBlogsByCategory(response?.result);
        }
      } catch (error) {
        console.log("Error fetching blogs by category:", error);
      }
    };
    fetchBlogsByCategory();
  }, []);

  // Slider settings for recent blogs
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>
          Singapore Blog - Food, Shopping, Real Estate & Lifestyle | AddressGuru
        </title>
        <meta
          name="title"
          content="Singapore Blog - Food, Shopping, Real Estate & Lifestyle | AddressGuru"
        />
        <meta
          name="description"
          content="Discover the best restaurants, shopping malls, real estate insights, health & fitness tips, and lifestyle guides in Singapore. Your go-to resource for living in Singapore."
        />
        <meta
          name="keywords"
          content="Singapore blog, Singapore restaurants, Singapore shopping, Singapore real estate, Singapore lifestyle, hawker centers Singapore, best cafes Singapore, fitness Singapore, education Singapore, entertainment Singapore"
        />
        <meta name="author" content="AddressGuru" />
        <link rel="canonical" href="https://addressguru.sg/blogs" />

        {/* Open Graph / Facebook Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://addressguru.sg/blogs" />
        <meta
          property="og:title"
          content="Singapore Blog - Food, Shopping, Real Estate & Lifestyle | AddressGuru"
        />
        <meta
          property="og:description"
          content="Discover the best restaurants, shopping malls, real estate insights, health & fitness tips, and lifestyle guides in Singapore."
        />
        <meta property="og:image" content={`${APP_URL}/og-image-blogs.jpg`} />
        <meta property="og:site_name" content="AddressGuru" />
        <meta property="og:locale" content="en_SG" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://addressguru.sg/blogs" />
        <meta
          name="twitter:title"
          content="Singapore Blog - Food, Shopping, Real Estate & Lifestyle | AddressGuru"
        />
        <meta
          name="twitter:description"
          content="Discover the best restaurants, shopping malls, real estate insights, health & fitness tips, and lifestyle guides in Singapore."
        />
        <meta name="twitter:image" content={`${APP_URL}/og-image-blogs.jpg`} />

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Geo Tags for Singapore */}
        <meta name="geo.region" content="SG" />
        <meta name="geo.placename" content="Singapore" />
        <meta name="geo.position" content="1.290270;103.851959" />
        <meta name="ICBM" content="1.290270, 103.851959" />

        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          // dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <div className="min-h-screen bg-white max-md:w-full max-w-[2000px] w-[80%] p-6 mx-auto py-8">
        {/* Recent Blogs Slider Section */}
        {/* <div className="mb-16">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Recent Blogs
          </h2>
          <div className="w-20 h-1 bg-[#FF6E04]"></div>
        </div>

        <Slider {...sliderSettings} className="recent-blogs-slider">
          {mostViewedBlogs?.map((blog) => (
            <div key={blog.id} className="px-3 ">
              <div className="bg-white h-100 rounded-lg overflow-hidden  transition-shadow duration-300 border border-gray-100">
                <div className="relative h-56  overflow-hidden">
                  <Image
                    src={`${APP_URL}/${blog.featured_image}`}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 text-xs bg-[#FF6E04] text-white px-3 py-1 rounded-full  font-medium">
                    {blog.category}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-500 text-xs mb-2">{blog.date}</p>
                  <h3 className="text-md font-semibold text-gray-800 mb-1.5 line-clamp-2 hover:text-[#FF6E04] transition-colors cursor-pointer">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-1">
                    {blog.excerpt}
                  </p>
                  <button className="text-[#FF6E04] border text-xs border-[#FF6E04] px-4 py-1 rounded hover:bg-[#FF6E04] hover:text-white transition-all duration-300 font-medium">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>  */}

        {/* Main Content Section - Left: All Blogs, Right: Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - All Blogs (65% width) */}
          <div className="lg:w-[70%]">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                All Blogs
              </h2>
              <div className="w-20 h-1 bg-[#FF6E04]"></div>
            </div>

            <div className="space-y-6">
              {blogs?.map((blog) => (
                <div
                  key={blog?._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col sm:flex-row"
                >
                  <Link
                    href={`/blogs/${blog?.slug}`}
                    className="sm:w-1/3 w-full aspect-[2/1] relative overflow-hidden bg-gray-100"
                  >
                    <img
                      src={`${APP_URL}/${blog?.coverImage}`}
                      alt={blog?.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </Link>
                  <div className="sm:w-2/3 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[#FF6E04] text-xs font-medium border border-[#FF6E04] px-3 py-1 rounded-full">
                        {blog?.category_id?.name}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {blog?.date}
                      </span>
                    </div>
                    <Link
                      href={`/blogs/${blog?.slug}`}
                      className="text-lg font-semibold text-gray-800 mb-3 hover:text-[#FF6E04] transition-colors cursor-pointer"
                    >
                      {blog?.title}
                    </Link>
                    <p
                      dangerouslySetInnerHTML={{ __html: blog?.content }}
                      className="text-gray-600 text-xs mb-4 line-clamp-2"
                    />
                    <Link
                      href={`/blogs/${blog?.slug}`}
                      className="text-[#FF6E04] border border-[#FF6E04] px-4 py-2 text-xs rounded hover:bg-[#FF6E04] hover:text-white transition-all duration-300 font-medium"
                    >
                      Continue Reading
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {/* <div className="flex justify-center items-center gap-2 mt-10">
            <button className="px-4 py-2 border border-gray-300 rounded hover:border-[#FF6E04] hover:text-[#FF6E04] transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-[#FF6E04] text-white rounded">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:border-[#FF6E04] hover:text-[#FF6E04] transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:border-[#FF6E04] hover:text-[#FF6E04] transition-colors">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:border-[#FF6E04] hover:text-[#FF6E04] transition-colors">
              Next
            </button>
          </div> */}
          </div>

          {/* Right Section - Sidebar (35% width) - Sticky */}
          <div className="lg:w-[30%]">
            <div className="lg:sticky lg:top-24">
              {/* Categories Section */}
              <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Categories
                </h3>
                <div className="w-16 h-1 bg-[#FF6E04] mb-6"></div>
                <div className="space-y-3">
                  {blogCategories.map((cat, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-1 hover:bg-gray-50 rounded cursor-pointer transition-colors border-l-2 border-transparent hover:border-[#FF6E04]"
                    >
                      <span className="text-gray-700 text-sm font-medium">
                        {cat?.name}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        {cat?.counts}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Blogs Section */}
              <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Popular Posts
                </h3>
                <div className="w-16 h-1 bg-[#FF6E04] mb-6"></div>
                <div className="space-y-4">
                  {mostViewedBlogs?.slice(0, 5)?.map((blog) => (
                    <div
                      key={blog?.id}
                      className="pb-4 border-b border-gray-100 last:border-b-0 hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      <h4 className="text-gray-800 font-semibold text-sm mb-2 hover:text-[#FF6E04] transition-colors">
                        {blog?.title}
                      </h4>
                      {/* <div className="flex items-center text-xs text-gray-500">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {blog.views} views
                    </div> */}
                    </div>
                  ))}
                </div>
              </div>

              {/* Ad Banner Section 1 */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md border-2 border-[#FF6E04] p-8 mb-6 text-center">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Advertise Here
                </h4>
                <p className="text-gray-600 mb-4">300 x 250</p>
                <button className="text-[#FF6E04] border border-[#FF6E04] px-6 py-2 rounded hover:bg-[#FF6E04] hover:text-white transition-all duration-300 font-medium">
                  Learn More
                </button>
              </div>

              {/* Ad Banner Section 2 */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md border border-gray-200 p-8 text-center">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Sponsored Content
                </h4>
                <p className="text-gray-600 mb-4">300 x 250</p>
                <button className="text-[#FF6E04] border border-[#FF6E04] px-6 py-2 rounded hover:bg-[#FF6E04] hover:text-white transition-all duration-300 font-medium">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Slider Styles */}
        <style jsx>{`
          .recent-blogs-slider .slick-dots {
            bottom: -40px;
          }
          .recent-blogs-slider .slick-dots li button:before {
            font-size: 10px;
            color: #ff6e04;
          }
          .recent-blogs-slider .slick-dots li.slick-active button:before {
            color: #ff6e04;
          }
          .recent-blogs-slider .slick-prev:before,
          .recent-blogs-slider .slick-next:before {
            color: #ff6e04;
          }
        `}</style>
      </div>
    </>
  );
};

export default Blogs;
