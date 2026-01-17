import BookmarksProvider from "../context/BookmarksProvider";
import HotelsProvider from "../context/HotelsProvider";

export default function Provider({children}) {
  return (
    <HotelsProvider>
      <BookmarksProvider>
        {children}
      </BookmarksProvider>
    </HotelsProvider>
  )
}