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
    onAddReview({ rating, comment, date: new Date().toISOString() });
    setRating(0);
    setComment("");
    setError("");
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Reviews & Ratings</h3>
      {!pending && (
        <form onSubmit={handleSubmit} className="mb-4 space-y-2">
          <div>
            <label className="block mb-1">Your Rating:</label>
            <select
              className="border rounded px-2 py-1"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value={0}>Select</option>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} Star{star > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Comment:</label>
            <textarea
              className="border rounded px-2 py-1 w-full"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
            />
          </div>
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Submit Review
          </button>
        </form>
      )}
      <div>
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet.</p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((review, idx) => (
              <li key={idx} className="border-b pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">
                    {"★".repeat(review.rating)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm mt-1">{review.comment}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HotelReviews;
