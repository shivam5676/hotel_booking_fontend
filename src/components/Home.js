import { useEffect, useState } from "react";

export default function Home({ user, setShowLogin }) {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/hotels")
      .then((res) => res.json())
      .then(setHotels)
      .catch((err) => console.log(err));
  }, []);

  const bookHotel = async (hotelId) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, hotelId }),
      });
      if (res.ok) alert("Hotel booked!");
      else alert("Booking failed.");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Hotels</h1>
      {hotels.map((hotel) => (
        <div key={hotel.id} className="border p-4 mb-4">
          <h2 className="text-xl">{hotel.name}</h2>
          <p>Location: {hotel.location}</p>
          <p>Rooms Available: {hotel.rooms_available}</p>
          <button
            onClick={() => bookHotel(hotel.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Book Now
          </button>
        </div>
      ))}
    </div>
  );
}
