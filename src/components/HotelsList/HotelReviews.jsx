import React, { useState } from "react";

const HotelReviews = ({ reviews = [], onAddReview, pending = false }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      setError("Please provide a rating and comment.");
      return;
    }

    onAddReview({
      rating,
      comment,
      date: new Date().toISOString(),
    });

    setRating(0);
    setComment("");
    setError("");
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4 dark:text-white">
        Reviews & Ratings
      </h3>

      {/* Review Form */}
      {!pending && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-gray-100 dark:bg-gray-800 p-5 rounded-2xl shadow-sm space-y-4"
        >
          {/* Rating */}
          <div>
            <label className="block mb-2 text-sm font-medium dark:text-gray-200">
              Your Rating
            </label>

            <select
              className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value={0}>Select Rating</option>
              {[5, 4, 3, 2, 1].map((star) => (
                <option key={star} value={star}>
                  {star} ⭐
                </option>
              ))}
            </select>
          </div>

          {/* Comment */}
          <div>
            <label className="block mb-2 text-sm font-medium dark:text-gray-200">
              Comment
            </label>

            <textarea
              className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share your experience..."
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition font-medium"
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No reviews yet.
          </p>
        ) : (
          reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-yellow-500 text-sm font-semibold">
                  {"★".repeat(review.rating)}
                </span>

                <span className="text-xs text-gray-400">
                  {review.date
                    ? new Date(review.date).toLocaleDateString()
                    : ""}
                </span>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HotelReviews;
