import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faRightFromBracket,
  faCalendarCheck,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
    setIsOpen(false);
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer border border-gray-300 dark:border-gray-600 hover:shadow-md transition"
          onClick={() => navigate("/profile")}
          title="View Profile"
        >
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block max-w-24 truncate bg-white dark:bg-gray-800 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 hover:shadow-md transition"
        >
          {user?.name || "User"}
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-800 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <FontAwesomeIcon icon={faUser} className="text-purple-600" />
              <span>Profile</span>
            </Link>
            <Link
              to="/my-bookings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <FontAwesomeIcon
                icon={faCalendarCheck}
                className="text-purple-600"
              />
              <span>My Bookings</span>
            </Link>

            <Link
              to="/bookmark"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <FontAwesomeIcon icon={faBookmark} className="text-purple-600" />
              <span>Saved Places</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition w-full"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
