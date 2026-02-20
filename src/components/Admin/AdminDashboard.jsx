import React, { useState } from "react";

const TABS = ["Hotels", "Bookings", "Users", "Reviews"];

const AdminDashboard = () => {
  const [tab, setTab] = useState(TABS[0]);

  // Demo: Fetch from localStorage (replace with backend integration as needed)
  const hotels = JSON.parse(localStorage.getItem("hotels") || "[]");
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const [reviews, setReviews] = useState(
    JSON.parse(localStorage.getItem("reviews") || "[]"),
  );

  // Approve review
  const approveReview = (idx) => {
    const updated = [...reviews];
    updated[idx].status = "approved";
    setReviews(updated);
    localStorage.setItem("reviews", JSON.stringify(updated));
  };
  // Reject review
  const rejectReview = (idx) => {
    const updated = [...reviews];
    updated.splice(idx, 1);
    setReviews(updated);
    localStorage.setItem("reviews", JSON.stringify(updated));
  };

  // Analytics summary
  const totalBookings = bookings.length;
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const totalUsers = users.length;
  const totalHotels = hotels.length;
  const totalCancellations = bookings.filter(
    (b) => b.status === "cancelled",
  ).length;
  const totalReviews = reviews.length;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-blue-700">
            {totalBookings}
          </div>
          <div className="text-xs text-gray-600">Total Bookings</div>
        </div>
        <div className="bg-green-50 p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-green-700">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-gray-600">Total Revenue</div>
        </div>
        <div className="bg-purple-50 p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-purple-700">{totalUsers}</div>
          <div className="text-xs text-gray-600">Total Users</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-yellow-700">
            {totalHotels}
          </div>
          <div className="text-xs text-gray-600">Total Hotels</div>
        </div>
        <div className="bg-red-50 p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-red-700">
            {totalCancellations}
          </div>
          <div className="text-xs text-gray-600">Cancellations</div>
        </div>
        <div className="bg-indigo-50 p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-indigo-700">
            {totalReviews}
          </div>
          <div className="text-xs text-gray-600">Reviews</div>
        </div>
      </div>

      <div>
        {tab === "Hotels" && (
          <div>
            <h3 className="font-semibold mb-2">Hotels</h3>
            <ul className="space-y-2">
              {hotels.length === 0 ? (
                <li>No hotels found.</li>
              ) : (
                hotels.map((h, i) => (
                  <li key={i} className="border-b pb-1">
                    {h.name} ({h.city})
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
        {tab === "Bookings" && (
          <div>
            <h3 className="font-semibold mb-2">Bookings</h3>
            <ul className="space-y-2">
              {bookings.length === 0 ? (
                <li>No bookings found.</li>
              ) : (
                bookings.map((b, i) => (
                  <li
                    key={i}
                    className="border-b pb-1 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div>
                      <span className="font-semibold">{b.hotelName}</span> -{" "}
                      {b.userEmail} ({b.checkIn} to {b.checkOut})
                      <span
                        className={`ml-2 text-xs font-medium px-2 py-1 rounded ${b.status === "cancelled" ? "bg-red-100 text-red-700" : b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {b.status}
                      </span>
                      {b.status === "cancelled" && (
                        <span className="ml-2 text-xs text-blue-600">
                          Refund:{" "}
                          {b.refundStatus === "initiated" ? "Initiated" : "N/A"}
                        </span>
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
        {tab === "Users" && (
          <div>
            <h3 className="font-semibold mb-2">Users</h3>
            <ul className="space-y-2">
              {users.length === 0 ? (
                <li>No users found.</li>
              ) : (
                users.map((u, i) => (
                  <li key={i} className="border-b pb-1">
                    {u.displayName} ({u.email})
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
        {tab === "Reviews" && (
          <div>
            <h3 className="font-semibold mb-2">Reviews</h3>
            <ul className="space-y-2">
              {reviews.length === 0 ? (
                <li>No reviews found.</li>
              ) : (
                reviews.map((r, i) => (
                  <li
                    key={i}
                    className="border-b pb-1 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  >
                    <div>
                      <span className="font-semibold">{r.comment}</span> -{" "}
                      {r.rating}★
                      <span className="ml-2 text-xs text-gray-400">
                        {r.status === "approved" ? "Approved" : "Pending"}
                      </span>
                    </div>
                    {r.status !== "approved" && (
                      <div className="flex gap-2">
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded"
                          onClick={() => approveReview(i)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => rejectReview(i)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
