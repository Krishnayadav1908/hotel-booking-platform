import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "info") => {
    setNotifications((prev) => [...prev, { id: Date.now(), message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 3500);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`px-4 py-2 rounded shadow text-white ${
              n.type === "success"
                ? "bg-green-600"
                : n.type === "error"
                  ? "bg-red-600"
                  : "bg-blue-600"
            }`}
          >
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
