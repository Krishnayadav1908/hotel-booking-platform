import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function useMyFetch(url, query = "") {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  async function name(params) {

      await axios
      .get(`${url}?${query}`)
      .then((response) => {
        setData(response);
      })
      .catch((err) => {
      toast.error(err.message);
    })
    .finally(() => setIsLoading(false));

    
  }
  
  if (!isLoading) {
    console.log(data);
    return data;
  }
}
