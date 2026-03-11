import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white max-w-[80%] mx-auto text-center px-4">
      {/* 404 Text */}
      <h1 className="text-8xl font-extrabold text-orange-500 tracking-wider">
        404
      </h1>

      {/* Message */}
      <p className="mt-4 text-gray-700 text-lg md:text-xl">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <p className="text-gray-500 mt-1">It might have been moved or deleted.</p>

      {/* Button */}
      <Link
        href="/"
        className="mt-8 inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-full shadow-md transition-all duration-200"
      >
        Go to Home
      </Link>

      {/* Optional Illustration */}
      <div className="mt-10 opacity-80">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="none"
          stroke="currentColor"
          className="w-48 h-48 text-orange-400"
        >
          <path
            d="M256 32C132.3 32 32 132.3 32 256s100.3 224 224 224 224-100.3 224-224S379.7 32 256 32z"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="180" cy="200" r="16" fill="currentColor" />
          <circle cx="332" cy="200" r="16" fill="currentColor" />
          <path
            d="M160 320c30 40 100 40 130 0"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
