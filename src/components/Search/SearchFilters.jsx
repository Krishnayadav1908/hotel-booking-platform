import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faXmark,
  faStar,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";

export default function SearchFilters({ onFilter, onReset }) {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [rating, setRating] = useState(0);
  const [propertyType, setPropertyType] = useState("");
  const [amenities, setAmenities] = useState([]);

  const amenitiesList = [
    { id: "wifi", label: "WiFi", icon: "📶" },
    { id: "pool", label: "Pool", icon: "🏊" },
    { id: "parking", label: "Parking", icon: "🅿️" },
    { id: "ac", label: "AC", icon: "❄️" },
    { id: "breakfast", label: "Breakfast", icon: "🍳" },
    { id: "gym", label: "Gym", icon: "💪" },
    { id: "spa", label: "Spa", icon: "💆" },
    { id: "restaurant", label: "Restaurant", icon: "🍽️" },
  ];

  const propertyTypes = [
    { id: "", label: "All Types" },
    { id: "hotel", label: "Hotel" },
    { id: "apartment", label: "Apartment" },
    { id: "villa", label: "Villa" },
    { id: "resort", label: "Resort" },
    { id: "hostel", label: "Hostel" },
  ];

  function handleAmenityToggle(amenityId) {
    setAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((a) => a !== amenityId)
        : [...prev, amenityId]
    );
  }

  function applyFilters() {
    onFilter({
      priceRange,
      rating,
      propertyType,
      amenities,
    });
    setIsOpen(false);
  }

  function resetFilters() {
    setPriceRange([0, 15000]);
    setRating(0);
    setPropertyType("");
    setAmenities([]);
    onReset();
    setIsOpen(false);
  }

  const activeFiltersCount =
    (rating > 0 ? 1 : 0) +
    (propertyType ? 1 : 0) +
    amenities.length +
    (priceRange[1] < 15000 ? 1 : 0);

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
          activeFiltersCount > 0
            ? "bg-purple-600 text-white border-purple-600"
            : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-500"
        }`}
      >
        <FontAwesomeIcon icon={faFilter} />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="bg-white text-purple-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Filter Content */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Filters
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                  Price Range
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <FontAwesomeIcon
                    icon={faIndianRupeeSign}
                    className="text-gray-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {priceRange[0].toLocaleString("en-IN")} -{" "}
                    {priceRange[1].toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0</span>
                  <span>₹15,000+</span>
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                  Minimum Rating
                </h4>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(rating === star ? 0 : star)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition ${
                        rating >= star
                          ? "bg-yellow-400 border-yellow-400 text-white"
                          : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-yellow-400"
                      }`}
                    >
                      {star}
                      <FontAwesomeIcon icon={faStar} className="text-sm" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                  Property Type
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setPropertyType(type.id)}
                      className={`px-3 py-2 rounded-lg border text-sm transition ${
                        propertyType === type.id
                          ? "bg-purple-600 border-purple-600 text-white"
                          : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-500"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                  Amenities
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesList.map((amenity) => (
                    <button
                      key={amenity.id}
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition ${
                        amenities.includes(amenity.id)
                          ? "bg-purple-600 border-purple-600 text-white"
                          : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-500"
                      }`}
                    >
                      <span>{amenity.icon}</span>
                      <span>{amenity.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
              >
                Reset All
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
