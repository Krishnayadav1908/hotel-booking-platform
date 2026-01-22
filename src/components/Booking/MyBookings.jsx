import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faUsers,
  faTrash,
  faHotel,
  faLocationDot,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    // Filter bookings for current user
    const userBookings = storedBookings.filter(
      (booking) => booking.userId === user?.id || booking.userEmail === user?.email
    );
    setBookings(userBookings);
    setIsLoading(false);
  }, [isAuthenticated, user, navigate]);

  function cancelBooking(bookingId) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmed) return;

    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const updatedBookings = allBookings.filter(
      (booking) => booking.id !== bookingId
    );
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    toast.success("Booking cancelled successfully!");
  }

  function getStatusColor(status) {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function isUpcoming(checkInDate) {
    return new Date(checkInDate) >= new Date();
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-purple-100 p-6 rounded-full mb-6">
          <FontAwesomeIcon
            icon={faHotel}
            className="text-purple-600 text-4xl"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          No Bookings Yet
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
          You haven't made any bookings yet. Start exploring hotels!
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
        >
          Browse Hotels
        </button>
      </div>
    );
  }

  const upcomingBookings = bookings.filter((b) => isUpcoming(b.checkIn));
  const pastBookings = bookings.filter((b) => !isUpcoming(b.checkIn));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        My Bookings 🏨
      </h1>

      {/* Upcoming Bookings */}
      {upcomingBookings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Upcoming ({upcomingBookings.length})
          </h2>
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={cancelBooking}
                getStatusColor={getStatusColor}
                showCancel={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Past Bookings ({pastBookings.length})
          </h2>
          <div className="space-y-4 opacity-75">
            {pastBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={cancelBooking}
                getStatusColor={getStatusColor}
                showCancel={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking, onCancel, getStatusColor, showCancel }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Hotel Image */}
        <div className="md:w-48 h-40 md:h-auto">
          <img
            src={booking.hotelImage || "/images/placeholder-hotel.jpg"}
            alt={booking.hotelName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/200x150?text=Hotel";
            }}
          />
        </div>

        {/* Booking Details */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                {booking.hotelName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <FontAwesomeIcon icon={faLocationDot} />
                {booking.hotelLocation}
              </p>
            </div>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Check-in</p>
              <p className="font-medium text-gray-800 dark:text-white flex items-center gap-1">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  className="text-purple-600"
                />
                {new Date(booking.checkIn).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Check-out</p>
              <p className="font-medium text-gray-800 dark:text-white flex items-center gap-1">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  className="text-purple-600"
                />
                {new Date(booking.checkOut).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Guests</p>
              <p className="font-medium text-gray-800 dark:text-white flex items-center gap-1">
                <FontAwesomeIcon icon={faUsers} className="text-purple-600" />
                {booking.guests}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Total</p>
              <p className="font-bold text-purple-600 flex items-center">
                <FontAwesomeIcon icon={faIndianRupeeSign} className="text-sm" />
                {booking.totalPrice?.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {showCancel && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => onCancel(booking.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition"
              >
                <FontAwesomeIcon icon={faTrash} />
                Cancel Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
