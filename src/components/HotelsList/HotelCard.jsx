import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

function HotelCard({ name, id, medium_url, smart_location, price, ...hotel }) {
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = isWishlisted(id);
  function handleWishlist(e) {
    e.preventDefault();
    if (wishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist({ id, name, medium_url, smart_location, price, ...hotel });
    }
  }
  return (
    <Link
      to={`/search/Hotels/${String(id)}`}
      className="locationItem relative group"
    >
      <img src={medium_url} alt={name} />
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 bg-white/80 rounded-full p-2 shadow group-hover:scale-110 transition"
        title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <FontAwesomeIcon
          icon={wishlisted ? faHeartSolid : faHeartRegular}
          className={wishlisted ? "text-red-500" : "text-gray-400"}
        />
      </button>
      <div className="locationItemDesc">
        <p className="location">{smart_location}</p>
        <p className="name">{name}</p>
        <p className="price">
          ₹&nbsp;{price}&nbsp;
          <span>night</span>
        </p>
      </div>
    </Link>
  );
}

export default HotelCard;
