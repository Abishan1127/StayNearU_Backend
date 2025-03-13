// routes/bookingRoutes.js

const express = require("express");
const router = express.Router();
const {
  getBookings,
  createBooking,
  deleteBooking,
} = require("../controllers/bookingController");

// Routes
router.get("/", getBookings);
router.post("/", createBooking);
router.delete("/:id", deleteBooking);

module.exports = router;
