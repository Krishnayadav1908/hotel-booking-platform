import React, { useEffect, useState } from "react";

const COOKIE_KEY = "cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 flex flex-col md:flex-row items-center justify-between z-50">
      <span>
        This website uses cookies to enhance the user experience. See our{" "}
        <a
          href="/privacy-policy.html"
          className="underline text-blue-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
        .
      </span>
      <button
        className="mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold ml-0 md:ml-4"
        onClick={acceptCookies}
      >
        Accept
      </button>
    </div>
  );
}
