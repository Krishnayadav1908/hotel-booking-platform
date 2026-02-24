import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthProvider";
import { db } from "../../services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  FaHotel,
  FaUser,
  FaBook,
  FaStar,
  FaChartBar,
  FaPlus,
  FaFileExport,
  FaBell,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

/* ================= TABS ================= */

const TABS = [
  "Hotels",
  "Bookings",
  "Users",
  "Reviews",
  "Manage Hotels",
  "Analytics",
  "Export Data",
  "Notifications",
];

const TAB_ICONS = {
  Hotels: <FaHotel className="inline mr-2" />,
  Bookings: <FaBook className="inline mr-2" />,
  Users: <FaUser className="inline mr-2" />,
  Reviews: <FaStar className="inline mr-2" />,
  "Manage Hotels": <FaPlus className="inline mr-2" />,
  Analytics: <FaChartBar className="inline mr-2" />,
  "Export Data": <FaFileExport className="inline mr-2" />,
  Notifications: <FaBell className="inline mr-2" />,
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const adminEmail = "krishna987@gmail.com";

  const [tab, setTab] = useState("Hotels");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [hotelForm, setHotelForm] = useState({
    name: "",
    city: "",
    price: "",
  });

  const [editHotel, setEditHotel] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    city: "",
    price: "",
  });

  /* ================= ACCESS ================= */

  if (!user || user.email !== adminEmail) {
    return (
      <div className="p-10 text-center text-red-600 text-xl font-bold">
        Access Denied
      </div>
    );
  }

  /* ================= FETCH ================= */

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const [h, b, u, r] = await Promise.all([
        getDocs(collection(db, "hotels")),
        getDocs(collection(db, "bookings")),
        getDocs(collection(db, "users")),
        getDocs(collection(db, "reviews")),
      ]);

      setHotels(h.docs.map((d) => ({ id: d.id, ...d.data() })));
      setBookings(b.docs.map((d) => ({ id: d.id, ...d.data() })));
      setUsers(u.docs.map((d) => ({ id: d.id, ...d.data() })));
      setReviews(r.docs.map((d) => ({ id: d.id, ...d.data() })));

      setLoading(false);
    }

    fetchData();
  }, []);

  /* ================= SEARCH FILTER ================= */

  const filterData = (data) => {
    return data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  };

  const filteredHotels = useMemo(() => filterData(hotels), [search, hotels]);
  const filteredBookings = useMemo(
    () => filterData(bookings),
    [search, bookings],
  );
  const filteredUsers = useMemo(() => filterData(users), [search, users]);
  const filteredReviews = useMemo(() => filterData(reviews), [search, reviews]);

  /* ================= HIGHLIGHT FUNCTION ================= */

  const highlightText = (text) => {
    if (!search) return text;

    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.toString().split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="bg-yellow-300 font-semibold">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  /* ================= CALCULATIONS ================= */

  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.totalPrice || 0),
    0,
  );

  /* ================= HOTEL ACTIONS ================= */

  const handleAddHotel = async (e) => {
    e.preventDefault();

    const docRef = await addDoc(collection(db, "hotels"), {
      name: hotelForm.name,
      city: hotelForm.city,
      price: Number(hotelForm.price),
    });

    setHotels([
      { id: docRef.id, ...hotelForm, price: Number(hotelForm.price) },
      ...hotels,
    ]);

    setHotelForm({ name: "", city: "", price: "" });
    toast.success("Hotel added!");
  };

  const handleDeleteHotel = async (id) => {
    await deleteDoc(doc(db, "hotels", id));
    setHotels(hotels.filter((h) => h.id !== id));
    toast.success("Hotel deleted!");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    await updateDoc(doc(db, "hotels", editHotel.id), {
      name: editForm.name,
      city: editForm.city,
      price: Number(editForm.price),
    });

    setHotels(
      hotels.map((h) =>
        h.id === editHotel.id
          ? { ...h, ...editForm, price: Number(editForm.price) }
          : h,
      ),
    );

    setEditHotel(null);
    toast.success("Hotel updated!");
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
            {user.email}
          </span>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Revenue"
            value={`₹${totalRevenue}`}
            icon={<FaChartBar />}
          />
          <StatCard title="Users" value={users.length} icon={<FaUser />} />
          <StatCard title="Hotels" value={hotels.length} icon={<FaHotel />} />
          <StatCard title="Reviews" value={reviews.length} icon={<FaStar />} />
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-3 mb-4">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg ${
                tab === t
                  ? "bg-purple-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {TAB_ICONS[t]} {t}
            </button>
          ))}
        </div>

        {/* SEARCH BAR */}
        {["Hotels", "Bookings", "Users", "Reviews", "Manage Hotels"].includes(
          tab,
        ) && (
          <div className="mb-4 flex items-center bg-white p-2 rounded shadow">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* CONTENT */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {tab === "Hotels" && (
            <Table
              data={filteredHotels}
              columns={["name", "city", "price"]}
              highlightText={highlightText}
            />
          )}

          {tab === "Bookings" && (
            <Table
              data={filteredBookings}
              columns={["userEmail", "hotelName", "totalPrice"]}
              highlightText={highlightText}
            />
          )}

          {tab === "Users" && (
            <Table
              data={filteredUsers}
              columns={["name", "email"]}
              highlightText={highlightText}
            />
          )}

          {tab === "Reviews" && (
            <Table
              data={filteredReviews}
              columns={["rating", "comment"]}
              highlightText={highlightText}
            />
          )}

          {tab === "Manage Hotels" && (
            <>
              {/* Show edit form if editing */}
              {editHotel ? (
                <form onSubmit={handleEditSubmit} className="flex gap-3 mb-6">
                  <input
                    placeholder="Name"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                    required
                  />
                  <input
                    placeholder="City"
                    value={editForm.city}
                    onChange={(e) =>
                      setEditForm({ ...editForm, city: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                    required
                  />
                  <button className="bg-green-600 text-white px-4 rounded">
                    Update
                  </button>
                  <button
                    type="button"
                    className="bg-gray-400 text-white px-4 rounded"
                    onClick={() => setEditHotel(null)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAddHotel} className="flex gap-3 mb-6">
                  <input
                    placeholder="Name"
                    value={hotelForm.name}
                    onChange={(e) =>
                      setHotelForm({ ...hotelForm, name: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                    required
                  />
                  <input
                    placeholder="City"
                    value={hotelForm.city}
                    onChange={(e) =>
                      setHotelForm({ ...hotelForm, city: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={hotelForm.price}
                    onChange={(e) =>
                      setHotelForm({ ...hotelForm, price: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                    required
                  />
                  <button className="bg-purple-600 text-white px-4 rounded">
                    Add
                  </button>
                </form>
              )}

              {filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="flex justify-between border-b py-2"
                >
                  {highlightText(hotel.name)} - {highlightText(hotel.city)} - ₹
                  {highlightText(hotel.price)}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditHotel(hotel);
                        setEditForm(hotel);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteHotel(hotel.id)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === "Analytics" && (
            <div>
              <p>Total Revenue: ₹{totalRevenue}</p>
              <p>Total Bookings: {bookings.length}</p>
            </div>
          )}

          {tab === "Export Data" && (
            <button className="bg-green-600 text-white px-4 py-2">
              Export Data
            </button>
          )}

          {tab === "Notifications" && <p>No new notifications.</p>}
        </div>
      </div>
    </div>
  );
};

/* ===== STAT CARD ===== */
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center">
    <div>
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-2xl font-bold text-purple-600">{value}</div>
    </div>
    <div className="text-purple-500 text-2xl">{icon}</div>
  </div>
);

/* ===== TABLE ===== */
const Table = ({ data, columns, highlightText }) => (
  <table className="min-w-full">
    <thead>
      <tr className="bg-gray-100">
        {columns.map((col) => (
          <th key={col} className="p-3 text-left capitalize">
            {col}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((item) => (
        <tr key={item.id} className="border-b">
          {columns.map((col) => (
            <td key={col} className="p-3">
              {highlightText(item[col] ?? "")}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default AdminDashboard;
