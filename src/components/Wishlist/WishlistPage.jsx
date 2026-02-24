import React from "react";
import { useWishlist } from "../context/WishlistProvider";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  const handleRemove = (id) => {
    removeFromWishlist(id);
    toast.success("Removed from wishlist");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-black py-10 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3">
          <FontAwesomeIcon icon={faHeart} className="text-red-500" />
          My Wishlist
          {wishlist.length > 0 && (
            <span className="ml-2 text-sm bg-purple-600 text-white px-3 py-1 rounded-full">
              {wishlist.length}
            </span>
          )}
        </h2>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="bg-white dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-10 text-center border border-gray-200 dark:border-gray-700 shadow-sm transition">
            <FontAwesomeIcon
              icon={faHeart}
              className="text-5xl text-red-400 mb-4"
            />

            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No hotels in your wishlist yet.
            </p>
            <Link
              to="/"
              className="
  inline-flex items-center justify-center
  mt-6
  bg-gradient-to-r from-purple-600 to-pink-600
  hover:opacity-90
  text-white
  dark:text-white
  font-semibold
  px-6 py-2
  rounded-lg
  shadow-md hover:shadow-lg
  transition
  "
            >
              Explore Hotels
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {wishlist.map((hotel) => (
              <div
                key={hotel.id}
                className="
                flex flex-col md:flex-row items-center gap-5 
                bg-white dark:bg-gray-800/70 
                border border-gray-200 dark:border-gray-700 
                rounded-2xl p-4 
                hover:shadow-xl hover:scale-[1.02]
                transition duration-300 ease-in-out
                "
              >
                {/* Image */}
                <img
                  src={hotel.medium_url}
                  alt={hotel.name}
                  className="w-full md:w-40 h-32 object-cover rounded-xl transition-transform duration-500 hover:scale-105"
                />

                {/* Details */}
                <div className="flex-1 text-center md:text-left">
                  <Link
                    to={`/search/hotels/${hotel.id}`}
                    className="text-xl font-semibold text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition"
                  >
                    {hotel.name}
                  </Link>

                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {hotel.smart_location}
                  </div>

                  <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold mt-2">
                    ₹{hotel.price?.toLocaleString("en-IN")} / night
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(hotel.id)}
                  className="
  bg-red-500 
  hover:bg-red-600
  text-white
  dark:text-white
  px-4 py-2 
  rounded-lg 
  text-sm 
  font-medium 
  flex items-center gap-2 
  transition
  shadow-md hover:shadow-lg
  "
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
