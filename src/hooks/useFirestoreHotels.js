import { useEffect, useState } from "react";
import { fetchHotelsFromFirestore } from "../services/firebase";

export default function useFirestoreHotels(query = "") {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchHotelsFromFirestore(query)
      .then((hotels) => {
        if (hotels && hotels.length > 0) {
          setData(hotels);
        } else {
          // If Firestore empty, show localStorage
          const localHotels = JSON.parse(localStorage.getItem("localHotels") || "[]");
          setData(localHotels);
        }
      })
      .catch(() => {
        // On error, show localStorage
        const localHotels = JSON.parse(localStorage.getItem("localHotels") || "[]");
        setData(localHotels);
      })
      .finally(() => setIsLoading(false));
  }, [query]);

  return { isLoading, data };
}