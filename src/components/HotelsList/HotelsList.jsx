import { useEffect } from "react";
import HotelCard from "./HotelCard";

import useFirestoreHotels from "../../hooks/useFirestoreHotels";
import Map from "../map/Map";

export default function HotelsList({ query }) {
  const { isLoading, data } = useFirestoreHotels(query);
  if (isLoading) {
    return <p>Loading ...</p>;
  }

  return (
    <div className="nearbyLocation">
      <h2>Nearby Locations</h2>
      <div className="locationList">
        {!isLoading &&
          data.map((hotel) => {
            return (
              <HotelCard
                key={hotel.id}
                id={hotel.id}
                name={hotel.name}
                url={hotel.listing_url}
                price={hotel.price}
                smart_location={hotel.smart_location}
                medium_url={hotel.medium_url}
              />
            );
          })}
      </div>
      {/* Show all hotels on a map below the list */}
      {!isLoading && data.length > 0 && (
        <div className="mt-8">
          <Map locations={data} />
        </div>
      )}
    </div>
  );
}
