import { Link } from "react-router-dom";

import { useHotels } from "../context/HotelsProvider";
import { useState } from "react";
import SearchFilters from "./SearchFilters";

export default function Hotels() {
  const [isLoading, data, currentHotel, current] = useHotels();
  const [filters, setFilters] = useState(null);
  const [filteredHotels, setFilteredHotels] = useState(null);

  function handleFilter(filterObj) {
    setFilters(filterObj);
    let filtered = data;
    if (filterObj.priceRange) {
      filtered = filtered.filter(
        (h) =>
          h.price >= filterObj.priceRange[0] &&
          h.price <= filterObj.priceRange[1],
      );
    }
    if (filterObj.rating) {
      filtered = filtered.filter((h) => (h.rating || 0) >= filterObj.rating);
    }
    if (filterObj.propertyType) {
      filtered = filtered.filter(
        (h) => (h.property_type || "").toLowerCase() === filterObj.propertyType,
      );
    }
    if (filterObj.amenities && filterObj.amenities.length > 0) {
      filtered = filtered.filter((h) =>
        filterObj.amenities.every((a) =>
          (h.amenities || []).map((x) => x.toLowerCase()).includes(a),
        ),
      );
    }
    setFilteredHotels(filtered);
  }

  function handleReset() {
    setFilters(null);
    setFilteredHotels(null);
  }

  if (isLoading) {
    return <div>searching hotels ...</div>;
  }

  const hotelsToShow = filteredHotels || data;

  return (
    <div className="searchList">
      <div className="mb-4">
        <SearchFilters onFilter={handleFilter} onReset={handleReset} />
      </div>
      <h2>Search Results ({hotelsToShow.length})</h2>
      {hotelsToShow.map((hotel) => {
        return (
          <Link
            key={hotel.id}
            to={`hotels/${hotel.id}?lat=${hotel.latitude}&lng=${hotel.longitude}`}
          >
            <div
              className={`searchItem ${hotel.id === current.id ? "border border-solid border-purple-300 p-4 rounded-3xl" : ""}`}
            >
              <img src={hotel.medium_url} alt="" />
              <div className="searchItemDesc">
                <p className="location">{hotel.smart_location}</p>
                <p className="name">{hotel.name}</p>
                <p className="price">
                  ₹&nbsp;{hotel.price}&nbsp;
                  <span>night</span>
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
