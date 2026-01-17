import ReactCountryFlag from "react-country-flag";
import { useBookmarks } from "../context/BookmarksProvider";
import { Link } from "react-router-dom";
import { closePopup } from "../map/Map";
import { HiTrash } from "react-icons/hi";

export default function BookmarkList() {
  const {bookmarks, deleteBookmark} = useBookmarks();

  function handleBookmarkDelete(e, id) {
    e.preventDefault();
    deleteBookmark(id);
    
  }
  return (
    <div>
      <h2>Bookmark List</h2>
      <div className="bookmarkList">
        {bookmarks.map((bookmark) => {
          return (
            <Link
              key={bookmark.id}
              to={`${bookmark.id}?lat=${bookmark.latitude}&lng=${bookmark.longitude}`}
              onClick={closePopup}
            >
              <div className="bookmarkItem">
                <div>
                  <ReactCountryFlag svg countryCode={bookmark.countryCode} />
                  &nbsp; <strong>{bookmark.cityName}</strong> &nbsp;{" "}
                  <span>{bookmark.country}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    handleBookmarkDelete(e, bookmark.id);
                  }}
                >
                  <HiTrash className="trash" />
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
