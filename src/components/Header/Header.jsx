import {
  Link,
  useNavigate,
  createSearchParams,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useTranslation } from "react-i18next";
import DarkModeToggle from "../common/DarkModeToggle";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistProvider";

export default function Header() {
  const { user, logout } = useAuth();
  const { i18n } = useTranslation();
  const { wishlist } = useWishlist();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const adminEmail = "maa12@gmail.com";

  const handleSearch = () => {
    const params = createSearchParams({
      destination,
    });
    navigate({ pathname: "/search", search: params.toString() });
  };

  return (
    <>
      {/* ===== HEADER ===== */}
      <header
        className="
        sticky top-0 z-50 w-full
        bg-gradient-to-br from-purple-50 to-indigo-100 dark:bg-gradient-to-br dark:from-indigo-950 dark:via-purple-950 dark:to-black
        border-b border-gray-200 dark:border-white/10
        shadow-sm
        transition-all duration-300
      "
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* ===== LOGO ===== */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-purple-700 dark:text-white"
          >
            🏨 <span>BookingHotel</span>
          </Link>

          {/* ===== DESKTOP RIGHT ===== */}
          <div className="hidden md:flex items-center gap-6 md:gap-5 lg:gap-7">
            <DarkModeToggle />

            {!user && (
              <>
                <Link
                  to="/login"
                  className={`text-sm px-2 py-1 rounded transition font-medium ${location.pathname === "/login" ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300" : "text-gray-700 dark:text-gray-300 hover:text-purple-600"}`}
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className={`bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs hover:shadow-lg hover:shadow-purple-500/40 transition duration-300 border border-white/20 dark:border-fuchsia-700 dark:bg-gradient-to-r dark:from-[#3b0764] dark:to-[#581c87] dark:text-white dark:brightness-125 dark:shadow-[0_2px_16px_rgba(0,0,0,0.9)] font-semibold ${location.pathname === "/signup" ? "ring-2 ring-pink-400" : ""}`}
                >
                  Signup
                </Link>
              </>
            )}

            {user && (
              <div className="flex items-center gap-3">
                <span
                  className="
                  bg-purple-600 text-white w-8 h-8 flex
                  items-center justify-center rounded-full
                  cursor-pointer border border-gray-300
                  dark:border-gray-600 hover:shadow-md transition
                "
                  onClick={() => navigate("/profile")}
                  title="View Profile"
                >
                  {user?.name?.charAt(0) || "U"}
                </span>

                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user?.name}
                </span>

                <Link
                  to="/my-bookings"
                  className={`text-sm px-2 py-1 rounded transition font-medium ${location.pathname === "/my-bookings" ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300" : "text-gray-700 dark:text-gray-300 hover:text-purple-600"}`}
                >
                  My Booking
                </Link>

                <Link
                  to="/wishlist"
                  className={`relative flex items-center group px-2 py-1 rounded ${location.pathname === "/wishlist" ? "bg-purple-100 dark:bg-purple-900" : ""}`}
                  aria-label="Wishlist"
                >
                  <FaHeart
                    className={`text-lg group-hover:scale-110 transition ${location.pathname === "/wishlist" ? "text-pink-600" : "text-pink-500"}`}
                  />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-pink-600 text-white text-sm font-bold rounded-full px-2 py-0.5 border-2 border-white dark:border-gray-900 flex items-center justify-center min-w-[1.5rem] min-h-[1.5rem]">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {user.email === adminEmail && (
                  <Link
                    to="/admin"
                    className="
                    bg-gradient-to-r from-purple-600 to-pink-600
                    text-white px-3 py-1.5 rounded-full text-xs
                    hover:shadow-lg hover:shadow-purple-500/40
                    transition duration-300
                    border border-white/20
                    dark:border-fuchsia-700
                    dark:bg-gradient-to-r dark:from-[#3b0764] dark:to-[#581c87]
                    dark:text-white
                    dark:brightness-125
                    dark:shadow-[0_2px_16px_rgba(0,0,0,0.9)]
                    font-semibold
                  "
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to logout?"))
                      logout();
                  }}
                  className="text-red-500 text-sm hover:underline px-2 py-1 rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* ===== MOBILE MENU BUTTON ===== */}
          <button
            className="md:hidden text-2xl text-gray-700 dark:text-white"
            onClick={() => setMobileMenu(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* ===== MOBILE SIDEBAR ===== */}
      {mobileMenu && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={() => setMobileMenu(false)}
        >
          <div
            className="w-72 bg-white dark:bg-gray-900 h-full p-6 flex flex-col gap-5 md:gap-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="self-end text-xl text-gray-700 dark:text-white"
              onClick={() => setMobileMenu(false)}
            >
              ✕
            </button>

            <Link
              to="/"
              className="text-2xl font-bold text-purple-700 dark:text-white"
            >
              🏨 BookingHotel
            </Link>

            <DarkModeToggle />

            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenu(false)}
                  className={`text-sm px-2 py-1 rounded transition font-medium ${location.pathname === "/login" ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300" : "text-gray-700 dark:text-gray-300 hover:text-purple-600"}`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenu(false)}
                  className={`bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs hover:shadow-lg hover:shadow-purple-500/40 transition duration-300 border border-white/20 dark:border-fuchsia-700 dark:bg-gradient-to-r dark:from-[#3b0764] dark:to-[#581c87] dark:text-white dark:brightness-125 dark:shadow-[0_2px_16px_rgba(0,0,0,0.9)] font-semibold ${location.pathname === "/signup" ? "ring-2 ring-pink-400" : ""}`}
                >
                  Signup
                </Link>
              </>
            )}

            {user && (
              <>
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenu(false)}
                  className={`text-sm px-2 py-1 rounded transition font-medium ${location.pathname === "/my-bookings" ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300" : "text-gray-700 dark:text-gray-300 hover:text-purple-600"}`}
                >
                  My Booking
                </Link>

                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenu(false)}
                  className={`relative flex items-center group px-2 py-1 rounded ${location.pathname === "/wishlist" ? "bg-purple-100 dark:bg-purple-900" : ""}`}
                  aria-label="Wishlist"
                >
                  <FaHeart
                    className={`text-lg group-hover:scale-110 transition ${location.pathname === "/wishlist" ? "text-pink-600" : "text-pink-500"}`}
                  />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-pink-600 text-white text-sm font-bold rounded-full px-2 py-0.5 border-2 border-white dark:border-gray-900 flex items-center justify-center min-w-[1.5rem] min-h-[1.5rem]">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {user.email === adminEmail && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenu(false)}
                    className="
                      bg-gradient-to-r from-purple-600 to-pink-600
                      text-white px-3 py-1.5 rounded-full text-xs
                      hover:shadow-lg hover:shadow-purple-500/40
                      transition duration-300
                      border border-white/20
                      dark:border-fuchsia-700
                      dark:bg-gradient-to-r dark:from-[#3b0764] dark:to-[#581c87]
                      dark:text-white
                      dark:brightness-125
                      dark:shadow-[0_2px_16px_rgba(0,0,0,0.9)]
                      font-semibold
                    "
                  >
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to logout?")) {
                      logout();
                      setMobileMenu(false);
                    }
                  }}
                  className="text-red-500 text-sm hover:underline px-2 py-1 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
