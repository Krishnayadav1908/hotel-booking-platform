import { Toaster } from "react-hot-toast";
import "./App.css";
import Header from "./components/Header/Header";
import HotelsList from "./components/HotelsList/HotelsList";
import { Navigate, Route, Routes } from "react-router-dom";
import ErrorPage from "./components/Pages/ErrorPage";
import SearchLayout from "./components/Layouts/SearchLayout";
import Hotels from "./components/Search/Hotels";

import Provider from "./components/Provider/Provider";
import SingleHotel from "./components/HotelsList/SingleHotel";
import BookmarkLayout from "./components/BookmarkLayout/BookmarkLayout";
import BookmarkList from "./components/Bookmark/BookmarkList";
import SingleBookmark from "./components/Bookmark/SingleBookmark";
import AddBookmarks from "./components/Bookmark/AddBookmarks";

function App() {
  return (
    <div>
        <Toaster />
        <Header />
      <Provider>
        <Routes>
          <Route path="/" element={<HotelsList />} />
          <Route path="/search" element={<SearchLayout />}>
            <Route index element={<Hotels />} />
            <Route path="Hotels/:id" element={<SingleHotel />} />
          </Route>
          <Route path="/bookmark" element={<BookmarkLayout />}>
            <Route index element={<BookmarkList />} />
            <Route path=":id" element={<SingleBookmark />} />
            <Route path="add" element={<AddBookmarks /> } />
          </Route>
          {/* <Route path="/404" element={<ErrorPage />} />
          <Route path="*" element={<Navigate to="/404" />} /> */}
        </Routes>
      </Provider>
    </div>
  );
}

export default App;
