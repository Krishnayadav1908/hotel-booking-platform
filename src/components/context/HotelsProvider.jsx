import { createContext, useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useFirestoreHotels from "../../hooks/useFirestoreHotels";

const HotelsContext = createContext();

export default function HotelsProvider({ children }) {
  const [current, setCurrent] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const destination = searchParams.get("destination");
  const room = JSON.parse(searchParams.get("options"))?.room;
  const { isLoading, data } = useFirestoreHotels(destination || "");

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  function currentHotel(singleHotel) {
    setCurrent(singleHotel);
  }
  return (
    <HotelsContext.Provider value={[isLoading, data, currentHotel, current]}>
      {children}
    </HotelsContext.Provider>
  );
}

export function useHotels() {
  return useContext(HotelsContext);
}
