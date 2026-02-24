import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider.jsx";

import { toast } from "react-hot-toast";
import { db } from "../../services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const BookmarkContext = createContext();

export default function BookmarksProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function fetchBookmarks() {
      setIsLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "bookmarks"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookmarks(data);
      } catch (err) {
        // Only show error if user is authenticated
        if (isAuthenticated) toast.error("Failed to fetch bookmarks");
      } finally {
        setIsLoading(false);
      }
    }
    if (isAuthenticated) {
      fetchBookmarks();
    } else {
      setBookmarks([]);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  if (isLoading) return <div>Loading...</div>;

  async function addBookmark(newBookmark) {
    try {
      const docRef = await addDoc(collection(db, "bookmarks"), newBookmark);
      setBookmarks((prev) => [...prev, { id: docRef.id, ...newBookmark }]);
      toast.success("Bookmark added!");
    } catch (error) {
      toast.error("Couldn't save your bookmark!");
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
      await deleteDoc(doc(db, "bookmarks", id));
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      toast.success("Bookmark deleted!");
    } catch (error) {
      toast.error("Couldn't delete bookmark!");
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
