import { useState, useEffect } from "react";

export default function Bookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [aadharNumbers, setAadharNumbers] = useState([""]);

  // Fetch bookings when component loads
  useEffect(() => {
    fetch(`http://localhost:5000/bookings/${user.id}`)
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, [user.id]);

  // Open check-in modal
  const handleCheckIn = (bookingId) => {
    setSelectedBooking(bookingId);
    setShowCheckInModal(true);
  };

  // Handle Aadhar input change
  const handleAadharChange = (index, value) => {
    const updatedAadharNumbers = [...aadharNumbers];
    updatedAadharNumbers[index] = value;
    setAadharNumbers(updatedAadharNumbers);
  };

  // Add new Aadhar input field
  const addAadharField = () => {
    setAadharNumbers([...aadharNumbers, ""]);
  };

  // Confirm Check-In
  const confirmCheckIn = () => {
    fetch(`http://localhost:5000/check-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: selectedBooking, aadharNumbers }),
    })
      .then((res) => res.json())
      .then((updatedBooking) => {
        setBookings(
          bookings.map((b) =>
            b.id === selectedBooking ? { ...b, checkedIn: true } : b
          )
        );
        setShowCheckInModal(false);
      })
      .catch((err) => console.log("Check-in error:", err));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className="border p-4 mb-3 rounded shadow">
            <h2 className="text-lg font-semibold">Hotel: {booking.hotel.name}</h2>
            <p>Status: {booking.checkedIn ? "✅ Checked In" : "📌 Booked"}</p>
            {!booking.checkedIn && (
              <button
                onClick={() => handleCheckIn(booking.id)}
                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
              >
                Check-In
              </button>
            )}
          </div>
        ))
      )}

      {/* Check-In Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-2">Enter Aadhar Numbers</h2>

            {aadharNumbers.map((num, index) => (
              <input
                key={index}
                type="text"
                placeholder="Enter Aadhar Number"
                value={num}
                onChange={(e) => handleAadharChange(index, e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
            ))}

            <button
              onClick={addAadharField}
              className="text-blue-500 underline text-sm"
            >
              + Add More
            </button>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowCheckInModal(false)}
                className="bg-gray-400 text-white px-3 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmCheckIn}
                className="bg-green-500 text-white px-3 py-2 rounded"
              >
                Confirm Check-In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
