import { useNavigate, useParams } from "react-router-dom";
import { useHotels } from "../context/HotelsProvider";
import { useBookmarks } from "../context/BookmarksProvider";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { v4 as uuidv4 } from "uuid";

export default function SingleHotel() {
  const navigate = useNavigate();
  const hotelId = useParams().id;
  const [isLoading, data, currentHotel, current] = useHotels();
  const { bookmarks, addBookmark, deleteBookmark } = useBookmarks();

  const singleHotel = data?.find((hotel) => hotel.id === hotelId);

  // Check if hotel is already bookmarked
  const isBookmarked = bookmarks.some(
    (bookmark) => bookmark.hotelId === hotelId
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
        id: uuidv4(),
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!singleHotel) {
    return <div>Hotel not found</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="border	border-slate-400 border-solid rounded-md flex space-x-1 items-center p-0.5 px-1"
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
          <span className="text-sm">
            {isBookmarked ? "Saved" : "Save"}
          </span>
        </button>
      </div>
      <div className="text-sm mt-4">
        <h4 className="font-bold">{singleHotel.name}</h4>
        <div className="flex text-xs mt-1">
          <p>{singleHotel.number_of_reviews} reviews &bull; </p>
          <p className="pl-1">{singleHotel.host_location}</p>
        </div>
        <img
          className="rounded-xl mt-2 w-full"
          src={singleHotel.medium_url}
          alt=""
        />
      </div>
    </div>
  );
}
