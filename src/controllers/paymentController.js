const Stripe = require("stripe");
const dotenv = require("dotenv");
const db = require("../config/db");

dotenv.config();

const stripe = new Stripe("sk_test_51R1hMOEONWevZjHkqDVTbzCymSwWPUl7HlU8diXX3fsxYhcUmo8ywukZYH1zR8J1lqZd9Na0WcU7jya15mfQHOZk00kvfRDpfn", {
  apiVersion: "2024-04-10",
});

const createPaymentIntent = async (req, res) => {
  try {
    let { user_id, board_id, room_id, start_date, end_date, amount, currency, payment_method_id } = req.body;

    if (!user_id || !board_id || !room_id || !start_date || !end_date || !amount || !currency || !payment_method_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let stripeAmount = amount;

    const formattedStartDate = new Date(start_date).toISOString().split("T")[0]; // "2025-03-11"
    const formattedEndDate = new Date(end_date).toISOString().split("T")[0];     // "2025-03-15"

    // Convert LKR to cents for Stripe
    if (currency.toLowerCase() === "lkr") {
      stripeAmount = amount * 100;
    }

    // Step 1: Create a Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: stripeAmount,
      currency,
      payment_method: payment_method_id, // Attach the payment method
      confirm: true, // Auto-confirm the payment
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // Prevents 3D Secure redirections
      },
    });

    // Step 2: If payment is successful, store it in DB and create a booking
    if (paymentIntent.status === "succeeded") {
      const [paymentResult] = await db.query(
        "INSERT INTO Payments (user_id, stripe_payment_intent_id, amount, currency, boarding_id, room_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [user_id, paymentIntent.id, amount, currency, board_id, room_id, "succeeded"]
      );

      const [bookingResult] = await db.query(
        "INSERT INTO booking (user_id, board_id, room_id, start_date, end_date, amount, payment_status, transaction_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [user_id, board_id, room_id, formattedStartDate, formattedEndDate, amount, "Completed", String(paymentResult.insertId)]      
      );

      console.log("✅ Booking Created:", bookingResult.insertId);

      return res.status(200).json({ message: "Payment and Booking Successful", bookingId: bookingResult.insertId });
    } else {
      return res.status(400).json({ error: "Payment failed or requires action" });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Payment processing failed" });
  }
};

module.exports = { createPaymentIntent };
