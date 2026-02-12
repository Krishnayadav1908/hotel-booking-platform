import { useEffect, useState } from "react";
import { fetchHotelsFromFirestore } from "../services/firebase";

export default function useFirestoreHotels(query = "") {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchHotelsFromFirestore(query)
      .then((hotels) => setData(hotels))
      .catch(() => setData([]))
      .finally(() => setIsLoading(false));
  }, [query]);

  return { isLoading, data };
}