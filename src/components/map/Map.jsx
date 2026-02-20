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

export default function Map({ locations, selectedHotelId }) {
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India center
  const { bookmarks } = useBookmarks();
  const [searchParams, setSearchParams] = useSearchParams();
  const latitude = searchParams.get("lat");
  const longitude = searchParams.get("lng");
  const { pathname } = useLocation();

  const updateMapCenterById = useCallback(() => {
    if (selectedHotelId && locations) {
      const selectedHotel = locations.find(
        (hotel) => hotel.id === selectedHotelId,
      );
      if (selectedHotel) {
        const lat = parseFloat(selectedHotel.latitude);
        const lng = parseFloat(selectedHotel.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          setMapCenter([lat, lng]);
        }
      }
    }
  }, [selectedHotelId, locations]);

  useEffect(() => {
    updateMapCenterById();
  }, [updateMapCenterById]);

  useEffect(() => {
    if (latitude && longitude)
      setMapCenter([parseFloat(latitude), parseFloat(longitude)]);
  }, [longitude, latitude]);

  useEffect(() => {
    if (locations && locations.length > 0 && !latitude && !longitude) {
      const firstHotel = locations[0];
      const lat = parseFloat(firstHotel.latitude);
      const lng = parseFloat(firstHotel.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter([lat, lng]);
      }
    }
  }, [locations, latitude, longitude]);

  useEffect(() => {
    if (locations && locations.length === 1) {
      const selectedHotel = locations[0];
      const lat = parseFloat(selectedHotel.latitude);
      const lng = parseFloat(selectedHotel.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter([lat, lng]);
        return; // Ensure no other logic overrides this
      }
    }
  }, [locations]);

  useEffect(() => {
    if (locations && locations.length > 1) {
      setMapCenter([
        parseFloat(locations[0].latitude),
        parseFloat(locations[0].longitude),
      ]);
    }
  }, [locations]);

  const {
    position: userPosition,
    isLoading: positionIsLoading,
    getUserLocation,
  } = useGeoLocation();

  useEffect(() => {
    if (userPosition?.lat && userPosition?.lng) {
      setMapCenter([userPosition.lat, userPosition.lng]);
    }
  }, [userPosition]);

  return (
    <div className="mapContainer">
      <MapContainer
        className="map"
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
      >
        <button className="getLocation" onClick={getUserLocation}>
          {positionIsLoading ? "Loading ..." : "my Location"}
        </button>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddBookmarkOnMap />
        <ChangeCenter position={mapCenter} />
        {pathname === "/bookmark" && latitude == null && (
          <BookmarkBounds bookmarks={bookmarks} />
        )}
        {locations &&
          locations.map((hotel) => {
            const lat = parseFloat(hotel.latitude);
            const lng = parseFloat(hotel.longitude);
            if (isNaN(lat) || isNaN(lng)) return null;
            // Highlight marker if selected
            const isSelected = selectedHotelId && hotel.id === selectedHotelId;
            return (
              <Marker key={hotel.id} position={[lat, lng]}>
                <Popup>
                  <div className="flex flex-col items-center justify-center">
                    <p className="font-bold">{hotel.name}</p>
                    <p className="text-xs">{hotel.smart_location}</p>
                    <p className="text-xs text-green-600">
                      ₹{hotel.price}/night
                    </p>
                    {isSelected && (
                      <span className="text-purple-600 font-bold">
                        Selected
                      </span>
                    )}
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
