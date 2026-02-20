import WishlistPage from "./components/Wishlist/WishlistPage";
{
  /* Wishlist - Protected */
}
<Route
  path="/wishlist"
  element={
    <ProtectedRoute>
      <WishlistPage />
    </ProtectedRoute>
  }
/>;
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Header from "./components/Header/Header";
import { NotificationProvider } from "./components/common/NotificationProvider";
import { WishlistProvider } from "./components/context/WishlistProvider";
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

// Auth imports
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

import MyBookings from "./components/Booking/MyBookings";
import AuthProvider from "./components/context/AuthProvider";

import UserProfile from "./components/UserProfile/UserProfile";
import AdminDashboard from "./components/Admin/AdminDashboard";
import CookieConsent from "./components/common/CookieConsent";
import ChatWidget from "./components/common/ChatWidget";
{
  /* Admin Dashboard - Protected */
}
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>;

function App() {
  return (
    <>
      <AuthProvider>
        <WishlistProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: "#333",
                    color: "#fff",
                  },
                }}
              />
              <Header />
              <Provider>
                <Routes>
                  <Route path="/" element={<HotelsList />} />

                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  {/* Search Routes */}
                  <Route path="/search" element={<SearchLayout />}>
                    <Route index element={<Hotels />} />
                    <Route path="Hotels/:id" element={<SingleHotel />} />
                  </Route>

                  {/* Bookmark Routes - Protected */}
                  <Route
                    path="/bookmark"
                    element={
                      <ProtectedRoute>
                        <BookmarkLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<BookmarkList />} />
                    <Route path=":id" element={<SingleBookmark />} />
                    <Route path="add" element={<AddBookmarks />} />
                  </Route>

                  {/* My Bookings - Protected */}
                  <Route
                    path="/my-bookings"
                    element={
                      <ProtectedRoute>
                        <MyBookings />
                      </ProtectedRoute>
                    }
                  />

                  {/* User Profile - Protected */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Error Routes */}
                  <Route path="/404" element={<ErrorPage />} />
                  <Route path="*" element={<Navigate to="/404" />} />
                </Routes>
              </Provider>
            </div>
          </NotificationProvider>
        </WishlistProvider>
      </AuthProvider>
      <ChatWidget />
      <CookieConsent />
    </>
  );
}

export default App;
