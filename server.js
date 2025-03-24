const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");

const bodyParser = require("body-parser");

const paymentRoutes = require("./src/routes/paymentRoutes");
const userRoutes = require("./src/routes/userRoutes");
const boardingRoutes = require("./src/routes/boardingRoutes");
const roomRoutes = require("./src/routes/roomRoutes");
const universityRoutes = require("./src/routes/universityRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes")

dotenv.config();

const app = express();

//  Enable CORS with Cookies
app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5173", process.env.FE_URL, process.env.ADMIN_URL],
  credentials: true, 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
}));
console.log(process.env.FE_URL, process.env.ADMIN_URL);
app.use(express.json()); 
app.use(cookieParser()); 
app.use(bodyParser.json());

// Serve uploaded images
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/book", bookingRoutes);
app.use("/api/boarding", boardingRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);

app.post("/send-email", async (req, res) => {
  const { name, email, title, message } = req.body;

  if (!process.env.EMAIL || !process.env.PASSWORD) {
    return res.status(500).json({ success: false, message: "Email credentials are missing" });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    let mailOptions = {
      from: email,
      to: process.env.EMAIL,
      subject: `New Message from Contact Form: ${title}`,
      text: `You have received a new message from ${name} (${email}):\n\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
