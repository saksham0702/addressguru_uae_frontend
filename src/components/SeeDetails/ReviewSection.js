import React, { useState, useEffect, useCallback } from "react";
import { Star, User, Calendar } from "lucide-react";
import { getReviews } from "@/api/Reviews";
import RecentCustomerReviewCard from "../BusinessListingComponents/RecentCustomerReviewCard";

const ReviewSection = ({ slug, handlePop }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  const fetchReviews = useCallback(async () => {
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
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchReviews();
    }
  }, [slug, fetchReviews]);

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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Customer Reviews
          </h2>
          <button
            onClick={() => handlePop("rateus")}
            className="px-5 py-2.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Write a Review
          </button>
        </div>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">No reviews yet</p>
          <p className="text-gray-400 text-sm mt-2 mb-6">
            Be the first to review this listing
          </p>
          <button
            onClick={() => handlePop("rateus")}
            className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
          >
            <Star size={20} />
            Share your experience
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 leading-none">
          Customer Reviews
        </h2>
        <button
          onClick={() => handlePop("rateus")}
          className="px-5 py-2.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          Write a Review
        </button>
      </div>

      {/* Rating Stats Summary */}
      <div className="px-6 py-6 border-b border-gray-100 flex flex-wrap items-center gap-8 bg-gray-50/30">
        <div className="flex flex-col items-center">
          <div className="text-4xl font-black text-gray-900 leading-none">
            {stats.averageRating}
          </div>
          <StarRating rating={parseFloat(stats.averageRating)} size={16} />
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mt-1">
            {stats.totalReviews} REVIEWS
          </p>
        </div>

        <div className="flex-1 max-w-xs space-y-1">
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

      {/* Reviews Horizontal Scroll */}
      <div className="py-6 overflow-x-auto hide-scroll px-2">
        <div className="flex gap-4 min-w-full">
          {reviews.map((review) => (
            <RecentCustomerReviewCard
              key={review._id}
              data={{
                name: review.fullName,
                rating: review.rating,
                message: review.reviewText,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
