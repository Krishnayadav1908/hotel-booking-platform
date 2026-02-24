import { Outlet, useLocation } from "react-router-dom";
export default function SearchLayout() {
  // const [isLoading, data] = useHotels(); // Removed: hook does not exist
  const location = useLocation();
  // Only show map on /search and /search?..., not on /search/Hotels/:id
  const isSingleHotel = /\/search\/Hotels\//.test(location.pathname);
  return (
    <div className="appLayout" style={{ display: "flex", gap: "2rem" }}>
      <div style={{ flex: 2 }}>
        <Outlet />
      </div>
      {/* Map display removed due to missing useHotels hook */}
      {/* Add back when correct data source is available */}
    </div>
  );
}
