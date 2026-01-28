import { Outlet, useLocation } from "react-router-dom";
import Map from "../map/Map";
import { useHotels } from "../context/HotelsProvider";

export default function SearchLayout() {
  const [isLoading, data] = useHotels();
  const { pathname } = useLocation();

  const locations = pathname === "/search" ? data : []; // Pass all hotels only on /search route

  return (
    <div className="appLayout">
      <div className="sidebar">
        <Outlet />
      </div>
      <Map locations={locations} />
    </div>
  );
}
