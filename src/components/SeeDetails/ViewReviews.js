import React, { useState } from "react";
import { Star, X } from "lucide-react";

const ReviewsView = ({ onClose, data }) => {
  const [filter, setFilter] = useState("newest");

  const ratings = data?.ratings || [];
  const averageRating = data?.statistics?.averageRating || 0;
  const totalReviews = data?.statistics?.totalReviews || 0;

  // Compute distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = ratings.filter((r) => Math.round(r.rating) === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, percentage };
  });

  const sortedReviews = [...ratings].sort((a, b) => {
    if (filter === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (filter === "oldest")
      return new Date(a.createdAt) - new Date(b.createdAt);
    if (filter === "highest") return b.rating - a.rating;
    if (filter === "lowest") return a.rating - b.rating;
    return 0;
  });

  function formatTime(dateString) {
    if (!dateString) return "some time ago";
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  }

  return (
    <div className=" max-h-[85vh] w-full max-w-md bg-white rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl ">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800 truncate mr-4">
          {data?.businessName}
        </h1>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="overflow-y-auto max-h-[calc(85vh-60px)]">
        {/* Rating Summary */}
        <div className="bg-white flex p-6 gap-4">
          {/* Rating Bars */}
          <div className="space-y-2 flex-grow mb-6">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-3">
                  {item.stars}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center min-w-[100px]">
            <div className="text-4xl font-black text-gray-900 leading-none">
              {averageRating}
            </div>
            <div className="flex items-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${star <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                />
              ))}
            </div>
            <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-tight">
              {totalReviews} Reviews
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-gray-50 px-4 py-3 border-y border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {["Newest", "Oldest", "Highest", "Lowest"].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option.toLowerCase())}
                className={`px-4 py-1.5 rounded-full border text-xs font-bold transition-all whitespace-nowrap ${
                  filter === option.toLowerCase()
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white p-2">
          {sortedReviews.length > 0 ? (
            sortedReviews.map((review, index) => (
              <div
                key={review._id || index}
                className={`p-4 ${
                  index !== sortedReviews.length - 1
                    ? "border-b border-gray-50"
                    : ""
                }`}
              >
                <div className="mb-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900">
                      {review.name || "Anonymous User"}
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {formatTime(review.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-gray-100 text-gray-100"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {review.comment ||
                    "This user left a " +
                      review.rating +
                      " star rating without a comment."}
                </p>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-400 font-medium">
              No reviews yet for this business.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsView;
