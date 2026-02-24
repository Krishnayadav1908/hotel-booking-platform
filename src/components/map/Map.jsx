import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useGeoLocation from "../../hooks/useGeoLocation";
import { useBookmarks } from "../context/BookmarksProvider";

export default function Map({ locations }) {
  // Always center on the first hotel
  const mapCenter =
    locations && locations.length > 0
      ? [parseFloat(locations[0].latitude), parseFloat(locations[0].longitude)]
      : [20.5937, 78.9629]; // India center

  return (
    <div className="mapContainer">
      <MapContainer
        className="map"
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations &&
          locations.map((hotel) => {
            const lat = parseFloat(hotel.latitude);
            const lng = parseFloat(hotel.longitude);
            console.log("Marker:", hotel.name, lat, lng);
            if (isNaN(lat) || isNaN(lng)) return null;
            return (
              <Marker key={hotel.id} position={[lat, lng]}>
                <Popup>
                  <div className="flex flex-col items-center justify-center">
                    <p className="font-bold">{hotel.name}</p>
                    <p className="text-xs">{hotel.smart_location}</p>
                    <p className="text-xs text-green-600">
                      ₹{hotel.price}/night
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function AddBookmarkOnMap() {
  const navigate = useNavigate();
  const [latlng, setLatlng] = useState({});
  useMapEvent({
    click: (e) => {
      setLatlng(e.latlng);
      navigate(`/bookmark?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });

  function name(params) {
    navigate(`add?lat=${latlng.lat}&lng=${latlng.lng}`);
  }
  return (
    <>
      {latlng.lat && (
        <Marker position={[latlng.lat, latlng.lng]}>
          <Popup closeButton={closePopup}>
            <div className="flex flex-col items-center justify-center">
              <button
                className="rounded-md px-2 py-1 bg-purple-600 text-white font-bold"
                onClick={name}
              >
                add bookmark
              </button>
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
}

function BookmarkBounds({ bookmarks }) {
  const map = useMap();
  const [bookmarksLatLng, setBookmarksLatLng] = useState([]);
  useEffect(() => {
    if (bookmarks) {
      bookmarks.map((bookmark) => {
        setBookmarksLatLng((prevState) => [
          ...prevState,
          [bookmark.latitude, bookmark.longitude],
        ]);
      });
    }
  }, []);

  if (bookmarksLatLng[0]) {
    map.fitBounds(bookmarksLatLng);
  }
}

export function closePopup(params) {
  return true;
}
