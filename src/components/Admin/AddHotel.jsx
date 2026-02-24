import React, { useState } from "react";
import { db, storage } from "../../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AddHotel = () => {
  const navigate = useNavigate();
  const [hotelForm, setHotelForm] = useState({
    name: "",
    city: "",
    country: "",
    price: "",
    image: null,
    description: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // No Firebase Storage upload, just use placeholder or local preview
    let imageUrl = "https://via.placeholder.com/300x200?text=No+Image";
    if (hotelForm.image) {
      // Use local preview as data URL
      try {
        imageUrl = URL.createObjectURL(hotelForm.image);
      } catch (err) {
        imageUrl = "https://via.placeholder.com/300x200?text=No+Image";
      }
    }
    const hotelData = {
      name: hotelForm.name,
      city: hotelForm.city,
      country: hotelForm.country,
      price: Number(hotelForm.price),
      latitude: Number(hotelForm.latitude),
      longitude: Number(hotelForm.longitude),
      description: hotelForm.description,
      image: imageUrl,
      id: Date.now(), // fallback id
    };
    // Only save to localStorage so user sees their hotel
    let localHotels = JSON.parse(localStorage.getItem("localHotels") || "[]");
    localHotels.unshift(hotelData);
    localStorage.setItem("localHotels", JSON.stringify(localHotels));
    toast.success("Hotel added!");
    setLoading(false);
    navigate("/admin-dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow max-w-md w-full flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold mb-4">Add New Hotel</h2>
        <input
          placeholder="Name"
          value={hotelForm.name}
          onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          placeholder="City"
          value={hotelForm.city}
          onChange={(e) => setHotelForm({ ...hotelForm, city: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          placeholder="Country"
          value={hotelForm.country}
          onChange={(e) =>
            setHotelForm({ ...hotelForm, country: e.target.value })
          }
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={hotelForm.price}
          onChange={(e) =>
            setHotelForm({ ...hotelForm, price: e.target.value })
          }
          className="border p-2 rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          className="border p-2 rounded"
          onChange={(e) =>
            setHotelForm({ ...hotelForm, image: e.target.files[0] })
          }
          required
        />
        {hotelForm.image && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(hotelForm.image)}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
        )}
        <textarea
          placeholder="Description"
          value={hotelForm.description}
          onChange={(e) =>
            setHotelForm({ ...hotelForm, description: e.target.value })
          }
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Latitude"
          value={hotelForm.latitude}
          onChange={(e) =>
            setHotelForm({ ...hotelForm, latitude: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Longitude"
          value={hotelForm.longitude}
          onChange={(e) =>
            setHotelForm({ ...hotelForm, longitude: e.target.value })
          }
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white py-2 rounded font-semibold mt-4"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Hotel"}
        </button>
      </form>
    </div>
  );
};

export default AddHotel;
