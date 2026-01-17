import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useBookmarks } from "../context/BookmarksProvider";
import { useEffect, useId, useState } from "react";
import {v4 as uuidv4} from 'uuid';


export default function AddBookmarks() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cityNameState, setCityNameState] = useState("");
  const [countryNameState, setCountryNameState] = useState("");
  const {addBookmark} = useBookmarks();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const {isLoading, data} = useFetch(
    "https://api.bigdatacloud.net/data/reverse-geocode-client",
    `latitude=${lat}&longitude=${lng}`
  );

  useEffect(() => {
    if (data) {
      setCityNameState(locationData.city);
      setCountryNameState(locationData.countryName);
    }
  }, [data]);

  if (isLoading) return <div>Loading ...</div>;

  const locationData = data;

  function handleSubmit(e) {
    e.preventDefault();
    
    const newBookmark = {
      cityName: cityNameState || locationData.locality,
      countryName: countryNameState,
      countryCode: locationData.countryCode,
      latitude: `${locationData.latitude}`,
      longitude: `${locationData.longitude}`,
      host_location: locationData.city + " " + locationData.countryName,
      id: uuidv4(),
    };

    addBookmark(newBookmark);
    navigate("/bookmark");
  }

  return (
    <div className="capitalize">
      <h2 className="font-bold">add bookmark</h2>
      <form className="mt-2 [&>div>label]:text-sm" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="">city:</label>
          <input
            className="border-b border-0 border-solid mt-2"
            type="text"
            required
            value={cityNameState}
            onChange={(e) => setCityNameState(e.target.value)}
          />
        </div>
        <div className="flex flex-col mt-4">
          <label>country:</label>
          <input
            className="border-b border-0 border-solid mt-2"
            type="text"
            required
            value={countryNameState}
            onChange={(e) => setCountryNameState(e.target.value)}
          />
        </div>
        <div className="mt-5 flex justify-between">
          <button
            onClick={() => {
              navigate(-1);
            }}
            type="button"
            className="border	border-slate-400 border-solid rounded-md flex space-x-1 items-center p-0.5 px-1"
          >
            <FontAwesomeIcon icon={faAnglesLeft} size="xs" />
            <p>Back</p>
          </button>
          <button className="bg-purple-600 text-white px-3 py-0.5 rounded-md">
            save
          </button>
        </div>
      </form>
    </div>
  );
}
