import { useEffect } from "react";
import HotelCard from "./HotelCard";
import useFirestoreHotels from "../../hooks/useFirestoreHotels";
import HeroSection from "../HeroSection";
import Loader from "../Loader/Loader";

export default function HotelsList({ query }) {
  const { isLoading, data } = useFirestoreHotels(query);
  if (!isLoading) {
    console.log("Hotel data:", data);
  }
  if (isLoading) {
    return <Loader message="Loading hotels..." />;
  }

  return (
    <>
      <HeroSection />
      <section className="nearbyLocation mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Nearby Locations
        </h2>
        <div className="locationList">
          {data.map((hotel) => (
            <HotelCard
              key={hotel.id}
              id={hotel.id}
              name={hotel.name}
              url={hotel.listing_url}
              price={hotel.price}
              smart_location={hotel.smart_location}
              medium_url={hotel.medium_url}
            />
          ))}
        </div>
      </section>
    </>
  );
}
