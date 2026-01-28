import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const BookmarkContext = createContext();
const BOOKMARK_URL = "http://localhost:5000/bookmarks";

export default function BookmarksProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(BOOKMARK_URL)
      .then((res) => setBookmarks(res.data))
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div>Loading...</div>;

  async function addBookmark(newBookmark) {
    try {
      const { data } = await axios.post(BOOKMARK_URL, newBookmark);
      setBookmarks((prev) => [...prev, data]);
      toast.success("Bookmark added!");
    } catch (error) {
      toast.error("Couldn't save your bookmark!");
      // log removed
    }
  }

  function getBookmark(id) {
    const bookmark = bookmarks.find(
      (bookmark) => bookmark.id.toString() === id,
    );
    return bookmark;
  }

  async function deleteBookmark(id) {
    try {
      await axios.delete(`${BOOKMARK_URL}/${id}`);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      toast.success("Bookmark deleted!");
    } catch (error) {
      toast.error("Couldn't delete bookmark!");
      // log removed
    }
  }

  return (
    <BookmarkContext.Provider
      value={{ bookmarks, addBookmark, getBookmark, deleteBookmark }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  return useContext(BookmarkContext);
}
