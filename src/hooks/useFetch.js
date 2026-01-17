import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function useFetch(url, query = "") {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${url}?${query}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [url, query]);

  return {isLoading, data};
}
