import React from "react";
import { useWishlist } from "../context/WishlistProvider";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-gray-500">No hotels in your wishlist yet.</p>
      ) : (
        <ul className="space-y-4">
          {wishlist.map((hotel) => (
            <li
              key={hotel.id}
              className="flex items-center gap-4 border-b pb-3"
            >
              <img
                src={hotel.medium_url}
                alt={hotel.name}
                className="w-20 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <Link
                  to={`/search/hotels/${hotel.id}`}
                  className="font-semibold text-lg text-purple-700 hover:underline"
                >
                  {hotel.name}
                </Link>
                <div className="text-sm text-gray-500">
                  {hotel.smart_location}
                </div>
                <div className="text-sm text-gray-600">
                  ₹{hotel.price} / night
                </div>
              </div>
              <button
                onClick={() => removeFromWishlist(hotel.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistPage;
