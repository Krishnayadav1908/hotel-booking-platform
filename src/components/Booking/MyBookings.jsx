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
import { db } from "../../services/firebase";
import { useWishlist } from "../context/WishlistProvider";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

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
    async function fetchBookings() {
      setIsLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "bookings"));
        const allBookings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const userBookings = allBookings.filter(
          (booking) =>
            booking.userId === user?.uid ||
            booking.userId === user?.id ||
            booking.userEmail === user?.email,
        );
        setBookings(userBookings);
      } catch (err) {
        toast.error("Failed to fetch bookings");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBookings();
  }, [isAuthenticated, user, navigate]);

  async function cancelBooking(bookingId) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking? Refund will be processed if eligible.",
    );
    if (!confirmed) return;
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, {
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
        refundStatus: "initiated",
      });
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                status: "cancelled",
                cancelledAt: new Date().toISOString(),
                refundStatus: "initiated",
              }
            : b,
        ),
      );
      toast.success("Booking cancelled! Refund will be processed soon.");
    } catch (err) {
      toast.error("Failed to cancel booking. Try again.");
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-800/40 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-800/40 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  }

  function isUpcoming(checkInDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkIn = new Date(checkInDate);
    checkIn.setHours(0, 0, 0, 0);

    return checkIn >= today;
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

  const upcomingBookings = bookings.filter(
    (b) => isUpcoming(b.checkIn) && b.status !== "cancelled",
  );
  const pastBookings = bookings.filter(
    (b) => !isUpcoming(b.checkIn) || b.status === "cancelled",
  );

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
  const { addToWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(
    booking.hotelId || booking.hotel_id || booking.id,
  );
  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Hotel Image */}
        <div className="md:w-52 h-40 md:h-auto overflow-hidden">
          <img
            src={booking.hotelImage || "/images/placeholder-hotel.jpg"}
            alt={booking.hotelName}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
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
              <button
                onClick={() => {
                  addToWishlist({
                    id: booking.hotelId || booking.hotel_id || booking.id,
                    name: booking.hotelName,
                    medium_url:
                      booking.hotelImage || "/images/placeholder-hotel.jpg",
                    smart_location: booking.hotelLocation,
                    price: booking.totalPrice || 0,
                  });
                }}
                className={`mt-2 px-3 py-1 rounded text-sm font-semibold border ${wishlisted ? "bg-purple-100 text-purple-700 border-purple-300" : "bg-gray-100 text-gray-700 border-gray-300"} hover:bg-purple-200 transition`}
                disabled={wishlisted}
                title={wishlisted ? "Already in wishlist" : "Add to wishlist"}
              >
                {wishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full capitalize backdrop-blur-sm ${getStatusColor(booking.status)}`}
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

          {showCancel && booking.status === "confirmed" && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => onCancel(booking.id)}
                className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition"
              >
                <FontAwesomeIcon icon={faTrash} />
                Cancel Booking
              </button>
            </div>
          )}
          {booking.status === "cancelled" && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-right">
              <span className="text-red-600 dark:text-red-400 font-semibold">
                Cancelled
              </span>
              <br />
              <span className="text-xs text-gray-500">
                Refund:{" "}
                {booking.refundStatus === "initiated" ? "Initiated" : "N/A"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
