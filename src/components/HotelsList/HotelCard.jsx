import { Link } from "react-router-dom";

export default function HotelCard({
  name,
  id,
  medium_url,
  smart_location,
  price,
}) {
  return (
    <Link to={`/search/Hotels/${String(id)}`} className="locationItem">
      <img src={medium_url} alt={name} />
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
