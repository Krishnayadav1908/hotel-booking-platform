import { useNavigate, useParams } from "react-router-dom";
import { useHotels } from "../context/HotelsProvider";
import { useBookmarks } from "../context/BookmarksProvider";
import { useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faHeart as faHeartSolid,
  faStar,
  faCalendarDays,
  faLocationDot,
  faUtensils,
  faPersonHiking,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import BookingForm from "../Booking/BookingForm";
import Map from "../map/Map";

export default function SingleHotel() {
  const navigate = useNavigate();
  const hotelId = useParams().id;
  const [isLoading, data, currentHotel, current] = useHotels();
  const { bookmarks, addBookmark, deleteBookmark } = useBookmarks();

  // Find the hotel by id
  const singleHotel = data?.find(
    (hotel) => String(hotel.id) === String(hotelId),
  );

  // Memoized, fully valid hotel object for map
  const validHotel = useMemo(() => {
    if (
      singleHotel &&
      singleHotel.latitude != null &&
      singleHotel.longitude != null &&
      singleHotel.latitude !== "" &&
      singleHotel.longitude !== "" &&
      !isNaN(Number(singleHotel.latitude)) &&
      !isNaN(Number(singleHotel.longitude))
    ) {
      return {
        ...singleHotel,
        latitude: Number(singleHotel.latitude),
        longitude: Number(singleHotel.longitude),
      };
    }
    return null;
  }, [singleHotel]);

  // Derived state: only true when validHotel is available
  const isMapReady = !!validHotel;

  // Check if hotel is already bookmarked
  const isBookmarked = bookmarks.some(
    (bookmark) => bookmark.hotelId === hotelId,
  );

  // Handle bookmark toggle
  function handleBookmarkToggle() {
    if (isBookmarked) {
      const bookmark = bookmarks.find((b) => b.hotelId === hotelId);
      if (bookmark) {
        deleteBookmark(bookmark.id);
      }
    } else {
      const newBookmark = {
        hotelId: singleHotel.id,
        cityName: singleHotel.city,
        countryName: singleHotel.country,
        countryCode: singleHotel.country_code,
        latitude: singleHotel.latitude,
        longitude: singleHotel.longitude,
        host_location: singleHotel.host_location,
        name: singleHotel.name,
        medium_url: singleHotel.medium_url,
        price: singleHotel.price,
        smart_location: singleHotel.smart_location,
      };
      addBookmark(newBookmark);
    }
  }

  useEffect(() => {
    if (singleHotel) {
      currentHotel(singleHotel);
    }
  }, [singleHotel, currentHotel]);

  useEffect(() => {
    if (isMapReady) {
      // log removed
    }
  }, [isMapReady, validHotel]);

  useEffect(() => {
    if (!singleHotel) {
      fetch(`http://localhost:5000/hotels/${hotelId}`)
        .then((response) => response.json())
        .then((hotel) => {
          // log removed
          if (hotel) {
            currentHotel(hotel);
          }
        })
        .catch((error) => {
          // log removed
        });
    }
  }, [hotelId, singleHotel, currentHotel]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!singleHotel) {
    return <div>Hotel not found</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="pb-4">
        {/* Header with Back and Save buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              navigate(-1);
            }}
            className="border border-slate-400 border-solid rounded-md flex space-x-1 items-center p-0.5 px-1"
          >
            <FontAwesomeIcon icon={faAnglesLeft} size="xs" />
            <p>Back</p>
          </button>
          <button
            onClick={handleBookmarkToggle}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-all ${
              isBookmarked
                ? "bg-red-500 text-white"
                : "border border-red-400 text-red-500 hover:bg-red-50"
            }`}
            title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
          >
            <FontAwesomeIcon
              icon={isBookmarked ? faHeartSolid : faHeartRegular}
              className={isBookmarked ? "text-white" : "text-red-500"}
            />
            <span className="text-sm">{isBookmarked ? "Saved" : "Save"}</span>
          </button>
        </div>

        {/* Hotel Basic Info */}
        <div className="text-sm mt-4">
          <h4 className="font-bold text-lg">{singleHotel.name}</h4>
          {/* Rating and Reviews */}
          <div className="flex items-center gap-2 mt-1">
            {singleHotel.rating && (
              <span className="flex items-center bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-xs font-semibold">
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-yellow-500 mr-1"
                />
                {singleHotel.rating}
              </span>
            )}
            <span className="text-gray-500 text-xs">
              {singleHotel.number_of_reviews} reviews
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 text-xs">
              {singleHotel.host_location}
            </span>
          </div>
          {/* Image */}
          <img
            className="rounded-xl mt-3 w-full h-48 object-cover"
            src={singleHotel.medium_url}
            alt={singleHotel.name}
          />
          {/* Price */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-purple-600 font-bold text-lg">
              ₹{singleHotel.price}{" "}
              <span className="text-gray-500 font-normal text-sm">/ night</span>
            </p>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              {singleHotel.property_type}
            </span>
          </div>
          {/* Description */}
          {singleHotel.description && (
            <p className="mt-3 text-gray-600 text-xs leading-relaxed">
              {singleHotel.description}
            </p>
          )}
          {/* Best Time to Visit */}
          {singleHotel.best_time_to_visit && (
            <div className="mt-4 bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                <FontAwesomeIcon icon={faCalendarDays} />
                <span>Best Time to Visit</span>
              </div>
              <p className="text-blue-600 text-xs mt-1">
                {singleHotel.best_time_to_visit}
              </p>
            </div>
          )}
          {/* Place Highlights */}
          {singleHotel.place_highlights &&
            singleHotel.place_highlights.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-red-500"
                  />
                  <span>Nearby Places</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {singleHotel.place_highlights.map((place, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      {place}
                    </span>
                  ))}
                </div>
              </div>
            )}
          {/* Food Speciality */}
          {singleHotel.food_speciality &&
            singleHotel.food_speciality.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                  <FontAwesomeIcon
                    icon={faUtensils}
                    className="text-orange-500"
                  />
                  <span>Must Try Food</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {singleHotel.food_speciality.map((food, index) => (
                    <span
                      key={index}
                      className="bg-orange-50 text-orange-700 px-2 py-1 rounded-full text-xs"
                    >
                      🍽️ {food}
                    </span>
                  ))}
                </div>
              </div>
            )}
          {/* Activities */}
          {singleHotel.activities && singleHotel.activities.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                <FontAwesomeIcon
                  icon={faPersonHiking}
                  className="text-green-600"
                />
                <span>Things to Do</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {singleHotel.activities.map((activity, index) => (
                  <span
                    key={index}
                    className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs"
                  >
                    ✨ {activity}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Amenities */}
          {singleHotel.amenities && singleHotel.amenities.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                <span>🏨 Amenities</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {singleHotel.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Booking Form */}
          <div className="mt-6">
            <BookingForm hotel={singleHotel} />
          </div>
          {/* Map Component - only render when isMapReady is true */}
          {isMapReady && (
            <div className="mt-4">
              <Map
                locations={[
                  {
                    latitude: validHotel.latitude,
                    longitude: validHotel.longitude,
                    name: validHotel.name,
                    smart_location: validHotel.smart_location,
                    price: validHotel.price,
                    id: validHotel.id,
                  },
                ]}
                selectedHotelId={validHotel.id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
