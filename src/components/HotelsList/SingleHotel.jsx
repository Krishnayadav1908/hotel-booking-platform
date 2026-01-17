import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useHotels } from "../context/HotelsProvider";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";

export default function SingleHotel() {
  const navigate = useNavigate();
  const hotelId = useParams().id;
  const [isLoading, data, currentHotel, current] = useHotels();
  if (isLoading) {
    return <div>lodaing ...</div>;
  }

  const singleHotel = data.find((hotel) => {
    return hotel.id === hotelId;
  });
  useEffect(() => {
    currentHotel(singleHotel);
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          navigate(-1);
        }}
        className="border	border-slate-400 border-solid rounded-md flex space-x-1 items-center p-0.5 px-1"
      >
        <FontAwesomeIcon icon={faAnglesLeft} size="xs" />
        <p>Back</p>
      </button>
      <div className="text-sm mt-4">
        <h4 className="font-bold">{singleHotel.name}</h4>
        <div className="flex text-xs mt-1">
          <p>{singleHotel.number_of_reviews} reviews &bull; </p>
          <p className="pl-1">{singleHotel.host_location}</p>
        </div>
        <img
          className="rounded-xl mt-2 w-full"
          src={singleHotel.medium_url}
          alt=""
        />
      </div>
    </div>
  );
}
