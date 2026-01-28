import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faUsers,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

export default function BookingForm({ hotel }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Calculate total nights and price
  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights * hotel.price : 0;
  };

  const totalPrice = calculateTotal();
  const nights = hotel.price ? Math.floor(totalPrice / hotel.price) : 0;

  async function handleBooking(e) {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to book!");
      navigate("/login");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      toast.error("Check-out must be after check-in!");
      return;
    }

    setIsBooking(true);

    try {
      const booking = {
        id: uuidv4(),
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelImage: hotel.medium_url || hotel.xl_picture_url,
        hotelLocation: hotel.smart_location || hotel.host_location,
        checkIn,
        checkOut,
        guests,
        nights,
        pricePerNight: hotel.price,
        totalPrice,
        userId: user?.id,
        userEmail: user?.email,
        status: "confirmed",
        bookedAt: new Date().toISOString(),
      };

      // Save to localStorage
      const existingBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]",
      );
      localStorage.setItem(
        "bookings",
        JSON.stringify([...existingBookings, booking]),
      );

      toast.success("Booking confirmed! 🎉");
      navigate("/my-bookings");
    } catch (error) {
      toast.error("Booking failed! Please try again.");
      // log removed
    } finally {
      setIsBooking(false);
    }
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          Book This Hotel
        </h3>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Available
        </span>
      </div>

      <div className="mb-6">
        <p className="text-3xl font-bold text-purple-600">
          <FontAwesomeIcon icon={faIndianRupeeSign} className="text-2xl" />
          {hotel.price?.toLocaleString("en-IN")}
          <span className="text-sm text-gray-500 font-normal ml-1">/night</span>
        </p>
      </div>

      <form onSubmit={handleBooking} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
              Check-in
            </label>
            <input
              type="date"
              required
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
              Check-out
            </label>
            <input
              type="date"
              required
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <FontAwesomeIcon icon={faUsers} className="mr-1" />
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
        </div>

        {totalPrice > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>
                ₹{hotel.price?.toLocaleString("en-IN")} × {nights} night
                {nights > 1 ? "s" : ""}
              </span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>Service fee</span>
              <span>₹0</span>
            </div>
            <hr className="border-gray-200 dark:border-gray-600" />
            <div className="flex justify-between font-bold text-gray-800 dark:text-white">
              <span>Total</span>
              <span className="text-purple-600">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isBooking || !checkIn || !checkOut}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isBooking ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            "Reserve Now"
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          You won't be charged yet
        </p>
      </form>
    </div>
  );
}
