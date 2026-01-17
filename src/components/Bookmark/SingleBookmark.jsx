import { useNavigate, useParams } from "react-router-dom";
import { useBookmarks } from "../context/BookmarksProvider";
import ReactCountryFlag from "react-country-flag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";

export default function SingleBookmark() {
  const {getBookmark} = useBookmarks();
  const bookmark = getBookmark(useParams().id);
  const navigator = useNavigate();
  return (
    <div>
      <button
      
        onClick={() => {
          navigator("/bookmark");
        }}
        className="border	border-slate-400 border-solid rounded-md flex space-x-1 items-center p-0.5 px-1"
      >
        <FontAwesomeIcon icon={faAnglesLeft} size="xs" />
        <p>Back</p>
      </button>
      <div className="flex flex-col items-center space-y-4 mt-4">
        <div className="flex space-x-4 items-center justify-center">
          <h4 className="text-lg font-bold -mb-1">{bookmark.cityName || ""}</h4>
          <div className="flex items-center space-x-1 mt-1">
            <ReactCountryFlag svg countryCode={bookmark.countryCode} />
            <p className="text-xs">{bookmark.country}</p>
          </div>
        </div>
        <div className="flex space-x-1 text-xs">
          <p>{bookmark.latitude?.slice(0,6)}</p>
          <p>{bookmark.longitude?.slice(0,6)}</p>
        </div>
      </div>
    </div>
  );
}
