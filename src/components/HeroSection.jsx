import React, { useState, useContext } from "react";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { AuthContext } from "./context/AuthProvider";

export default function HeroSection() {
  const { user, loading } = useContext(AuthContext);
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!destination.trim()) return;

    const params = createSearchParams({ destination });

    navigate({
      pathname: "/search",
      search: params.toString(),
    });
  };

  return (
    <section
      className="relative overflow-hidden w-full min-h-[32vh] py-8 text-center 
      bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900"
    >
      {/* Softer Glow Effects */}
      <div className="absolute top-[-80px] left-[-80px] w-[250px] h-[250px] bg-purple-500 opacity-10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-[250px] h-[250px] bg-pink-500 opacity-10 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Heading */}
        <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
          Your Next Unforgettable Stay
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            Starts Here.
          </span>
        </h1>

        <p className="text-sm md:text-base text-gray-300 mb-6 max-w-xl mx-auto">
          Luxury stays. Instant booking. Zero hassle.
        </p>

        {/* Search Bar */}
        <div
          className="flex items-center border border-white/20 bg-white/5 backdrop-blur-md 
          rounded-full overflow-hidden shadow-lg max-w-xl mx-auto mb-8 
          focus-within:ring-2 focus-within:ring-purple-500 transition"
        >
          <input
            type="text"
            placeholder="Where do you want to go?"
            className="bg-transparent outline-none flex-1 px-4 py-3 text-white placeholder-gray-400 text-sm"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-pink-500 to-purple-600 
            text-white px-4 py-3 hover:opacity-90 transition duration-300 
            flex items-center justify-center"
          >
            <FaSearch className="text-sm" />
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 flex-wrap mb-10">
          <Link
            to="/search"
            className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500
            hover:opacity-90 text-white font-medium tracking-wide
            px-6 py-2 rounded-full shadow-md transition duration-300 text-sm"
          >
            Explore Now
          </Link>

          {!loading && (
            <>
              {!user ? (
                <Link
                  to="/signup"
                  className="border border-white/40 text-white
                  px-6 py-2 rounded-full
                  hover:bg-white hover:text-black
                  transition duration-300 text-sm"
                >
                  Create Account
                </Link>
              ) : (
                <Link
                  to="/profile"
                  className="border border-white/40 text-white
                  px-6 py-2 rounded-full
                  hover:bg-white hover:text-black
                  transition duration-300 text-sm"
                >
                  My Profile
                </Link>
              )}
            </>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Feature icon="🏨" title="Top Hotels" desc="Curated stays." />
          <Feature icon="🔒" title="Secure Booking" desc="Safe payments." />
          <Feature icon="🌍" title="Global Access" desc="100+ countries." />
          <Feature icon="💬" title="24/7 Support" desc="Always here." />
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center group">
      <span className="text-2xl mb-2 group-hover:scale-110 transition">
        {icon}
      </span>
      <h4 className="font-medium text-white text-sm mb-1">{title}</h4>
      <p className="text-xs text-gray-400">{desc}</p>
    </div>
  );
}
