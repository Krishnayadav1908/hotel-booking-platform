import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

/* Layout & Providers */
import Header from "./components/Header/Header";
import Provider from "./components/Provider/Provider";
import AuthProvider from "./components/context/AuthProvider";
import { WishlistProvider } from "./components/context/WishlistProvider";
import { NotificationProvider } from "./components/common/NotificationProvider";

/* Pages */
import HotelsList from "./components/HotelsList/HotelsList";
import ErrorPage from "./components/Pages/ErrorPage";
import SearchLayout from "./components/Layouts/SearchLayout";
import Hotels from "./components/Search/Hotels";
import SingleHotel from "./components/HotelsList/SingleHotel";

import BookmarkLayout from "./components/BookmarkLayout/BookmarkLayout";
import BookmarkList from "./components/Bookmark/BookmarkList";
import SingleBookmark from "./components/Bookmark/SingleBookmark";
import AddBookmarks from "./components/Bookmark/AddBookmarks";

import WishlistPage from "./components/Wishlist/WishlistPage";
import MyBookings from "./components/Booking/MyBookings";
import UserProfile from "./components/UserProfile/UserProfile";
import AdminDashboard from "./components/Admin/AdminDashboard";

/* Auth */
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

/* Common */
import CookieConsent from "./components/common/CookieConsent";

import AddHotel from "./components/Admin/AddHotel";
import ChatWidget from "./components/common/ChatWidget";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <WishlistProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Toast Notifications */}
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

            {/* Hide Header on Admin Page */}
            {!isAdminRoute && <Header />}

            <Provider>
              <Routes>
                {/* Home */}
                <Route path="/" element={<HotelsList />} />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Wishlist - Protected */}
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <WishlistPage />
                    </ProtectedRoute>
                  }
                />

                {/* Search */}
                <Route path="/search" element={<SearchLayout />}>
                  <Route index element={<Hotels />} />
                  <Route path="hotels/:id" element={<SingleHotel />} />
                </Route>

                {/* Bookmarks - Protected */}
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

                {/* Admin - Protected */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Add Hotel - Protected */}
                <Route
                  path="/add-hotel"
                  element={
                    <ProtectedRoute>
                      <AddHotel />
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route path="/404" element={<ErrorPage />} />
                <Route path="*" element={<Navigate to="/404" />} />
              </Routes>
            </Provider>
          </div>

          {/* Global Widgets */}
          <ChatWidget />
          <CookieConsent />
        </NotificationProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
