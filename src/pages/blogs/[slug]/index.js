import React, { useState, useCallback, useMemo } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import {
  getBlogDetails,
  getCategories,
  getMostViewedBlogs,
} from "@/api/uae-blogs";
import { FaTwitter, FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";

const BlogDetail = () => {
  const getIcon = (name) => {
    switch (name.toLowerCase()) {
      case "twitter":
        return <FaTwitter />;
      case "linkedin":
        return <FaLinkedin />;
      case "github":
        return <FaGithub />;
      default:
        return <FaGlobe />;
    }
  };
  const router = useRouter();
  const { slug } = router.query;
  const [blogDetail, setBlogDetail] = useState(null);
  const [blogCategories, setBlogCategories] = useState([]);
  const [mostViewedBlogs, setMostViewedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const APP_URL = "https://addressguru.ae/api";
  // Memoized fetch functions
  const fetchBlogDetail = useCallback(async (slugParam) => {
    if (!slugParam) return;

    try {
      const response = await getBlogDetails(slugParam);
      if (response?.status == true) {
        setBlogDetail(response?.data);
        console.log("Blog Detail:", response);
      } else {
        setError("Blog not found");
      }
    } catch (error) {
      console.error("Error fetching blog detail:", error);
      setError("Failed to load blog");
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      if (response?.status == true) {
        setBlogCategories(response?.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  const fetchMostViewedBlogs = useCallback(async () => {
    try {
      const response = await getMostViewedBlogs();
      if (response?.status == true) {
        setMostViewedBlogs(response?.data?.blogs);
      }
    } catch (error) {
      console.error("Error fetching most viewed blogs:", error);
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (!slug) return;

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([
          fetchBlogDetail(slug),
          fetchCategories(),
          fetchMostViewedBlogs(),
        ]);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [
    router.isReady,
    slug,
    fetchBlogDetail,
    fetchCategories,
    fetchMostViewedBlogs,
  ]);

  // Memoized formatted date and time
  const { formattedDate, formattedTime } = useMemo(() => {
    if (!blogDetail?.created_at)
      return { formattedDate: "", formattedTime: "" };

    const date = new Date(blogDetail.created_at);
    return {
      formattedDate: date.toLocaleDateString(),
      formattedTime: date.toLocaleTimeString(),
    };
  }, [blogDetail?.created_at]);

  // Share handlers
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = useCallback(
    (platform) => {
      const title = blogDetail?.title || "";
      const url = encodeURIComponent(currentUrl);
      const text = encodeURIComponent(title);

      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      };

      if (shareUrls[platform]) {
        window.open(shareUrls[platform], "_blank", "width=600,height=400");
      }
    },
    [blogDetail?.title, currentUrl],
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6E04] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !blogDetail) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Blog Not Found
          </h2>
          <Link href="/blogs" className="text-[#FF6E04] hover:underline">
            Return to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {blogDetail?.seo?.title || blogDetail?.title || "Blog Detail"}
        </title>

        <meta
          name="description"
          content={blogDetail?.seo?.description || blogDetail?.title || ""}
        />

        <meta name="keywords" content={blogDetail?.seo?.keywords || ""} />

        {/* ✅ Robots Meta Tag */}
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content={blogDetail?.seo?.title || blogDetail?.title}
        />
        <meta
          property="og:description"
          content={blogDetail?.seo?.description || ""}
        />
        <meta
          property="og:image"
          content={`${APP_URL}/${blogDetail?.coverImage}`}
        />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="article" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={blogDetail?.meta_title || blogDetail?.title}
        />
        <meta
          name="twitter:description"
          content={blogDetail?.meta_description || ""}
        />
        <meta
          name="twitter:image"
          content={`${APP_URL}/${blogDetail?.coverImage}`}
        />

        {/* Canonical URL */}
        <link rel="canonical" href={currentUrl} />
      </Head>

      {/* Outer container */}
      <div className="min-h-screen bg-white w-full md:w-[90%] max-w-[1800px] 2xl:w-[80%] px-4 mx-auto py-8">
        {/* Main Content Section - Left: Blog Detail, Right: Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - takes remaining space after 380px sidebar */}
          <div className="lg:w-[calc(100%-396px)] min-w-0">
            {/* Breadcrumb Navigation */}
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-600 text-left">
              <Link href="/" className="hover:text-[#FF6E04] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/blogs"
                className="hover:text-[#FF6E04] transition-colors"
              >
                Blogs
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">
                {blogDetail?.category_id?.name}
              </span>
            </div>

            {/* Blog Header */}
            <div className="mb-4 text-left">
              <h1 className="2xl:text-2xl text-lg font-semibold text-gray-800 mb-2 leading-tight text-left">
                {blogDetail?.title}
              </h1>

              {/* Blog Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {/* author */}
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 text-base leading-tight">
                    {blogDetail?.author?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{blogDetail?.date}</span>
                </div>
              </div>
            </div>

            {/* Featured Image — full width of the left column, fixed 400px height, never cut */}
            <div
              className="mb-8 rounded-lg overflow-hidden shadow-lg w-full"
              style={{ height: "400px" }}
            >
              <Image
                src={`${APP_URL}/${blogDetail?.coverImage}`}
                alt={blogDetail?.title}
                className="h-full w-full object-cover"
                width={1200}
                height={400}
                quality={100}
                priority
                unoptimized
              />
            </div>

            {/* Social Share Buttons */}
            <div className="mb-8 flex items-center gap-4 pb-6 border-b text-sm border-gray-200">
              <span className="text-gray-600 font-medium">Share:</span>
              <button
                onClick={() => handleShare("facebook")}
                className="flex items-center gap-2 text-gray-600 hover:text-[#FF6E04] transition-colors"
                aria-label="Share on Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="flex items-center gap-2 text-gray-600 hover:text-[#FF6E04] transition-colors"
                aria-label="Share on X (Twitter)"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X (twitter)
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="flex items-center gap-2 text-gray-600 hover:text-[#FF6E04] transition-colors"
                aria-label="Share on LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </button>
            </div>

            {/* Blog Content */}
            <div
              className="blog-content mb-12"
              dangerouslySetInnerHTML={{ __html: blogDetail?.content }}
            />

            {/* FAQ Section */}
            {blogDetail?.faqs &&
              (() => {
                try {
                  const faqs =
                    typeof blogDetail.faqs === "string"
                      ? JSON.parse(blogDetail.faqs)
                      : blogDetail.faqs;
                  return faqs?.length > 0 ? (
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-gray-800 mb-6 text-left">
                        Frequently Asked Questions
                      </h3>
                      <div className="w-16 h-1 bg-[#FF6E04] mb-6"></div>
                      <div className="space-y-4">
                        {faqs.map((faq, index) => (
                          <details
                            key={index}
                            className="group border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-orange-50 transition-colors list-none">
                              <span className="font-semibold text-gray-800 pr-4 text-left">
                                {faq.question}
                              </span>
                              <span className="text-[#FF6E04] font-bold text-xl flex-shrink-0 group-open:rotate-45 transition-transform duration-200">
                                +
                              </span>
                            </summary>
                            <div className="p-4 text-gray-600 leading-relaxed border-t border-gray-100 bg-white text-left">
                              {faq.answer}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  ) : null;
                } catch (e) {
                  return null;
                }
              })()}

            {/* author profile */}

            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                Author Profile
              </h3>
              <div className="w-16 h-1 bg-[#FF6E04] mb-5"></div>

              {/* Avatar + Name + Job Title */}
              <div className="flex items-center gap-4 mb-4">
                <Image
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-[#FF6E04]/20"
                  src={`${APP_URL}/${blogDetail?.author?.avatar}`}
                  alt="author-profile"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-base leading-tight">
                    {blogDetail?.author?.name}
                  </p>
                  <p className="text-sm text-[#FF6E04] font-medium mt-0.5">
                    {blogDetail?.author?.JobTitle}
                  </p>
                </div>
              </div>

              {/* Bio */}
              {blogDetail?.author?.bio && (
                <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                  {blogDetail?.author?.bio}
                </p>
              )}

              {/* social links */}
              <div className="flex items-center gap-3 text-xl">
                {Object.entries(blogDetail?.author?.social || {})
                  .filter(([_, url]) => url) // remove empty links
                  .map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition flex items-center gap-1"
                    >
                      {getIcon(platform)}
                      <span className="text-sm">{platform}</span>
                    </a>
                  ))}
              </div>
            </div>

            {/* Related Blogs Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-left">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mostViewedBlogs?.slice(0, 3)?.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blogs/${blog.slug}`}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={`${APP_URL}/${blog.coverImage}`}
                        alt={blog.title}
                        width={500}
                        height={500}
                        quality={100}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#FF6E04] text-white px-3 py-1 rounded-full text-xs font-medium">
                        {blog?.category_id?.name}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-base font-bold text-gray-800 hover:text-[#FF6E04] transition-colors line-clamp-2 text-left">
                        {blog?.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Sidebar: fixed 380px width */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="lg:sticky lg:top-24 mt-32">
              {/* Categories Section */}
              <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-left">
                  Categories
                </h3>
                <div className="w-16 h-1 bg-[#FF6E04] mb-6"></div>
                <div className="space-y-1">
                  {blogCategories?.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors border-l-2 border-transparent hover:border-[#FF6E04]"
                    >
                      <span className="text-gray-700 text-sm font-medium text-left">
                        {cat.name}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        {cat.counts}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Blogs Section */}
              <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-left">
                  Popular Posts
                </h3>
                <div className="w-16 h-1 bg-[#FF6E04] mb-6"></div>
                <div className="space-y-4">
                  {mostViewedBlogs?.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blogs/${blog.slug}`}
                      className="block pb-4 border-b border-gray-100 last:border-b-0 hover:translate-x-1 transition-transform"
                    >
                      <h4 className="text-gray-800 text-sm font-semibold mb-1 hover:text-[#FF6E04] transition-colors text-left">
                        {blog.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Ad Banner Section 1 */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md border-2 border-[#FF6E04] p-8 mb-6 text-center">
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  Advertise Here
                </h4>
                <p className="text-gray-600">300 x 250</p>
              </div>

              {/* Ad Banner Section 2 */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md border border-gray-200 p-8 text-center">
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  Sponsored Content
                </h4>
                <p className="text-gray-600 mb-4">300 x 250</p>
                <Link
                  href="/contact-us"
                  className="inline-block text-[#FF6E04] border border-[#FF6E04] px-6 py-2 rounded hover:bg-[#FF6E04] hover:text-white transition-all duration-300 font-medium"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Styles for Blog Content */}
        <style jsx global>{`
          .blog-content .TyagGW_tableWrapper {
            width: 100% !important;
            max-width: 100% !important;
          }

          .blog-content .TyagGW_tableContainer {
            width: 100% !important;
          }

          /* Table full width */
          .blog-content table {
            width: 100% !important;
            min-width: 100% !important;
            table-layout: auto !important;
            border-collapse: collapse !important; /* 🔥 important */
          }

          /* 🔥 Add borders properly */
          .blog-content table,
          .blog-content th,
          .blog-content td {
            border: 1px solid #e5e7eb !important;
          }

          /* Better spacing */
          .blog-content th,
          .blog-content td {
            padding: 8px 10px !important;
            text-align: left !important;
          }

          /* Optional: header styling */
          .blog-content th {
            font-weight: 600;
            background-color: #f9fafb; /* light gray */
          }

          .blog-content * {
            font-family: inherit !important;
            font-size: inherit !important;
            line-height: inherit !important;
            text-align: left !important;
          }

          .blog-content {
            font-size: 1rem;
            line-height: 1.875;
            color: #1f2937;
            text-align: left;
          }

          .blog-content p {
            margin-bottom: 1.25rem;
            color: #1f2937;
            text-align: left !important;
          }

          .blog-content h1,
          .blog-content h2,
          .blog-content h3,
          .blog-content h4,
          .blog-content h5,
          .blog-content h6 {
            font-weight: 700 !important;
            color: #111827 !important;
            margin-top: 2rem !important;
            margin-bottom: 1rem !important;
            line-height: 1.3 !important;
            text-align: left !important;
          }

          .blog-content h2 {
            font-size: 1.5rem !important;
          }
          .blog-content h3 {
            font-size: 1.25rem !important;
          }

          .blog-content ul,
          .blog-content ol {
            margin-left: 1.5rem !important;
            margin-bottom: 1.25rem !important;
            padding-left: 1rem !important;
            text-align: left !important;
          }

          .blog-content ul {
            list-style-type: disc !important;
          }

          .blog-content ol {
            list-style-type: decimal !important;
          }

          .blog-content ul li,
          .blog-content ol li {
            display: list-item !important;
            margin-bottom: 0.5rem !important;
            color: black;
            text-align: left !important;
          }

          .blog-content span {
            font-size: inherit !important;
            line-height: inherit !important;
            font-family: inherit !important;
            text-align: left !important;
          }

          .blog-content div,
          .blog-content section,
          .blog-content article {
            text-align: left !important;
          }
        `}</style>
      </div>
    </>
  );
};

export default BlogDetail;
