import { createContext, useContext, useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { toast } from "react-hot-toast";

const BookmarkContext = createContext();
const BOOKMARK_URL = "http://localhost:5000/bookmarks"

export default function BookmarksProvider({ children }) {
  let {isLoading, data: bookmarks} = useFetch(BOOKMARK_URL);
  if (isLoading) return <div>Loading...</div>;
  
  
  function addBookmark(newBookmark) {
    axios
      .post(BOOKMARK_URL, newBookmark)
      .then((response) => {})
      .catch((error) => {
        toast.error("couldn't save your bookmark!");
        console.log(error.response.data);
      });
  }

  function getBookmark(id) {
    const bookmark = data.find(
      (bookmark) => bookmark.id.toString() === id
    );

    return bookmark;
  }

  function deleteBookmark(id) {
    axios.delete(`${BOOKMARK_URL}/${id}`).catch((error)=>{
      toast.error("couldn't delete bookmark!");
      console.log(error.response.data);
    })

  }

  return (
    <BookmarkContext.Provider value={{bookmarks, addBookmark, getBookmark, deleteBookmark}}>
      {children}
    </BookmarkContext.Provider>
  );
} 

export function useBookmarks() {
  return useContext(BookmarkContext);
}
