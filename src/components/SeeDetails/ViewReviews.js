import React, { useState } from "react";
import { Star, X } from "lucide-react";

const ReviewsView = ({onClose}) => {
  const [filter, setFilter] = useState("newest");

  const reviews = [
    {
      id: 1,
      name: "Amit",
      rating: 5,
      time: "4 years ago",
      text: "Good hospital, every type of specialist are here",
    },
    {
      id: 2,
      name: "Suraj Singh",
      rating: 5,
      time: "4 years ago",
      text: "The hospital is very clean and services are provided also",
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      rating: 4,
      time: "3 years ago",
      text: "Epileptic, Neuromuscular and movement disorders. We...",
    },
  ];

  const ratingDistribution = [
    { stars: 5, percentage: 85 },
    { stars: 4, percentage: 10 },
    { stars: 3, percentage: 3 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 },
  ];

  const totalReviews = 2;
  const averageRating = 5.0;

  return (
    <div className=" max-h-[70vh] bg-white scale-90 ">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b flex items-center justify-between">
        <h1 className="text-lg font-medium text-gray-800">
          Max Super Speciality Hospital
        </h1>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Rating Summary */}
      <div className="bg-white flex p-6">
        {/* Rating Bars */}
        <div className="space-y-2 min-w-[55%] mb-6">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <span className="text-sm text-gray-700 w-3">{item.stars}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col min-w-[40%] items-center">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-5xl font-bold text-gray-900">
                {averageRating}
              </div>
              <div className="flex items-center mt-1 ">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              <div className="text-sm text-gray-600 mt-1 pl-1 relative bottom-[2px]">({totalReviews})</div>
              </div>
            </div>
          </div>
          <button className="bg-white border border-gray-300 text-gray-700 p-2 my-2 ml-2 text-xs rounded font-medium hover:bg-gray-50 transition-colors whitespace-nowrap">
            + Write a Review
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white px-4 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-600 mb-3 font-medium">Filter by</div>
        <div className="flex gap-2">
          {["Oldest", "Newest", "Highest", "Lowest"].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption.toLowerCase())}
              className={`px-4 py-1.5 rounded border text-sm transition-colors ${
                filter === filterOption.toLowerCase()
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white mt-2 max-h-60 overflow-y-scroll">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className={`p-4 ${
              index !== reviews.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div className="mb-2">
              <h3 className="font-medium text-gray-900">{review.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-300 text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">{review.time}</span>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsView;
