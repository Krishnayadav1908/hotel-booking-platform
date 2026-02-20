import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (hotel) => {
    setWishlist((prev) =>
      prev.some((h) => h.id === hotel.id) ? prev : [...prev, hotel],
    );
  };

  const removeFromWishlist = (hotelId) => {
    setWishlist((prev) => prev.filter((h) => h.id !== hotelId));
  };

  const isWishlisted = (hotelId) => wishlist.some((h) => h.id === hotelId);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
