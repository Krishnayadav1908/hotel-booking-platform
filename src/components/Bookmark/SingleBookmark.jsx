import { useNavigate, useParams } from "react-router-dom";
import { useBookmarks } from "../context/BookmarksProvider";
import ReactCountryFlag from "react-country-flag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function SingleBookmark() {
  const { getBookmark, deleteBookmark } = useBookmarks();
  const bookmark = getBookmark(useParams().id);
  const navigator = useNavigate();

  if (!bookmark) {
    return (
      <div className="text-center py-8">
        <p>Bookmark not found</p>
        <button
          onClick={() => navigator("/bookmark")}
          className="mt-4 text-purple-600 underline"
        >
          Go back to bookmarks
        </button>
      </div>
    );
  }

  function handleDelete() {
    deleteBookmark(bookmark.id);
    navigator("/bookmark");
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            navigator("/bookmark");
          }}
          className="border border-slate-400 border-solid rounded-md flex space-x-1 items-center p-0.5 px-1"
        >
          <FontAwesomeIcon icon={faAnglesLeft} size="xs" />
          <p>Back</p>
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center space-x-1 hover:bg-red-600 transition-all"
        >
          <FontAwesomeIcon icon={faTrash} size="xs" />
          <span className="text-sm">Remove</span>
        </button>
      </div>

      <div className="mt-4">
        {bookmark.medium_url && (
          <img
            src={bookmark.medium_url}
            alt={bookmark.name}
            className="w-full h-48 object-cover rounded-xl"
          />
        )}

        <div className="mt-3">
          <h4 className="text-lg font-bold">{bookmark.name || bookmark.cityName}</h4>
          <div className="flex items-center space-x-2 mt-1">
            <ReactCountryFlag svg countryCode={bookmark.countryCode} />
            <p className="text-sm text-gray-600">{bookmark.host_location}</p>
          </div>

          {bookmark.price && (
            <p className="mt-2 text-purple-600 font-semibold">
              ₹{bookmark.price} / night
            </p>
          )}

          <div className="flex space-x-2 text-xs text-gray-400 mt-2">
            <p>Lat: {bookmark.latitude?.toString().slice(0, 8)}</p>
            <p>Lng: {bookmark.longitude?.toString().slice(0, 8)}</p>
          </div>

          {bookmark.hotelId && (
            <button
              onClick={() => navigator(`/search/Hotels/${bookmark.hotelId}`)}
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-all"
            >
              View Hotel Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
