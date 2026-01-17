import { Outlet } from "react-router-dom";
import Map from "../map/Map";
import { useHotels } from "../context/HotelsProvider";

export default function SearchLayout() {
  const [isLoading, data] = useHotels();

  return (
    <div className="appLayout">
      <div className="sidebar">
        <Outlet />
      </div>
      <Map locations={data}/>
    </div>
  )
}
