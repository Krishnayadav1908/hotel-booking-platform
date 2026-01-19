import ReactCountryFlag from "react-country-flag";
import { useBookmarks } from "../context/BookmarksProvider";
import { Link } from "react-router-dom";
import { closePopup } from "../map/Map";
import { HiTrash } from "react-icons/hi";

export default function BookmarkList() {
  const { bookmarks, deleteBookmark } = useBookmarks();

  function handleBookmarkDelete(e, id) {
    e.preventDefault();
    deleteBookmark(id);
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-lg font-semibold mb-2">No Bookmarks Yet</h2>
        <p className="text-gray-500 text-sm">
          Jab koi jagah pasand aaye, heart icon pe click karke save karo!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bold text-lg mb-3">Your Saved Places ❤️</h2>
      <div className="bookmarkList space-y-3">
        {bookmarks.map((bookmark) => {
          return (
            <Link
              key={bookmark.id}
              to={`${bookmark.id}?lat=${bookmark.latitude}&lng=${bookmark.longitude}`}
              onClick={closePopup}
            >
              <div className="bookmarkItem flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 transition-all">
                <div className="flex items-center space-x-3">
                  {bookmark.medium_url && (
                    <img
                      src={bookmark.medium_url}
                      alt={bookmark.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  )}
                  <div>
                    <div className="flex items-center space-x-1">
                      <ReactCountryFlag svg countryCode={bookmark.countryCode} />
                      <strong className="text-sm">{bookmark.name || bookmark.cityName}</strong>
                    </div>
                    <p className="text-xs text-gray-500">{bookmark.host_location}</p>
                    {bookmark.price && (
                      <p className="text-xs font-semibold text-purple-600">
                        ₹{bookmark.price}/night
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    handleBookmarkDelete(e, bookmark.id);
                  }}
                  className="p-2 hover:bg-red-100 rounded-full transition-all"
                >
                  <HiTrash className="trash text-red-500" />
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
