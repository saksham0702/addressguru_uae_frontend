import React, { useState, useEffect } from "react";
import { Star, User, Calendar } from "lucide-react";
import { getReviews } from "@/api/Reviews";

const ReviewSection = ({ slug }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  useEffect(() => {
    if (slug) {
      fetchReviews();
    }
  }, [slug]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getReviews(slug);
      console.log(response, "response");
      if (response?.success) {
        setReviews(response?.data || []);
        calculateStats(response?.data || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reviewsData) => {
    if (!reviewsData.length) {
      setStats({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });
      return;
    }

    const total = reviewsData.length;
    const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
    const average = (sum / total).toFixed(1);

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach((review) => {
      distribution[review.rating]++;
    });

    setStats({
      averageRating: average,
      totalReviews: total,
      ratingDistribution: distribution,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const StarRating = ({ rating, size = 16, showNumber = false }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
        {showNumber && (
          <span className="ml-1 text-sm font-medium text-gray-700">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    );
  };

  const RatingBar = ({ rating, count, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600 w-3">{rating}</span>
        <Star size={14} className="fill-yellow-400 text-yellow-400" />
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Customer Reviews
        </h2>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">No reviews yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Be the first to review this listing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900">
          Customer Reviews
        </h2>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center md:border-r border-gray-200">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {stats.averageRating}
            </div>
            <StarRating rating={parseFloat(stats.averageRating)} size={20} />
            <p className="text-sm text-gray-600 mt-2">
              Based on {stats.totalReviews}{" "}
              {stats.totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <RatingBar
                key={rating}
                rating={rating}
                count={stats.ratingDistribution[rating]}
                total={stats.totalReviews}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-200">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="px-6 py-6 hover:bg-gray-50 transition-colors"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {review.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Name and Date */}
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {review.fullName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <Calendar size={12} />
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <StarRating rating={review.rating} size={16} />
            </div>

            {/* Review Text */}
            <p className="text-gray-700 leading-relaxed pl-13">
              {review.reviewText}
            </p>
          </div>
        ))}
      </div>

      {/* View All Button (if you want to add pagination later) */}
      {reviews.length >= 5 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button className="w-full py-2.5 text-blue-600 font-medium hover:text-blue-700 transition-colors">
            View All Reviews ({stats.totalReviews})
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;



// import React, { useState, useEffect } from "react";
// import { Star, Calendar } from "lucide-react";

// const CompactReviewSection = ({ slug }) => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (slug) {
//       fetchReviews();
//     }
//   }, [slug]);

//   const fetchReviews = async () => {
//     try {
//       setLoading(true);
//       // Replace with your actual API endpoint
//       const response = await fetch(`/api/reviews/${slug}`);
//       const data = await response.json();

//       if (data.success) {
//         setReviews(data.reviews || []);
//       }
//     } catch (error) {
//       console.error("Error fetching reviews:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 0) return "Today";
//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7) return `${diffDays} days ago`;
//     if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const StarRating = ({ rating }) => {
//     return (
//       <div className="flex items-center gap-0.5">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Star
//             key={star}
//             size={14}
//             className={`${
//               star <= rating
//                 ? "fill-yellow-400 text-yellow-400"
//                 : "fill-gray-200 text-gray-200"
//             }`}
//           />
//         ))}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
//         <div className="animate-pulse space-y-4">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="space-y-2">
//               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (!reviews.length) {
//     return (
//       <div className="w-full bg-white rounded-lg border border-gray-200 p-8 text-center">
//         <Star size={32} className="text-gray-300 mx-auto mb-2" />
//         <p className="text-gray-500">No reviews yet</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-gray-200">
//         <h3 className="text-lg font-semibold text-gray-900">
//           Reviews ({reviews.length})
//         </h3>
//       </div>

//       {/* Reviews List */}
//       <div className="divide-y divide-gray-200">
//         {reviews.map((review) => (
//           <div key={review._id} className="px-6 py-4">
//             <div className="flex items-start gap-3">
//               {/* Avatar */}
//               <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
//                 <span className="text-white font-semibold text-sm">
//                   {review.fullName.charAt(0).toUpperCase()}
//                 </span>
//               </div>

//               {/* Content */}
//               <div className="flex-1 min-w-0">
//                 {/* Name and Rating */}
//                 <div className="flex items-center justify-between mb-1">
//                   <h4 className="font-medium text-gray-900 text-sm">
//                     {review.fullName}
//                   </h4>
//                   <StarRating rating={review.rating} />
//                 </div>

//                 {/* Review Text */}
//                 <p className="text-gray-700 text-sm leading-relaxed mb-2">
//                   {review.reviewText}
//                 </p>

//                 {/* Date */}
//                 <div className="flex items-center gap-1 text-xs text-gray-500">
//                   <Calendar size={12} />
//                   <span>{formatDate(review.createdAt)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CompactReviewSection;