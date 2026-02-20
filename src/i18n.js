import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Hotel Booking Platform!",
      "search_results": "Search Results",
      "nearby_locations": "Nearby Locations",
      "book_this_hotel": "Book This Hotel",
      "my_wishlist": "My Wishlist",
      "my_bookings": "My Bookings",
      "admin_dashboard": "Admin Dashboard",
      "profile": "Profile",
      "login": "Login",
      "signup": "Sign Up",
      "logout": "Logout"
    }
  },
  hi: {
    translation: {
      "welcome": "होटल बुकिंग प्लेटफ़ॉर्म में आपका स्वागत है!",
      "search_results": "खोज परिणाम",
      "nearby_locations": "नज़दीकी स्थान",
      "book_this_hotel": "इस होटल को बुक करें",
      "my_wishlist": "मेरी पसंदीदा सूची",
      "my_bookings": "मेरी बुकिंग्स",
      "admin_dashboard": "प्रशासन डैशबोर्ड",
      "profile": "प्रोफ़ाइल",
      "login": "लॉगिन",
      "signup": "साइन अप",
      "logout": "लॉगआउट"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
