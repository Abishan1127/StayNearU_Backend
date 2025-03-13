// controllers/bookingController.js

const db = require("../config/db");

// Get all bookings
const getBookings = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM booking ORDER BY booking_id ASC");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

// Create a new booking
const createBooking = async (req, res) => {
  const { bookId, userId, boardId, roomId, startDate, endDate, status, method, transactionId, amount } = req.body;

  if (!bookId || !userId || !boardId || !roomId || !startDate || !endDate || !status || !method || !transactionId || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO booking (bookId, userId, boardId, roomId, startDate, endDate, status, method, transactionId, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [bookId, userId, boardId, roomId, startDate, endDate, status, method, transactionId, amount]
    );

    res.status(201).json({ message: "Booking created successfully", bookingId: result.insertId });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Error creating booking", error });
  }
};

// Delete a booking
const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM booking WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Error deleting booking", error });
  }
};

module.exports = {
  getBookings,
  createBooking,
  deleteBooking,
};
